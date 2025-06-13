import { Car, Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import { toast } from 'sonner';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setForm({ name: '', email: '', message: '' });
    toast.success('Message envoyé ! Nous vous répondrons bientôt.');
  };
  return (
    <footer className="bg-morocco-blue text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Car className="h-6 w-6" />
              <span className="font-display font-bold text-xl">CarRentalConnect</span>
            </div>
            <p className="text-sm opacity-80">
              Votre service de location de voitures dans la région de Tinghir. 
              Qualité, flexibilité et tarifs compétitifs pour tous vos besoins de mobilité.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-morocco-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-morocco-gold transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 border-b border-white/20 pb-2">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-morocco-gold transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/cars" className="text-sm hover:text-morocco-gold transition-colors">Nos Véhicules</Link>
              </li>
              <li>
                <Link to="/locations" className="text-sm hover:text-morocco-gold transition-colors">Nos Agences</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-morocco-gold transition-colors">À Propos</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-morocco-gold transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 border-b border-white/20 pb-2">Services</h3>
            <ul className="space-y-2">
              <li className="text-sm hover:text-morocco-gold transition-colors">Location Courte Durée</li>
              <li className="text-sm hover:text-morocco-gold transition-colors">Location Longue Durée</li>
              <li className="text-sm hover:text-morocco-gold transition-colors">Livraison à l'Hôtel</li>
              <li className="text-sm hover:text-morocco-gold transition-colors">Chauffeur Personnel</li>
              <li className="text-sm hover:text-morocco-gold transition-colors">Assurance Tous Risques</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4 border-b border-white/20 pb-2">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Avenue Mohammed V, Tinghir, Maroc</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-sm">+212 666-123456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-sm">contact@carrentalconnect.ma</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-6 text-sm opacity-80">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2025 CarRentalConnect Tinghir. Tous droits réservés.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="hover:text-morocco-gold transition-colors">Conditions d'utilisation</Link>
              <Link to="/privacy" className="hover:text-morocco-gold transition-colors">Politique de confidentialité</Link>
            </div>
          </div>
        </div>
      </div>
      <button
        className="fixed bottom-6 right-6 bg-morocco-gold text-morocco-blue px-4 py-2 rounded shadow-lg font-bold z-50 hover:bg-yellow-400"
        onClick={() => setShowModal(true)}
      >
        Contact Support
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white text-morocco-dark rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <button className="absolute top-2 right-2 text-xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4">Contactez le support</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-name" className="block font-medium">Nom</label>
                <input id="contact-name" className="border rounded px-3 py-2 w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Votre nom" required />
              </div>
              <div>
                <label htmlFor="contact-email" className="block font-medium">Email</label>
                <input id="contact-email" type="email" className="border rounded px-3 py-2 w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Votre email" required />
              </div>
              <div>
                <label htmlFor="contact-message" className="block font-medium">Message</label>
                <textarea id="contact-message" className="border rounded px-3 py-2 w-full" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Votre message" required />
              </div>
              <button type="submit" className="bg-morocco-blue text-white px-4 py-2 rounded">Envoyer</button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
