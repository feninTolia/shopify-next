import { ProductExtended } from '@/lib/types';
import React from 'react';

interface IProps {
  product?: ProductExtended;
}

export function ProductPageContent({ product }: IProps) {
  if (!product) {
    return null;
  }
  return <div>{product.description}</div>;
}
