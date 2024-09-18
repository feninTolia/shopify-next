import { ProductPageContent } from '@/components/ProductPageContent';
import { getAllProducts, getProduct } from '@/lib/shopify';

const ProductPage = async ({ params }: { params: { slug: string } }) => {
  const result = await getProduct(params.slug);

  return (
    <div>
      {result?.title}
      <ProductPageContent product={result} />
    </div>
  );
};

export default ProductPage;

export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((product) => ({
    slug: product.handle,
  }));
}
