import { NextRequest, NextResponse } from 'next/server';
import { createJob } from '@/lib/itineraryStore';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    console.log('Start API route called');
    
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
    
    const { prompt, formData } = requestBody;
    
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
    
    if (!apiKey) {
      console.log('No API key found');
      return NextResponse.json(
        { error: 'AI21_API_KEY not configured' },
        { status: 500 }
      );
    }
    
    // Create a new job
    const job = createJob(prompt, formData);
    
    // Start the generation process in the background
    // We don't await this promise, so it runs in the background
    generateItinerary(job.id, prompt, apiKey).catch(error => {
      console.error(`Error in background job ${job.id}:`, error);
    });
    
    // Return the job ID immediately
    return NextResponse.json({ 
      jobId: job.id,
      status: job.status
    });
    
  } catch (error: unknown) {
    console.error('Unexpected error in start endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to start itinerary generation: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// This function runs in the background and doesn't block the response
async function generateItinerary(jobId: string, prompt: string, apiKey: string) {
  const { updateJob } = await import('@/lib/itineraryStore');
  
  try {
    // Update job status to processing
    updateJob(jobId, { status: 'processing' });
    
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

    // First try Maestro if available
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
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        }
      );
        
      const runId = maestroResponse.data.id;
      console.log('Maestro Run ID:', runId);
        
      // Store the Maestro Run ID in the job metadata
      updateJob(jobId, { 
        metadata: { 
          maestroRunId: runId 
        } 
      });
        
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
              'Authorization': `Bearer ${apiKey}`,
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
            
            try {
              const parsedData = JSON.parse(jsonString);
              console.log('Successfully parsed JSON response');
              
              // Update job with result
              updateJob(jobId, { 
                status: 'completed',
                result: parsedData
              });
              return;
            } catch (jsonParseError) {
              console.error('Error parsing extracted JSON:', jsonParseError);
              
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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          console.error('Maestro API request timed out:', error);
        } else if (error.code === 'ECONNRESET') {
          console.error('Socket hang up error occurred during Maestro API request:', error);
        } else {
          console.error('Error with Maestro API:', error.message);
          if (error.response) {
            console.error('Maestro error response data:', JSON.stringify(error.response.data));
            console.error('Maestro error status:', error.response.status);
            console.error('Maestro error headers:', JSON.stringify(error.response.headers));
          }
        }
      } else {
        const genericError = error as Error;
        console.error('Unknown error with Maestro API:', genericError.message);
      }
      console.log('Falling back to standard chat completions...');
    }
    
    // Standard chat completions (used as fallback if Maestro fails)
    console.log('Using standard AI21 chat completions...');
    
    const response = await axios.post(
      'https://api.ai21.com/studio/v1/chat/completions',
      {
        model: 'jamba-large',
        messages: [{ role: 'user', content: structuredPrompt }],
        temperature: 0.7,
        maxTokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('AI21 API response status:', response.status);
    
    // Extract the completion text
    const completionText = response.data.choices[0].message.content;
    console.log('Completion text received (length):', completionText.length);
    
    // Try to extract JSON from the response
    try {
      // Find JSON in the text
      const jsonMatch = completionText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        console.log('JSON pattern found in response');
        const jsonString = jsonMatch[0];
        
        try {
          const parsedData = JSON.parse(jsonString);
          console.log('Successfully parsed JSON response');
          
          // Update job with result
          updateJob(jobId, { 
            status: 'completed',
            result: parsedData
          });
          return;
        } catch (jsonParseError) {
          console.error('Error parsing extracted JSON:', jsonParseError);
          
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
  } catch (error: unknown) {
    console.error('Error generating itinerary:', error);
    
    // Update job with error
    updateJob(jobId, { 
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
