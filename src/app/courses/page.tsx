"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import { fetchCourses, Course } from "../../utils/courses";

export default function CoursesPage() {
  const router = useRouter();
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section Skeleton */}
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-3xl animate-pulse"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Filters Skeleton */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-100 dark:border-gray-700">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-xl mx-1 animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Courses Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                {/* Progress Bar Skeleton */}
                <div className="w-1/3 h-1 bg-gray-200 dark:bg-gray-700 rounded-t-3xl mb-6 animate-pulse"></div>

                {/* Course Icon Skeleton */}
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 animate-pulse"></div>

                {/* Course Title Skeleton */}
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse"></div>

                {/* Course Description Skeleton */}
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>

                {/* Course Stats Skeleton */}
                <div className="space-y-3 mb-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between">
                      <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-12 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>

                {/* Action Button Skeleton */}
                <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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

  const filteredCourses =
    activeFilter === "all"
      ? courses
      : courses.filter((course) => course.difficulty === activeFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore Courses
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Master new skills with our carefully crafted learning modules
          </p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-100 dark:border-gray-700">
            <Button
              variant={activeFilter === "all" ? "primary" : "ghost"}
              size="sm"
              className="rounded-xl mr-2"
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button
              variant={activeFilter === "Beginner" ? "primary" : "ghost"}
              size="sm"
              className="rounded-xl mx-1"
              onClick={() => setActiveFilter("Beginner")}
            >
              Beginner
            </Button>
            <Button
              variant={activeFilter === "Intermediate" ? "primary" : "ghost"}
              size="sm"
              className="rounded-xl mx-1"
              onClick={() => setActiveFilter("Intermediate")}
            >
              Intermediate
            </Button>
            <Button
              variant={activeFilter === "Advanced" ? "primary" : "ghost"}
              size="sm"
              className="rounded-xl ml-2"
              onClick={() => setActiveFilter("Advanced")}
            >
              Advanced
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => router.push(`/course/${course.slug}`)}
              >
                {/* Progress Bar */}
                {course.progress > 0 && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-3xl"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                )}

                {/* Course Icon */}
                <div className="mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                    style={{ backgroundColor: course.color + "20" }}
                  >
                    {course.icon}
                  </div>
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.name}
                </h3>

                {/* Course Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Difficulty
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {course.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Duration
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Stages
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {course.totalStages}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant="primary"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  {course.progress > 0 ? "Continue Learning" : "Start Course"}
                </Button>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
