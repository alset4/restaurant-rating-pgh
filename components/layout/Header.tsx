import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center max-w-7xl relative">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Hallo" width={70} height={70} />
        </div>
        <div className="flex gap-6 text-lg absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-gray-700 font-semibold hover:text-yellow-600 font-lg">
            Home
          </Link>
          <Link href="/reviews" className="text-gray-700 font-semibold hover:text-yellow-600 font-lg">
            Reviews
          </Link>
          <Link href="/rankings" className="text-gray-700 font-semibold hover:text-yellow-600 font-lg">
            Rankings
          </Link>
        </div>
      </div>
    </nav>
  );
}
