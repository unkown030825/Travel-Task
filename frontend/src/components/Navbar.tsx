import { MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold">highway</div>
              <div className="text-xs font-light">delite</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search experiences"
                className="pl-4 pr-4 py-2 bg-gray-100 rounded-lg w-80 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
