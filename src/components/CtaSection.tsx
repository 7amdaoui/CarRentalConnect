
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Calendar, User } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-16 bg-morocco-blue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Prêt à explorer Tinghir et ses environs?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Réservez votre véhicule dès maintenant et profitez d'une expérience de location sans souci.
            Nos conseillers sont disponibles pour vous aider à choisir le véhicule parfait pour votre séjour.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Button 
              size="lg" 
              className="bg-morocco-red hover:bg-morocco-red/90 text-white"
              asChild
            >
              <Link to="/cars">
                <Car className="mr-2 h-5 w-5" />
                Voir nos véhicules
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-morocco-blue"
              asChild
            >
              <Link to="/register">
                <User className="mr-2 h-5 w-5" />
                Créer un compte
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-morocco-gold p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Car className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Large sélection</h3>
              <p className="text-white/80">
                Des véhicules pour tous les besoins : économiques, familiaux, SUV et utilitaires.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-morocco-gold p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation facile</h3>
              <p className="text-white/80">
                Processus de réservation simple et rapide, avec confirmation immédiate.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="bg-morocco-gold p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service client</h3>
              <p className="text-white/80">
                Assistance disponible 7j/7 pour répondre à toutes vos questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
