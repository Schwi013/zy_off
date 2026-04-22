from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# Modelo de entrada: lo que el frontend nos envia 
class UserCreate(BaseModel):
    name: str
    last_name: str
    email: str
    password: str

class EsquemaBase(BaseModel):
    class Config:
        from_attributes = True

# Modelo de salida: lo que el backend responde
class UserResponse(EsquemaBase):
    id_user: UUID
    name: str
    last_name: str
    email: str
    is_admin: bool
    is_verified: bool
    created_at: datetime


class ProductResponse(EsquemaBase):
    id_product: int
    name_product: str
    base_price: float
    gender: str

class UserLogin(BaseModel):
    email: str
    password: str

class CatalogoResponse(EsquemaBase):
    id_variant: int
    name_product: str
    brand_name: str
    price: float
    image_url: str
