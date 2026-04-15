const ProductCard = ({ shoeName, brand, price }) => {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square w-full bg-[#f6f6f6] rounded-xl flex items-center justify-center overflow-hidden mb-4">
        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 flex items-center justify-center text-6xl">
          👟
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-800">{shoeName}</h3>
        <p className="text-sm font-black text-black uppercase">{brand}</p>
        <p className="text-sm font-bold text-gray-900 mt-2">$ {price}</p>
      </div>
    </div>
  );
};

export default ProductCard;