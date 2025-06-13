import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CircleAlert, LockKeyhole } from 'lucide-react';
import { toast } from 'sonner';
import PaymentForm from '@/components/PaymentForm';
import { Reservation } from '@/services/reservationService';
import { Car } from '@/types/car';
import reservationService from '@/services/reservationService';
import carService from '@/services/carService';

const PaymentPage = () => {
  const { reservationId } = useParams<{ reservationId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  
  useEffect(() => {
    const fetchReservationAndCar = async () => {
      setIsLoading(true);
      try {
        if (!reservationId) return;
        // Fetch the real reservation
        const reservation = await reservationService.getReservationById(reservationId);
        setReservation(reservation);
        // Fetch the real car
        const car = await carService.getCarById(reservation.carId);
        setCar(car);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erreur lors du chargement des données", {
          description: "Veuillez réessayer plus tard"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservationAndCar();
  }, [reservationId]);
  
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
  
  if (!reservation || !car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <CircleAlert className="h-16 w-16 text-morocco-red mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Réservation non trouvée</h1>
            <p className="text-gray-600 mb-8">
              La réservation que vous recherchez n'existe pas ou a expiré.
            </p>
            <Button 
              onClick={() => navigate('/cars')}
              className="bg-morocco-blue hover:bg-morocco-blue/90"
            >
              Voir nos véhicules
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  // Calculate duration in days (inclusive)
const start = new Date(reservation.startDate);
const end = new Date(reservation.endDate);
const days = Math.abs(Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) + 1;
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Paiement | CarRentalConnect Tinghir</title>
        <meta name="description" content="Finaliser le paiement de votre réservation de véhicule" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-morocco-blue"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Retour
            </Button>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Finaliser votre réservation</h1>
              <p className="text-gray-600">
                {car.brand} {car.model} | {new Date(reservation.startDate).toLocaleDateString('fr-FR')} - {new Date(reservation.endDate).toLocaleDateString('fr-FR')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PaymentForm reservation={reservation} />
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                  <h3 className="font-semibold text-lg mb-4">Résumé de la réservation</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{car.brand} {car.model}</span>
                      <span>{car.pricePerDay} MAD/jour</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Durée</span>
                      <span>{days} jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Location</span>
                      <span>{days * car.pricePerDay} MAD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Assurance</span>
                      <span>Incluse</span>
                    </div>
                    <div className="flex justify-between items-center font-bold pt-3 border-t">
                      <span>Total</span>
                      <span className="text-morocco-red">{reservation.totalPrice} MAD</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md flex items-center space-x-2">
                    <LockKeyhole className="h-5 w-5 text-morocco-blue" />
                    <p className="text-sm text-blue-800">
                      Paiement sécurisé avec cryptage SSL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PaymentPage; 