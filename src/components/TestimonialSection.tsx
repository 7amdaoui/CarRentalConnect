
import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

// Mock data for testimonials
const testimonials = [
  {
    id: "t1",
    name: "Mohammed Alaoui",
    location: "Casablanca",
    rating: 5,
    comment: "Excellent service! La voiture était en parfait état et le processus de réservation était simple et rapide. Je recommande vivement CarRentalConnect pour vos déplacements dans la région de Tinghir.",
    imageUrl: "https://i.pravatar.cc/150?img=11"
  },
  {
    id: "t2",
    name: "Sarah Bensaid",
    location: "Rabat",
    rating: 4,
    comment: "Très bonne expérience avec cette agence. Personnel accueillant et professionnel. Véhicule propre et bien entretenu. Seul petit bémol sur le temps d'attente à l'agence.",
    imageUrl: "https://i.pravatar.cc/150?img=5"
  },
  {
    id: "t3",
    name: "Omar Essadiki",
    location: "Marrakech",
    rating: 5,
    comment: "J'ai loué un SUV pour explorer les gorges du Todra et tout était parfait. Prix raisonnable et voiture adaptée aux routes de montagne. Je reviendrai certainement!",
    imageUrl: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "t4",
    name: "Fatima Zahra",
    location: "Agadir",
    rating: 5,
    comment: "Service impeccable! La livraison à notre hôtel était ponctuelle et le retour très pratique. Excellente communication tout au long du processus.",
    imageUrl: "https://i.pravatar.cc/150?img=9"
  },
  {
    id: "t5",
    name: "Youssef Benjelloun",
    location: "Fès",
    rating: 4,
    comment: "Très satisfait de la qualité des véhicules et du service client. Les tarifs sont compétitifs et transparents. Pas de mauvaises surprises.",
    imageUrl: "https://i.pravatar.cc/150?img=13"
  }
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-morocco-gold fill-morocco-gold" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

const TestimonialSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-morocco-dark">
            Ce que nos clients disent
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Découvrez les expériences de nos clients satisfaits qui ont choisi CarRentalConnect 
            pour leurs déplacements au Maroc.
          </p>
        </div>

        <Carousel 
          className="max-w-5xl mx-auto"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar>
                        <AvatarImage src={testimonial.imageUrl} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    
                    <RatingStars rating={testimonial.rating} />
                    
                    <blockquote className="mt-4 text-muted-foreground flex-grow">
                      "{testimonial.comment}"
                    </blockquote>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex" />
          <CarouselNext className="hidden lg:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
