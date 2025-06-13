import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Politique de confidentialité | CarRentalConnect Tinghir</title>
        <meta name="description" content="Notre politique de confidentialité explique comment nous collectons et utilisons vos données." />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-display font-bold text-morocco-dark mb-8 text-center">Politique de Confidentialité</h1>
          
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Introduction</h2>
                <p className="text-gray-700">
                  Chez CarRentalConnect, nous accordons une grande importance à la protection de vos données personnelles. 
                  Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations 
                  lorsque vous utilisez notre site web et nos services.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Informations que nous collectons</h2>
                <p className="text-gray-700 mb-2">
                  Nous collectons les informations suivantes lorsque vous utilisez nos services :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><span className="font-semibold">Informations personnelles</span> : nom, prénom, adresse email, numéro de téléphone, adresse postale.</li>
                  <li><span className="font-semibold">Informations de paiement</span> : détails de carte de crédit ou de débit (pour la garantie de réservation).</li>
                  <li><span className="font-semibold">Informations sur le permis de conduire</span> : numéro, date d'émission, date d'expiration.</li>
                  <li><span className="font-semibold">Informations d'utilisation</span> : données sur la façon dont vous interagissez avec notre site web.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Comment nous utilisons vos informations</h2>
                <p className="text-gray-700 mb-2">
                  Nous utilisons vos informations pour :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Traiter et gérer vos réservations de véhicules.</li>
                  <li>Vous fournir une assistance client.</li>
                  <li>Vous informer sur nos promotions et offres spéciales (avec votre consentement).</li>
                  <li>Améliorer nos services et notre site web.</li>
                  <li>Respecter nos obligations légales et réglementaires.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Partage de vos informations</h2>
                <p className="text-gray-700 mb-2">
                  Nous ne vendons pas vos données personnelles. Nous pouvons partager vos informations avec :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Nos employés et agents qui ont besoin d'y accéder pour fournir nos services.</li>
                  <li>Des prestataires de services tiers qui nous aident à exploiter notre entreprise (traitement des paiements, service client, etc.).</li>
                  <li>Les autorités compétentes, lorsque la loi l'exige.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Sécurité des données</h2>
                <p className="text-gray-700">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles 
                  contre la perte, l'accès non autorisé, la divulgation ou la destruction.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Vos droits</h2>
                <p className="text-gray-700 mb-2">
                  Vous avez le droit de :
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Accéder à vos données personnelles.</li>
                  <li>Rectifier vos données si elles sont inexactes.</li>
                  <li>Demander la suppression de vos données dans certaines circonstances.</li>
                  <li>Limiter ou vous opposer au traitement de vos données.</li>
                  <li>Retirer votre consentement à tout moment.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Contactez-nous</h2>
                <p className="text-gray-700">
                  Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                  veuillez nous contacter à : <span className="text-morocco-blue">privacy@carrentalconnect.ma</span>
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-display font-bold text-morocco-blue mb-4">Modifications de la politique</h2>
                <p className="text-gray-700">
                  Nous pouvons modifier cette politique de temps à autre. Toute modification sera publiée sur cette page.
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

export default Privacy;
