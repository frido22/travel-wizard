import { NextResponse } from 'next/server';

export async function GET() {
  // Check if the API key is available in the environment
  const apiKey = process.env.AI21_API_KEY;
  
  return NextResponse.json({
    hasApiKey: !!apiKey,
    apiKeyFirstChars: apiKey ? `${apiKey.substring(0, 3)}...` : 'Not set',
    allEnvKeys: Object.keys(process.env).filter(key => 
      !key.startsWith('npm_') && 
      !key.startsWith('NODE_')
    )
  });
}
