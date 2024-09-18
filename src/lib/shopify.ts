import {
  Product,
  ShopifyAllProductsData,
  ShopifyCollectionData,
  ShopifyProductData,
} from './types';

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

export async function getProductsInCollection(): Promise<Product[]> {
  const query = `{
  collection(handle: "frontpage") {
    id
    title
    products(first: 20) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first: 1) {
          nodes {
            altText
            url
          }
        }
      }
    }
  }
}`;

  const response: ShopifyCollectionData = await shopifyData(query);

  return response?.data?.collection?.products?.nodes ?? [];
}

export const getAllProducts = async () => {
  const query = `{
  products(first: 25) {
    nodes {
      id
      handle
    }
  }
}`;

  const response: ShopifyAllProductsData = await shopifyData(query);
  const slugs = response.data.products.nodes ?? [];
  return slugs;
};

export async function getProduct(handle: string) {
  const query = `{
  product(handle: "${handle}") {
    id
    title
    handle
    description
    images(first: 5) {
      edges {
        node {
          url
          altText
        }
      }
    }
    options {
      id
      name
      optionValues {
        name
      }
    }
    variants(first: 25) {
      nodes {
        id
        title
        price {
          amount
        }
        selectedOptions {
          name
          value
        }
        image {
          url
          altText
        }
      }
    }
  }
}`;

  const response: ShopifyProductData = await shopifyData(query);
  return response.data.product;
}
