import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

// Mock data for locations
const locations = [
  {
    id: "tinghir",
    name: "Tinghir Centre",
    address: "123 Avenue Mohammed V, Tinghir, Maroc",
    phone: "+212 666-123456",
    hours: "8h30 - 18h30 (Lun-Ven), 9h00 - 16h00 (Sam)",
    description: "Notre agence principale au cœur de Tinghir, à proximité de la place centrale.",
    imageUrl: "/images/agencies/tinghir.jpg"
  },
  {
    id: "ouarzazate",
    name: "Ouarzazate Ville",
    address: "45 Boulevard Mohammed V, Ouarzazate, Maroc",
    phone: "+212 666-789012",
    hours: "8h30 - 18h30 (Lun-Ven), 9h00 - 16h00 (Sam)",
    description: "Située près des studios cinématographiques, notre agence d'Ouarzazate est idéale pour explorer la région.",
    imageUrl: "/images/agencies/ouarzazate.jpg"
  },
  {
    id: "errachidia",
    name: "Errachidia Centre",
    address: "78 Rue de la Paix, Errachidia, Maroc",
    phone: "+212 666-456789",
    hours: "8h30 - 18h30 (Lun-Ven), 9h00 - 14h00 (Sam)",
    description: "Notre agence d'Errachidia vous permet d'explorer facilement le Tafilalet et ses oasis.",
    imageUrl: "/images/agencies/errachidia.jpg"
  }
];

const Locations = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Nos Agences | CarRentalConnect Tinghir</title>
        <meta name="description" content="Découvrez nos agences de location de voiture à Tinghir, Ouarzazate et Errachidia." />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-morocco-dark mb-8 text-center">Nos Agences</h1>
          
          <div className="max-w-5xl mx-auto">
            <p className="text-lg text-center text-gray-700 mb-12">
              Nos agences stratégiquement situées vous offrent un accès facile à nos services de location 
              dans toute la région. Chaque agence dispose d'une équipe dédiée prête à vous accueillir et 
              à répondre à tous vos besoins de mobilité.
            </p>
            
            <div className="space-y-12">
              {locations.map((location, index) => (
                <div 
                  key={location.id}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} bg-white rounded-xl shadow-md overflow-hidden`}
                >
                  <div className="lg:w-1/2">
                    <img 
                      src={location.imageUrl} 
                      alt={location.name} 
                      className="h-full w-full object-cover"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  <div className="lg:w-1/2 p-8">
                    <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">{location.name}</h2>
                    <p className="text-gray-700 mb-6">{location.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-morocco-red mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{location.address}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <Phone className="h-5 w-5 text-morocco-red mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{location.phone}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-morocco-red mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{location.hours}</span>
                      </div>
                    </div>
                    
                    <Button 
                      asChild
                      className="bg-morocco-red hover:bg-morocco-red/90 text-white"
                    >
                      <Link to={`/locations/${location.id}`}>
                        Voir les véhicules disponibles
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
