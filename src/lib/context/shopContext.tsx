'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';
import { createCheckout, updateCheckout } from '../shopify';
import { ICheckoutVariant } from '@/components/ProductForm';

type Props = {
  children: ReactNode;
};

interface ICartContext {
  cart?: ICheckoutVariant[];
  isCartOpen?: boolean;
  setIsCartOpen?: Dispatch<SetStateAction<boolean>>;
  addToCart?: (newItem: ICheckoutVariant) => Promise<void>;
  checkoutUrl?: string;
}

export const CartContext = createContext<ICartContext>({});

const ShopProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<ICheckoutVariant[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutId, setIsCheckoutId] = useState('');
  const [checkoutUrl, setIsCheckoutUrl] = useState('');

  async function addToCart(newItem: ICheckoutVariant) {
    if (cart.length === 0) {
      const checkout = await createCheckout(
        newItem.id,
        newItem.variantQuantity
      );

      setCart([{ ...newItem, cartLineId: checkout.lines.edges[0].node.id }]);

      setIsCheckoutId(checkout.id);
      setIsCheckoutUrl(checkout.checkoutUrl);

      localStorage.setItem('checkout_id', JSON.stringify([newItem, checkout]));
    } else {
      let newLine: ICheckoutVariant = {};

      cart.map((cartLineEl) => {
        if (cartLineEl.id === newItem.id) {
          newLine = { ...cartLineEl };
        } else {
          newLine = { ...newItem };
        }
      });

      setCart((prev) => [...prev, newLine]);
      const newCheckout = await updateCheckout(checkoutId, newLine);

      localStorage.setItem(
        'checkout_id',
        JSON.stringify([newItem, newCheckout])
      );
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, isCartOpen, setIsCartOpen, addToCart, checkoutUrl }}
    >
      {children}
    </CartContext.Provider>
  );
};

const ShopConsumer = CartContext.Consumer;

export { ShopConsumer, ShopProvider };
