import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b sticky top-0 z-20 bg-white">
      <div className="flex items-center justify-between max-w-6xl pt-4 pb-2 px-4 mx-auto lg:max-w-screen-xl">
        <Link href={'/'} className="cursor-pointer text-lg pt-1 font-bold">
          Shopify + Next
        </Link>
        <Link href={'/'} className="text-md font-bold cursor-pointer">
          Cart
        </Link>
      </div>
    </header>
  );
}
