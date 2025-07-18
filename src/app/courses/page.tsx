"use client";

import React from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

// Demo courses data
const demoCourses = [
  {
    id: "1",
    name: "Spanish Basics",
    description: "Learn fundamental Spanish vocabulary and grammar",
    icon: "🇪🇸",
    color: "#3B82F6",
    progress: 75,
    totalStages: 8,
    completedStages: 6,
    difficulty: "Beginner",
    duration: "2 hours",
  },
  {
    id: "2",
    name: "Math Fundamentals",
    description: "Master basic mathematics and problem-solving",
    icon: "🧮",
    color: "#10B981",
    progress: 45,
    totalStages: 10,
    completedStages: 4,
    difficulty: "Intermediate",
    duration: "3 hours",
  },
  {
    id: "3",
    name: "Science Intro",
    description: "Explore scientific concepts and experiments",
    icon: "🔬",
    color: "#F59E0B",
    progress: 20,
    totalStages: 6,
    completedStages: 1,
    difficulty: "Beginner",
    duration: "1.5 hours",
  },
  {
    id: "4",
    name: "Programming Basics",
    description: "Learn the fundamentals of programming",
    icon: "💻",
    color: "#8B5CF6",
    progress: 0,
    totalStages: 12,
    completedStages: 0,
    difficulty: "Beginner",
    duration: "4 hours",
  },
];

export default function CoursesPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Courses
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore all available learning modules
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <Button variant="primary" size="sm">
            All Courses
          </Button>
          <Button variant="outline" size="sm">
            Beginner
          </Button>
          <Button variant="outline" size="sm">
            Intermediate
          </Button>
          <Button variant="outline" size="sm">
            Advanced
          </Button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: course.color + "20" }}
                  >
                    {course.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Difficulty:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.difficulty}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Duration:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.duration}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Stages:
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {course.totalStages}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${course.progress}%`,
                        backgroundColor: course.color,
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {course.completedStages} of {course.totalStages} stages
                    completed
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    alert(
                      `Demo: ${course.progress > 0 ? "Continue" : "Start"} ${course.name}`,
                    )
                  }
                >
                  {course.progress > 0 ? "Continue" : "Start"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Demo: View ${course.name} details`)}
                >
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
