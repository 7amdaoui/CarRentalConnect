import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for agency locations
const agencies = [
  {
    id: "tinghir",
    name: "CarRentalConnect Tinghir",
    address: "123 Avenue Mohammed V, Tinghir, Maroc",
    phone: "+212 666-123456",
    hours: "7:00 - 22:00",
    mapUrl: "https://maps.google.com/?q=Tinghir+Morocco",
    imageUrl: "/images/agencies/tinghir.jpg"
  },
  {
    id: "ouarzazate",
    name: "CarRentalConnect Ouarzazate",
    address: "456 Boulevard Mohammed VI, Ouarzazate, Maroc",
    phone: "+212 666-456789",
    hours: "8:00 - 20:00",
    mapUrl: "https://maps.google.com/?q=Ouarzazate+Morocco",
    imageUrl: "/images/agencies/ouarzazate.jpg"
  },
  {
    id: "errachidia",
    name: "CarRentalConnect Errachidia",
    address: "789 Rue Ibn Sina, Errachidia, Maroc",
    phone: "+212 666-987654",
    hours: "8:00 - 21:00",
    mapUrl: "https://maps.google.com/?q=Errachidia+Morocco",
    imageUrl: "/images/agencies/errachidia.jpg"
  }
];

const AgencyLocations = () => {
  return (
    <section className="py-16 bg-gray-50 moroccan-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-morocco-dark">
            Nos Agences
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Nos agences sont stratégiquement situées pour vous offrir un service de proximité.
            Venez nous rencontrer ou contactez-nous directement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agencies.map((agency) => (
            <Card key={agency.id} className="overflow-hidden">
              <div className="aspect-[16/9] relative">
                <img 
                  src={agency.imageUrl} 
                  alt={agency.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white font-display font-semibold text-xl">{agency.name}</h3>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-morocco-red flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{agency.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-morocco-red flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{agency.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-morocco-red flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{agency.hours}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-morocco-blue text-morocco-blue hover:bg-morocco-blue hover:text-white"
                    asChild
                  >
                    <a href={`tel:${agency.phone.replace(/\s+/g, '')}`}>
                      Appeler
                    </a>
                  </Button>
                  <Button 
                    className="flex-1 bg-morocco-red hover:bg-morocco-red/90 text-white"
                    asChild
                  >
                    <Link to={`/locations/${agency.id}`}>
                      Voir les véhicules disponibles
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-morocco-blue hover:bg-morocco-blue/90 text-white"
            size="lg"
            asChild
          >
            <Link to="/locations">
              Toutes nos agences
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AgencyLocations;
