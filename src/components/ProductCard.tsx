import { Product } from '@/lib/types';
import { formatter } from '@/utils/formatter';
import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  product: Product;
}

export const ProductCard = ({ product }: IProps) => {
  console.log(product);
  const { handle, title, images, priceRange } = product;
  const img = images.nodes[0];
  const price = Number.parseFloat(priceRange.minVariantPrice.amount);

  return (
    <Link href={`/products/${handle}`} className="group">
      <div className="w-full bg-gray-200 rounded-3xl overflow-hidden">
        <div className="relative group-hover:opacity-75 h-72">
          <Image
            src={img.url}
            // width={100}
            // height={50}
            layout="fill"
            objectFit="cover"
            alt={img.altText + ''}
          />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-700">{formatter.format(price)}</p>
    </Link>
  );
};
