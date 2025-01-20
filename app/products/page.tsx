
'use client'
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/hygraph";
import React, { useEffect, useState } from "react";

const ProductPage = () => {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError('error fetching products' + {err})
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="px-6 py-8">
    <h1 className="text-2xl font-bold text-gray-800 mb-6">Featured Products</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product:any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
  );
};

export default ProductPage;
