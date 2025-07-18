"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";
import AvatarUpload from "../../components/ui/AvatarUpload";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/utils/auth/profile";
import { getUserStats } from "@/utils/auth/stats";
import { generateAvatar } from "@/utils/avatar";
import {
  uploadAvatar,
  getAvatarUrl,
  deleteAvatar,
} from "@/utils/avatar-upload";
import {
  updateProfile,
  validateProfileData,
} from "@/utils/auth/profile-update";
import {
  updatePreferencesWithoutTheme,
  validatePreferencesWithoutTheme,
  type UserPreferences,
} from "@/utils/auth/preferences-update";
import Notification from "@/components/ui/Notification";

// User profile type
interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string | null;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    language?: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface UserStats {
  total_courses: number;
  completed_courses: number;
  total_stages: number;
  completed_stages: number;
  total_quizzes: number;
  completed_quizzes: number;
  average_score: number;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAvatarCropperOpen, setIsAvatarCropperOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
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

  // Load profile and stats
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        Promise.all([
          getUserProfile(user.id),
          getUserStats(user.id),
          getAvatarUrl(user.id),
        ])
          .then(([profileData, statsData, avatarData]) => {
            setProfile(profileData.profile);
            setStats(statsData.stats.stats);
            setAvatarUrl(avatarData);
            if (profileData.profile && profileData.profile.full_name !== "") {
              setIsLoading(false);
            }
          })
          .catch(() => {
            setIsLoading(false);
          });
      });

      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Update formData and preferencesData when profile loads
  useEffect(() => {
    if (profile != null) {
      setFormData({
        fullName: profile.full_name ?? "",
        email: profile.email ?? "",
        notifications: profile.preferences?.notifications ?? true,
        language: profile.preferences?.language ?? "en",
      });

      setPreferencesData({
        language:
          (profile.preferences?.language as "en" | "es" | "fr" | "de") ?? "en",
        notifications: profile.preferences?.notifications ?? true,
      });
    }
  }, [profile]);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    notifications: true,
    language: "en" as string,
  });
  const [preferencesData, setPreferencesData] = useState<
    Omit<UserPreferences, "theme">
  >({
    language: "en",
    notifications: true,
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

  const handlePreferencesChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setPreferencesData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAvatarChange = async (file: File | null) => {
    if (!user?.id) return;

    if (file) {
      setIsUploadingAvatar(true);
      try {
        const result = await uploadAvatar(file, user.id);
        if (result.success && result.url) {
          setAvatarUrl(result.url);
          // Update profile with new avatar URL
          setProfile((prev) =>
            prev ? { ...prev, avatar_url: result.url } : null,
          );
          // Show success notification
          setNotification({
            type: "success",
            title: "Avatar Updated",
            message: "Your avatar has been uploaded successfully",
            isVisible: true,
          });
          // Refresh avatar URL after a short delay to ensure consistency
          setTimeout(() => {
            refreshAvatarUrl();
          }, 1000);
        } else {
          setNotification({
            type: "error",
            title: "Upload Failed",
            message: result.error || "Failed to upload avatar",
            isVisible: true,
          });
        }
      } catch (error) {
        console.error("Avatar upload error:", error);
        setNotification({
          type: "error",
          title: "Upload Error",
          message: "Failed to upload avatar. Please try again.",
          isVisible: true,
        });
      } finally {
        setIsUploadingAvatar(false);
      }
    } else {
      // Handle avatar removal
      setIsUploadingAvatar(true);
      try {
        const success = await deleteAvatar(user.id);
        if (success) {
          setAvatarUrl(null);
          setProfile((prev) => (prev ? { ...prev, avatar_url: null } : null));
          // Show success notification
          setNotification({
            type: "success",
            title: "Avatar Removed",
            message: "Your avatar has been removed successfully",
            isVisible: true,
          });
          // Refresh avatar URL after a short delay to ensure consistency
          setTimeout(() => {
            refreshAvatarUrl();
          }, 1000);
        } else {
          setNotification({
            type: "error",
            title: "Removal Failed",
            message: "Failed to remove avatar. Please try again.",
            isVisible: true,
          });
        }
      } catch (error) {
        console.error("Avatar removal error:", error);
        setNotification({
          type: "error",
          title: "Removal Error",
          message: "Failed to remove avatar. Please try again.",
          isVisible: true,
        });
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  const refreshAvatarUrl = useCallback(async () => {
    if (user?.id) {
      const newUrl = await getAvatarUrl(user.id);
      setAvatarUrl(newUrl);
    }
  }, [user?.id]);

  // Refresh avatar URL when user changes
  useEffect(() => {
    if (user?.id) {
      refreshAvatarUrl();
    }
  }, [user?.id, refreshAvatarUrl]);

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSavePreferences = async () => {
    if (!user?.id) return;

    try {
      // Validate the preferences data
      const validation = validatePreferencesWithoutTheme(preferencesData);

      if (!validation.isValid) {
        setNotification({
          type: "error",
          title: "Validation Error",
          message: validation.error || "Please check your preferences",
          isVisible: true,
        });
        return;
      }

      // Show loading state
      setIsSavingPreferences(true);

      // Update the preferences (without theme)
      const result = await updatePreferencesWithoutTheme(
        user.id,
        preferencesData,
      );

      if (result.success) {
        setNotification({
          type: "success",
          title: "Preferences Updated",
          message:
            result.message || "Your preferences have been updated successfully",
          isVisible: true,
        });

        // Update local profile state
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                preferences: preferencesData,
              }
            : null,
        );

        // Exit edit mode
        setIsEditingPreferences(false);
      } else {
        setNotification({
          type: "error",
          title: "Update Failed",
          message: result.error || "Failed to update preferences",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      setNotification({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred while saving your preferences",
        isVisible: true,
      });
    } finally {
      // Reset loading state
      setIsSavingPreferences(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate the form data
      const validation = validateProfileData({
        fullName: formData.fullName,
        email: formData.email,
      });

      if (!validation.isValid) {
        setNotification({
          type: "error",
          title: "Validation Error",
          message: validation.error || "Please check your input",
          isVisible: true,
        });
        return;
      }

      // Show loading state
      setIsSavingProfile(true);

      // Update the profile
      const result = await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
      });

      if (result.success) {
        // Show appropriate message based on what was updated
        if (result.emailChanged) {
          setNotification({
            type: "info",
            title: "Email Update",
            message:
              result.message || "Please check your email for confirmation",
            isVisible: true,
          });
        } else {
          setNotification({
            type: "success",
            title: "Profile Updated",
            message:
              result.message || "Your profile has been updated successfully",
            isVisible: true,
          });
        }

        // Update local state
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                full_name: formData.fullName,
                email: formData.email,
              }
            : null,
        );

        // Exit edit mode
        setIsEditing(false);
      } else {
        setNotification({
          type: "error",
          title: "Update Failed",
          message: result.error || "Failed to update profile",
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setNotification({
        type: "error",
        title: "Error",
        message: "An unexpected error occurred while saving your profile",
        isVisible: true,
      });
    } finally {
      // Reset loading state
      setIsSavingProfile(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.full_name ?? "",
      email: profile?.email ?? "",
      notifications: profile?.preferences?.notifications ?? true,
      language: profile?.preferences?.language ?? "en",
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    {isLoading || profile == null ? (
                      <>
                        <Skeleton className="w-20 h-20 rounded-full" />
                      </>
                    ) : (
                      <>
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={`${profile?.full_name || "User"} avatar`}
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full"
                          />
                        ) : (
                          <div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                            style={{
                              backgroundColor: generateAvatar(
                                profile?.full_name,
                              ).bgColor,
                            }}
                          >
                            {generateAvatar(profile?.full_name).letter}
                          </div>
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {profile?.full_name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {profile?.email}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <AvatarUpload
                    currentAvatarUrl={avatarUrl}
                    userName={profile?.full_name}
                    onAvatarChange={handleAvatarChange}
                    size="md"
                    disabled={isUploadingAvatar}
                    onCropperOpenChange={setIsAvatarCropperOpen} // NEW
                  />

                  {isUploadingAvatar && (
                    <div className="text-sm text-blue-600 dark:text-blue-400 text-center">
                      Uploading avatar...
                    </div>
                  )}

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
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </Button>
                    {/* Hide Cancel if cropper is open */}
                    {!isAvatarCropperOpen && (
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSavingProfile}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Preferences */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Preferences
                </h2>
                {!isEditingPreferences && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingPreferences(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>

              {!isEditingPreferences ? (
                <div className="space-y-4">
                  {isLoading || profile == null ? (
                    <>
                      <div>
                        <Skeleton className="w-16 h-4 mb-1" />
                        <Skeleton className="w-24 h-5" />
                      </div>
                      <div>
                        <Skeleton className="w-20 h-4 mb-1" />
                        <Skeleton className="w-20 h-5" />
                      </div>
                      <div>
                        <Skeleton className="w-32 h-4 mb-1" />
                        <Skeleton className="w-16 h-5" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Language
                        </label>
                        <p className="text-gray-900 dark:text-white capitalize">
                          {preferencesData.language}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Notifications
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {preferencesData.notifications
                            ? "Enabled"
                            : "Disabled"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={preferencesData.language}
                      onChange={handlePreferencesChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      checked={preferencesData.notifications}
                      onChange={handlePreferencesChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Enable email notifications
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      variant="primary"
                      onClick={handleSavePreferences}
                      disabled={isSavingPreferences}
                    >
                      {isSavingPreferences ? "Saving..." : "Save Preferences"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingPreferences(false)}
                      disabled={isSavingPreferences}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Learning Stats
              </h2>

              <div className="space-y-4">
                {isLoading || profile == null ? (
                  <>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Skeleton className="w-16 h-7 mx-auto mb-2" />
                      <Skeleton className="w-24 h-4 mx-auto" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Skeleton className="w-20 h-3 mx-auto my-1.5 " />
                        <Skeleton className="w-8 h-8 mx-auto" />
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Skeleton className="w-16 h-3 mx-auto my-1.5" />
                        <Skeleton className="w-8 h-8 mx-auto" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="w-32 h-4 mb-1" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="w-32 h-4 mb-1" />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats?.average_score || 0}%
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        Average Score
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {stats?.completed_courses || 0}
                        </div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Courses Completed
                        </div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {stats?.total_courses || 0}
                        </div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">
                          Total Courses
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Stages Completed:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stats?.completed_stages || 0}/
                          {stats?.total_stages || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Quizzes Completed:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stats?.completed_quizzes || 0}/
                          {stats?.total_quizzes || 0}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
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
                  className="w-full text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
