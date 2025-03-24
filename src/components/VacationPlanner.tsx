'use client';

import { useState, useEffect } from 'react';
import { FormInputs, ItineraryResponse } from '@/types/itinerary';
import { mockItineraryResponse } from '@/data/mockData';
import VacationPlannerForm from './VacationPlannerForm';
import ItineraryDisplay from './ItineraryDisplay';
import 'react-loading-skeleton/dist/skeleton.css';

export default function VacationPlanner() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ItineraryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [polling, setPolling] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

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
    setResults(null);
    setError(null);
    setDebugInfo(null);
    setPolling(false);
    setProgress(0);

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

      // Call our internal API route to start the generation
      console.log('Calling internal API route to start generation...');
      setDebugInfo(prev => `${prev || ''}\n\nCalling internal API route to start generation...`);
      
      const requestBody = JSON.stringify({ 
        prompt: simplePrompt,
        formData: data
      });
      setDebugInfo(prev => `${prev || ''}\nRequest body: ${requestBody}`);
      
      console.log('Request body:', requestBody);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch('/api/generate-itinerary/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
          signal: controller.signal
        }).finally(() => clearTimeout(timeoutId));

        console.log('Response status:', response.status);
        console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));
        setDebugInfo(prev => `${prev || ''}\nAPI response status: ${response.status}`);
        setDebugInfo(prev => `${prev || ''}\nAPI response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);

        if (!response.ok) {
          let errorText;
          try {
            const errorJson = await response.json();
            errorText = errorJson.error || JSON.stringify(errorJson);
          } catch {
            errorText = await response.text();
          }
          
          console.error('API error response:', errorText);
          setDebugInfo(prev => `${prev || ''}\nAPI error: ${errorText}`);
          throw new Error(`API request failed: ${errorText}`);
        }

        let result: { jobId: string; status: string };
        try {
          result = await response.json();
          console.log('API response data:', result);
          setDebugInfo(prev => `${prev || ''}\nAPI response data: ${JSON.stringify(result)}`);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          setDebugInfo(prev => `${prev || ''}\nError parsing JSON response: ${jsonError}`);
          throw new Error('Failed to parse API response');
        }

        // Save the job ID for polling
        setPolling(true);
        setDebugInfo(prev => `${prev || ''}\nJob ID: ${result.jobId}`);
        console.log('Job ID:', result.jobId);

        // Add a small delay before starting polling to ensure the job is saved
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Start polling for status
        await pollJobStatus(result.jobId);

      } catch (fetchError: unknown) {
        console.error('Error fetching from API:', fetchError);
        setDebugInfo(prev => `${prev || ''}\nError fetching from API: ${fetchError}`);
        
        // Handle timeout errors specifically
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          setError('Request timed out. The server might be busy. Please try again in a moment.');
        } else {
          setError(`Failed to generate itinerary: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setDebugInfo(prev => `${prev || ''}\nError in handleSubmit: ${error}`);
      setError(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false);
    }
  };

  // Function to poll for job status
  const pollJobStatus = async (id: string) => {
    try {
      // Start with a longer polling interval that matches server-side polling
      const pollInterval = 20000; // Start with 20 seconds to match server
      let pollCount = 0;
      const maxPolls = 15; // Maximum number of polls (15 polls at 20 seconds initially)
      let retryCount = 0;
      const maxRetries = 5; // Increased maximum number of retries for "Job not found" errors
      
      const poll = async () => {
        if (pollCount >= maxPolls) {
          throw new Error('Timed out waiting for itinerary generation');
        }
        
        pollCount++;
        // Update progress based on poll count (simple approximation)
        setProgress(Math.min(95, Math.floor((pollCount / maxPolls) * 100)));
        
        try {
          // Add timeout to the fetch request to prevent socket hang-ups
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
          
          const response = await fetch(`/api/generate-itinerary/status?jobId=${id}`, {
            signal: controller.signal
          }).finally(() => clearTimeout(timeoutId));
          
          if (response.status === 404) {
            // Job not found - this could be a race condition
            if (retryCount < maxRetries) {
              retryCount++;
              // Use exponential backoff for retries
              const retryDelay = Math.min(1000 * Math.pow(2, retryCount - 1), 10000);
              console.log(`Job not found, retrying (${retryCount}/${maxRetries}) in ${retryDelay}ms...`);
              setDebugInfo(prev => `${prev || ''}\nJob not found, retrying in ${retryDelay}ms (${retryCount}/${maxRetries})...`);
              
              // Wait with exponential backoff and retry
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              await poll();
              return;
            } else {
              // Try to get more information about the error
              try {
                const errorData = await response.json();
                throw new Error(`Job not found after multiple retries. ${errorData.message || 'Please try again.'}`);
              } catch (jsonError) {
                throw new Error('Job not found after multiple retries. Please try again.');
              }
            }
          } else if (!response.ok) {
            let errorText;
            try {
              const errorJson = await response.json();
              errorText = errorJson.error || JSON.stringify(errorJson);
            } catch {
              errorText = await response.text();
            }
            throw new Error(`Status check failed: ${errorText}`);
          }
          
          const statusData = await response.json();
          console.log('Status check result:', statusData);
          setDebugInfo(prev => `${prev || ''}\nStatus check #${pollCount}: ${JSON.stringify(statusData)}`);
          
          if (statusData.status === 'completed') {
            // Job is complete, set the results
            console.log('Job completed, setting results');
            setDebugInfo(prev => `${prev || ''}\nJob completed, setting results`);
            setResults(statusData.result);
            setLoading(false);
            setProgress(100);
            setPolling(false);
            return;
          } else if (statusData.status === 'failed') {
            // Job failed, set the error
            console.error('Job failed:', statusData.error);
            setDebugInfo(prev => `${prev || ''}\nJob failed: ${statusData.error}`);
            setError(`Failed to generate itinerary: ${statusData.error}`);
            setLoading(false);
            setPolling(false);
            return;
          } else {
            // Job is still processing, continue polling with same interval
            console.log(`Job still ${statusData.status}, continuing to poll`);
            setDebugInfo(prev => `${prev || ''}\nJob still ${statusData.status}, continuing to poll`);
            
            // Keep the same polling interval to match server-side polling
            // Schedule the next poll
            setTimeout(poll, pollInterval);
          }
        } catch (error: unknown) {
          // Handle abort errors separately
          if (error instanceof Error && error.name === 'AbortError') {
            console.error('Status check request timed out');
            setDebugInfo(prev => `${prev || ''}\nStatus check request timed out, retrying...`);
            
            // Retry immediately on timeout
            if (retryCount < maxRetries) {
              retryCount++;
              await poll();
              return;
            } else {
              throw new Error('Status check timed out repeatedly. Please try again.');
            }
          }
          
          console.error('Error checking job status:', error);
          setDebugInfo(prev => `${prev || ''}\nError checking job status: ${error}`);
          setError(`Failed to check generation status: ${error instanceof Error ? error.message : String(error)}`);
          setLoading(false);
          setPolling(false);
        }
      };
      
      // Start polling
      await poll();
    } catch (error) {
      console.error('Error in polling:', error);
      setDebugInfo(prev => `${prev || ''}\nError in polling: ${error}`);
      setError(`Failed to monitor itinerary generation: ${error instanceof Error ? error.message : String(error)}`);
      setLoading(false);
      setPolling(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-white">Travel Wizard</h1>
      <p className="text-center mb-8 text-gray-600 dark:text-gray-300">Your AI-powered vacation planner</p>
      
      {(loading || polling) && (
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {progress < 30 && "Starting itinerary generation..."}
              {progress >= 30 && progress < 60 && "Generating your personalized itinerary..."}
              {progress >= 60 && progress < 90 && "Almost there! Finalizing your travel plans..."}
              {progress >= 90 && "Putting the finishing touches on your itinerary..."}
            </p>
          </div>
        </div>
      )}
      
      <VacationPlannerForm onSubmit={handleSubmit} loading={loading} />
      
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
  );
}
