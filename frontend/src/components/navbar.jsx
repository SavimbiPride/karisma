import { Link } from 'react-router-dom';

const Navbar = () => (

    <nav>
        <header className="bg-gray-300 sticky top-0 z-50 border-b border-[#252a61]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div>
            <img src="Logo Karisma Academy.png" alt="Logo"/>
          </div>
          <Link to="/login" className="hover:underline">Login</Link>
        </div>
      </header>
    </nav>
);

export default Navbar;