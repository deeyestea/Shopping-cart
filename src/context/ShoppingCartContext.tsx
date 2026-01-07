import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

type ShoppingCartProviderProps = {
    children: ReactNode;
};

type ShoppingCartConetxt = {
    openCart: () => void;
    closeCart: () => void;
    getItemQuantity: (id: number) => number;
    increaseCartQuantity: (id: number) => void;
    decreaseCartQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    cartQuatity: number;
    cartItems: CartItem[];
};

type CartItem = {
    id: number;
    quantity: number;
};

const ShoppingCartContext = createContext({} as ShoppingCartConetxt);

export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

export const ShoppingCartProvider = ({
    children,
}: ShoppingCartProviderProps) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isOpen, setOpen] = useState<Boolean>(false);

    const cartQuatity = useMemo(
        () => cartItems.reduce((quantity, item) => item.quantity + quantity, 0),
        [cartItems]
    );

    const openCart = () => {
        setOpen(true);
    };

    const closeCart = () => {
        setOpen(false);
    };

    const getItemQuantity = (id: number) => {
        return cartItems?.find((item) => item.id === id)?.quantity || 0;
    };

    const increaseCartQuantity = (id: number) => {
        setCartItems((currItems) => {
            if (currItems.find((item) => item.id === id) == null) {
                return [...currItems, { id, quantity: 1 }];
            } else {
                return currItems.map((item) => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        return item;
                    }
                });
            }
        });
    };

    const decreaseCartQuantity = (id: number) => {
        setCartItems((currItems) => {
            if (currItems.find((item) => item.id === id)?.quantity === 1) {
                return currItems.filter((item) => item.id !== id);
            } else {
                return currItems.map((item) => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 };
                    } else {
                        return item;
                    }
                });
            }
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems((currItems) => currItems.filter((item) => item.id !== id));
    };

    return (
        <ShoppingCartContext.Provider
            value={{
                getItemQuantity,
                increaseCartQuantity,
                decreaseCartQuantity,
                removeFromCart,
                cartItems,
                cartQuatity,
                openCart,
                closeCart,
            }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};
