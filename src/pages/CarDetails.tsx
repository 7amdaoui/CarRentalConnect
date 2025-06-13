import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Car as CarIcon, 
  Check, 
  ChevronLeft, 
  CircleAlert,
  Fuel, 
  Info, 
  Map, 
  MapPin, 
  ShieldCheck, 
  Star, 
  User
} from 'lucide-react';
import { toast } from 'sonner';
import { Car } from '@/types/car';
import BookingForm from '@/components/BookingForm';
import carService from '@/services/carService';

const API_URL = "http://localhost:8080";

// Type for car features
interface CarFeature {
  icon: React.ReactNode;
  label: string;
}

const CarDetails = () => {
  console.log('CarDetails component mounted');
  const { carId } = useParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Only use images that exist
  const images = [car?.imageUrl].filter(Boolean);
  
  // Fetch car details
  useEffect(() => {
    console.log('useEffect triggered, carId:', carId);
    const fetchCar = async () => {
      console.log('fetchCar called with carId:', carId);
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/cars/${carId}`);
        console.log('Fetch response:', response);
        if (!response.ok) {
          throw new Error('Car not found');
        }
        const responseData = await response.json();
        console.log('Car details API response:', responseData);
        
        // Extract the car data from the nested structure
        const data = responseData.data;
        console.log('Extracted car data:', data);
        
        // Map fields to handle both camelCase and snake_case
        const mappedCar = {
          ...data,
          brand: data.brand || '',
          model: data.model || '',
          type: data.type || '',
          year: data.year || '',
          pricePerDay: data.pricePerDay || 0,
          imageUrl: data.imageUrl || '',
          registrationNumber: data.registrationNumber || '',
          agency: data.agency || '',
          available: data.status === 'AVAILABLE',
          features: data.features || [],
          description: data.description || '',
        };
        
        setCar(mappedCar);
      } catch (err) {
        console.error('Error in fetchCar:', err);
        setError(err instanceof Error ? err.message : 'Failed to load car details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [carId]);
  
  // Define car features
  const carFeatures: CarFeature[] = [
    { icon: <User className="h-5 w-5" />, label: "5 places" },
    { icon: <Fuel className="h-5 w-5" />, label: "Diesel" },
    { icon: <Map className="h-5 w-5" />, label: "GPS intégré" },
    { icon: <Check className="h-5 w-5" />, label: "Air conditionné" },
    { icon: <Check className="h-5 w-5" />, label: "ABS" },
    { icon: <Check className="h-5 w-5" />, label: "Bluetooth" },
    { icon: <Check className="h-5 w-5" />, label: "2 Valises" },
    { icon: <Check className="h-5 w-5" />, label: "Boîte manuelle" },
  ];
  
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
  
  if (!car) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="text-center">
            <CircleAlert className="h-16 w-16 text-morocco-red mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Véhicule non trouvé</h1>
            <p className="text-gray-600 mb-8">
              Le véhicule que vous recherchez n'existe pas ou a été retiré de notre catalogue.
            </p>
            <Button asChild className="bg-morocco-blue hover:bg-morocco-blue/90">
              <Link to="/cars">Voir tous nos véhicules</Link>
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
        <title>
          {car && car.brand && car.model
            ? `${car.brand} ${car.model} | CarRentalConnect Tinghir`
            : 'Détail du véhicule | CarRentalConnect Tinghir'}
        </title>
        <meta name="description" content={
          car && car.brand && car.model && car.year && car.pricePerDay && car.agency
            ? `Louez ${car.brand} ${car.model} ${car.year} à partir de ${car.pricePerDay} MAD/jour. Véhicule disponible à notre agence de ${car.agency}.`
            : 'Détail du véhicule à louer à Tinghir.'
        } />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-morocco-blue">Accueil</Link>
              <span>/</span>
              <Link to="/cars" className="hover:text-morocco-blue">Véhicules</Link>
              <span>/</span>
              <span className="text-gray-400">{car.brand} {car.model}</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-morocco-blue"
              asChild
            >
              <Link to="/cars">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour aux véhicules
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Car Images and Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Car Title */}
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-display font-bold">{car.brand || ''} {car.model || ''}</h1>
                    <p className="text-gray-600 flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" /> 
                      Agence {car.agency} | <Star className="h-4 w-4 text-yellow-500 mx-1" /> 4.8 (24 avis)
                    </p>
                  </div>
                  {car.status === 'AVAILABLE' || car.status === 'available' ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>
                  ) : car.status === 'RENTED' || car.status === 'rented' ? (
                    <Badge variant="secondary">Loué</Badge>
                  ) : car.status === 'MAINTENANCE' || car.status === 'maintenance' ? (
                    <Badge variant="destructive">En Maintenance</Badge>
                  ) : (
                    <Badge variant="outline">Indéfini</Badge>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-morocco-red">{car.pricePerDay ? `${car.pricePerDay} MAD/jour` : 'Prix non défini'}</p>
                </div>
              </div>
              
              {/* Car Main Image */}
              <div className="rounded-lg overflow-hidden">
                <img 
                  src={car.imageUrl || ''} 
                  alt={`${car.brand || ''} ${car.model || ''}`} 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              {/* Car Image Gallery */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.map((img, index) => (
                  <div 
                    key={index}
                    className={`rounded-md overflow-hidden cursor-pointer border-2 ${activeImage === index ? 'border-morocco-blue' : 'border-transparent'}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={img} 
                      alt={`${car.brand || ''} ${car.model || ''} - Vue ${index + 1}`} 
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
              
              {/* Tabs for Details */}
              <Tabs defaultValue="features">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Caractéristiques</TabsTrigger>
                  <TabsTrigger value="conditions">Conditions</TabsTrigger>
                  <TabsTrigger value="reviews">Avis clients</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Caractéristiques du véhicule</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {carFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="text-morocco-blue">
                            {feature.icon}
                          </div>
                          <span className="text-sm">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Description</h3>
                    <p className="text-gray-600">
                      Le {(car.brand || '')} {(car.model || '')} est un SUV {(car.type || '')} parfait pour vos voyages dans la région. 
                      Confortable, économique et fiable, ce véhicule est idéal pour les trajets en ville comme sur les routes 
                      de campagne. Avec ses équipements modernes et sa consommation raisonnable, vous profiterez d'une 
                      expérience de conduite agréable.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="conditions" className="space-y-4 mt-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="h-5 w-5 text-morocco-blue mt-0.5" />
                      <div>
                        <h4 className="font-medium">Assurance incluse</h4>
                        <p className="text-sm text-gray-600">Assurance tous risques avec franchise de 5000 MAD</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-morocco-blue mt-0.5" />
                      <div>
                        <h4 className="font-medium">Documents requis</h4>
                        <p className="text-sm text-gray-600">Permis de conduire valide, pièce d'identité, carte de crédit</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-morocco-blue mt-0.5" />
                      <div>
                        <h4 className="font-medium">Durée de location</h4>
                        <p className="text-sm text-gray-600">Minimum 24h, pas de maximum</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CarIcon className="h-5 w-5 text-morocco-blue mt-0.5" />
                      <div>
                        <h4 className="font-medium">Kilométrage</h4>
                        <p className="text-sm text-gray-600">Kilométrage illimité</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Politique d'annulation</h3>
                      <p className="text-sm text-gray-600">
                        Annulation gratuite jusqu'à 24 heures avant la prise du véhicule.
                        En cas d'annulation moins de 24 heures avant, des frais peuvent s'appliquer.
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Avis clients</h3>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-bold">4.8</span>
                      <span className="text-gray-500 ml-1">(24 avis)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Sample reviews */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Mohamed A.</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Excellent véhicule, très confortable et économique. Le personnel de l'agence était très professionnel.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">12 Mars 2023</p>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Sarah L.</span>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Voiture très bien entretenue, prise en main facile. Petit bémol sur la clim qui était un peu faible.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">5 Février 2023</p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full hover:bg-gray-100"
                    >
                      Voir tous les avis
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BookingForm car={car} />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CarDetails; 