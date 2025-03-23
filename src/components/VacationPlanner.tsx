'use client';

import { useState, useEffect } from 'react';
import { FormInputs, ItineraryResponse } from '@/types/itinerary';
import { mockItineraryResponse } from '@/data/mockData';
import VacationPlannerForm from './VacationPlannerForm';
import ItineraryDisplay from './ItineraryDisplay';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ApiResponse {
  itineraries?: any[];
  textResponse?: string;
  error?: string;
}

export default function VacationPlanner() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ItineraryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  // Check if the API key is available via our test endpoint
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        setDebugInfo('Checking API key availability...');
        const response = await fetch('/api/test-env');
        const data = await response.json();
        setHasApiKey(data.hasApiKey);
        console.log('API key available:', data.hasApiKey);
        setDebugInfo(prev => `${prev || ''}\nAPI key available: ${data.hasApiKey}`);
      } catch (err) {
        console.error('Error checking API key:', err);
        setHasApiKey(false);
        setDebugInfo(prev => `${prev || ''}\nError checking API key: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    checkApiKey();
  }, []);

  const handleSubmit = async (data: FormInputs) => {
    setLoading(true);
    setError(null);
    setDebugInfo('Starting itinerary generation...');

    try {
      // Create a simpler prompt for the AI
      const simplePrompt = `Create a travel itinerary for a trip to ${data.destination} for ${data.dates}.
Number of people: ${data.people}
Dietary/other restrictions: ${data.restrictions || 'None'}
Budget: ${data.budget}
Transportation mode: ${data.transportationMode}
Interests: ${data.interests || 'General sightseeing'}`;

      setDebugInfo(prev => `${prev || ''}\n\nUsing prompt: ${simplePrompt}`);
      console.log('Generated prompt:', simplePrompt);

      // For development/testing purposes, use mock data if API key is not available
      if (hasApiKey === false) {
        console.log('Using mock data - API key not available');
        setDebugInfo(prev => `${prev || ''}\n\nUsing mock data (API key not available)`);
        setTimeout(() => {
          setResults(mockItineraryResponse);
          setLoading(false);
        }, 2000);
        return;
      }

      // Call our internal API route
      console.log('Calling internal API route...');
      setDebugInfo(prev => `${prev || ''}\n\nCalling internal API route...`);
      
      const requestBody = JSON.stringify({ prompt: simplePrompt });
      setDebugInfo(prev => `${prev || ''}\nRequest body: ${requestBody}`);
      
      console.log('Request body:', requestBody);
      
      try {
        const response = await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
        setDebugInfo(prev => `${prev || ''}\nAPI response status: ${response.status}`);
        setDebugInfo(prev => `${prev || ''}\nAPI response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

        if (!response.ok) {
          let errorText;
          try {
            const errorJson = await response.json();
            errorText = errorJson.error || JSON.stringify(errorJson);
          } catch (e) {
            errorText = await response.text();
          }
          
          console.error('API error response:', errorText);
          setDebugInfo(prev => `${prev || ''}\nAPI error: ${errorText}`);
          throw new Error(`API request failed: ${errorText}`);
        }

        let result: ApiResponse;
        try {
          result = await response.json();
          console.log('API response received', result);
          setDebugInfo(prev => `${prev || ''}\nAPI response received: ${JSON.stringify(result).substring(0, 300)}...`);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          setDebugInfo(prev => `${prev || ''}\nError parsing JSON response: ${jsonError instanceof Error ? jsonError.message : String(jsonError)}`);
          throw new Error('Failed to parse API response');
        }

        if (result.error) {
          setDebugInfo(prev => `${prev || ''}\nError from API: ${result.error}`);
          throw new Error(result.error);
        }

        // Check if we have itineraries directly
        if (result.itineraries && Array.isArray(result.itineraries)) {
          console.log('Received itineraries array directly');
          setDebugInfo(prev => `${prev || ''}\nReceived itineraries array directly`);
          setResults(result as ItineraryResponse);
        }
        // Create a simple itinerary object from the text response
        else if (result.textResponse && typeof result.textResponse === 'string') {
          const textResponse = result.textResponse;
          console.log('Received text response:', textResponse.substring(0, 100) + '...');
          setDebugInfo(prev => `${prev || ''}\nReceived text response (${textResponse.length} chars)`);
          setDebugInfo(prev => `${prev || ''}\nText response preview: ${textResponse.substring(0, 300)}...`);

          const textItinerary: ItineraryResponse = {
            itineraries: [
              {
                title: "AI Generated Itinerary",
                focus: data.interests || "General sightseeing",
                summary: "Generated based on your preferences",
                dailySchedule: [],
                accommodations: [],
                costBreakdown: {
                  activities: 0,
                  meals: 0,
                  accommodation: 0,
                  transportation: 0,
                  miscellaneous: 0,
                  totalEstimatedCost: 0,
                  comparisonToBudget: "",
                  savingsSuggestions: []
                },
                localInsights: {
                  culturalNotes: [],
                  hiddenGems: [],
                  crowdAvoidanceTips: []
                },
                practicalInfo: {
                  weatherExpectations: "",
                  packingSuggestions: []
                },
                textResponse: textResponse
              }
            ]
          };

          setResults(textItinerary);
        } else {
          console.error('Unexpected response format:', result);
          setDebugInfo(prev => `${prev || ''}\nReceived unexpected response format: ${JSON.stringify(result).substring(0, 300)}...`);
          throw new Error('Unexpected response format from API');
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        setDebugInfo(prev => `${prev || ''}\nFetch error: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
        throw fetchError;
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error generating vacation plan:', err);
      setError(`Failed to generate vacation plan: ${err.message}`);
      setDebugInfo(prev => `${prev || ''}\nError caught: ${err.message}`);
      setLoading(false);

      // Fall back to mock data for demonstration if API fails
      console.log('Falling back to mock data');
      setDebugInfo(prev => `${prev || ''}\nFalling back to mock data`);
      setTimeout(() => {
        setResults(mockItineraryResponse);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm">
      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-1">Travel Wizard</h2>
        </div>
        
        <VacationPlannerForm onSubmit={handleSubmit} loading={loading} />
        
        {loading && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">Creating your itinerary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please wait while we plan your perfect trip</p>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-sm p-5">
              {/* Itinerary Title and Summary */}
              <Skeleton height={24} width="60%" className="mb-2" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
              <Skeleton height={16} count={2} className="mb-4" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
              
              {/* Tabs */}
              <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 mb-5 pb-2">
                <Skeleton height={12} width={60} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <Skeleton height={12} width={80} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <Skeleton height={12} width={70} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <Skeleton height={12} width={50} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
              </div>
              
              {/* Content */}
              <div className="space-y-4">
                <Skeleton height={16} width="40%" className="mb-2" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <Skeleton height={12} count={3} className="mb-3" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Skeleton height={16} width="30%" className="mb-2" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={12} count={2} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </div>
                  <div>
                    <Skeleton height={16} width="30%" className="mb-2" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                    <Skeleton height={12} count={2} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                  </div>
                </div>
                
                <Skeleton height={16} width="40%" className="mb-2 mt-4" baseColor="#e5e7eb" highlightColor="#f3f4f6" />
                <Skeleton height={12} count={2} baseColor="#e5e7eb" highlightColor="#f3f4f6" />
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 border-l-4 border-gray-400 text-gray-700 dark:text-gray-300 text-sm">
            <p>{error}</p>
          </div>
        )}
        
        {results && !loading && (
          <div className="mt-8">
            <ItineraryDisplay itineraries={results.itineraries} />
          </div>
        )}
      </div>
    </div>
  );
}
