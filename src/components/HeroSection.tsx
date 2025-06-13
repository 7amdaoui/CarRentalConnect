
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SearchForm from "@/components/SearchForm";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?q=80&w=2070&auto=format&fit=crop')", 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 pt-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white hero-text mb-4">
            Découvrez le Maroc avec le <span className="text-morocco-gold">confort</span> que vous méritez
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 hero-text">
            Location de voitures à Tinghir et dans la région. Flexibilité, qualité et prix compétitifs pour vos déplacements au Maroc.
          </p>
          <div className="flex space-x-4 mb-16">
            <Button 
              size="lg" 
              className="bg-morocco-red hover:bg-morocco-red/90 text-white"
              asChild
            >
              <Link to="/cars">
                Voir nos véhicules
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-morocco-blue"
              asChild
            >
              <Link to="/about">
                En savoir plus
              </Link>
            </Button>
          </div>
        </div>

        {/* Search form */}
        <div className="mt-8">
          <SearchForm />
        </div>
      </div>

      {/* Scroll down indicator */}
      <button 
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={32} />
      </button>
    </div>
  );
};

export default HeroSection;
