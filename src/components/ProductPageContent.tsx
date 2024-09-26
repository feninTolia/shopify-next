'use client';
import { ProductExtended } from '@/lib/types';
import Image from 'next/image';
import { ReactElement } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductForm } from './ProductForm';
import { RecommendedList } from './RecommendedList';

interface IProps {
  product?: ProductExtended;
}

export function ProductPageContent({ product }: IProps) {
  if (!product) {
    return null;
  }
  const images: ReactElement[] = [];

  product.images.edges.map((image, idx) => {
    images.push(
      <SwiperSlide key={'slide-' + idx}>
        <Image
          src={image.node.url}
          alt={image.node.altText || ''}
          layout="fill"
          objectFit="cover"
        />
      </SwiperSlide>
    );
  });

  return (
    <div>
      <div className="flex flex-col justify-center items-center space-y-8 md:flex-row md:items-start md:space-y-0 md:space-x-4 lg:space-x-8 max-w-6xl w-11/12 mx-auto">
        <div className="w-full max-w-md border bg-white rounded-2xl overflow-hidden shadow-lg md:w-1/2">
          <div className="relative  h-96 w-full">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="h-96 rounded-2xl"
              style={{
                // @ts-expect-error: Used custom property
                '--swiper-navigation-color': '#000',
                '--swiper-pagination-color': '#000',
              }}
              loop={true}
              slidesPerView={1}
            >
              {images}
            </Swiper>
          </div>
        </div>
        <ProductForm product={product} />
      </div>
      <p className="pt-16 space-y-8 md:space-x-4 lg:space-x-8 max-w-3xl w-11/12 mx-auto">
        {product.description}
      </p>
      <RecommendedList
        current={product.id}
        products={product.collections.edges[0].node.products.edges}
      />
    </div>
  );
}
