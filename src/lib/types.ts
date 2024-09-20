export interface Product {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: Price;
  };
  images: {
    nodes: Image[];
  };
}

export interface ProductExtended {
  id: string; // "gid://shopify/Product/8843853955318"
  title: string; // "Millionaire in the Waiting"
  handle: string; // "millionaire-in-the-waiting"
  description: string; // Product description
  images: {
    edges: ImageEdge[]; // Array of image edges
  };
  options: ProductOption[]; // Array of product options
  variants: {
    nodes: Variant[]; // Array of variant nodes
  };
}

interface Price {
  amount: string;
}

interface Image {
  altText: string | null;
  url: string;
}

interface ImageEdge {
  node: Image;
}

interface ProductOption {
  id: string; // Option ID
  name: string; // Option name, e.g., "Color"
  optionValues: OptionValue[]; // Array of option values
}

export interface OptionValue {
  name: string; // Option value name, e.g., "Pink"
}

interface Variant {
  id: string; // Variant ID
  title: string; // Variant title, e.g., "Pink / S"
  price: {
    amount: string; // Price amount as a string, e.g., "139.0"
  };
  selectedOptions: SelectedOption[]; // Array of selected options for this variant
  image: Image | null; // Image for the variant, nullable if not present
}

interface SelectedOption {
  name: string; // Option name, e.g., "Color"
  value: string; // Selected value for the option, e.g., "Pink"
}

export interface ShopifyCollectionData {
  data: {
    collection: {
      id: string;
      title: string;
      products: {
        nodes: Product[];
      };
    };
  };
}

export interface ShopifyAllProductsData {
  data: {
    products: {
      nodes: Product[];
    };
  };
}

export interface ShopifyProductData {
  data: {
    product: ProductExtended;
  };
}

export interface ShopifyPCreateCartData {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        lines: { edges: [{ node: { id: string } }] };
      };
    };
  };
}
