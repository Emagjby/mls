"use client";

import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Notification from "../components/ui/Notification";
import { logSessionInfo } from "@/utils/supabase/client-logger";

// Demo data
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
  },
];

export default function HomePage() {
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
    isVisible: boolean;
  }>({
    type: "info",
    title: "",
    message: "",
    isVisible: false,
  });

  useEffect(() => {
    // Log session info once on page load
    logSessionInfo();
  }, []);

  useEffect(() => {
    // Check if user came from email confirmation
    const urlParams = new URLSearchParams(window.location.search);
    const emailConfirmed = urlParams.get("emailConfirmed");
    const message = urlParams.get("message");

    if (emailConfirmed === "true") {
      setNotification({
        type: "success",
        title: "Email Confirmed",
        message: "Your email address has been successfully confirmed!",
        isVisible: true,
      });

      // Clean up the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("emailConfirmed");
      window.history.replaceState({}, "", newUrl.toString());
    } else if (message) {
      // Handle the old email confirmation message
      setNotification({
        type: "info",
        title: "Email Confirmation",
        message: decodeURIComponent(message),
        isVisible: true,
      });

      // Clean up the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("message");
      window.history.replaceState({}, "", newUrl.toString());
    }
  }, []);

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to MLS Framework
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A powerful learning engine that provides modular learning
              experiences. This demo shows how the engine can be used to create
              engaging learning content.
            </p>
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Courses
          </h2>
          <p className="text-gray-600">
            Track your progress across different learning modules
          </p>
        </div>

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
                    <h3 className="font-semibold text-gray-900">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: course.color,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {course.completedStages} of {course.totalStages} stages
                  completed
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => alert(`Demo: Continue ${course.name}`)}
                >
                  Continue
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

        {/* Demo Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Demo Information
          </h3>
          <p className="text-blue-800 mb-4">
            This is a demo UI for the MLS Framework. The components are fully
            functional but not connected to any backend. You can:
          </p>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• Click buttons to see demo interactions</li>
            <li>• Navigate between pages (when created)</li>
            <li>• See how the UI components work</li>
            <li>• Test form validation and user interactions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
