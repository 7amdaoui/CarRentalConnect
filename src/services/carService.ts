import api from './api';
import { Car } from '@/types/car';

// Type for car listing response
interface CarListResponse {
  cars: Car[];
  total: number;
  page: number;
  limit: number;
}

// Type for car filters
interface CarFilters {
  type?: string;
  brand?: string;
  agency?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  pickupDate?: string;
  returnDate?: string;
}

const carService = {
  /**
   * Get all cars with optional filtering
   */
  getAllCars: async (filters?: CarFilters, page: number = 1, limit: number = 10): Promise<Car[]> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }
    queryParams.append('page', String(page));
    queryParams.append('limit', String(limit));
    const response = await api.get<{ data: any[] }>(`/cars?${queryParams.toString()}`);
    return (response.data || []).map(car => ({
      ...car,
      pricePerDay: typeof car.pricePerDay === 'string' ? parseFloat(car.pricePerDay) : (car.pricePerDay?.toNumber ? car.pricePerDay.toNumber() : Number(car.pricePerDay)),
    }));
  },
  
  /**
   * Get a single car by ID
   */
  getCarById: async (carId: string): Promise<Car> => {
    const response = await api.get<{ data: any }>(`/cars/${carId}`);
    const car = response.data;
    return {
      ...car,
      pricePerDay: typeof car.pricePerDay === 'string' ? parseFloat(car.pricePerDay) : (car.pricePerDay?.toNumber ? car.pricePerDay.toNumber() : Number(car.pricePerDay)),
    };
  },
  
  /**
   * Get cars by agency/location
   */
  getCarsByAgency: async (agency: string): Promise<Car[]> => {
    return api.get<Car[]>(`/cars?agency=${agency}`);
  },
  
  /**
   * Create a new car (admin)
   */
  createCar: async (carData: Partial<Car>): Promise<Car> => {
    return api.post<Car>('/cars', carData);
  },
  
  /**
   * Update an existing car (admin)
   */
  updateCar: async (carId: string, carData: Partial<Car>): Promise<Car> => {
    return api.put<Car>(`/cars/${carId}`, carData);
  },
  
  /**
   * Delete a car (admin)
   */
  deleteCar: async (carId: string): Promise<void> => {
    return api.delete<void>(`/cars/${carId}`);
  },
  
  /**
   * Check car availability for a specific date range
   */
  checkCarAvailability: async (
    carId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ available: boolean; message?: string }> => {
    return api.get<{ available: boolean; message?: string }>(
      `/cars/${carId}/availability?startDate=${startDate}&endDate=${endDate}`
    );
  },
  
  /**
   * Get all car types
   */
  getTypes: async (): Promise<string[]> => {
    return api.get<string[]>('/cars/types');
  },
  
  /**
   * Get all agencies
   */
  getAgencies: async (): Promise<string[]> => {
    return api.get<string[]>('/cars/agencies');
  }
};

export default carService; 