// Simple in-memory store for itinerary generation jobs
// In a production environment, this would be replaced with a database

import { v4 as uuidv4 } from 'uuid';
import { FormInputs } from '@/types/itinerary';

export interface ItineraryJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  prompt: string;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  formData?: FormInputs;
}

// In-memory store
const jobs = new Map<string, ItineraryJob>();

export const createJob = (prompt: string, formData?: FormInputs): ItineraryJob => {
  const id = uuidv4();
  const job: ItineraryJob = {
    id,
    status: 'pending',
    prompt,
    createdAt: new Date(),
    updatedAt: new Date(),
    formData
  };
  
  jobs.set(id, job);
  return job;
};

export const getJob = (id: string): ItineraryJob | undefined => {
  return jobs.get(id);
};

export const updateJob = (id: string, updates: Partial<ItineraryJob>): ItineraryJob | undefined => {
  const job = jobs.get(id);
  if (!job) return undefined;
  
  const updatedJob = {
    ...job,
    ...updates,
    updatedAt: new Date()
  };
  
  jobs.set(id, updatedJob);
  return updatedJob;
};

export const deleteJob = (id: string): boolean => {
  return jobs.delete(id);
};

// Clean up old jobs (optional, can be called periodically)
export const cleanupOldJobs = (maxAgeHours = 24): void => {
  const now = new Date();
  const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert hours to milliseconds
  
  jobs.forEach((job, id) => {
    const jobAge = now.getTime() - job.createdAt.getTime();
    if (jobAge > maxAge) {
      jobs.delete(id);
    }
  });
};
