import api from './api';

// Types for reservation-related data
export interface ReservationUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Reservation {
  car: any;
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  user?: ReservationUser;
}

export interface ReservationCreateDTO {
  carId: string;
  startDate: string;
  endDate: string;
  userDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface ReservationUpdateDTO {
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
}

export interface ReservationListResponse {
  reservations: Reservation[];
  total: number;
  page: number;
  limit: number;
}

const reservationService = {
  /**
   * Get all reservations (admin)
   */
  getAllReservations: async (page: number = 1, limit: number = 10): Promise<ReservationListResponse> => {
    return api.get<ReservationListResponse>(`/reservations?page=${page}&limit=${limit}`);
  },
  
  /**
   * Get reservations for the current user
   */
  getUserReservations: async (userId?: string): Promise<Reservation[]> => {
    const endpoint = userId ? `/reservations/user/${userId}` : '/reservations/user';
    return api.get<Reservation[]>(endpoint);
  },
  
  /**
   * Get a reservation by ID
   */
  getReservationById: async (reservationId: string): Promise<Reservation> => {
    const response = await api.get<{ data: Reservation }>(`/reservations/${reservationId}`);
    return response.data;
  },
  
  /**
   * Create a new reservation
   */
  createReservation: async (reservationData: ReservationCreateDTO): Promise<Reservation> => {
    return api.post<Reservation>('/reservations', reservationData);
  },
  
  /**
   * Update a reservation (status, payment status)
   */
  updateReservation: async (
    reservationId: string, 
    updateData: ReservationUpdateDTO
  ): Promise<Reservation> => {
    return api.patch<Reservation>(`/reservations/${reservationId}`, updateData);
  },
  
  /**
   * Cancel a reservation
   */
  cancelReservation: async (reservationId: string): Promise<Reservation> => {
    return api.patch<Reservation>(`/reservations/${reservationId}`, {
      status: 'cancelled'
    });
  },
  
  /**
   * Process payment for a reservation
   */
  processPayment: async (
    reservationId: string, 
    paymentDetails: any
  ): Promise<{ success: boolean; message: string }> => {
    return api.post<{ success: boolean; message: string }>(
      `/reservations/${reservationId}/payment`, 
      paymentDetails
    );
  }
};

export default reservationService; 