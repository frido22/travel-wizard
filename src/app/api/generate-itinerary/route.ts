import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

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
      "title": "London Adventure",
      "focus": "Sightseeing and Culture",
      "summary": "A comprehensive tour of London's top attractions and cultural sites",
      "dailySchedule": [
        {
          "day": 1,
          "date": "April 1",
          "morning": {
            "activity": "Arrival and Check-in",
            "location": "Hotel",
            "duration": "2 hours",
            "cost": 0,
            "distance": "N/A",
            "transportation": "Airport Transfer"
          },
          "afternoon": {
            "activity": "Westminster Walking Tour",
            "location": "Westminster",
            "duration": "3 hours",
            "cost": 0,
            "distance": "1 mile",
            "transportation": "Walking"
          },
          "evening": {
            "activity": "Dinner at Local Restaurant",
            "location": "Covent Garden",
            "duration": "2 hours",
            "cost": 100,
            "distance": "1 mile",
            "transportation": "Tube"
          },
          "meals": [
            {
              "type": "Lunch",
              "suggestion": "Sandwich at Pret A Manger",
              "accommodatesRestrictions": true,
              "cost": 15
            },
            {
              "type": "Dinner",
              "suggestion": "Traditional British cuisine at The Ivy",
              "accommodatesRestrictions": true,
              "cost": 100
            }
          ]
        },
        {
          "day": 2,
          "date": "April 2",
          "morning": {
            "activity": "Tower of London Tour",
            "location": "Tower of London",
            "duration": "2 hours",
            "cost": 25,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "afternoon": {
            "activity": "London Eye Ride",
            "location": "London Eye",
            "duration": "1 hour",
            "cost": 30,
            "distance": "1 mile",
            "transportation": "Walking"
          },
          "evening": {
            "activity": "Dinner at Local Restaurant",
            "location": "South Bank",
            "duration": "2 hours",
            "cost": 100,
            "distance": "1 mile",
            "transportation": "Tube"
          },
          "meals": [
            {
              "type": "Lunch",
              "suggestion": "Fish and Chips at The Fisherman's Arms",
              "accommodatesRestrictions": true,
              "cost": 20
            },
            {
              "type": "Dinner",
              "suggestion": "Modern British cuisine at The Delaunay",
              "accommodatesRestrictions": true,
              "cost": 120
            }
          ]
        },
        {
          "day": 3,
          "date": "April 3",
          "morning": {
            "activity": "British Museum Visit",
            "location": "British Museum",
            "duration": "2 hours",
            "cost": 0,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "afternoon": {
            "activity": "Covent Garden Shopping",
            "location": "Covent Garden",
            "duration": "2 hours",
            "cost": 0,
            "distance": "1 mile",
            "transportation": "Walking"
          },
          "evening": {
            "activity": "Dinner at Local Restaurant",
            "location": "Soho",
            "duration": "2 hours",
            "cost": 100,
            "distance": "1 mile",
            "transportation": "Tube"
          },
          "meals": [
            {
              "type": "Lunch",
              "suggestion": "Sandwich at Pret A Manger",
              "accommodatesRestrictions": true,
              "cost": 15
            },
            {
              "type": "Dinner",
              "suggestion": "Italian cuisine at Bocca di Lupo",
              "accommodatesRestrictions": true,
              "cost": 120
            }
          ]
        },
        {
          "day": 4,
          "date": "April 4",
          "morning": {
            "activity": "Hyde Park Visit",
            "location": "Hyde Park",
            "duration": "2 hours",
            "cost": 0,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "afternoon": {
            "activity": "Kensington Palace Tour",
            "location": "Kensington Palace",
            "duration": "2 hours",
            "cost": 20,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "evening": {
            "activity": "Dinner at Local Restaurant",
            "location": "Notting Hill",
            "duration": "2 hours",
            "cost": 100,
            "distance": "1 mile",
            "transportation": "Tube"
          },
          "meals": [
            {
              "type": "Lunch",
              "suggestion": "Salad at The Natural History Museum Cafe",
              "accommodatesRestrictions": true,
              "cost": 15
            },
            {
              "type": "Dinner",
              "suggestion": "Caribbean cuisine at The Rum Kitchen",
              "accommodatesRestrictions": true,
              "cost": 120
            }
          ]
        },
        {
          "day": 5,
          "date": "April 5",
          "morning": {
            "activity": "Tate Modern Visit",
            "location": "Tate Modern",
            "duration": "2 hours",
            "cost": 0,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "afternoon": {
            "activity": "Borough Market Visit",
            "location": "Borough Market",
            "duration": "2 hours",
            "cost": 0,
            "distance": "1 mile",
            "transportation": "Walking"
          },
          "evening": {
            "activity": "Dinner at Local Restaurant",
            "location": "Shoreditch",
            "duration": "2 hours",
            "cost": 100,
            "distance": "1 mile",
            "transportation": "Tube"
          },
          "meals": [
            {
              "type": "Lunch",
              "suggestion": "Street food at Borough Market",
              "accommodatesRestrictions": true,
              "cost": 10
            },
            {
              "type": "Dinner",
              "suggestion": "Indian cuisine at Dishoom",
              "accommodatesRestrictions": true,
              "cost": 120
            }
          ]
        },
        {
          "day": 6,
          "date": "April 6",
          "morning": {
            "activity": "Regent's Park Visit",
            "location": "Regent's Park",
            "duration": "2 hours",
            "cost": 0,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "afternoon": {
            "activity": "Madame Tussauds Visit",
            "location": "Madame Tussauds",
            "duration": "2 hours",
            "cost": 30,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "evening": {
            "activity": "Dinner at Local Restaurant",
            "location": "Camden",
            "duration": "2 hours",
            "cost": 100,
            "distance": "1 mile",
            "transportation": "Tube"
          },
          "meals": [
            {
              "type": "Lunch",
              "suggestion": "Sandwich at Pret A Manger",
              "accommodatesRestrictions": true,
              "cost": 15
            },
            {
              "type": "Dinner",
              "suggestion": "Vegetarian cuisine at The Gate",
              "accommodatesRestrictions": true,
              "cost": 120
            }
          ]
        },
        {
          "day": 7,
          "date": "April 7",
          "morning": {
            "activity": "Harrods Visit",
            "location": "Harrods",
            "duration": "2 hours",
            "cost": 0,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "afternoon": {
            "activity": "Hyde Park Winter Wonderland",
            "location": "Hyde Park",
            "duration": "2 hours",
            "cost": 0,
            "distance": "2 miles",
            "transportation": "Tube"
          },
          "evening": {
            "activity": "Dinner at Local Restaurant",
            "location": "Knightsbridge",
            "duration": "2 hours",
            "cost": 100,
            "distance": "1 mile",
            "transportation": "Tube"
          },
          "meals": [
            {
              "type": "Lunch",
              "suggestion": "Afternoon tea at The Ritz",
              "accommodatesRestrictions": true,
              "cost": 50
            },
            {
              "type": "Dinner",
              "suggestion": "Fine dining at The Ledbury",
              "accommodatesRestrictions": true,
              "cost": 200
            }
          ]
        }
      ],
      "accommodations": [
        {
          "name": "Park Plaza Westminster Bridge",
          "description": "4-star hotel with views of Big Ben",
          "amenities": ["Free WiFi", "Spa", "Restaurant"],
          "proximityToAttractions": "Walking distance to London Eye and Westminster",
          "costPerNight": 250,
          "totalAccommodationCost": 1500
        }
      ],
      "costBreakdown": {
        "activities": 500,
        "meals": 1200,
        "accommodation": 1500,
        "transportation": 300,
        "miscellaneous": 500,
        "totalEstimatedCost": 4000,
        "comparisonToBudget": "Well within budget",
        "savingsSuggestions": ["Use Oyster card for public transport", "Visit free museums"]
      },
      "localInsights": {
        "culturalNotes": ["Tipping is typically 10-15%", "Stand on the right on escalators"],
        "hiddenGems": ["Little Venice", "Postman's Park"],
        "crowdAvoidanceTips": ["Visit popular attractions early morning", "Book tickets online in advance"]
      },
      "practicalInfo": {
        "weatherExpectations": "April in London can be unpredictable with average temperatures of 8-15°C and occasional rain",
        "packingSuggestions": ["Umbrella", "Light jacket", "Comfortable walking shoes"]
      }
    }
  ]
}

Make sure to include all days in the dailySchedule array, with appropriate activities for each part of the day.`;

    console.log('Structured prompt length:', structuredPrompt.length);
    
    // Determine whether to use Maestro with web search or standard chat completions
    const useWebSearch = true; // Set to true to use web search, false to use standard chat
    
    let result = null;
    
    // First try Maestro with web search if enabled
    if (useWebSearch) {
      console.log('Using AI21 Maestro with web search...');
      
      try {
        // Create a Maestro run with web search
        const maestroResponse = await axios.post(
          'https://api.ai21.com/studio/v1/maestro/runs',
          {
            input: structuredPrompt,
            tools: [{ type: "web_search" }]
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        const runId = maestroResponse.data.id;
        console.log('Maestro Run ID:', runId);
        
        // Poll for results with timeout
        let runStatus = 'running';
        let runResult;
        let attempts = 0;
        const maxAttempts = 12; // 5 seconds * 12 = 60 seconds max wait time
        
        while ((runStatus === 'running' || runStatus === 'pending' || runStatus === 'in_progress') && attempts < maxAttempts) {
          console.log(`Run status: ${runStatus}, waiting 5 seconds... (attempt ${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, 5000));
          attempts++;
          
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
          runResult = statusResponse.data;
        }
        
        console.log('Maestro Final Status:', runStatus);
        
        if (runStatus === 'completed') {
          console.log('Maestro response received successfully');
          
          // Try to extract JSON from the response
          const resultText = runResult.result;
          const jsonMatch = resultText.match(/\{[\s\S]*\}/);
          
          if (jsonMatch) {
            console.log('JSON pattern found in Maestro response');
            const jsonString = jsonMatch[0];
            console.log('JSON string length:', jsonString.length);
            console.log('First 100 chars of JSON string:', jsonString.substring(0, 100));
            
            try {
              const parsedData = JSON.parse(jsonString);
              console.log('Successfully parsed JSON response from Maestro');
              console.log('Parsed data structure:', Object.keys(parsedData));
              result = parsedData;
            } catch (jsonParseError) {
              console.error('Error parsing extracted JSON from Maestro:', jsonParseError);
              console.log('JSON parse error on string:', jsonString.substring(0, 200));
              result = { textResponse: resultText };
            }
          } else {
            // If no JSON found, return as text
            console.log('No JSON found in Maestro response, returning as text');
            result = { textResponse: resultText };
          }
        }
        // If we got a result, we'll return it at the end of the function
        if (result) {
          return NextResponse.json(result);
        }
        
        // Otherwise, we'll fall back to standard chat completions
        console.log('Maestro did not provide a usable result. Falling back to standard chat completions...');
      } catch (error) {
        const maestroError = error as Error;
        console.error('Error with Maestro API:', maestroError.message);
        if (axios.isAxiosError(maestroError) && maestroError.response) {
          console.error('Maestro error response data:', JSON.stringify(maestroError.response.data));
          console.error('Maestro error status:', maestroError.response.status);
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
          'Authorization': `Bearer ${apiKey}`,
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
          return NextResponse.json(parsedData);
        } catch (jsonParseError) {
          console.error('Error parsing extracted JSON:', jsonParseError);
          console.log('JSON parse error on string:', jsonString.substring(0, 200));
          return NextResponse.json({ textResponse: completionText });
        }
      } else {
        // If no JSON found, return as text
        console.log('No JSON found in response, returning as text');
        return NextResponse.json({ textResponse: completionText });
      }
    } catch (parseError) {
      console.error('Error in JSON extraction process:', parseError);
      return NextResponse.json({ textResponse: completionText });
    }
  } catch (error: any) {
    console.error('Server error:', error.message);
    console.error('Error stack:', error.stack);
    
    // Determine if this is an AI21 API error
    if (axios.isAxiosError(error) && error.response) {
      console.error('API error response:', JSON.stringify(error.response.data));
      console.error('API error status:', error.response.status);
      return NextResponse.json(
        { error: `AI21 API error: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
