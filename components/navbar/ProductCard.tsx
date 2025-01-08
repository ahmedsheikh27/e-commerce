import React from "react";
import Link from "next/link"; 

const ProductCard = ({ product }: any) => {
  return (
    <Link href={`/products/${product.id}`}>
     
     <div className="max-w-sm m-5 rounded overflow-hidden shadow-lg bg-white p-4">
      <img
        className="w-full h-auto object-cover rounded-lg"
        src={product.productImage.url}
        alt={product.name}
      />

      <div>

        <div className="px-4 py-2">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p className="text-gray-700 mt-2">${product.price}</p>
        </div>
        <p className="text-gray-700 text-[14px] mt-2">{product.description}</p>
      </div>
    </div>
    </Link>
  );
};

export default ProductCard;
