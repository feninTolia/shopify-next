import { ShopifyProductData } from '@/lib/types';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const idQuery = searchParams.get('id');

  console.log('in route');

  const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
  const ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const apiVersion = '2024-07';

  async function shopifyData(query: string) {
    const URL = `https://${DOMAIN}/api/${apiVersion}/graphql.json`;

    const option: RequestInit = {
      // endpoint: URL,
      method: 'POST',
      headers: {
        'X-Shopify-Storefront-Access-Token': `${ACCESS_TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    };

    try {
      return await fetch(URL, option).then((response) => {
        return response.json();
      });
    } catch (error) {
      console.log(error);
      throw new Error('Failed to fetch products');
    }
  }

  async function getProduct(handle: string) {
    const query = `{
  product(handle: "${handle}") {
    id
    title
    variants(first: 25) {
      nodes {
        id
        title
        availableForSale
     }
    }
  }
}`;

    const response: ShopifyProductData = await shopifyData(query);
    return response.data.product ?? [];
  }

  const products = await getProduct(idQuery || '');
  //   const res = await fetch('https://data.mongodb-api.com/...', {});
  //   const data = await res.json();

  return Response.json(products);
}
