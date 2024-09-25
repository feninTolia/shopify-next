'use client';
import { CartContext } from '@/lib/context/shopContext';
import { formatter } from '@/utils/formatter';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useContext, useRef } from 'react';
import { ICheckoutVariant } from './ProductForm';
import Link from 'next/link';

export default function MiniCart({ cart }: { cart?: ICheckoutVariant[] }) {
  const { isCartOpen, setIsCartOpen, checkoutUrl, removeCartItem } =
    useContext(CartContext);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  let cartTotal = 0;

  cart?.map((item) => {
    cartTotal += +item?.variantPrice?.amount * item.variantQuantity;
  });

  if (!cart) {
    return null;
  }

  return (
    <Dialog
      open={isCartOpen}
      initialFocus={cancelButtonRef}
      onClose={() => setIsCartOpen?.(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed  inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className=" pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping cart
                    </DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        ref={cancelButtonRef}
                        onClick={() => setIsCartOpen?.(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      {cart.length > 0 ? (
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {cart.map((product) => (
                            <li key={product.id} className="flex py-6">
                              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <Image
                                  alt={product.title}
                                  src={product.image || ''}
                                  layout="fill"
                                  objectFit="cover"
                                  // className="h-full w-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <Link
                                        href={`/products/${product.handle}`}
                                        onClick={() => setIsCartOpen?.(false)}
                                      >
                                        {product.title}
                                      </Link>
                                    </h3>
                                    <p className="ml-4">
                                      {formatter.format(
                                        +product?.variantPrice?.amount
                                      )}
                                    </p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {product.variantTitle}
                                  </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <p className="text-gray-500">
                                    Qty {product.variantQuantity}
                                  </p>

                                  <div className="flex">
                                    <button
                                      type="button"
                                      onClick={() => removeCartItem?.(product)}
                                      className="font-medium text-gray-800 hover:text-gray-600"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Noting in your cart yet!</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>{formatter.format(cartTotal)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="mt-6">
                    <a
                      href={checkoutUrl}
                      className="flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700"
                    >
                      Checkout
                    </a>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        onClick={() => setIsCartOpen?.(false)}
                        className="font-medium text-black  hover:text-gray-800"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
