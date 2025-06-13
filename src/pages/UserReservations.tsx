import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  Car, 
  CircleAlert, 
  Download, 
  FileText, 
  MoreVertical, 
  ShoppingCart, 
  UserCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Reservation } from '@/services/reservationService';
import reservationService from '@/services/reservationService';
import userService from '@/services/userService';

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

const UserReservations = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const email = localStorage.getItem('user_email');
  const token = localStorage.getItem('auth_token');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      if (!token) {
        setIsLoading(false);
        return;
      }
      const response = await fetch('/reservations/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
      });
      if (response.status === 401) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
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

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthenticated(!!token);
    };
    checkAuth();
    if (token) {
      fetchReservations();
    }
  }, [token]);
  
  const handleCancelReservation = async (reservationId: string) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?');
    if (!confirmed) return;
    try {
      await reservationService.cancelReservation(reservationId);
      await fetchReservations();
      toast.success("Réservation annulée avec succès");
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Erreur lors de l'annulation de la réservation", {
        description: "Veuillez réessayer plus tard"
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'd MMMM yyyy', { locale: fr });
  };
  
  const handleDownloadPDF = (reservationId: string) => {
    fetch(`/reservation/${reservationId}/invoice`)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservation-${reservationId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <UserCircle className="h-16 w-16 text-morocco-blue mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Connexion requise</h1>
            <p className="text-gray-600 mb-8">
              Veuillez vous connecter pour accéder à vos réservations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                onClick={() => navigate('/login')}
                className="bg-morocco-blue hover:bg-morocco-blue/90"
              >
                Se connecter
              </Button>
              <Button 
                onClick={() => navigate('/register')}
                variant="outline"
              >
                Créer un compte
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-morocco-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement en cours...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Reservation stats logic
  const confirmedReservations = reservations.filter(r => r.status && r.status.toLowerCase() === "confirmed");
  const upcomingReservations = reservations.filter(
    r => r.status && r.status.toLowerCase() === "confirmed" && new Date(r.startDate) > new Date()
  );
  const totalSpent = reservations
    .filter(r => r.status && (r.status.toLowerCase() === "completed" || r.status.toLowerCase() === "confirmed"))
    .reduce((sum, r) => sum + (r.totalPrice || 0), 0)
    .toFixed(2) + " MAD";
  
  const pastReservations = reservations.filter(res => 
    res.status && (res.status.toLowerCase() === 'completed' || res.status.toLowerCase() === 'cancelled')
  );
  
  const filteredUpcoming = upcomingReservations.filter(res => {
    const matchesSearch =
      res.car.brand.toLowerCase().includes(search.toLowerCase()) ||
      res.car.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? res.status && res.status.toLowerCase() === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  const filteredPast = pastReservations.filter(res => {
    const matchesSearch =
      res.car.brand.toLowerCase().includes(search.toLowerCase()) ||
      res.car.model.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? res.status && res.status.toLowerCase() === statusFilter : true;
    return matchesSearch && matchesStatus;
  });
  
  if (email === 'admin@admin.com') {
    return (
      <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Accès réservé</h2>
        <p>Vous êtes administrateur. Veuillez utiliser la page d'administration des réservations.</p>
        <button className="mt-4 bg-morocco-blue text-white px-4 py-2 rounded" onClick={() => navigate('/admin/reservations')}>Admin Réservations</button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Mes Réservations | CarRentalConnect Tinghir</title>
        <meta name="description" content="Gérez vos réservations de véhicules et consultez l'historique de vos locations" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-bold">Mes Réservations</h1>
            <Button 
              onClick={() => navigate('/cars')}
              className="bg-morocco-red hover:bg-morocco-red/90"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Nouvelle location
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total des réservations</CardTitle>
                <CardDescription>Toutes vos réservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{reservations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Réservations confirmées</CardTitle>
                <CardDescription>Réservations confirmées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-morocco-blue">{confirmedReservations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Réservations à venir</CardTitle>
                <CardDescription>Réservations à venir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-morocco-blue">{upcomingReservations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total dépensé</CardTitle>
                <CardDescription>Sur toutes vos locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-morocco-red">{totalSpent}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <input
              type="text"
              className="border rounded px-3 py-2 w-full md:w-64"
              placeholder="Rechercher par marque ou modèle..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="border rounded px-3 py-2 w-full md:w-48"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              aria-label="Filtrer par statut"
              title="Filtrer par statut"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmée</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
          
          <Tabs defaultValue="upcoming" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upcoming">Réservations à venir</TabsTrigger>
              <TabsTrigger value="past">Historique</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {filteredUpcoming.length > 0 ? (
                <div className="rounded-md border bg-white overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Véhicule</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUpcoming.map((reservation) => {
                        return (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Car className="h-5 w-5 text-gray-400" />
                                <div>
                                  <div>{reservation.car.brand} {reservation.car.model}</div>
                                  <div className="text-xs text-gray-500">{reservation.car.type}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-gray-400" />
                                <div>
                                  <div className="whitespace-nowrap">{formatDate(reservation.startDate)}</div>
                                  <div className="text-xs text-gray-500">au {formatDate(reservation.endDate)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={reservation.status} />
                            </TableCell>
                            <TableCell>
                              <PaymentBadge status={reservation.paymentStatus} />
                            </TableCell>
                            <TableCell className="font-medium">
                              {reservation.totalPrice} MAD
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <span className="sr-only">Menu</span>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => navigate(`/reservation/confirmation/${reservation.id}`)}>
                                      Voir les détails
                                    </DropdownMenuItem>
                                    {reservation.status && reservation.status.toLowerCase() === 'pending' && (
                                      <DropdownMenuItem onClick={() => navigate(`/payment/${reservation.id}`)}>
                                        Effectuer le paiement
                                      </DropdownMenuItem>
                                    )}
                                    {(reservation.status && (reservation.status.toLowerCase() === 'confirmed' || reservation.status.toLowerCase() === 'pending')) && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                          className="text-red-600"
                                          onClick={() => handleCancelReservation(reservation.id)}
                                        >
                                          Annuler la réservation
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                {(reservation.status && (reservation.status.toLowerCase() === 'confirmed' || reservation.status.toLowerCase() === 'pending')) && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => handleCancelReservation(reservation.id)}
                                  >
                                    Annuler
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-white border rounded-md">
                  <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune réservation à venir</h3>
                  <p className="text-gray-500 mb-6">
                    Vous n'avez aucune réservation active ou en attente pour le moment.
                  </p>
                  <Button 
                    onClick={() => navigate('/cars')}
                    className="bg-morocco-blue hover:bg-morocco-blue/90"
                  >
                    Explorer nos véhicules
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {filteredPast.length > 0 ? (
                <div className="rounded-md border bg-white overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Véhicule</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Paiement</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPast.map((reservation) => {
                        return (
                          <TableRow key={reservation.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Car className="h-5 w-5 text-gray-400" />
                                <div>
                                  <div>{reservation.car.brand} {reservation.car.model}</div>
                                  <div className="text-xs text-gray-500">{reservation.car.type}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5 text-gray-400" />
                                <div>
                                  <div className="whitespace-nowrap">{formatDate(reservation.startDate)}</div>
                                  <div className="text-xs text-gray-500">au {formatDate(reservation.endDate)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={reservation.status} />
                            </TableCell>
                            <TableCell>
                              <PaymentBadge status={reservation.paymentStatus} />
                            </TableCell>
                            <TableCell className="font-medium">
                              {reservation.totalPrice} MAD
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => navigate(`/reservation/confirmation/${reservation.id}`)}>
                                    Voir les détails
                                  </DropdownMenuItem>
                                  {reservation.status === 'completed' && (
                                    <DropdownMenuItem onClick={() => handleDownloadPDF(reservation.id)}>
                                      <FileText className="h-4 w-4 mr-2" />
                                      Facture (PDF)
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-white border rounded-md">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun historique</h3>
                  <p className="text-gray-500 mb-6">
                    Vous n'avez pas encore d'historique de location avec nous.
                  </p>
                  <Button 
                    onClick={() => navigate('/cars')}
                    className="bg-morocco-blue hover:bg-morocco-blue/90"
                  >
                    Explorer nos véhicules
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserReservations; 