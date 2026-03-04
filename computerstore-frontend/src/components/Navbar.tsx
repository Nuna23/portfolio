// client/src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/userSlice';

function Navbar() {
  const { totalItems } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">
          My Computer Store
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link>
          
          {user ? (
            <>
              {/* 🚨 เพิ่มเงื่อนไขเช็ค Admin */}
              {user.role === 'admin' && (
                <Link to="/admin" className="font-bold text-red-600 hover:text-red-800">
                  Admin Dashboard
                </Link>
              )}
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
            </>
          )}
          
          <Link to="/cart" className="relative">
            <span className="font-bold text-lg">🛒</span>
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;