import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/itineraryStore';

export async function GET(request: NextRequest) {
  try {
    // Get the job ID from the query parameters
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      console.log('No job ID provided');
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Get the job from the store
    const job = getJob(jobId);
    
    if (!job) {
      console.log(`Job not found: ${jobId}`);
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Return the job status
    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      // Only include the result if the job is completed
      ...(job.status === 'completed' ? { result: job.result } : {}),
      // Only include the error if the job failed
      ...(job.status === 'failed' ? { error: job.error } : {})
    });
    
  } catch (error: unknown) {
    console.error('Error in status endpoint:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to get job status: ${errorMessage}` },
      { status: 500 }
    );
  }
}
