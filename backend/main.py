from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models as models 
import schemas as schemas


Base.metadata.create_all(bind=engine)

app = FastAPI(title="ZY OFF API")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Creamos nuestra primera ruta (Endpoint)
@app.get("/")
def ruta_principal():
    return {"mensaje": "¡Hola, creador de ZY OFF! Tu backend está funcionando perfectamente 🚀"}

@app.post("/usuarios", response_model=schemas.UserResponse)
def crear_usuario(usuario: schemas.UserCreate, db: Session = Depends(get_db)):
    usuario_existente = db.query(models.User).filter(models.User.email == usuario.email).first()

    if usuario_existente:
        raise HTTPException(status_code=400, detail="Este correo ya esta registrado.")
    
    nuevo_usuario = models.User(
        name=usuario.name,
        last_name=usuario.last_name,
        email=usuario.email,
        password_hash=usuario.password
    )

    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    return nuevo_usuario