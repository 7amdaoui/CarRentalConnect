import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Car, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use real authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const email = localStorage.getItem('user_email');
    setIsAuthenticated(!!token);
    setUserEmail(email);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_email');
    setIsAuthenticated(false);
    setUserEmail(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-morocco-red" />
              <div>
                <span className="font-display font-bold text-morocco-red text-xl">CarRentalConnect</span>
                <div className="flex text-xs text-morocco-blue">
                  <span>Location de Voitures</span>
                  <span className="mx-1">|</span>
                  <span className="arabic-text">تأجير السيارات</span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="text-morocco-dark hover:text-morocco-blue px-3 py-2 rounded-md text-sm font-medium">Accueil</Link>
            <Link to="/cars" className="text-morocco-dark hover:text-morocco-blue px-3 py-2 rounded-md text-sm font-medium">Véhicules</Link>
            <Link to="/locations" className="text-morocco-dark hover:text-morocco-blue px-3 py-2 rounded-md text-sm font-medium">Agences</Link>
            <Link to="/contact" className="text-morocco-dark hover:text-morocco-blue px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-morocco-dark hover:text-morocco-blue px-3 py-2 rounded-md text-sm font-medium focus:outline-none">
                  <User className="inline-block h-4 w-4 mr-1" />
                      {userEmail}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>Profil</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-reservations')}>Mes Réservations</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">Déconnexion</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  className="border-morocco-blue text-morocco-blue hover:bg-morocco-blue hover:text-white"
                  onClick={handleLogin}
                >
                  Connexion
                </Button>
                <Button 
                  className="bg-morocco-red hover:bg-morocco-red/90 text-white"
                  onClick={() => navigate('/register')}
                >
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-morocco-dark hover:text-morocco-blue focus:outline-none"
            >
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-slide-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-morocco-dark hover:text-morocco-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/cars" 
              className="block px-3 py-2 rounded-md text-base font-medium text-morocco-dark hover:text-morocco-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Véhicules
            </Link>
            <Link 
              to="/locations" 
              className="block px-3 py-2 rounded-md text-base font-medium text-morocco-dark hover:text-morocco-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Agences
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 rounded-md text-base font-medium text-morocco-dark hover:text-morocco-blue"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <div className="px-3 py-2 space-y-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-morocco-dark hover:text-morocco-blue px-3 py-2 rounded-md text-sm font-medium focus:outline-none">
                  <User className="inline-block h-4 w-4 mr-1" />
                      {userEmail}
                </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>Profil</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-reservations')}>Mes Réservations</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">Déconnexion</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-morocco-blue text-morocco-blue hover:bg-morocco-blue hover:text-white"
                  onClick={() => {
                    handleLogin();
                    setIsMenuOpen(false);
                  }}
                >
                  Connexion
                </Button>
                <Button 
                  className="w-full bg-morocco-red hover:bg-morocco-red/90 text-white"
                  onClick={() => {
                    navigate('/register');
                    setIsMenuOpen(false);
                  }}
                >
                  S'inscrire
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
