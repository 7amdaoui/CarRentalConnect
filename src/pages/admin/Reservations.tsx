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
  Eye, 
  FileText, 
  MoreVertical, 
  Search, 
  Calendar, 
  Car
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Reservation } from '@/services/reservationService';
import reservationService from '@/services/reservationService';

// Status badge component
const StatusBadge = ({ status }: { status: Reservation['status'] }) => {
  switch (status && status.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline" className="border-orange-500 text-orange-600">En attente</Badge>;
    case 'confirmed':
      return <Badge className="bg-green-500 hover:bg-green-600">Confirmée</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Annulée</Badge>;
    case 'completed':
      return <Badge variant="secondary">Terminée</Badge>;
    default:
      return <Badge variant="outline">Indéfini</Badge>;
  }
};

// Payment status badge component
const PaymentBadge = ({ status }: { status: Reservation['paymentStatus'] }) => {
  switch (status && status.toLowerCase()) {
    case 'pending':
      return <Badge variant="outline" className="border-orange-500 text-orange-600">En attente</Badge>;
    case 'paid':
      return <Badge className="bg-green-500 hover:bg-green-600">Payé</Badge>;
    case 'refunded':
      return <Badge variant="secondary">Remboursé</Badge>;
    default:
      return <Badge variant="outline">Indéfini</Badge>;
  }
};

const AdminReservations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/reservations');
        const data = await response.json();
        setReservations(data.data || []);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        toast.error("Erreur lors du chargement des réservations", {
          description: "Veuillez réessayer plus tard"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);
  
  const handleUpdateStatus = async (reservationId: string, newStatus: Reservation['status']) => {
    try {
      // In a real app, call API to update reservation status
      // await reservationService.updateReservation(reservationId, { status: newStatus });
      
      // For demo, update state locally
      setReservations(reservations.map(res => 
        res.id === reservationId 
          ? { ...res, status: newStatus }
          : res
      ));
      
      toast.success("Statut mis à jour avec succès");
    } catch (error) {
      console.error("Error updating reservation status:", error);
      toast.error("Erreur lors de la mise à jour du statut", {
        description: "Veuillez réessayer plus tard"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: fr });
  };
  
  // Filter reservations based on search term and status filter
  const filteredReservations = reservations.filter(reservation => {
    const carInfo = reservation.car || { brand: '', model: '' };
    const userInfo = reservation.user || { firstName: '', lastName: '', email: '' };

    const matchesSearch =
      reservation.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      carInfo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carInfo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userInfo.firstName + ' ' + userInfo.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      userInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  
  // Calculate statistics
  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status && r.status.toLowerCase() === 'pending').length,
    confirmed: reservations.filter(r => r.status && r.status.toLowerCase() === 'confirmed').length,
    cancelled: reservations.filter(r => r.status && r.status.toLowerCase() === 'cancelled').length,
    completed: reservations.filter(r => r.status && r.status.toLowerCase() === 'completed').length,
    revenue: reservations
      .filter(r => r.status && r.status.toLowerCase() !== 'cancelled' && r.paymentStatus && r.paymentStatus.toLowerCase() === 'paid')
      .reduce((sum, r) => sum + r.totalPrice, 0)
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>Gestion des réservations | Admin CarRentalConnect</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display">Gestion des réservations</h1>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Total</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">En attente</div>
            <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Confirmées</div>
            <div className="text-2xl font-bold text-green-500">{stats.confirmed}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Complétées</div>
            <div className="text-2xl font-bold text-blue-500">{stats.completed}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Revenus</div>
            <div className="text-2xl font-bold text-morocco-red">{stats.revenue} MAD</div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Rechercher une réservation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="completed">Complétées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Reservations Table */}
        <div className="rounded-md border bg-white">
          <Table>
            <TableCaption>Liste des réservations</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="w-8 h-8 border-4 border-morocco-blue border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 mt-2">Chargement en cours...</p>
                  </TableCell>
                </TableRow>
              ) : filteredReservations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <p className="text-gray-500">Aucune réservation trouvée</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReservations.map((reservation) => {
                  return (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">
                        {reservation.id.toString().substring(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{reservation.user ? `${reservation.user.firstName} ${reservation.user.lastName}` : 'Inconnu'}</div>
                          <div className="text-xs text-gray-500">{reservation.user?.email || 'inconnu@example.com'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{reservation.car ? `${reservation.car.brand} ${reservation.car.model}` : 'Inconnu'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <div className="whitespace-nowrap">{formatDate(reservation.startDate)}</div>
                            <div className="text-xs text-gray-500">au {formatDate(reservation.endDate)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {reservation.totalPrice} MAD
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={reservation.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentBadge status={reservation.paymentStatus} />
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
                              Voir les détails
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Facture
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Changer le statut</DropdownMenuLabel>
                            
                            {reservation.status !== 'confirmed' && (
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(reservation.id, 'confirmed')}
                                disabled={reservation.status === 'cancelled' || reservation.status === 'completed'}
                              >
                                Confirmer
                              </DropdownMenuItem>
                            )}
                            
                            {reservation.status !== 'completed' && (
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(reservation.id, 'completed')}
                                disabled={reservation.status === 'cancelled'}
                              >
                                Marquer comme terminée
                              </DropdownMenuItem>
                            )}
                            
                            {reservation.status !== 'cancelled' && (
                              <DropdownMenuItem 
                                onClick={() => handleUpdateStatus(reservation.id, 'cancelled')}
                                className="text-red-600"
                                disabled={reservation.status === 'completed'}
                              >
                                Annuler
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReservations;