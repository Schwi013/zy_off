// En ProductCard.jsx
const ProductCard = ({ shoeName, brand, price, imageUrl }) => {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square w-full bg-[#f6f6f6] rounded-xl flex items-center justify-center overflow-hidden mb-4 relative">
        {/* Mostramos la imagen real si existe, sino un emoji */}
        {imageUrl ? (
          <img src={imageUrl} alt={shoeName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="text-6xl opacity-10"></div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-800 truncate">{shoeName}</h3>
        <p className="text-sm font-black text-black uppercase">{brand}</p>
        <p className="text-sm font-bold text-gray-900 mt-2">$ {price}</p>
      </div>
    </div>
  );
};
export default ProductCard;