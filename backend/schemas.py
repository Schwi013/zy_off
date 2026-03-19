from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# Modelo de entrada: lo que el frontend nos envia 
class UserCreate(BaseModel):
    name: str
    last_name: str
    email: str
    password: str

# Modelo de salida: lo que el backend responde
class UserResponse(BaseModel):
    id_user: UUID
    name: str
    last_name: str
    email: str
    is_admin: bool
    is_verified: bool
    created_at: datetime

class Config:
    from_attributes = True
