import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CarCard from "@/components/CarCard";
import { Car } from "@/types/car";
import carService from "@/services/carService";

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    carService.getAllCars({}, 0, 4)
      .then(carsArray => {
        setCars(carsArray);
        setIsLoading(false);
      })
      .catch(() => {
        setCars([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-morocco-dark">
            Nos Véhicules Populaires
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre sélection de véhicules populaires disponibles à la location. 
            Choisissez le modèle parfait pour votre séjour à Tinghir et dans la région.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="rounded-xl bg-gray-100 animate-pulse h-64"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            className="bg-morocco-blue hover:bg-morocco-blue/90 text-white"
            size="lg"
            asChild
          >
            <Link to="/cars">
              Voir tous nos véhicules
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;
