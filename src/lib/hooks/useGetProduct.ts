'use client';
import { useEffect, useState } from 'react';
import { getProduct } from '../shopify';
import { ProductExtended } from '../types';

export const useGetProduct = (slug: string) => {
  const [data, setData] = useState<ProductExtended>();

  useEffect(() => {
    (async () => {
      const result = await getProduct(slug);
      setData(result);
    })();
  });

  return { data };
};
