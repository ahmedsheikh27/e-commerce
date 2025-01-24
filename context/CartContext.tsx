'use client'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { fetchCartById } from "@/lib/hygraph";
import { usePathname } from 'next/navigation';

const CartContext = createContext<any>(null)


export default function CartContextProvider({ children }: PropsWithChildren) {
    const [cart, setCart] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const pathname = usePathname()

    const fetchCart = async () => {
        try {
            const cartId = sessionStorage.getItem("cartId");
            if (cartId) {
                const fetchedCart: any = await fetchCartById(cartId);
                setCart(fetchedCart);
            }
        } catch (error) {
            console.error("Cart Fetch Error:", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [pathname]);

    return (
        <CartContext.Provider value={{
            loading, error, cart, fetchCart
        }}>
            {children}
        </CartContext.Provider>
    )
}


export function useCartContext() {

    return useContext(CartContext)
}