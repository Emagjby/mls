"use client";

import React, { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { fetchCourses, Course } from "../../utils/courses";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
      } catch (err) {
        setError("Failed to load courses");
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Loading courses...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <Button
            variant={activeFilter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All Courses
          </Button>
          <Button
            variant={activeFilter === "Beginner" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("Beginner")}
          >
            Beginner
          </Button>
          <Button
            variant={activeFilter === "Intermediate" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("Intermediate")}
          >
            Intermediate
          </Button>
          <Button
            variant={activeFilter === "Advanced" ? "primary" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("Advanced")}
          >
            Advanced
          </Button>
        </div>

        {/* Filtered Courses */}
        {(() => {
          const filteredCourses =
            activeFilter === "all"
              ? courses
              : courses.filter((course) => course.difficulty === activeFilter);

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    📚
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {courses.length === 0
                      ? "No courses available"
                      : `No ${activeFilter.toLowerCase()} courses found`}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {courses.length === 0
                      ? "Check back later for new learning modules"
                      : "Try selecting a different difficulty level"}
                  </p>
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-md transition-shadow flex flex-col h-full"
                  >
                    {/* Top Section - Icon, Name, Description */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ backgroundColor: course.color + "20" }}
                        >
                          {course.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {course.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Section - Course Info and Actions */}
                    <div className="mt-auto">
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

                      {/* Action Buttons */}
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
                          onClick={() =>
                            alert(`Demo: View ${course.name} details`)
                          }
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
