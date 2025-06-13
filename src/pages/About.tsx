
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>À Propos | CarRentalConnect Tinghir</title>
        <meta name="description" content="Découvrez notre histoire et notre mission de location de voiture à Tinghir et ses environs." />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-morocco-dark mb-8 text-center">À Propos de Nous</h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Notre Histoire</h2>
              <p className="text-lg text-gray-700 mb-4">
                Fondée en 2015, CarRentalConnect est née d'une passion pour offrir un service de location de voitures de qualité dans la région de Tinghir. 
                Notre fondateur, originaire de la région, a constaté le besoin d'un service fiable pour les touristes et les locaux souhaitant explorer 
                les magnifiques paysages du sud-est marocain.
              </p>
              <p className="text-lg text-gray-700">
                Depuis, nous avons grandi pour devenir l'un des leaders de la location de voitures dans la région, 
                avec plusieurs agences à Tinghir, Ouarzazate et Errachidia.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Notre Mission</h2>
              <p className="text-lg text-gray-700">
                Notre mission est simple : fournir des véhicules fiables, propres et bien entretenus à des prix compétitifs, 
                accompagnés d'un service client exceptionnel. Nous nous efforçons de rendre vos déplacements au Maroc aussi 
                agréables et sans souci que possible.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Nos Valeurs</h2>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                <li><span className="font-semibold">Qualité</span> - Nous maintenons notre flotte dans un état impeccable.</li>
                <li><span className="font-semibold">Transparence</span> - Pas de frais cachés, tout est clair dès le début.</li>
                <li><span className="font-semibold">Service</span> - Nous sommes là pour vous aider à chaque étape.</li>
                <li><span className="font-semibold">Communauté</span> - Nous soutenons l'économie locale et participons à des initiatives communautaires.</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Notre Équipe</h2>
              <p className="text-lg text-gray-700">
                Notre équipe est composée de professionnels passionnés par le service client. 
                Tous nos employés sont originaires de la région et connaissent parfaitement les routes et les destinations que vous pourriez vouloir explorer.
                Ils seront ravis de vous conseiller sur les meilleurs itinéraires et sites à visiter.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
