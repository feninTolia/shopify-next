'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { createCheckout, removeCheckoutLine, updateCheckout } from '../shopify';
import { ICheckoutVariant } from '@/components/ProductForm';

type Props = {
  children: ReactNode;
};

interface ICartContext {
  cart?: ICheckoutVariant[];
  isCartOpen?: boolean;
  setIsCartOpen?: Dispatch<SetStateAction<boolean>>;
  addToCart?: (newItem: ICheckoutVariant) => Promise<void>;
  removeCartItem?: (newItem: ICheckoutVariant) => Promise<void>;
  checkoutUrl?: string;
}

export const CartContext = createContext<ICartContext>({});

const ShopProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<ICheckoutVariant[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutId, setIsCheckoutId] = useState('');
  const [checkoutUrl, setIsCheckoutUrl] = useState('');

  useEffect(() => {
    if (localStorage.checkout_id) {
      const cartObject = JSON.parse(localStorage.checkout_id);
      if (cartObject[0].length === 1) {
        setCart([...cartObject[0]]);
      } else if (cartObject[0].length > 1) {
        setCart([...cartObject[0]]);
      }

      setIsCheckoutId(cartObject[1].id);
      setIsCheckoutUrl(cartObject[1].checkoutUrl);
    }
  }, []);

  async function addToCart(newItem: ICheckoutVariant) {
    if (cart.length === 0) {
      const checkout = await createCheckout(
        newItem.id,
        newItem.variantQuantity
      );

      setCart([{ ...newItem, cartLineId: checkout.lines.edges[0].node.id }]);

      setIsCheckoutId(checkout.id);
      setIsCheckoutUrl(checkout.checkoutUrl);

      localStorage.setItem(
        'checkout_id',
        JSON.stringify([
          [{ ...newItem, cartLineId: checkout.lines.edges[0].node.id }],
          checkout,
        ])
      );
    } else {
      let newLine: ICheckoutVariant = {
        id: '',
        title: '',
        handle: '',
        options: {},
        variantTitle: '',
        variantPrice: {
          amount: '',
        },
        variantQuantity: 0,
      };

      cart.map((cartLineEl) => {
        if (cartLineEl.id === newItem.id) {
          newLine = { ...cartLineEl };
        } else {
          newLine = { ...newItem };
        }
      });

      const newCheckout = await updateCheckout(checkoutId, newLine);

      setCart((prev) => [
        ...prev,
        { ...newLine, cartLineId: newCheckout.lines.edges[0].node.id },
      ]);

      if (localStorage.checkout_id) {
        const cartObj = JSON.parse(localStorage.checkout_id);
        localStorage.setItem(
          'checkout_id',
          JSON.stringify([
            [
              ...cartObj[0],
              { ...newLine, cartLineId: newCheckout.lines.edges[0].node.id },
            ],
            newCheckout,
          ])
        );
      }
    }
  }

  async function removeCartItem(itemToRemove: ICheckoutVariant) {
    const updatedCart = cart.filter((item) => item.id !== itemToRemove.id);
    setCart(updatedCart);

    const newCheckout = await removeCheckoutLine(checkoutId, itemToRemove);

    if (localStorage.checkout_id) {
      localStorage.setItem(
        'checkout_id',
        JSON.stringify([updatedCart, newCheckout])
      );
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        checkoutUrl,
        removeCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const ShopConsumer = CartContext.Consumer;

export { ShopConsumer, ShopProvider };
