import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Calendar } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Car } from "@/types/car";
import { toast } from "sonner";
import carService from "@/services/carService";

// Mock data for locations
const locationData = {
  tinghir: {
    id: "tinghir",
    name: "Tinghir Centre",
    address: "123 Avenue Mohammed V, Tinghir, Maroc",
    phone: "+212 666-123456",
    hours: "8h30 - 18h30 (Lun-Ven), 9h00 - 16h00 (Sam)",
    description: "Notre agence principale au cœur de Tinghir, à proximité de la place centrale.",
    longDescription: "Située au centre de Tinghir, notre agence principale offre un accès facile à tous nos véhicules et services. Notre équipe professionnelle est disponible pour vous conseiller et vous aider à choisir le véhicule idéal pour votre séjour dans la région.",
    imageUrl: "/images/agencies/tinghir.jpg"
  },
  ouarzazate: {
    id: "ouarzazate",
    name: "Ouarzazate Ville",
    address: "45 Boulevard Mohammed V, Ouarzazate, Maroc",
    phone: "+212 666-789012",
    hours: "8h30 - 18h30 (Lun-Ven), 9h00 - 16h00 (Sam)",
    description: "Située près des studios cinématographiques, notre agence d'Ouarzazate est idéale pour explorer la région.",
    longDescription: "Notre agence d'Ouarzazate est située près des célèbres studios de cinéma, vous permettant de commencer votre aventure sans délai. Idéalement placée pour découvrir les kasbahs et les paysages désertiques environnants.",
    imageUrl: "/images/agencies/ouarzazate.jpg"
  },
  errachidia: {
    id: "errachidia",
    name: "Errachidia Centre",
    address: "78 Rue de la Paix, Errachidia, Maroc",
    phone: "+212 666-456789",
    hours: "8h30 - 18h30 (Lun-Ven), 9h00 - 14h00 (Sam)",
    description: "Notre agence d'Errachidia vous permet d'explorer facilement le Tafilalet et ses oasis.",
    longDescription: "Idéalement située pour découvrir les oasis du Tafilalet et les dunes de Merzouga, notre agence d'Errachidia vous propose une sélection de véhicules adaptés pour la ville comme pour les pistes.",
    imageUrl: "/images/agencies/errachidia.jpg"
  }
};

const LocationDetail = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [location, setLocation] = useState<any>(null);
  const [availableCars, setAvailableCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (locationId && locationData[locationId as keyof typeof locationData]) {
      setLocation(locationData[locationId as keyof typeof locationData]);
      // Map locationId to agency name as in your DB
      const agencyName = locationId === 'tinghir' ? 'Tinghir' : 
                        locationId === 'ouarzazate' ? 'Ouarzazate' : 'Errachidia';
      carService.getAllCars({ agency: agencyName }, 0, 100)
        .then(carsArray => {
          console.log('DEBUG: carsArray', carsArray, 'agencyName', agencyName);
          setAvailableCars(carsArray);
          setIsLoading(false);
        })
        .catch(() => {
          setAvailableCars([]);
          setIsLoading(false);
        });
    } else {
      toast.error("Agence non trouvée");
      setIsLoading(false);
    }
  }, [locationId]);

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

  if (!location) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-display font-bold text-morocco-dark mb-4">Agence non trouvée</h1>
            <p className="mb-8">L'agence que vous recherchez n'existe pas.</p>
            <Button asChild className="bg-morocco-blue hover:bg-morocco-blue/90">
              <a href="/locations">Voir toutes nos agences</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  console.log('RENDER DEBUG: availableCars', availableCars);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{location.name} | CarRentalConnect {location.id.charAt(0).toUpperCase() + location.id.slice(1)}</title>
        <meta name="description" content={`Location de voitures à ${location.name}. Découvrez notre flotte de véhicules disponibles à la location.`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={location.imageUrl} 
            alt={location.name} 
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">{location.name}</h1>
              <p className="text-lg max-w-2xl mx-auto">{location.description}</p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-display font-bold text-morocco-dark mb-6">Nos véhicules disponibles</h2>
              
              {availableCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableCars.map(car => (
                    <CarCard key={car.id} {...car} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-morocco-red mb-4" />
                  <h3 className="text-xl font-medium mb-2">Aucun véhicule disponible actuellement</h3>
                  <p className="text-muted-foreground mb-4">
                    Tous nos véhicules sont actuellement réservés à cette agence. 
                    Veuillez consulter nos autres agences ou nous contacter pour plus d'informations.
                  </p>
                  <Button asChild className="bg-morocco-blue hover:bg-morocco-blue/90">
                    <a href="/contact">Nous contacter</a>
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-display font-bold text-morocco-dark mb-4">Informations de l'agence</h2>
                
                <div className="space-y-4">
                  <p className="text-gray-700">{location.longDescription}</p>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-morocco-red flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Adresse</h3>
                      <p className="text-gray-600">{location.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-morocco-red flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <p className="text-gray-600">{location.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-morocco-red flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium">Horaires</h3>
                      <p className="text-gray-600">{location.hours}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button asChild className="w-full bg-morocco-red hover:bg-morocco-red/90">
                      <a href={`tel:${location.phone.replace(/\s+/g, '')}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Appeler cette agence
                      </a>
                    </Button>
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

export default LocationDetail;
