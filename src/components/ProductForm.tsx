'use client';
import { CartContext } from '@/lib/context/shopContext';
import { OptionValue, ProductExtended } from '@/lib/types';
import { formatter } from '@/utils/formatter';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import useSWR from 'swr';
import { ProductOptions } from './ProductOptions';

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

const fetcher = (url: string, id: string) =>
  axios.get(url, { params: { id: id } }).then((res) => res.data);

export const ProductForm = ({ product }: IProps) => {
  const { addToCart } = useContext(CartContext);
  const { data: productInventory } = useSWR<ProductExtended>(
    ['/api/available?id=' + product.handle],
    (url: string, id: string) => fetcher(url, id),
    { errorRetryCount: 3 }
  );
  const [available, setAvailable] = useState(true);

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

  useEffect(() => {
    if (productInventory) {
      const checkAvailable = productInventory.variants.nodes.filter(
        (item) => item.id === selectedVariant.id
      );

      if (checkAvailable[0].availableForSale) {
        setAvailable(true);
      } else {
        setAvailable(false);
      }
    }
  }, [productInventory, selectedVariant.id]);

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
      {available ? (
        <button
          onClick={() => {
            addToCart?.(selectedVariant);
          }}
          className="bg-black rounded-lg text-white px-2 py-2 hover:bg-gray-800"
        >
          Add to chart
        </button>
      ) : (
        <button className="bg-gray-800 rounded-lg text-white px-2 py-2 cursor-default ">
          Sold out!
        </button>
      )}
    </div>
  );
};
