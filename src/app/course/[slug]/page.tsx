"use client";

import React from "react";
import Button from "../../../components/ui/Button";

// Demo course data
const demoCourse = {
  id: "1",
  name: "Spanish Basics",
  description:
    "Learn fundamental Spanish vocabulary and grammar through interactive lessons and quizzes.",
  icon: "🇪🇸",
  color: "#3B82F6",
  progress: 75,
  totalStages: 8,
  completedStages: 6,
  totalQuizzes: 8,
  completedQuizzes: 6,
  difficulty: "Beginner",
  duration: "2 hours",
  stages: [
    { id: "1", name: "Greetings", completed: true, type: "stage" },
    { id: "2", name: "Greetings Quiz", completed: true, type: "quiz" },
    { id: "3", name: "Numbers 1-10", completed: true, type: "stage" },
    { id: "4", name: "Numbers Quiz", completed: true, type: "quiz" },
    { id: "5", name: "Colors", completed: true, type: "stage" },
    { id: "6", name: "Colors Quiz", completed: true, type: "quiz" },
    { id: "7", name: "Family Members", completed: false, type: "stage" },
    { id: "8", name: "Family Quiz", completed: false, type: "quiz" },
    { id: "9", name: "Food & Drinks", completed: false, type: "stage" },
    { id: "10", name: "Food Quiz", completed: false, type: "quiz" },
    { id: "11", name: "Weather", completed: false, type: "stage" },
    { id: "12", name: "Weather Quiz", completed: false, type: "quiz" },
    { id: "13", name: "Daily Activities", completed: false, type: "stage" },
    { id: "14", name: "Activities Quiz", completed: false, type: "quiz" },
    { id: "15", name: "Final Review", completed: false, type: "stage" },
    { id: "16", name: "Final Quiz", completed: false, type: "quiz" },
  ],
};

export default function CourseDetailPage() {
  const getStatusIcon = (completed: boolean, type: string) => {
    if (completed) {
      return "✅";
    }
    return type === "stage" ? "📖" : "📝";
  };

  const getStatusText = (completed: boolean, type: string) => {
    if (completed) {
      return "Completed";
    }
    return type === "stage" ? "Not Started" : "Locked";
  };

  const getNextItem = () => {
    return demoCourse.stages.find((stage) => !stage.completed);
  };

  const nextItem = getNextItem();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
              style={{ backgroundColor: demoCourse.color + "20" }}
            >
              {demoCourse.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {demoCourse.name}
              </h1>
              <p className="text-gray-600 mb-4">{demoCourse.description}</p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {demoCourse.difficulty}
                  </div>
                  <div className="text-sm text-gray-500">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {demoCourse.duration}
                  </div>
                  <div className="text-sm text-gray-500">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {demoCourse.totalStages}
                  </div>
                  <div className="text-sm text-gray-500">Stages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {demoCourse.totalQuizzes}
                  </div>
                  <div className="text-sm text-gray-500">Quizzes</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Overall Progress</span>
                  <span>{demoCourse.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${demoCourse.progress}%`,
                      backgroundColor: demoCourse.color,
                    }}
                  />
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {demoCourse.completedStages + demoCourse.completedQuizzes} of{" "}
                  {demoCourse.totalStages + demoCourse.totalQuizzes} items
                  completed
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {nextItem ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => alert(`Demo: Continue to ${nextItem.name}`)}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => alert("Demo: Course completed!")}
                  >
                    Course Complete
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => alert("Demo: Restart course")}
                >
                  Restart Course
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Course Content
          </h2>

          <div className="space-y-3">
            {demoCourse.stages.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center p-4 rounded-lg border transition-colors ${
                  stage.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-2xl">
                    {getStatusIcon(stage.completed, stage.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {stage.name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          stage.type === "quiz"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {stage.type === "quiz" ? "Quiz" : "Lesson"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getStatusText(stage.completed, stage.type)}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {stage.completed ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Demo: Review ${stage.name}`)}
                    >
                      Review
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => alert(`Demo: Start ${stage.name}`)}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
