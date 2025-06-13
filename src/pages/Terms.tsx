import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Conditions d'utilisation | CarRentalConnect Tinghir</title>
        <meta name="description" content="Nos conditions générales d'utilisation pour les services de location de voiture." />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-morocco-dark mb-8 text-center">Conditions Générales d'Utilisation</h1>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">1. Introduction</h2>
                <p className="text-gray-700">
                  Bienvenue sur le site web de CarRentalConnect. Les présentes conditions générales d'utilisation régissent 
                  votre utilisation de notre site web et de nos services de location de véhicules. En utilisant notre site ou 
                  nos services, vous acceptez d'être lié par ces conditions.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">2. Définitions</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">"Nous", "notre", "nos"</span> désignent CarRentalConnect Tinghir.</li>
                  <li><span className="font-semibold">"Vous", "votre", "vos"</span> désignent l'utilisateur du site web ou le client de nos services.</li>
                  <li><span className="font-semibold">"Site web"</span> désigne le site web de CarRentalConnect accessible à l'adresse carrentalconnect.ma.</li>
                  <li><span className="font-semibold">"Services"</span> désignent les services de location de véhicules proposés par CarRentalConnect.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">3. Conditions de location</h2>
                <p className="text-gray-700 mb-2">Pour louer un véhicule, vous devez :</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Être âgé d'au moins 21 ans.</li>
                  <li>Posséder un permis de conduire valide depuis au moins 2 ans.</li>
                  <li>Présenter une pièce d'identité valide.</li>
                  <li>Disposer d'une carte de crédit valide à votre nom pour la caution.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">4. Réservations</h2>
                <p className="text-gray-700 mb-2">
                  Les réservations peuvent être effectuées en ligne via notre site web, par téléphone ou directement dans nos agences.
                </p>
                <p className="text-gray-700">
                  Une réservation est confirmée après validation de vos informations et paiement de l'acompte demandé, le cas échéant.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">5. Annulations et modifications</h2>
                <p className="text-gray-700 mb-2">
                  Les annulations et modifications de réservation sont soumises aux conditions suivantes :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Annulation plus de 48 heures avant le début de la location : remboursement intégral.</li>
                  <li>Annulation entre 24 et 48 heures avant le début de la location : frais de 25% du montant total.</li>
                  <li>Annulation moins de 24 heures avant le début de la location : frais de 50% du montant total.</li>
                  <li>Non-présentation : aucun remboursement.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">6. Paiements</h2>
                <p className="text-gray-700">
                  Nous acceptons les paiements par carte de crédit (Visa, MasterCard) et en espèces pour les paiements en agence. 
                  Une caution sera demandée lors de la prise du véhicule et sera restituée après vérification de l'état du véhicule lors de son retour.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">7. Assurance et responsabilité</h2>
                <p className="text-gray-700 mb-2">
                  Tous nos véhicules sont couverts par une assurance au tiers. Des options d'assurance supplémentaires 
                  sont disponibles moyennant un supplément.
                </p>
                <p className="text-gray-700">
                  Le client est responsable du véhicule pendant toute la durée de la location et doit le restituer 
                  dans l'état où il l'a reçu, sous peine de frais supplémentaires.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">8. Litige et droit applicable</h2>
                <p className="text-gray-700">
                  En cas de litige, les parties s'efforceront de trouver une solution amiable. 
                  À défaut, le litige sera soumis aux tribunaux compétents de Tinghir, Maroc. 
                  Les présentes conditions sont régies par le droit marocain.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">9. Modifications des conditions</h2>
                <p className="text-gray-700">
                  Nous nous réservons le droit de modifier ces conditions à tout moment. 
                  Toute modification sera publiée sur cette page.
                  Dernière mise à jour : 15 mai 2025
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
