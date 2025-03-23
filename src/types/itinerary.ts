// Define the itinerary response structure
export interface ItineraryResponse {
  itineraries: Itinerary[];
}

export interface Itinerary {
  title: string;
  focus: string;
  summary: string;
  dailySchedule: DailyScheduleItem[];
  accommodations: Accommodation[];
  costBreakdown: CostBreakdown;
  localInsights: LocalInsights;
  practicalInfo: PracticalInfo;
  textResponse?: string; // Optional field for text-based responses
}

// Renamed from DailySchedule to DailyScheduleItem to avoid confusion with the component
export interface DailyScheduleItem {
  day: number;
  date: string;
  morning?: Activity;
  afternoon?: Activity;
  evening?: Activity;
  meals?: Meal[];
}

export interface Activity {
  activity: string;
  location: string;
  duration: string;
  cost: number;
  distance: string;
  transportation: string;
}

export interface Meal {
  type: string;
  suggestion: string;
  accommodatesRestrictions: boolean;
  cost: number;
}

export interface Accommodation {
  name: string;
  description: string;
  amenities: string[];
  proximityToAttractions: string;
  costPerNight: number;
  totalAccommodationCost: number;
}

export interface CostBreakdown {
  activities: number;
  meals: number;
  accommodation: number;
  transportation: number;
  miscellaneous: number;
  totalEstimatedCost: number;
  comparisonToBudget: string;
  savingsSuggestions: string[];
}

export interface LocalInsights {
  culturalNotes: string[];
  hiddenGems: string[];
  crowdAvoidanceTips: string[];
}

export interface PracticalInfo {
  weatherExpectations?: string; // Made optional and renamed
  packingSuggestions?: string[]; // Made optional
  advanceReservations?: string[];
  weatherConsiderations?: string;
  emergencyContacts?: {
    police: string;
    medical: string;
    embassy: string;
  };
  transportationTips?: string[]; // Added for compatibility
  safetyInfo?: string[]; // Added for compatibility
}

// Define the form input types
export interface FormInputs {
  destination: string;
  dates: string;
  people: string;
  restrictions: string;
  budget: string;
  transportationMode: string;
  interests?: string; // Added for compatibility
}
