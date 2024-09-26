import { ICheckoutVariant } from '@/components/ProductForm';
import {
  Product,
  ShopifyAllProductsData,
  ShopifyCollectionData,
  ShopifyPCreateCartData,
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
    collections(first: 1) {
      edges {
        node {
          products(first: 5) {
            edges {
              node {
                id
                title
                handle
                priceRange {
                  minVariantPrice {
                    amount
                  }
                }
               images(first: 5) {
                  nodes{
                    altText
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
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
  return response.data.product ?? [];
}

export async function createCheckout(id: string, quantity: number) {
  const query = `
  mutation {
  cartCreate(
    input: {lines: [{quantity:${quantity}, merchandiseId: "${id}"}]}
  ) {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
          }
        }
      }
    }
  }
}`;

  const response: ShopifyPCreateCartData = await shopifyData(query);
  return response.data.cartCreate.cart ?? [];
}

export async function updateCheckout(id: string, lineItem: ICheckoutVariant) {
  const lineItemObject = `{
    merchandiseId: "${lineItem.id}"
    quantity: ${1}
    }`;

  const query = `mutation {
  cartLinesAdd(
    lines: [${lineItemObject}]
    cartId: "${id}"
  ) {
    cart {
      id
      checkoutUrl
      totalQuantity
       lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                title
              }
            }
          }
        }
      }
    }
  }
}`;

  const response = await shopifyData(query);
  return response.data.cartLinesAdd.cart ?? [];
}

export async function removeCheckoutLine(
  id: string,
  lineItem: ICheckoutVariant
) {
  const query = `mutation {
  cartLinesRemove(
    cartId: "${id}",
    lineIds: ["${lineItem.cartLineId}"]
  ) {
    cart {
      id
      checkoutUrl
    }
  }
}`;

  const response = await shopifyData(query);
  return response.data.cartLinesRemove.cart ?? [];
}
