import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchForm from "@/components/SearchForm";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";
import carService from "@/services/carService";
import { Car } from "@/types/car";
import { Helmet } from "react-helmet-async";

const Cars = () => {
  const [searchParams] = useSearchParams();
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [brandFilter, setBrandFilter] = useState<string>(searchParams.get("brand") || "");
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get("type") || "");
  const [agencyFilter, setAgencyFilter] = useState<string>(searchParams.get("agency") || "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [showAvailable, setShowAvailable] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("recommended");

  useEffect(() => {
    setIsLoading(true);
    carService.getAllCars({}, 0, 100)
      .then(cars => {
        setAllCars(cars);
        setIsLoading(false);
      })
      .catch(() => {
        setAllCars([]);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = allCars;
    if (showAvailable) {
      result = result.filter(car => car.status && car.status.toLowerCase() === "available");
    }
    if (brandFilter) {
      result = result.filter(car => car.brand.toLowerCase().includes(brandFilter.toLowerCase()));
    }
    if (typeFilter) {
      result = result.filter(car => car.type === typeFilter);
    }
    if (agencyFilter) {
      result = result.filter(car => car.agency === agencyFilter);
    }
    if (minPrice) {
      result = result.filter(car => car.pricePerDay >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter(car => car.pricePerDay <= parseInt(maxPrice));
    }
    switch (sortOption) {
      case "price-asc":
        result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "newest":
        result = [...result].sort((a, b) => b.year - a.year);
        break;
      default:
        break;
    }
    setFilteredCars(result);
  }, [allCars, brandFilter, typeFilter, agencyFilter, minPrice, maxPrice, showAvailable, sortOption, searchParams]);

  const clearFilters = () => {
    setBrandFilter("");
    setTypeFilter("");
    setAgencyFilter("");
    setMinPrice("");
    setMaxPrice("");
    setShowAvailable(true);
    setSortOption("recommended");
  };

  // Get unique values for filters
  const brands = [...new Set(allCars.map(car => car.brand))];
  const types = [...new Set(allCars.map(car => car.type))];
  const agencies = [...new Set(allCars.map(car => car.agency))];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Nos Véhicules | CarRentalConnect Tinghir</title>
        <meta name="description" content="Découvrez notre gamme de véhicules disponibles à la location à Tinghir et dans la région. SUV, économiques, berlines et utilitaires." />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        {/* Search header */}
        <div className="bg-morocco-blue py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-display font-bold text-white mb-6">
              Trouvez votre véhicule idéal
            </h1>
            <SearchForm isHorizontal className="bg-white/10 backdrop-blur-sm" />
          </div>
        </div>

        {/* Results section */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-display font-semibold">
              {isLoading ? "Chargement..." : `${filteredCars.length} véhicules disponibles`}
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                className="flex items-center md:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <div className="hidden md:block">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommandés</SelectItem>
                    <SelectItem value="price-asc">Prix: croissant</SelectItem>
                    <SelectItem value="price-desc">Prix: décroissant</SelectItem>
                    <SelectItem value="newest">Plus récents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filtres</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 text-sm text-morocco-red hover:text-morocco-red/90"
                  >
                    Réinitialiser
                  </Button>
                </div>

                {/* Status filter */}
                <div className="mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="available" 
                      checked={showAvailable}
                      onCheckedChange={(checked) => setShowAvailable(checked as boolean)} 
                    />
                    <Label htmlFor="available">Disponibles uniquement</Label>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Type filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Type de véhicule</h4>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Tous les types</SelectItem>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Marque</h4>
                  <Select value={brandFilter} onValueChange={setBrandFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les marques" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Toutes les marques</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Agency filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Agence</h4>
                  <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les agences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Toutes les agences</SelectItem>
                      {agencies.map((agency) => (
                        <SelectItem key={agency} value={agency}>{agency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                {/* Price range filter */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Prix par jour (MAD)</h4>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-1/2"
                    />
                    <span>-</span>
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-1/2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile filters */}
            {isFilterOpen && (
              <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex justify-end">
                <div className="bg-white w-80 h-full overflow-auto animate-slide-in">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold">Filtres</h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setIsFilterOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="mobile-available" 
                          checked={showAvailable}
                          onCheckedChange={(checked) => setShowAvailable(checked as boolean)} 
                        />
                        <Label htmlFor="mobile-available">Disponibles uniquement</Label>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-4">
                      <Label htmlFor="mobile-sort" className="block mb-2">Trier par</Label>
                      <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger id="mobile-sort">
                          <SelectValue placeholder="Trier par" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recommended">Recommandés</SelectItem>
                          <SelectItem value="price-asc">Prix: croissant</SelectItem>
                          <SelectItem value="price-desc">Prix: décroissant</SelectItem>
                          <SelectItem value="newest">Plus récents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Type de véhicule</h4>
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Tous les types</SelectItem>
                          {types.map((type) => (
                            <SelectItem key={`mobile-${type}`} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Marque</h4>
                      <Select value={brandFilter} onValueChange={setBrandFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les marques" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Toutes les marques</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={`mobile-${brand}`} value={brand}>{brand}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Agence</h4>
                      <Select value={agencyFilter} onValueChange={setAgencyFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les agences" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Toutes les agences</SelectItem>
                          {agencies.map((agency) => (
                            <SelectItem key={`mobile-${agency}`} value={agency}>{agency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="my-4" />

                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Prix par jour (MAD)</h4>
                      <div className="flex items-center space-x-2">
                        <Input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-1/2"
                        />
                        <span>-</span>
                        <Input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-1/2"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-6">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={clearFilters}
                      >
                        Réinitialiser
                      </Button>
                      <Button 
                        className="flex-1 bg-morocco-blue hover:bg-morocco-blue/90"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cars grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, index) => (
                    <div key={index} className="rounded-xl bg-gray-100 animate-pulse h-64"></div>
                  ))}
                </div>
              ) : filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard key={car.id} {...car} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">Aucun véhicule ne correspond à vos critères.</h3>
                  <p className="text-muted-foreground mb-6">Veuillez modifier vos filtres ou essayer d'autres options de recherche.</p>
                  <Button onClick={clearFilters}>Réinitialiser les filtres</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cars;
