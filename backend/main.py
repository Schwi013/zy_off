from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session 
from typing import List
import redis
import json
from database import engine, Base, SessionLocal
import models as models 
import schemas as schemas
from security import verify_password, create_access_token, verify_token, get_password_hash
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware


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



@app.get("/productos", response_model=List[schemas.ProductResponse])
def obtener_productos(db: Session = Depends(get_db)):
    productos = db.query(models.Product).all()
    return productos 

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