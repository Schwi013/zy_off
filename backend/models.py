import uuid
from sqlalchemy import Column, String, Boolean, Integer, SmallInteger, DateTime, ForeignKey, Text, Numeric, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base

# ==========================================
# 1. TABLA: users (Usuarios)
# ==========================================
class User(Base):
    __tablename__ = "users"

    id_user = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)

# ==========================================
# 2. TABLA: brands (Marcas)
# ==========================================
class Brand(Base):
    __tablename__ = "brands"

    id_brand = Column(SmallInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    url_logo = Column(String(255), nullable=False)

# ==========================================
# 3. TABLA: categories (Categorías)
# ==========================================
class Category(Base):
    __tablename__ = "categories"

    id_category = Column(SmallInteger, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)
    slug = Column(String(60), unique=True, nullable=False)

# ==========================================
# 4. TABLA: addresses (Direcciones - Soft Delete)
# ==========================================
class Address(Base):
    __tablename__ = "addresses"

    id_address = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(UUID(as_uuid=True), ForeignKey("users.id_user"), nullable=False)
    alias = Column(String(30), nullable=False)
    street = Column(String(100), nullable=False)
    num_ext = Column(String(10), nullable=False)
    num_int = Column(String(10), nullable=True)
    zip_code = Column(String(10), nullable=False)
    city = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    country = Column(String(50), nullable=False)
    tel = Column(String(20), nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False) 

# ==========================================
# 5. TABLA: products (Modelo General)
# ==========================================
class Product(Base):
    __tablename__ = "products"

    id_product = Column(Integer, primary_key=True, autoincrement=True)
    id_brand = Column(SmallInteger, ForeignKey("brands.id_brand"), nullable=False)
    name_product = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    gender = Column(String(10), nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint("gender IN ('Hombre', 'Mujer', 'Unisex')", name="check_gender_valid"),
        CheckConstraint("base_price >= 0", name="check_base_price_positive"),
    )

# ==========================================
# 6. TABLA: product_variant (Colores / Tendencias)
# ==========================================
class ProductVariant(Base):
    __tablename__ = "product_variant"

    id_product_variant = Column(Integer, primary_key=True, autoincrement=True)
    id_product = Column(Integer, ForeignKey("products.id_product"), nullable=False)
    image_front = Column(String(255), nullable=False)
    image_back = Column(String(255), nullable=True)
    image_bottom = Column(String(255), nullable=True)
    image_side = Column(String(255), nullable=True)
    image_other_side = Column(String(255), nullable=True)
    name_color = Column(String(50), nullable=False)
    promotional_price = Column(Numeric(10, 2), nullable=True)
    views_count = Column(Integer, default=0, nullable=False)
    search_tags = Column(String(255), nullable=True)

    __table_args__ = (
        CheckConstraint("promotional_price >= 0", name="check_promo_price_positive"),
    )

# ==========================================
# 7. TABLA: product_sku (Inventario Físico)
# ==========================================
class ProductSku(Base):
    __tablename__ = "product_sku"

    id_product_sku = Column(Integer, primary_key=True, autoincrement=True)
    id_product_variant = Column(Integer, ForeignKey("product_variant.id_product_variant"), nullable=False)
    size = Column(Numeric(4, 1), nullable=False)
    stock = Column(SmallInteger, nullable=False)

    __table_args__ = (
        CheckConstraint("size > 0", name="check_size_positive"),
        CheckConstraint("stock >= 0", name="check_stock_non_negative"),
    )

# ==========================================
# 8. TABLA: orders (Cabecera del Pedido)
# ==========================================
class Order(Base):
    __tablename__ = "orders"

    num_order = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    id_user = Column(UUID(as_uuid=True), ForeignKey("users.id_user"), nullable=False)
    id_address = Column(Integer, ForeignKey("addresses.id_address"), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="PENDING", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    stripe_payment_intent_id = Column(String(255), nullable=True)

    __table_args__ = (
        CheckConstraint("total >= 0", name="check_total_positive"),
    )

# ==========================================
# 9. TABLA: order_items (Detalle inmutable)
# ==========================================
class OrderItem(Base):
    __tablename__ = "order_items"

    id_order_items = Column(Integer, primary_key=True, autoincrement=True)
    num_order = Column(UUID(as_uuid=True), ForeignKey("orders.num_order"), nullable=False)
    id_product_sku = Column(Integer, ForeignKey("product_sku.id_product_sku"), nullable=False)
    quantity = Column(SmallInteger, nullable=False)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint("quantity > 0", name="check_quantity_positive"),
    )

# ==========================================
# 10. TABLA: reviews (Calificaciones)
# ==========================================
class Review(Base):
    __tablename__ = "reviews"

    id_review = Column(Integer, primary_key=True, autoincrement=True)
    id_product = Column(Integer, ForeignKey("products.id_product"), nullable=False)
    id_user = Column(UUID(as_uuid=True), ForeignKey("users.id_user"), nullable=False)
    rating = Column(SmallInteger, nullable=False)
    comment = Column(String(500), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="check_rating_range"),
    )

# ==========================================
# 11 y 12. TABLAS INTERMEDIAS Y AISLADAS
# ==========================================
class Favorite(Base):
    __tablename__ = "favorites"
    id_user = Column(UUID(as_uuid=True), ForeignKey("users.id_user"), primary_key=True)
    id_product_variant = Column(Integer, ForeignKey("product_variant.id_product_variant"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class ProductCategory(Base):
    __tablename__ = "product_categories"
    id_category = Column(SmallInteger, ForeignKey("categories.id_category"), primary_key=True)
    id_product = Column(Integer, ForeignKey("products.id_product"), primary_key=True)

class SearchAnalytics(Base):
    __tablename__ = "search_analytics"
    id_search = Column(Integer, primary_key=True, autoincrement=True)
    search_term = Column(String(100), unique=True, nullable=False)
    search_count = Column(Integer, default=1, nullable=False)
    last_searched_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
