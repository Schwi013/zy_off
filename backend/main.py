from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session 
from sqlalchemy import func 
from typing import List
import redis
import json
from database import engine, Base, SessionLocal
import models as models 
import schemas as schemas
from security import verify_password, create_access_token, verify_token, get_password_hash



Base.metadata.create_all(bind=engine)
redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
validacion_token = HTTPBearer()

app = FastAPI(title="ZY OFF API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_usuario_actual(credenciales: HTTPAuthorizationCredentials = Depends(validacion_token), db: Session = Depends(get_db)):
    token_usuario = credenciales.credentials
    user_id = verify_token(token_usuario)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalido o expirado",
        )
    
    usuario_db = db.query(models.User).filter(models.User.id_user == user_id).first()

    if not usuario_db:
        return HTTPException(status_code=404, detail="El usuario no existe")
    
    return usuario_db


@app.get("/")
def ruta_principal():
    return {"mensaje": "¡Hola, Bienvenido a ZY OFF"}


@app.post("/usuarios", response_model=schemas.UserResponse)
def crear_usuario(usuario: schemas.UserCreate, db: Session = Depends(get_db)):
    usuario_existente = db.query(models.User).filter(models.User.email == usuario.email).first()

    if usuario_existente:
        raise HTTPException(status_code=400, detail="El correo electronico ya esta en uso")

    contrasena_encriptada = get_password_hash(usuario.password)
    
    db_user = models.User(
        name = usuario.name,
        last_name = usuario.last_name,
        email = usuario.email,
        password_hash = contrasena_encriptada
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@app.post("/carrito/{id_user}")
def agregar_al_carrito(id_user: str, nombre_tenis: str, cantidad: int):
    redis_key = f"zyoff:cart:{id_user}"
    datos_carrito = {
        "producto": nombre_tenis,
        "cantidad": cantidad,
        "estado": "guardado en cache"
    }

    redis_client.setex(redis_key, 3600, json.dumps(datos_carrito))
    return {"mensaje": f"Carrito de {id_user} guardado en cache"}


@app.get("/carrito/{id_user}")
def ver_carrito(id_user: str):
    redis_key = f"zyoff:cart:{id_user}"
    carrito_guardado = redis_client.get(redis_key)
    if carrito_guardado:
        return json.loads(carrito_guardado)
    return {"mensaje": "El carrito esta vacio o ya expiro"}



@app.get("/productos", response_model=dict)
def obtener_productos(
    gender: str = None,
    brand: str = None,
    color: str = None,
    size: float = None,
    category: str = None,
    uso: str = None,
    max_price: float = None,
    page: int = 1,
    limit: int = 60,
    db: Session = Depends(get_db)
):
    query = db.query(
        models.ProductVariant.id_product_variant.label("id_variant"),
        models.Product.name_product,
        models.Brand.name.label("brand_name"),
        models.Product.base_price.label("price"),
        models.ProductVariant.image_front.label("image_url")
    ).select_from(models.ProductVariant)\
    .join(models.Product, models.ProductVariant.id_product == models.Product.id_product)\
    .join(models.Brand, models.Product.id_brand == models.Brand.id_brand)

    if gender: 
        generos_lista = [g.strip() for g in gender.split(',')]
        query = query.filter(models.Product.gender.in_(generos_lista))

    if brand: 
        query = query.filter(models.Brand.name == brand)

    if color:
        query = query.filter(models.ProductVariant.name_color.ilike(f"{color}"))

    if size:
        query = query.join(models.ProductSku, models.ProductVariant.id_product_variant == models.ProductSku.id_product_variant)\
                    .filter(models.ProductSku.size == size, models.ProductSku.stock > 0)
        
    if category:
        query = query.join(models.ProductCategory, models.Product.id_product == models.ProductCategory.id_product)\
                    .join(models.Category, models.ProductCategory.id_category == models.Category.id_category)\
                    .filter(models.Category.name == category)
        
    if uso:
        query = query.join(models.ProductUse, models.Product.id_product == models.ProductUse.id_product)\
                    .join(models.Use, models.ProductUse.id_use == models.Use.id_use)\
                    .filter(models.Use.name == uso)
        
    if max_price:
        query = query.filter(models.Product.base_price <= max_price)
        
    query = query.distinct()

    total_items = query.count()
    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 1 
    offset = (page - 1 ) * limit 

    productos = query.offset(offset).limit(limit).all()
    items = [schemas.CatalogoResponse.model_validate(p) for p in productos]

    return {
        "total": total_items,
        "pages": total_pages,
        "page": page,
        "items": items
    }

@app.get("/filtros-disponibles")
def obtener_filtros(gender: str, db: Session = Depends(get_db)):
    generos_lista = [g.strip() for g in gender.split(',')]
    # 1. Marcas Disponibles
    marcas = db.query(models.Brand.name)\
        .select_from(models.Brand)\
        .join(models.Product, models.Brand.id_brand == models.Product.id_brand)\
        .filter(models.Product.gender.in_(generos_lista))\
        .distinct().all()
    
    # 2. Colores Disponibles
    colores_query = db.query(models.ProductVariant.name_color, models.ProductVariant.hex_color)\
        .select_from(models.ProductVariant)\
        .join(models.Product, models.ProductVariant.id_product == models.Product.id_product)\
        .filter(models.Product.gender.in_(generos_lista))\
        .distinct().all()

    # 3. Categorías Disponibles
    categorias = db.query(models.Category.name)\
        .select_from(models.Category)\
        .join(models.ProductCategory, models.Category.id_category == models.ProductCategory.id_category)\
        .join(models.Product, models.ProductCategory.id_product == models.Product.id_product)\
        .filter(models.Product.gender.in_(generos_lista))\
        .distinct().all()

    # 4. Usos Disponibles
    usos = db.query(models.Use.name)\
        .select_from(models.Use)\
        .join(models.ProductUse, models.Use.id_use == models.ProductUse.id_use)\
        .join(models.Product, models.ProductUse.id_product == models.Product.id_product)\
        .filter(models.Product.gender.in_(generos_lista))\
        .distinct().all()

    # 5. Rango de Tallas Real (Solo con stock)
    tallas_stats = db.query(func.min(models.ProductSku.size), func.max(models.ProductSku.size))\
        .select_from(models.ProductSku)\
        .join(models.ProductVariant, models.ProductSku.id_product_variant == models.ProductVariant.id_product_variant)\
        .join(models.Product, models.ProductVariant.id_product == models.Product.id_product)\
        .filter(models.Product.gender.in_(generos_lista), models.ProductSku.stock > 0)\
        .first()

    # 6. Rango de Precios Real
    precios_stats = db.query(func.min(models.Product.base_price), func.max(models.Product.base_price))\
        .select_from(models.Product)\
        .filter(models.Product.gender.in_(generos_lista))\
        .first()

    return {
        "marcas": [m[0] for m in marcas if m[0]],
        "colores": [{"nombre": c[0], "hex": c[1]} for c in colores_query if c[0]],
        "categorias": [c[0] for c in categorias if c[0]],
        "usos": [u[0] for u in usos if u[0]],
        "talla_min": float(tallas_stats[0]) if tallas_stats and tallas_stats[0] else 22,
        "talla_max": float(tallas_stats[1]) if tallas_stats and tallas_stats[1] else 32,
        "precio_min": float(precios_stats[0]) if precios_stats and precios_stats[0] else 0,
        "precio_max": float(precios_stats[1]) if precios_stats and precios_stats[1] else 5000
    }


@app.post("/login")
def login(credenciales: schemas.UserLogin, db: Session = Depends(get_db)):
    usuario_db = db.query(models.User).filter(models.User.email == credenciales.email).first()

    if not usuario_db or not verify_password(credenciales.password, usuario_db.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correro o contraseña incorrecta"
        )
    
    acces_token = create_access_token(data={"sub": str(usuario_db.id_user)})

    return {
        "mensaje": "Login exitoso",
        "access_token": acces_token,
        "token_type": "bearer"
    }

@app.get("/perfil", response_model=schemas.UserResponse)
def ver_perfil(usuario_actual: models.User = Depends(get_usuario_actual)):
    return usuario_actual