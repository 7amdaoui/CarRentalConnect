import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Reservation } from '@/services/reservationService';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { createPayment } from '@/services/paymentService';

// Form validation schema
const formSchema = z.object({
  paymentMethod: z.enum(['card', 'transfer']),
  cardholderName: z.string().min(3, { message: 'Le nom du titulaire est requis' }).optional(),
  cardNumber: z.string()
    .regex(/^\d{16}$/, { message: 'Numéro de carte invalide' })
    .optional(),
  expirationDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: 'Format invalide (MM/YY)' })
    .optional(),
  cvv: z.string()
    .regex(/^\d{3,4}$/, { message: 'CVV invalide' })
    .optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'card') {
    if (!data.cardholderName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le nom du titulaire est requis',
        path: ['cardholderName']
      });
    }
    if (!data.cardNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le numéro de carte est requis',
        path: ['cardNumber']
      });
    }
    if (!data.expirationDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La date d\'expiration est requise',
        path: ['expirationDate']
      });
    }
    if (!data.cvv) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Le CVV est requis',
        path: ['cvv']
      });
    }
  }
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  reservation: Reservation;
}

const PaymentForm = ({ reservation }: PaymentFormProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: 'card',
      cardholderName: '',
      cardNumber: '',
      expirationDate: '',
      cvv: ''
    }
  });
  
  const paymentMethod = form.watch('paymentMethod');
  
  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };
  
  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    
    form.setValue('expirationDate', value);
  };
  
  const onSubmit = async (data: FormValues) => {
    setIsProcessing(true);
    try {
      // Build payment payload
      const paymentPayload = {
        reservation: { id: reservation.id },
        amount: reservation.totalPrice,
        method: data.paymentMethod === 'card' ? 'CARD' : 'TRANSFER',
        status: 'SUCCESS',
        transactionId: data.cardNumber || undefined,
      };
      await createPayment(paymentPayload);
      toast.success("Paiement effectué avec succès!", {
        description: "Votre réservation a été confirmée. Un email de confirmation a été envoyé."
      });
      navigate(`/reservation/confirmation/${String(reservation.id).substring(0, 8)}`);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du paiement", {
        description: "Veuillez réessayer plus tard"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="shadow-md max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">Finaliser votre paiement</CardTitle>
        <CardDescription>Paiement sécurisé pour la réservation #{String(reservation.id).substring(0, 8)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Méthode de paiement</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="card" id="card" />
                          <label htmlFor="card" className="flex-1 cursor-pointer">
                            <div className="font-medium">Carte bancaire</div>
                            <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                          </label>
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="transfer" id="transfer" />
                          <label htmlFor="transfer" className="flex-1 cursor-pointer">
                            <div className="font-medium">Virement bancaire</div>
                            <div className="text-sm text-gray-500">Paiement par virement classique</div>
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {paymentMethod === 'card' && (
                <>
                  <FormField
                    control={form.control}
                    name="cardholderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du titulaire</FormLabel>
                        <FormControl>
                          <Input placeholder="PRENOM NOM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de carte</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1234 5678 9012 3456" 
                            maxLength={19}
                            onChange={(e) => {
                              field.onChange(e.target.value.replace(/\s/g, ''));
                            }}
                            value={field.value ? formatCardNumber(field.value) : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expirationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date d'expiration</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              maxLength={5}
                              {...field}
                              onChange={(e) => handleExpirationDateChange(e)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVV</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="123" 
                              type="password" 
                              maxLength={4} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
              
              {paymentMethod === 'transfer' && (
                <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                  <p className="font-medium">Instructions pour le virement bancaire:</p>
                  <p>Veuillez effectuer votre paiement dans les 48h à:</p>
                  <div className="font-mono bg-white p-2 rounded-md text-xs">
                    <p>Bénéficiaire: CarRentalConnect Tinghir</p>
                    <p>IBAN: MA123456789012345678901234</p>
                    <p>BIC/SWIFT: BMCEMAMCXXX</p>
                    <p>Référence: RESERVATION-{String(reservation.id).substring(0, 8)}</p>
                  </div>
                  <p className="italic text-xs mt-2">Vous recevrez un email de confirmation dès la réception du paiement</p>
                </div>
              )}
              
              <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2 mt-4">
                <ShieldCheck className="h-5 w-5 text-morocco-blue mt-0.5" />
                <p className="text-sm text-blue-800">
                  Vos informations de paiement sont cryptées et transmises en toute sécurité.
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm font-medium">Montant total</p>
                  <p className="text-xs text-gray-500">TVA incluse</p>
                </div>
                <div className="text-xl font-bold text-morocco-red">
                  {reservation.totalPrice} MAD
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-morocco-blue hover:bg-morocco-blue/90 text-white"
                disabled={isProcessing}
              >
                {isProcessing ? 'Traitement en cours...' : `Payer ${reservation.totalPrice} MAD`}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t px-6 py-4 text-xs text-gray-500 flex items-center justify-between">
        <p>Transaction sécurisée</p>
        <div className="flex items-center space-x-2">
          <img src="/images/visa.svg" alt="Visa" className="h-6" />
          <img src="/images/mastercard.svg" alt="Mastercard" className="h-6" />
          <img src="/images/amex.svg" alt="American Express" className="h-6" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm; 