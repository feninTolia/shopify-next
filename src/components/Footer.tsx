import Link from 'next/link';

const navigation = [
  { name: 'About', href: '#' },
  { name: 'Shop', href: '#' },
  { name: 'Jobs', href: '#' },
  { name: 'Terms and Conditions', href: '#' },
];

export const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center">
          {navigation.map((item) => (
            <div className="px-6 py-2" key={item.name}>
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-900"
              >
                {item.name}
              </Link>
            </div>
          ))}
        </nav>
        <p className="mt-8 text-center text-gray-400">
          &copy; 2024 Shopify Next.js. All right reserved.
        </p>
      </div>
    </footer>
  );
};
