"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

// Demo user data
const demoUser = {
  id: "1",
  email: "john.doe@example.com",
  fullName: "John Doe",
  avatarUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  preferences: {
    theme: "light",
    notifications: true,
    language: "en",
  },
  stats: {
    totalCourses: 4,
    completedCourses: 1,
    totalStages: 36,
    completedStages: 18,
    totalQuizzes: 36,
    completedQuizzes: 18,
    averageScore: 85,
  },
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: demoUser.fullName,
    email: demoUser.email,
    theme: demoUser.preferences.theme,
    notifications: demoUser.preferences.notifications,
    language: demoUser.preferences.language,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    alert("Demo: Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: demoUser.fullName,
      email: demoUser.email,
      theme: demoUser.preferences.theme,
      notifications: demoUser.preferences.notifications,
      language: demoUser.preferences.language,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Basic Information
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={demoUser.avatarUrl}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {demoUser.fullName}
                      </h3>
                      <p className="text-gray-600">{demoUser.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={demoUser.avatarUrl}
                      alt="Profile"
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full"
                    />
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  </div>

                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <div className="flex space-x-3 pt-4">
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Preferences */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Preferences
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Enable email notifications
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Learning Stats
              </h2>

              <div className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {demoUser.stats.averageScore}%
                  </div>
                  <div className="text-sm text-blue-700">Average Score</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {demoUser.stats.completedCourses}
                    </div>
                    <div className="text-xs text-green-700">
                      Courses Completed
                    </div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                      {demoUser.stats.totalCourses}
                    </div>
                    <div className="text-xs text-purple-700">Total Courses</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stages Completed:</span>
                    <span className="font-medium">
                      {demoUser.stats.completedStages}/
                      {demoUser.stats.totalStages}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quizzes Completed:</span>
                    <span className="font-medium">
                      {demoUser.stats.completedQuizzes}/
                      {demoUser.stats.totalQuizzes}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => alert("Demo: Export learning data")}
                >
                  Export Learning Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => alert("Demo: Download certificates")}
                >
                  Download Certificates
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => alert("Demo: View learning history")}
                >
                  Learning History
                </Button>
              </div>
            </Card>

            {/* Account Actions */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Account
              </h2>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => alert("Demo: Change password")}
                >
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={() => alert("Demo: Delete account")}
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
