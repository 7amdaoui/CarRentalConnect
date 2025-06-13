import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CircleAlert, Home } from 'lucide-react';
import { toast } from 'sonner';
import EmailConfirmation from '@/components/EmailConfirmation';
import { Reservation } from '@/services/reservationService';
import { Car } from '@/types/car';
import reservationService from '@/services/reservationService';
import carService from '@/services/carService';

const ReservationConfirmation = () => {
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Confirmation de Réservation | CarRentalConnect Tinghir</title>
        <meta name="description" content="Confirmation de votre réservation de véhicule" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Merci pour votre réservation!</h1>
              <p className="text-gray-600">
                Votre réservation a été confirmée et vous recevrez prochainement un email avec tous les détails.
              </p>
            </div>
            
            <EmailConfirmation reservation={reservation} car={car} />
            
            <div className="flex justify-center mt-10">
              <Button 
                className="bg-morocco-blue hover:bg-morocco-blue/90"
                onClick={() => navigate('/')}
              >
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReservationConfirmation; 