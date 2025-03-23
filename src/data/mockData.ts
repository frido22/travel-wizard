// Mock data for itinerary response
import { ItineraryResponse } from '../types/itinerary';

export const mockItineraryResponse: ItineraryResponse = {
  itineraries: [
    {
      title: "Parisian Adventure: Pointy-Thing-Free Edition",
      focus: "Cultural Immersion & Gastronomy",
      summary: "A delightful exploration of Paris that strategically avoids the Eiffel Tower while maximizing cultural experiences and culinary delights. Perfect for those with specific architectural phobias and dietary preferences.",
      dailySchedule: [
        {
          day: 1,
          date: "2025-04-01",
          morning: {
            activity: "Louvre Museum Visit",
            location: "Rue de Rivoli, 75001 Paris",
            duration: "3 hours",
            cost: 17,
            distance: "N/A (First Stop)",
            transportation: "Metro Line 1 to Palais Royal-Musée du Louvre"
          },
          afternoon: {
            activity: "Luxembourg Gardens Stroll",
            location: "6th Arrondissement",
            duration: "2 hours",
            cost: 0,
            distance: "2.5 km from Louvre",
            transportation: "Metro Line 4"
          },
          evening: {
            activity: "Seine River Cruise (Eiffel Tower-Free Route)",
            location: "Pont Neuf",
            duration: "1 hour",
            cost: 15,
            distance: "1.5 km from Luxembourg Gardens",
            transportation: "Walking"
          },
          meals: [
            {
              type: "breakfast",
              suggestion: "Café de Flore - Classic French breakfast",
              accommodatesRestrictions: true,
              cost: 15
            },
            {
              type: "lunch",
              suggestion: "Le Petit Italien - Pizza and pasta options",
              accommodatesRestrictions: true,
              cost: 20
            },
            {
              type: "dinner",
              suggestion: "Bistrot Paul Bert - Traditional French cuisine",
              accommodatesRestrictions: true,
              cost: 35
            }
          ]
        }
      ],
      accommodations: [
        {
          name: "Hotel des Arts Montmartre",
          description: "Charming boutique hotel in the artistic Montmartre district",
          amenities: ["Free WiFi", "Air conditioning", "24-hour front desk"],
          proximityToAttractions: "Walking distance to Sacré-Cœur and Place du Tertre",
          costPerNight: 120,
          totalAccommodationCost: 360
        }
      ],
      costBreakdown: {
        activities: 32,
        meals: 70,
        accommodation: 360,
        transportation: 20,
        miscellaneous: 50,
        totalEstimatedCost: 532,
        comparisonToBudget: "Well within your specified budget with room for additional experiences",
        savingsSuggestions: [
          "Purchase a Paris Museum Pass for multiple attractions",
          "Consider picnic lunches from local markets",
          "Use Navigo weekly pass for unlimited transportation"
        ]
      },
      localInsights: {
        culturalNotes: [
          "Greet shopkeepers with 'Bonjour' when entering",
          "Tipping is not required but rounding up is appreciated",
          "Many shops close on Sundays"
        ],
        hiddenGems: [
          "Passage des Panoramas - oldest covered passage in Paris",
          "Musée de la Vie Romantique - free small museum with lovely tea garden",
          "Canal Saint-Martin - trendy area with boutiques and cafes"
        ],
        crowdAvoidanceTips: [
          "Visit the Louvre on Wednesday or Friday evenings",
          "Explore Montmartre early in the morning",
          "Book restaurant reservations 1-2 weeks in advance"
        ]
      },
      practicalInfo: {
        advanceReservations: [
          "Louvre Museum tickets",
          "Restaurant reservations for dinner",
          "Seine River Cruise"
        ],
        weatherConsiderations: "April in Paris can be unpredictable with average temperatures of 8-15°C (46-59°F). Pack layers and a light raincoat.",
        emergencyContacts: {
          police: "17",
          medical: "15",
          embassy: "U.S. Embassy: +33 1 43 12 22 22"
        }
      }
    }
  ]
};
