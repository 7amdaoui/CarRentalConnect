
export type CarStatus = "available" | "rented" | "maintenance";

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  registrationNumber: string;
  type: string;
  agency: string;
  status: CarStatus;
  pricePerDay: number;
  imageUrl: string;
}

export type CarCardProps = Car;
