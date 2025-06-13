import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, differenceInDays, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Car } from '@/types/car';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Car as CarIcon, Map } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import reservationService from '@/services/reservationService';
import carService from '@/services/carService';

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Email invalide' }),
  phone: z.string().min(10, { message: 'Numéro de téléphone invalide' }),
  startDate: z.date({
    required_error: "Veuillez sélectionner une date de début",
  }),
  endDate: z.date({
    required_error: "Veuillez sélectionner une date de fin",
  }),
}).refine(data => {
  return data.endDate >= data.startDate;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

interface BookingFormProps {
  car: Car;
}

const BookingForm = ({ car }: BookingFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 3),
    },
  });
  
  // Watch date fields to calculate price
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  
  // Calculate price when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const days = differenceInDays(endDate, startDate) + 1;
      setTotalPrice(days * car.pricePerDay);
    }
  }, [startDate, endDate, car.pricePerDay]);
  
  const checkAvailability = async () => {
    if (!startDate || !endDate) return;
    
    setIsCheckingAvailability(true);
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const result = await carService.checkCarAvailability(
        car.id, 
        formattedStartDate,
        formattedEndDate
      );
      
      if (result.data.available !== true && result.data.available !== "true") {
        toast.error("Véhicule non disponible", {
          description: result.data.message || "Ce véhicule n'est pas disponible pour les dates sélectionnées"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Erreur de vérification de disponibilité", {
        description: "Veuillez réessayer plus tard"
      });
      return false;
    } finally {
      setIsCheckingAvailability(false);
    }
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // First check availability
      const isAvailable = await checkAvailability();
      if (!isAvailable) {
        setIsSubmitting(false);
        return;
      }
      
      // Format dates for API
      const formattedStartDate = format(data.startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(data.endDate, 'yyyy-MM-dd');
      
      // Create reservation
      const reservationData = {
        carId: car.id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        userDetails: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone
        }
      };
      
      const reservation = await reservationService.createReservation(reservationData);
      
      toast.success("Réservation créée avec succès!", {
        description: "Vous allez être redirigé vers la page de paiement"
      });
      
      // Redirect to payment page
      const reservationId = reservation?.id || reservation?.data?.id;
      navigate(`/payment/${reservationId}`);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Erreur lors de la réservation", {
        description: "Veuillez réessayer plus tard"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Réserver ce véhicule</CardTitle>
        <CardDescription>Complétez le formulaire pour réserver {car.brand} {car.model}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="+212 600 000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de prise</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", { locale: fr })
                            ) : (
                              "Sélectionner une date"
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de retour</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", { locale: fr })
                            ) : (
                              "Sélectionner une date"
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => 
                            date < startDate || date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CarIcon className="w-5 h-5 mr-2 text-morocco-blue" />
                <span className="font-medium">{car.brand} {car.model}</span>
              </div>
              <div className="flex items-center mb-4">
                <Map className="w-5 h-5 mr-2 text-morocco-blue" />
                <span>{car.agency}</span>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <div className="flex justify-between mb-2">
                  <span>Prix par jour:</span>
                  <span className="font-medium">{car.pricePerDay} MAD</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Nombre de jours:</span>
                  <span className="font-medium">
                    {startDate && endDate ? (differenceInDays(endDate, startDate) + 1) : 0}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                  <span>Prix total:</span>
                  <span className="text-morocco-red">{totalPrice} MAD</span>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-morocco-red hover:bg-morocco-red/90 text-white"
              disabled={isSubmitting || isCheckingAvailability}
            >
              {isSubmitting || isCheckingAvailability ? 'Traitement en cours...' : 'Réserver maintenant'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-6 py-4 text-xs text-gray-500">
        <p>En réservant, vous acceptez nos <a href="/terms" className="text-morocco-blue hover:underline">conditions d'utilisation</a> et notre <a href="/privacy" className="text-morocco-blue hover:underline">politique de confidentialité</a>.</p>
      </CardFooter>
    </Card>
  );
};

export default BookingForm; 