import { Hero } from '@/components/Hero';
import { ProductList } from '@/components/ProductList';
import { getProductsInCollection } from '@/lib/shopify';

export default async function Home() {
  const result = await getProductsInCollection();

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Hero />
      <ProductList products={result} />
    </div>
  );
}
