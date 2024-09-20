'use client';
import { OptionValue, ProductExtended } from '@/lib/types';
import { formatter } from '@/utils/formatter';
import { useContext, useState } from 'react';
import { ProductOptions } from './ProductOptions';
import { CartContext } from '@/lib/context/shopContext';

interface IProps {
  product: ProductExtended;
}
interface IOptions {
  [name: string]: { name: string };
}

export interface ICheckoutVariant {
  id: string;
  title: string;
  handle: string;
  image?: string;
  options: IOptions;
  variantTitle: string;
  variantPrice: { amount: string };
  variantQuantity: number;
  cartLineId?: string;
}

export const ProductForm = ({ product }: IProps) => {
  const { addToCart } = useContext(CartContext);

  const allVariantOptions: ICheckoutVariant[] = product.variants.nodes.map(
    (variant) => {
      const allOptions: IOptions = {};
      variant.selectedOptions.map((option) => {
        allOptions[option.name] = { name: option.value };
      });

      return {
        id: variant.id,
        title: product.title,
        handle: product.handle,
        image: variant.image?.url,
        options: allOptions,
        variantTitle: variant.title,
        variantPrice: variant.price,
        variantQuantity: 1,
      };
    }
  );

  const defaultOptions: { [name: string]: OptionValue } = {};
  product.options.map(
    (item) => (defaultOptions[item.name] = item.optionValues[0])
  );

  const [selectedVariant, setSelectedVariant] = useState(allVariantOptions[0]);
  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

  function setOptions(name: string, value: OptionValue) {
    setSelectedOptions((prevState) => ({ ...prevState, [name]: value }));

    const selection = {
      ...selectedOptions,
      [name]: value,
    };

    allVariantOptions.map((item) => {
      if (JSON.stringify(item.options) === JSON.stringify(selection)) {
        setSelectedVariant(item);
      }
    });
  }

  return (
    <div className="rounded-2xl p-4 shadow-lg flex flex-col w-full md:w-1/3">
      <h2 className="text-2xl font-bold">{product.title}</h2>
      <span className="pb-6">
        {formatter.format(+product.variants.nodes[0].price.amount)}
      </span>
      {product.options.map(({ name, optionValues }) => (
        <ProductOptions
          key={name}
          name={name}
          values={optionValues}
          selectedOptions={selectedOptions}
          setOptions={setOptions}
        />
      ))}
      <button
        onClick={() => {
          addToCart?.(selectedVariant);
        }}
        className="bg-black rounded-lg text-white px-2 py-2 hover:bg-gray-800"
      >
        Add to chart
      </button>
    </div>
  );
};
