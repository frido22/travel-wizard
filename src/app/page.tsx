import VacationPlanner from "@/components/VacationPlanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2">The Itinerarist</h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-8">Your quirky but thorough vacation planning assistant</p>
        <VacationPlanner />
      </main>
    </div>
  );
}
