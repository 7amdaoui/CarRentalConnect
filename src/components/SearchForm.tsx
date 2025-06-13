
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Search } from "lucide-react";

interface SearchFormProps {
  className?: string;
  isHorizontal?: boolean;
}

const SearchForm = ({ className, isHorizontal = false }: SearchFormProps) => {
  const navigate = useNavigate();
  const [carType, setCarType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (carType && carType !== "all") params.append('type', carType);
    if (location && location !== "all") params.append('agency', location);
    if (pickupDate) params.append('pickup', format(pickupDate, 'yyyy-MM-dd'));
    if (returnDate) params.append('return', format(returnDate, 'yyyy-MM-dd'));
    
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className={cn(
        "bg-white rounded-xl shadow-lg p-6",
        isHorizontal ? "grid grid-cols-1 md:grid-cols-5 gap-4" : "space-y-4",
        className
      )}
    >
      <div>
        <Label htmlFor="type">Type de Véhicule</Label>
        <Select value={carType} onValueChange={setCarType}>
          <SelectTrigger id="type" className="mt-1.5">
            <SelectValue placeholder="Tous les véhicules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les véhicules</SelectItem>
            <SelectItem value="SUV">SUV / 4x4</SelectItem>
            <SelectItem value="Berline">Berline</SelectItem>
            <SelectItem value="Economique">Economique</SelectItem>
            <SelectItem value="Utilitaire">Utilitaire</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="location">Agence</Label>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger id="location" className="mt-1.5">
            <SelectValue placeholder="Toutes les agences" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les agences</SelectItem>
            <SelectItem value="Tinghir">Tinghir</SelectItem>
            <SelectItem value="Ouarzazate">Ouarzazate</SelectItem>
            <SelectItem value="Errachidia">Errachidia</SelectItem>
            <SelectItem value="Merzouga">Merzouga</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Date de Prise</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-1.5",
                !pickupDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {pickupDate ? format(pickupDate, 'P', { locale: fr }) : <span>Sélectionner</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={pickupDate}
              onSelect={setPickupDate}
              initialFocus
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Date de Retour</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-1.5",
                !returnDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {returnDate ? format(returnDate, 'P', { locale: fr }) : <span>Sélectionner</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={returnDate}
              onSelect={setReturnDate}
              initialFocus
              disabled={(date) => 
                date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                (pickupDate && date < pickupDate)
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className={isHorizontal ? "self-end" : ""}>
        <Button 
          type="submit" 
          className="w-full bg-morocco-red hover:bg-morocco-red/90 mt-1.5"
        >
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
