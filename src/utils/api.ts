import axios, { AxiosResponse } from 'axios';
import { RouteRequest, RouteResponse, UserPreferences, ApiResponse, Route } from '../types';

// API base configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Route planning API functions
export const routeAPI = {
  // Plan a route with POI recommendations
  planRoute: async (request: RouteRequest): Promise<RouteResponse> => {
    try {
      const response = await api.post<ApiResponse<RouteResponse>>('/routes/plan', request);
      return response.data.data!;
    } catch (error) {
      console.error('Error planning route:', error);
      throw new Error('Failed to plan route');
    }
  },

  // Get alternative routes
  getAlternativeRoutes: async (request: RouteRequest): Promise<Route[]> => {
    try {
      const response = await api.post<ApiResponse<Route[]>>('/routes/alternatives', request);
      return response.data.data!;
    } catch (error) {
      console.error('Error getting alternative routes:', error);
      throw new Error('Failed to get alternative routes');
    }
  },

  // Get route details
  getRouteDetails: async (routeId: string): Promise<RouteResponse> => {
    try {
      const response = await api.get<ApiResponse<RouteResponse>>(`/routes/${routeId}`);
      return response.data.data!;
    } catch (error) {
      console.error('Error getting route details:', error);
      throw new Error('Failed to get route details');
    }
  },
};

// User preferences API functions
export const preferencesAPI = {
  // Save user preferences
  savePreferences: async (preferences: UserPreferences): Promise<void> => {
    try {
      await api.post<ApiResponse<void>>('/preferences', preferences);
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw new Error('Failed to save preferences');
    }
  },

  // Get user preferences
  getPreferences: async (): Promise<UserPreferences> => {
    try {
      const response = await api.get<ApiResponse<UserPreferences>>('/preferences');
      return response.data.data!;
    } catch (error) {
      console.error('Error getting preferences:', error);
      throw new Error('Failed to get preferences');
    }
  },
};

// Points of Interest API functions
export const poiAPI = {
  // Search for POIs near a location
  searchNearby: async (
    coordinates: [number, number],
    radius: number = 5000,
    types?: string[]
  ) => {
    try {
      const response = await api.get<ApiResponse<any[]>>('/pois/nearby', {
        params: {
          lat: coordinates[0],
          lng: coordinates[1],
          radius,
          types: types?.join(','),
        },
      });
      return response.data.data!;
    } catch (error) {
      console.error('Error searching nearby POIs:', error);
      throw new Error('Failed to search nearby POIs');
    }
  },

  // Get POI details
  getDetails: async (poiId: string) => {
    try {
      const response = await api.get<ApiResponse<any>>(`/pois/${poiId}`);
      return response.data.data!;
    } catch (error) {
      console.error('Error getting POI details:', error);
      throw new Error('Failed to get POI details');
    }
  },
};

// Geocoding API functions
export const geocodingAPI = {
  // Geocode an address to coordinates
  geocode: async (address: string) => {
    try {
      const response = await api.get<ApiResponse<any>>('/geocoding/geocode', {
        params: { address },
      });
      return response.data.data!;
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw new Error('Failed to geocode address');
    }
  },

  // Reverse geocode coordinates to address
  reverseGeocode: async (coordinates: [number, number]) => {
    try {
      const response = await api.get<ApiResponse<any>>('/geocoding/reverse', {
        params: {
          lat: coordinates[0],
          lng: coordinates[1],
        },
      });
      return response.data.data!;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw new Error('Failed to reverse geocode');
    }
  },
};

// Mock data for development
export const mockAPI = {
  planRoute: async (request: RouteRequest): Promise<RouteResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      route: {
        start: request.start.coordinates,
        end: request.end.coordinates,
        waypoints: [],
        distance: 15.5,
        duration: 25,
      },
      pois: [
        {
          id: '1',
          name: 'Historic Downtown Museum',
          type: 'museum',
          description: 'Explore local history and culture',
          rating: 4.5,
          distance: 2.3,
          coordinates: [40.7128, -74.0060],
        },
        {
          id: '2',
          name: 'Central Park Gardens',
          type: 'park',
          description: 'Beautiful botanical gardens with walking trails',
          rating: 4.2,
          distance: 5.1,
          coordinates: [40.7589, -73.9851],
        },
      ],
    };
  },
};

export default api; 