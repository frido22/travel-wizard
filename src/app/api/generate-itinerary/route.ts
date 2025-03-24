import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { createJob, getJob, updateJob } from '@/lib/itineraryStore';

// Use direct API calls instead of the SDK to avoid 'fs' module issues
export async function POST(request: NextRequest) {
  try {
    console.log('API route called');
    
    // Log request headers for debugging
    console.log('Request headers:', JSON.stringify(Object.fromEntries(request.headers.entries())));
    
    let requestBody;
    try {
      requestBody = await request.json();
      console.log('Request body received:', JSON.stringify(requestBody));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { prompt } = requestBody;
    
    if (!prompt) {
      console.log('No prompt provided');
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    // Check if we have an API key
    const apiKey = process.env.AI21_API_KEY;
    console.log('API key available:', !!apiKey);
    console.log('API key length:', apiKey ? apiKey.length : 0);
    
    if (!apiKey) {
      console.log('No API key found');
      return NextResponse.json(
        { error: 'AI21_API_KEY not configured' },
        { status: 500 }
      );
    }
    
    // Create a more structured prompt for better JSON responses
    const structuredPrompt = `${prompt}
    
Please provide a detailed day-by-day itinerary for this trip in JSON format with the following structure:
{
  "itineraries": [
    {
      "title": "Trip Title",
      "focus": "Main focus of the trip (e.g., Adventure, Culture, Relaxation)",
      "summary": "Brief summary of the itinerary",
      "dailySchedule": [
        {
          "day": 1,
          "date": "Date in text format",
          "morning": {
            "activity": "Description of morning activity",
            "location": "Location name",
            "duration": "Duration in hours",
            "cost": 0,
            "distance": "Distance from previous location",
            "transportation": "Mode of transportation"
          },
          "afternoon": {
            "activity": "Description of afternoon activity",
            "location": "Location name",
            "duration": "Duration in hours",
            "cost": 0,
            "distance": "Distance from previous location",
            "transportation": "Mode of transportation"
          },
          "evening": {
            "activity": "Description of evening activity",
            "location": "Location name",
            "duration": "Duration in hours",
            "cost": 0,
            "distance": "Distance from previous location",
            "transportation": "Mode of transportation"
          },
          "meals": [
            {
              "type": "breakfast/lunch/dinner",
              "suggestion": "Restaurant or meal suggestion",
              "accommodatesRestrictions": true/false,
              "cost": 0
            }
          ]
        }
      ],
      "accommodations": [
        {
          "name": "Accommodation name",
          "description": "Brief description",
          "amenities": ["amenity1", "amenity2"],
          "proximityToAttractions": "Description of location advantages",
          "costPerNight": 0,
          "totalAccommodationCost": 0
        }
      ],
      "costBreakdown": {
        "activities": 0,
        "meals": 0,
        "accommodation": 0,
        "transportation": 0,
        "miscellaneous": 0,
        "totalEstimatedCost": 0,
        "comparisonToBudget": "Under/Over budget explanation",
        "savingsSuggestions": ["suggestion1", "suggestion2"]
      },
      "localInsights": {
        "culturalNotes": ["note1", "note2"],
        "hiddenGems": ["gem1", "gem2"],
        "crowdAvoidanceTips": ["tip1", "tip2"]
      },
      "practicalInfo": {
        "weatherExpectations": "Weather description",
        "packingSuggestions": ["item1", "item2"],
        "advanceReservations": ["reservation1", "reservation2"],
        "transportationTips": ["tip1", "tip2"],
        "safetyInfo": ["info1", "info2"]
      }
    }
  ]
}`;

    console.log('Structured prompt length:', structuredPrompt.length);
    
    // Create a job and start the generation process
    const job = createJob(prompt, requestBody.formData);
    
    // Start the generation process in the background
    generateItinerary(job.id, structuredPrompt, apiKey).catch(error => {
      console.error(`Error in background job ${job.id}:`, error);
    });
    
    // For backward compatibility, wait for the job to complete
    // This is not ideal for long-running jobs, but maintains compatibility
    try {
      // Poll for completion with a timeout
      const maxWaitTime = 55000; // 55 seconds (just under Vercel's 60s limit)
      const startTime = Date.now();
      
      while (true) {
        // Check if we're approaching the timeout
        if (Date.now() - startTime > maxWaitTime) {
          console.log('Approaching timeout limit, returning partial result');
          break;
        }
        
        // Get the current job status
        const currentJob = getJob(job.id);
        
        if (!currentJob) {
          throw new Error('Job not found');
        }
        
        if (currentJob.status === 'completed') {
          // Job completed successfully
          return NextResponse.json(currentJob.result);
        } else if (currentJob.status === 'failed') {
          // Job failed
          throw new Error(currentJob.error || 'Job failed');
        }
        
        // Wait before checking again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // If we get here, we're approaching the timeout
      // Return a response indicating the job is still in progress
      return NextResponse.json({
        textResponse: "Your itinerary is still being generated. Please try again in a moment."
      });
    } catch (error) {
      console.error('Error waiting for job completion:', error);
      throw error;
    }
  } catch (error: unknown) {
    console.error('Error in API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate itinerary: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// This function runs in the background and doesn't block the response
async function generateItinerary(jobId: string, structuredPrompt: string, apiKey: string) {
  try {
    // Update job status to processing
    updateJob(jobId, { status: 'processing' });
    
    // Determine whether to use Maestro with web search or standard chat completions
    const useMaestro = true; // Always try Maestro first
    
    // First try Maestro with web search if enabled
    if (useMaestro) {
      console.log('Using AI21 Maestro with web search...');
      
      try {
        // Log the request payload for debugging
        const maestroPayload = {
          maestroId: "travel-planner",
          input: structuredPrompt,
          includeWebSearch: true
        };
        console.log('Maestro API request payload:', JSON.stringify(maestroPayload));
        
        // Create a Maestro run with web search
        const maestroResponse = await axios.post(
          'https://api.ai21.com/studio/v1/maestro/runs',
          maestroPayload,
          {
            headers: {
              'Authorization': `Bearer ${apiKey.trim()}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const runId = maestroResponse.data.id;
        console.log('Maestro Run ID:', runId);
        
        // Poll for completion
        let runStatus = 'in_progress';
        let resultText = '';
        let attempts = 0;
        const maxAttempts = 15; // 5 minutes (15 * 20 seconds)
        
        while (runStatus === 'in_progress') {
          if (attempts >= maxAttempts) {
            console.log('Maestro run taking too long, falling back to standard chat completions...');
            break;
          }
          
          attempts++;
          console.log(`Run status: ${runStatus}, waiting 20 seconds... (attempt ${attempts}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 20000));
          
          const statusResponse = await axios.get(
            `https://api.ai21.com/studio/v1/maestro/runs/${runId}`,
            {
              headers: {
                'Authorization': `Bearer ${apiKey.trim()}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          runStatus = statusResponse.data.status;
          console.log(`Updated run status: ${runStatus}`);
          
          if (runStatus === 'completed') {
            resultText = statusResponse.data.outputs.text;
            break;
          } else if (runStatus === 'failed') {
            console.error('Maestro run failed:', statusResponse.data);
            break;
          }
        }
        
        console.log('Maestro Final Status:', runStatus);
        
        if (runStatus === 'completed') {
          console.log('Maestro response received successfully');
          console.log('Maestro text received (length):', resultText.length);
          
          // Try to extract JSON from the response
          try {
            // Find JSON in the text
            const jsonMatch = resultText.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
              console.log('JSON pattern found in response');
              const jsonString = jsonMatch[0];
              console.log('JSON string length:', jsonString.length);
              console.log('First 100 chars of JSON string:', jsonString.substring(0, 100));
              
              try {
                const parsedData = JSON.parse(jsonString);
                console.log('Successfully parsed JSON response');
                console.log('Parsed data structure:', Object.keys(parsedData));
                
                // Update job with result
                updateJob(jobId, { 
                  status: 'completed',
                  result: parsedData
                });
                return;
              } catch (jsonParseError) {
                console.error('Error parsing extracted JSON:', jsonParseError);
                console.log('JSON parse error on string:', jsonString.substring(0, 200));
                
                // Update job with text response
                updateJob(jobId, { 
                  status: 'completed',
                  result: { textResponse: resultText }
                });
                return;
              }
            } else {
              // If no JSON found, return as text
              console.log('No JSON found in response, returning as text');
              
              // Update job with text response
              updateJob(jobId, { 
                status: 'completed',
                result: { textResponse: resultText }
              });
              return;
            }
          } catch (parseError) {
            console.error('Error in JSON extraction process:', parseError);
            
            // Update job with text response
            updateJob(jobId, { 
              status: 'completed',
              result: { textResponse: resultText }
            });
            return;
          }
        }
      } catch (error) {
        const maestroError = error as Error;
        console.error('Error with Maestro API:', maestroError.message);
        if (axios.isAxiosError(maestroError) && maestroError.response) {
          console.error('Maestro error response data:', JSON.stringify(maestroError.response.data));
          console.error('Maestro error status:', maestroError.response.status);
          console.error('Maestro error headers:', JSON.stringify(maestroError.response.headers));
        }
        console.log('Falling back to standard chat completions...');
      }
    }
    
    // Standard chat completions (used as fallback if Maestro fails or takes too long)
    console.log('Using standard AI21 chat completions...');
    console.log('API endpoint:', 'https://api.ai21.com/studio/v1/chat/completions');
    
    const response = await axios.post(
      'https://api.ai21.com/studio/v1/chat/completions',
      {
        model: 'jamba-large',
        messages: [{ role: 'user', content: structuredPrompt }],
        temperature: 0.7,
        maxTokens: 2000  // Increased token count for detailed JSON response
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('AI21 API response status:', response.status);
    console.log('AI21 API response headers:', JSON.stringify(response.headers));
    
    // Extract the completion text
    const completionText = response.data.choices[0].message.content;
    console.log('Completion text received (length):', completionText.length);
    console.log('First 100 chars of completion:', completionText.substring(0, 100));
    
    // Try to extract JSON from the response
    try {
      // Find JSON in the text
      console.log('Attempting to extract JSON from response...');
      const jsonMatch = completionText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        console.log('JSON pattern found in response');
        const jsonString = jsonMatch[0];
        console.log('JSON string length:', jsonString.length);
        console.log('First 100 chars of JSON string:', jsonString.substring(0, 100));
        
        try {
          const parsedData = JSON.parse(jsonString);
          console.log('Successfully parsed JSON response');
          console.log('Parsed data structure:', Object.keys(parsedData));
          
          // Update job with result
          updateJob(jobId, { 
            status: 'completed',
            result: parsedData
          });
          return;
        } catch (jsonParseError) {
          console.error('Error parsing extracted JSON:', jsonParseError);
          console.log('JSON parse error on string:', jsonString.substring(0, 200));
          
          // Update job with text response
          updateJob(jobId, { 
            status: 'completed',
            result: { textResponse: completionText }
          });
          return;
        }
      } else {
        // If no JSON found, return as text
        console.log('No JSON found in response, returning as text');
        
        // Update job with text response
        updateJob(jobId, { 
          status: 'completed',
          result: { textResponse: completionText }
        });
        return;
      }
    } catch (parseError) {
      console.error('Error in JSON extraction process:', parseError);
      
      // Update job with text response
      updateJob(jobId, { 
        status: 'completed',
        result: { textResponse: completionText }
      });
      return;
    }
  } catch (error) {
    console.error('Error generating itinerary:', error);
    
    // Update job with error
    updateJob(jobId, { 
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
