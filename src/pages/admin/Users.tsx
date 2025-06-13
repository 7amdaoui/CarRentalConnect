import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Edit, 
  Eye, 
  MoreVertical, 
  Search, 
  Shield, 
  Trash2, 
  UserPlus, 
  UserCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User } from '@/services/userService';
import userService from '@/services/userService';

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // Fetch real users from backend
        const usersData = await userService.getAllUsers();
        setUsers(usersData.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Erreur lors du chargement des utilisateurs", {
          description: "Veuillez réessayer plus tard"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);
  
  const handleUpdateRole = async (userId: string, newRole: User['role']) => {
    try {
      // In a real app, call API to update user role
      // await userService.updateUser(userId, { role: newRole });
      
      // For demo, update state locally
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ));
      
      toast.success("Rôle mis à jour avec succès");
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Erreur lors de la mise à jour du rôle", {
        description: "Veuillez réessayer plus tard"
      });
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      // In a real app, call API to delete user
      // await userService.deleteUser(userId);
      
      // For demo, update state locally
      setUsers(users.filter(user => user.id !== userId));
      
      toast.success("Utilisateur supprimé avec succès");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Erreur lors de la suppression de l'utilisateur", {
        description: "Veuillez réessayer plus tard"
      });
    }
  };
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: fr });
  };
  
  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Gestion des utilisateurs | Admin CarRentalConnect</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display">Gestion des utilisateurs</h1>
          <Button 
            onClick={() => toast.info("Fonctionnalité en développement")}
            className="bg-morocco-blue hover:bg-morocco-blue/90"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Total utilisateurs</div>
            <div className="text-2xl font-bold">{users.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Clients</div>
            <div className="text-2xl font-bold text-morocco-blue">
              {users.filter(user => user.role?.toLowerCase() === 'user').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Administrateurs</div>
            <div className="text-2xl font-bold text-morocco-red">
              {users.filter(user => user.role?.toLowerCase() === 'admin').length}
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="user">Clients</SelectItem>
              <SelectItem value="admin">Administrateurs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Users Table */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableCaption>Liste des utilisateurs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-morocco-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 mt-2">Chargement en cours...</p>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-gray-500">Aucun utilisateur trouvé</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <UserCircle className="h-10 w-10 text-gray-300 mr-3" />
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-500">{String(user.id).substring(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge 
                        className={user.role.toLowerCase() === 'user' ? 'bg-morocco-blue hover:bg-morocco-blue/90' : ''}
                      >
                        {user.role.toLowerCase() === 'admin' ? 'Administrateur' : 'Client'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(user.createdAt)}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le profil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator />
                          
                          {user.role === 'user' ? (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateRole(user.id, 'admin')}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Promouvoir en admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleUpdateRole(user.id, 'user')}
                            >
                              <UserCircle className="h-4 w-4 mr-2" />
                              Rétrograder en utilisateur
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers; 