
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="text-center px-4 py-16 max-w-lg mx-auto">
          <h1 className="text-9xl font-bold text-morocco-red mb-4">404</h1>
          <h2 className="text-3xl font-display font-bold text-morocco-dark mb-6">
            Page non trouvée
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
            Veuillez vérifier l'URL ou retourner à la page d'accueil.
          </p>
          <Button 
            size="lg"
            className="bg-morocco-blue hover:bg-morocco-blue/90 text-white" 
            asChild
          >
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
