import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Car, 
  Users, 
  Calendar, 
  MapPin, 
  CreditCard,
  TrendingUp
} from "lucide-react";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    activeReservations: 0,
    totalCustomers: 0,
    locations: 0,
    revenue: "0 MAD"
  });
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [vehiclePerformance, setVehiclePerformance] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch total cars
        const carsResponse = await fetch('/cars');
        const carsData = await carsResponse.json();
        const totalCars = carsData.data.length;
        const availableCars = carsData.data.filter(car => car.status === 'AVAILABLE').length;

        // Fetch all reservations
        const reservationsResponse = await fetch('/reservations');
        const reservationsData = await reservationsResponse.json();
        const allReservations = reservationsData.data;
        const activeReservations = allReservations.filter(res => res.status === 'CONFIRMED').length;

        // Recent reservations (latest 5)
        const sortedReservations = [...allReservations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentReservations(sortedReservations.slice(0, 5));

        // Vehicle performance: top 3 most rented vehicles
        const carStats: Record<string, { count: number; revenue: number; car: any }> = {};
        allReservations.forEach(res => {
          if (!res.car) return;
          const carId = res.car.id;
          if (!carStats[carId]) {
            carStats[carId] = { count: 0, revenue: 0, car: res.car };
          }
          carStats[carId].count += 1;
          if (res.paymentStatus === 'PAID') {
            carStats[carId].revenue += Number(res.totalPrice || 0);
          }
        });
        const topCars = Object.values(carStats)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);
        setVehiclePerformance(topCars);

        // Fetch total customers
        const usersResponse = await fetch('/users');
        const usersData = await usersResponse.json();
        const totalCustomers = usersData.users.length;

        // Fetch locations (agencies)
        const locationsResponse = await fetch('/cars/agencies');
        const locationsData = await locationsResponse.json();
        const locations = locationsData.data.length;

        // Fetch revenue
        const revenueResponse = await fetch('/revenue');
        const revenueData = await revenueResponse.json();
        const revenue = revenueData.total + " MAD";

        setStats({
          totalCars,
          availableCars,
          activeReservations,
          totalCustomers,
          locations,
          revenue
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-morocco-blue border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Tableau de bord Admin | CarRentalConnect</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-display">Tableau de bord</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cars Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Véhicules
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <div>
                  <div className="text-2xl font-bold">{stats.totalCars}</div>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.availableCars}</div>
                  <p className="text-xs text-muted-foreground">Disponibles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Reservations Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Réservations
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeReservations}</div>
              <p className="text-xs text-muted-foreground">
                Réservations actives
              </p>
            </CardContent>
          </Card>
          
          {/* Customers Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Clients
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Clients inscrits
              </p>
            </CardContent>
          </Card>
          
          {/* Locations Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Agences
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.locations}</div>
              <p className="text-xs text-muted-foreground">
                Agences actives
              </p>
            </CardContent>
          </Card>
          
          {/* Revenue Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Revenus
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenue}</div>
              <p className="text-xs text-muted-foreground">
                Ce mois-ci
              </p>
            </CardContent>
          </Card>
          
          {/* Growth Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Croissance
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+15%</div>
              <p className="text-xs text-muted-foreground">
                Par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Réservations récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentReservations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Les données des réservations récentes apparaîtront ici.
                </p>
              ) : (
                <table className="w-full text-sm border-separate border-spacing-y-1">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 rounded-tl-lg">ID</th>
                      <th className="text-left px-3 py-2">Client</th>
                      <th className="text-left px-3 py-2">Véhicule</th>
                      <th className="text-left px-3 py-2">Dates</th>
                      <th className="text-left px-3 py-2">Statut</th>
                      <th className="text-left px-3 py-2 rounded-tr-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReservations.map((res, idx) => (
                      <tr
                        key={res.id}
                        className={`bg-white ${idx % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-morocco-blue/10 transition`}
                      >
                        <td className="px-3 py-2 rounded-l-lg">{res.id}</td>
                        <td className="px-3 py-2">{res.user ? `${res.user.firstName} ${res.user.lastName}` : '-'}</td>
                        <td className="px-3 py-2">{res.car ? `${res.car.brand} ${res.car.model}` : '-'}</td>
                        <td className="px-3 py-2">{res.startDate} → {res.endDate}</td>
                        <td className="px-3 py-2">
                          {res.status === 'CONFIRMED' && (
                            <span className="inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-semibold">Confirmée</span>
                          )}
                          {res.status === 'PENDING' && (
                            <span className="inline-block px-2 py-1 text-xs rounded bg-orange-100 text-orange-700 font-semibold">En attente</span>
                          )}
                          {res.status === 'CANCELLED' && (
                            <span className="inline-block px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-semibold">Annulée</span>
                          )}
                          {res.status === 'COMPLETED' && (
                            <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 font-semibold">Terminée</span>
                          )}
                        </td>
                        <td className="px-3 py-2 rounded-r-lg">{res.totalPrice} MAD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance des véhicules</CardTitle>
            </CardHeader>
            <CardContent>
              {vehiclePerformance.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Les données de performance des véhicules apparaîtront ici.
                </p>
              ) : (
                <table className="w-full text-sm border-separate border-spacing-y-1">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 rounded-tl-lg">Véhicule</th>
                      <th className="text-left px-3 py-2">Réservations</th>
                      <th className="text-left px-3 py-2 rounded-tr-lg">Revenus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehiclePerformance.map((car, idx) => (
                      <tr
                        key={car.car.id}
                        className={`bg-white ${idx % 2 === 1 ? 'bg-gray-50' : ''} hover:bg-morocco-blue/10 transition`}
                      >
                        <td className="px-3 py-2 rounded-l-lg">{car.car.brand} {car.car.model}</td>
                        <td className="px-3 py-2">{car.count}</td>
                        <td className="px-3 py-2 rounded-r-lg">{car.revenue} MAD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
