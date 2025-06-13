import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Car, CheckCircle, Clock, Download, Map, MapPin, Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Reservation } from '@/services/reservationService';
import { Car as CarType } from '@/types/car';
import { QRCodeSVG } from 'qrcode.react';
import jsPDF from 'jspdf';

interface EmailConfirmationProps {
  reservation: Reservation;
  car: CarType;
}

const EmailConfirmation = ({ reservation, car }: EmailConfirmationProps) => {
  const startDate = new Date(reservation.startDate);
  const endDate = new Date(reservation.endDate);
  
  const formatDate = (date: Date) => format(date, 'd MMMM yyyy', { locale: fr });
  
  const handleDownloadPDF = () => {
    fetch(`/reservation/${reservation.id}/invoice`)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reservation-${reservation.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      });
  };
  
  return (
    <Card className="shadow-md max-w-2xl mx-auto">
      <CardHeader className="bg-morocco-blue text-white rounded-t-lg pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl tracking-tight mb-1">Confirmation de Réservation</CardTitle>
            <p className="text-white/80">#{String(reservation.id).substring(0, 8)}</p>
          </div>
          <div className="bg-white p-2 rounded-full h-12 w-12 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-green-800 font-medium">
              Votre réservation a été confirmée
            </p>
            <p className="text-green-600 text-sm mt-1">
              Un e-mail a été envoyé à l'adresse fournie avec votre reçu
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Détails du véhicule</h3>
              
              <div className="rounded-lg border overflow-hidden">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.brand} ${car.model}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-morocco-blue" />
                    <h4 className="font-medium">{car.brand} {car.model} ({car.year})</h4>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Map className="h-4 w-4 text-morocco-blue" />
                    <span>{car.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <MapPin className="h-4 w-4 text-morocco-blue" />
                    <span>Agence {car.agency}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Détails de la réservation</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-morocco-blue mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Dates de location</p>
                    <p className="font-medium">{formatDate(startDate)} - {formatDate(endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-morocco-blue mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Horaires</p>
                    <p className="font-medium">Prise: 12h00 / Retour: 12h00</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <User className="h-5 w-5 text-morocco-blue mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium">{reservation.user ? `${reservation.user.firstName} ${reservation.user.lastName}` : ''}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-morocco-blue mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-medium">{reservation.user ? `${reservation.user.phone} | ${reservation.user.email}` : ''}</p>
                  </div>
                </div>
                
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm text-gray-500">Coût total</p>
                  <p className="text-xl font-bold text-morocco-red">{reservation.totalPrice} MAD</p>
                  <p className="text-xs text-gray-500">Paiement {reservation.paymentStatus === 'paid' ? 'effectué' : 'en attente'}</p>
                </div>
              </div>
              
              <div className="flex justify-center pt-2">
                <QRCodeSVG 
                  value={`https://carrentalconnect.com/reservations/${String(reservation.id)}`} 
                  size={120}
                  level="L"
                  includeMargin={true}
                />
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">Informations importantes</h3>
            
            <div className="text-sm space-y-2">
              <p><span className="font-medium">Documents requis:</span> Permis de conduire, pièce d'identité, carte bancaire</p>
              <p><span className="font-medium">Caution:</span> Une empreinte de carte bancaire sera prise à la prise du véhicule</p>
              <p><span className="font-medium">Contact agence:</span> +212 666-123456 | contact@carrentalconnect.com</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t px-6 py-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">Merci de votre confiance</p>
        <Button 
          variant="outline" 
          className="text-morocco-blue border-morocco-blue hover:bg-morocco-blue hover:text-white"
          size="sm"
          onClick={handleDownloadPDF}
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailConfirmation; 