// Core types for the NavPlace application

export interface PointOfInterest {
  id: string;
  name: string;
  type: string;
  description: string;
  rating: number;
  distance: number;
  coordinates: [number, number];
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  price?: string;
  images?: string[];
}

export interface Route {
  start: [number, number];
  end: [number, number];
  waypoints: [number, number][];
  distance: number;
  duration: number;
  polyline?: string;
  trafficInfo?: {
    congestion: 'low' | 'medium' | 'high';
    delay: number;
  };
}

export interface UserPreferences {
  interests: InterestCategory[];
  travelSettings: TravelSettings;
}

export interface InterestCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  selected: boolean;
  weight: number;
}

export interface TravelSettings {
  maxDetour: number;
  maxStops: number;
  avoidHighways: boolean;
  preferScenicRoutes: boolean;
  includeRestStops: boolean;
  preferredTransportMode: 'car' | 'public' | 'bike' | 'walk';
}

export interface Location {
  name: string;
  coordinates: [number, number];
  address?: string;
}

export interface RouteRequest {
  start: Location;
  end: Location;
  preferences: UserPreferences;
  departureTime?: Date;
  arrivalTime?: Date;
}

export interface RouteResponse {
  route: Route;
  pois: PointOfInterest[];
  alternativeRoutes?: Route[];
  estimatedCost?: {
    fuel?: number;
    tolls?: number;
    parking?: number;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Map related types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'start' | 'end' | 'poi' | 'waypoint';
  data?: PointOfInterest | Location;
} 