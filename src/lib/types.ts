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
  id: string;
  collections: ProductCollection;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: ImageEdge[];
  };
  options: ProductOption[];
  variants: {
    nodes: Variant[];
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
  availableForSale: string;
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

interface ProductCollection {
  edges: {
    node: {
      products: {
        edges: {
          node: Product;
        }[];
      };
    };
  }[];
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
