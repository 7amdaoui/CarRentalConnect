import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  PlusCircle,
  Search,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import carService from '@/services/carService';

// Mock data - In a real app, fetch this from your API
const mockCars = [
  { id: 1, name: "Dacia Logan", type: "Économique", brand: "Dacia", price: 250, status: "Disponible" },
  { id: 2, name: "Peugeot 208", type: "Économique", brand: "Peugeot", price: 300, status: "Loué" },
  { id: 3, name: "Renault Clio", type: "Économique", brand: "Renault", price: 280, status: "Maintenance" },
  { id: 4, name: "Toyota Yaris", type: "Compact", brand: "Toyota", price: 320, status: "Disponible" },
  { id: 5, name: "Volkswagen Golf", type: "Compact", brand: "Volkswagen", price: 350, status: "Disponible" },
  { id: 6, name: "Hyundai Tucson", type: "SUV", brand: "Hyundai", price: 450, status: "Loué" },
];

// Add image compression function
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with 0.7 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const FUEL_OPTIONS = ["Essence", "Diesel", "Hybride", "Electrique"];
const TRANSMISSION_OPTIONS = ["Manuelle", "Automatique"];

const AdminCars = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cars, setCars] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({
    name: '',
    brand: '',
    type: '',
    year: '',
    registrationNumber: '',
    seats: '',
    fuel: '',
    transmission: '',
    color: '',
    price: '',
    status: 'Disponible',
    image: '', // base64
    agency: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const [agencies, setAgencies] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCar, setEditCar] = useState<any>(null);
  
  // Fetch cars, types, and agencies on mount
  useEffect(() => {
    fetchCars();
    fetchTypes();
    fetchAgencies();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carService.getAllCars({}, 0, 100);
      console.log('Cars API response:', response);
      setCars(response || []);
    } catch (error) {
      toast.error("Erreur lors du chargement des véhicules");
      setCars([]);
    }
  };

  const fetchTypes = async () => {
    try {
      const res = await carService.getTypes();
      setTypes(res.data || []);
    } catch (error) {
      setTypes([]);
    }
  };

  const fetchAgencies = async () => {
    try {
      const res = await carService.getAgencies();
      setAgencies(res.data || []);
    } catch (error) {
      setAgencies([]);
    }
  };

  // Filter cars by search term
  const filteredCars = cars.filter(car => 
    (car.model || car.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (car.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Mock delete function
  const handleDeleteCar = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
    try {
      await carService.deleteCar(id);
      setCars(cars.filter(car => car.id !== id));
      toast.success('Véhicule supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression du véhicule');
    }
  };
  
  // Mock edit function
  const handleEditCar = (id: number) => {
    const car = cars.find(car => car.id === id);
    if (car) {
      setEditCar({ ...car });
      setShowEditModal(true);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Show loading toast
        const loadingToast = toast.loading("Compression de l'image...");
        
        // Compress the image
        const compressedImage = await compressImage(file);
        
        // Update state with compressed image
        setNewCar(car => ({ ...car, image: compressedImage }));
        setImagePreview(compressedImage);
        
        // Update loading toast to success
        toast.dismiss(loadingToast);
        toast.success("Image compressée avec succès");
      } catch (error) {
        toast.error("Erreur lors de la compression de l'image");
        console.error(error);
      }
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.name || !newCar.brand || !newCar.type || !newCar.price || !newCar.agency || !newCar.fuel || !newCar.transmission) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    try {
      // Prepare the car data to match backend expectations
      const carData = {
        brand: newCar.brand,
        model: newCar.name,
        year: newCar.year ? Number(newCar.year) : undefined,
        registrationNumber: newCar.registrationNumber,
        type: newCar.type,
        agency: newCar.agency,
        status: newCar.status === 'Disponible' ? 'AVAILABLE' : newCar.status.toUpperCase(),
        pricePerDay: Number(newCar.price),
        imageUrl: newCar.image,
        fuel: newCar.fuel,
        transmission: newCar.transmission,
        seats: newCar.seats ? Number(newCar.seats) : undefined,
        color: newCar.color,
      };
      await carService.createCar(carData);
      setShowAddModal(false);
      setNewCar({ name: '', brand: '', type: '', year: '', registrationNumber: '', seats: '', fuel: '', transmission: '', color: '', price: '', status: 'Disponible', image: '', agency: '' });
      setImagePreview(null);
      toast.success('Véhicule ajouté avec succès');
      fetchCars();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du véhicule');
      console.error(error);
    }
  };

  const handleEditCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCar) return;
    try {
      const carData = {
        brand: editCar.brand,
        model: editCar.model,
        year: editCar.year ? Number(editCar.year) : undefined,
        registrationNumber: editCar.registrationNumber,
        type: editCar.type,
        agency: editCar.agency,
        status: editCar.status,
        pricePerDay: Number(editCar.pricePerDay),
        imageUrl: editCar.imageUrl,
        fuel: editCar.fuel,
        transmission: editCar.transmission,
        seats: editCar.seats ? Number(editCar.seats) : undefined,
        color: editCar.color,
      };
      await carService.updateCar(editCar.id, carData);
      toast.success('Véhicule modifié avec succès');
      setShowEditModal(false);
      setEditCar(null);
      fetchCars();
    } catch (error) {
      toast.error('Erreur lors de la modification du véhicule');
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Gestion des véhicules | Admin CarRentalConnect</title>
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-display">Gestion des véhicules</h1>
          <Button onClick={() => setShowAddModal(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un véhicule
          </Button>
        </div>
        
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            type="search" 
            placeholder="Rechercher un véhicule..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        
        <Table>
          <TableCaption>Liste des véhicules disponibles dans la flotte.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Prix/Jour</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.length > 0 ? (
              filteredCars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.id}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.brand}</TableCell>
                  <TableCell>{car.type}</TableCell>
                  <TableCell>{car.pricePerDay} MAD</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      car.status === 'AVAILABLE' 
                        ? 'bg-green-100 text-green-800' 
                        : car.status === 'RENTED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                    }`}>
                      {car.status === 'AVAILABLE' ? 'Disponible' : car.status === 'RENTED' ? 'Loué' : 'Maintenance'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleEditCar(car.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDeleteCar(car.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key="no-cars">
                <TableCell colSpan={7} className="text-center">
                  Aucun véhicule trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Car Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un véhicule</DialogTitle>
            <DialogDescription>
              Remplissez le formulaire pour ajouter un nouveau véhicule à la flotte.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCar} className="space-y-4">
            <Input placeholder="Nom du véhicule" value={newCar.name} onChange={e => setNewCar({ ...newCar, name: e.target.value })} required />
            <Input placeholder="Marque" value={newCar.brand} onChange={e => setNewCar({ ...newCar, brand: e.target.value })} required />
            <select className="border rounded px-3 py-2 w-full" value={newCar.agency} onChange={e => setNewCar({ ...newCar, agency: e.target.value })} required title="Agence du véhicule">
              <option value="">Sélectionner une agence</option>
              {agencies.map(agency => <option key={agency} value={agency}>{agency}</option>)}
            </select>
            <select className="border rounded px-3 py-2 w-full" value={newCar.type} onChange={e => setNewCar({ ...newCar, type: e.target.value })} required title="Type du véhicule">
              <option value="">Sélectionner un type</option>
              {types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <Input placeholder="Numéro d'immatriculation" value={newCar.registrationNumber} onChange={e => setNewCar({ ...newCar, registrationNumber: e.target.value })} required />
            <Input type="number" placeholder="Année" value={newCar.year} onChange={e => setNewCar({ ...newCar, year: e.target.value })} required />
            <Input type="number" placeholder="Nombre de places" value={newCar.seats} onChange={e => setNewCar({ ...newCar, seats: e.target.value })} />
            <select className="border rounded px-3 py-2 w-full" value={newCar.fuel} onChange={e => setNewCar({ ...newCar, fuel: e.target.value })} required title="Carburant du véhicule">
              <option value="">Sélectionner le carburant</option>
              {FUEL_OPTIONS.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
            </select>
            <select className="border rounded px-3 py-2 w-full" value={newCar.transmission} onChange={e => setNewCar({ ...newCar, transmission: e.target.value })} required title="Transmission du véhicule">
              <option value="">Sélectionner la transmission</option>
              {TRANSMISSION_OPTIONS.map(trans => <option key={trans} value={trans}>{trans}</option>)}
            </select>
            <Input placeholder="Couleur" value={newCar.color} onChange={e => setNewCar({ ...newCar, color: e.target.value })} />
            <Input type="number" placeholder="Prix par jour (MAD)" value={newCar.price} onChange={e => setNewCar({ ...newCar, price: e.target.value })} required />
            <select className="border rounded px-3 py-2 w-full" value={newCar.status} onChange={e => setNewCar({ ...newCar, status: e.target.value })} title="Statut du véhicule" aria-label="Statut du véhicule">
              <option value="Disponible">Disponible</option>
              <option value="Loué">Loué</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <div>
              <label className="block font-medium mb-1">Image du véhicule</label>
              <input type="file" accept="image/*" onChange={handleImageChange} title="Image du véhicule" placeholder="Choisir une image" />
              {imagePreview && <img src={imagePreview} alt="Aperçu" className="mt-2 w-32 h-20 object-cover rounded" />}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-morocco-blue text-white">Ajouter</Button>
              <Button type="button" variant="outline" onClick={() => { setShowAddModal(false); setImagePreview(null); }}>Annuler</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Edit Car Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
            <DialogDescription>
              Modifiez les informations du véhicule puis validez.
            </DialogDescription>
          </DialogHeader>
          {editCar && (
            <form onSubmit={handleEditCarSubmit} className="space-y-4">
              <Input placeholder="Nom du véhicule" value={editCar.model} onChange={e => setEditCar({ ...editCar, model: e.target.value })} required />
              <Input placeholder="Marque" value={editCar.brand} onChange={e => setEditCar({ ...editCar, brand: e.target.value })} required />
              <select className="border rounded px-3 py-2 w-full" value={editCar.agency} onChange={e => setEditCar({ ...editCar, agency: e.target.value })} required title="Agence du véhicule">
                <option value="">Sélectionner une agence</option>
                {agencies.map(agency => <option key={agency} value={agency}>{agency}</option>)}
              </select>
              <select className="border rounded px-3 py-2 w-full" value={editCar.type} onChange={e => setEditCar({ ...editCar, type: e.target.value })} required title="Type du véhicule">
                <option value="">Sélectionner un type</option>
                {types.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <Input placeholder="Numéro d'immatriculation" value={editCar.registrationNumber} onChange={e => setEditCar({ ...editCar, registrationNumber: e.target.value })} required />
              <Input type="number" placeholder="Année" value={editCar.year} onChange={e => setEditCar({ ...editCar, year: e.target.value })} required />
              <Input type="number" placeholder="Nombre de places" value={editCar.seats} onChange={e => setEditCar({ ...editCar, seats: e.target.value })} />
              <select className="border rounded px-3 py-2 w-full" value={editCar.fuel} onChange={e => setEditCar({ ...editCar, fuel: e.target.value })} required title="Carburant du véhicule">
                <option value="">Sélectionner le carburant</option>
                {FUEL_OPTIONS.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
              </select>
              <select className="border rounded px-3 py-2 w-full" value={editCar.transmission} onChange={e => setEditCar({ ...editCar, transmission: e.target.value })} required title="Transmission du véhicule">
                <option value="">Sélectionner la transmission</option>
                {TRANSMISSION_OPTIONS.map(trans => <option key={trans} value={trans}>{trans}</option>)}
              </select>
              <Input placeholder="Couleur" value={editCar.color} onChange={e => setEditCar({ ...editCar, color: e.target.value })} />
              <Input type="number" placeholder="Prix par jour (MAD)" value={editCar.pricePerDay} onChange={e => setEditCar({ ...editCar, pricePerDay: e.target.value })} required />
              <select className="border rounded px-3 py-2 w-full" value={editCar.status} onChange={e => setEditCar({ ...editCar, status: e.target.value })} title="Statut du véhicule" aria-label="Statut du véhicule">
                <option value="AVAILABLE">Disponible</option>
                <option value="RENTED">Loué</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
              <DialogFooter>
                <Button type="submit" className="bg-morocco-blue text-white">Enregistrer</Button>
                <Button type="button" variant="outline" onClick={() => { setShowEditModal(false); setEditCar(null); }}>Annuler</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCars;
