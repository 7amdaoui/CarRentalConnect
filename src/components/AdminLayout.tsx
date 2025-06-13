import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CarFront, 
  ChevronDown, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  MessageSquare, 
  Settings, 
  ShoppingCart, 
  Users, 
  X
} from 'lucide-react';
import { toast } from 'sonner';
import userService from '@/services/userService';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      // In a real app, call API to logout
      await userService.logout();
      
      toast.success("Déconnecté avec succès");
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };
  
  const navigationLinks = [
    { 
      name: 'Tableau de bord', 
      path: '/admin', 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: 'Véhicules', 
      path: '/admin/cars', 
      icon: <CarFront className="w-5 h-5" /> 
    },
    { 
      name: 'Réservations', 
      path: '/admin/reservations', 
      icon: <ShoppingCart className="w-5 h-5" /> 
    },
    { 
      name: 'Utilisateurs', 
      path: '/admin/users', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Messages', 
      path: '/admin/messages', 
      icon: <MessageSquare className="w-5 h-5" />,
      notification: 5
    },
    { 
      name: 'Paramètres', 
      path: '/admin/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
  ];
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <Link to="/admin" className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl text-morocco-blue">CarRentalConnect</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Sidebar navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'bg-morocco-blue text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.name}</span>
                {link.notification && (
                  <span className="ml-auto bg-morocco-red text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {link.notification}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-gray-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
            
            <div className="mt-4 flex items-center justify-between">
              <Link to="/" className="text-sm text-morocco-blue flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Voir le site
              </Link>
              <span className="text-xs text-gray-500">v1.0.0</span>
            </div>
          </div>
        </div>
        </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Header */}
        <header className="z-10 py-4 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-4 mx-auto">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-800 lg:hidden">CarRentalConnect</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 rounded-full">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-morocco-blue text-white flex items-center justify-center">
                        A
                      </div>
                      <span className="ml-2 hidden md:block text-sm font-medium">
                        Admin User
                      </span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuItem>
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
