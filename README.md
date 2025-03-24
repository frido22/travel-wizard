# The Itinerarist - Vacation Planner

A Next.js application that uses AI to create detailed, personalized vacation itineraries based on user inputs. The Itinerarist is a quirky but incredibly thorough vacation planning agent that crafts ridiculously detailed itineraries balancing fun, practicality, and the inevitable chaos of travel.

## Features

- Interactive form to collect user travel preferences
- AI-powered itinerary generation using AI21 Maestro
- Detailed itinerary display with information about:
  - Daily schedules with activities and meals
  - Accommodation options
  - Cost breakdowns and budget analysis
  - Local insights and practical information
- Responsive design with Tailwind CSS
- TypeScript for type safety

## Prerequisites

- Node.js 18.17.0 or later
- AI21 API key

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following content:

```
AI21_API_KEY=your_api_key_here
```

**IMPORTANT: Never commit your .env files or API keys to version control. Make sure .env and .env.local files are in your .gitignore file.**

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/page.tsx` - Main page component
- `src/components/VacationPlanner.tsx` - Form component for user inputs and API integration
- `src/components/ItineraryDisplay.tsx` - Component to display multiple itineraries
- `src/components/ItineraryDetails.tsx` - Component to display detailed information about each itinerary

## How It Works

1. Users enter their travel preferences (destination, dates, budget, etc.)
2. The application sends this information to the AI21 Maestro API
3. The API generates detailed itineraries based on the user inputs
4. The application displays the itineraries with tabs for different sections

## Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository
   - **IMPORTANT: Make sure your .env files are in .gitignore and not pushed to the repository**
2. Import the project in Vercel
3. Configure environment variables:
   - Add `AI21_API_KEY` with your API key value in the Vercel dashboard (Settings > Environment Variables)
   - **NEVER hardcode API keys in your codebase or expose them in client-side code**
4. Deploy the application

### Troubleshooting Vercel Deployment

## License

MIT
