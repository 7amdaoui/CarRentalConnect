import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Info } from "lucide-react";
import { CarCardProps, CarStatus } from "@/types/car";

const StatusBadge = ({ status }: { status: CarStatus }) => {
  switch (status) {
    case 'available':
    case 'AVAILABLE':
      return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
    case 'rented':
    case 'RENTED':
      return <Badge variant="secondary">Loué</Badge>;
    case 'maintenance':
    case 'MAINTENANCE':
      return <Badge variant="destructive">En Maintenance</Badge>;
    default:
      return <Badge variant="outline">Indéfini</Badge>;
  }
};

const CarCard = ({
  id,
  brand,
  model,
  year,
  registrationNumber,
  type,
  agency,
  status,
  pricePerDay,
  imageUrl
}: CarCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="overflow-hidden h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[16/9] relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={`${brand} ${model}`} 
          className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={status} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-display font-semibold text-xl">{brand} {model}</h3>
          <p className="text-white/90 text-sm">{year}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-600">
            <span>{type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{agency}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3 flex justify-between items-center mt-auto">
          <div>
            <p className="text-sm text-gray-500">Prix par jour</p>
            <p className="text-morocco-red font-semibold text-xl">{pricePerDay} MAD</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-morocco-blue text-morocco-blue hover:bg-morocco-blue hover:text-white"
              asChild
            >
              <Link to={`/cars/${id}`}>
              <Info className="h-4 w-4 mr-1" />
              Détails
              </Link>
            </Button>
            
            {(status === 'available' || status === 'AVAILABLE') && (
              <Button 
                size="sm"
                className="bg-morocco-red hover:bg-morocco-red/90 text-white"
                asChild
              >
                <Link to={`/cars/${id}`}>
                <Calendar className="h-4 w-4 mr-1" />
                Réserver
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CarCard;
