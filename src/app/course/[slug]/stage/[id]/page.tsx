"use client";

import React, { useState } from "react";
import Button from "../../../../../components/ui/Button";
import Card from "../../../../../components/ui/Card";

// Demo stage data
const demoStage = {
  id: "7",
  name: "Family Members",
  content: `# Family Members in Spanish

Learn the essential family member vocabulary in Spanish.

## Basic Family Members

- **Padre** = Father
- **Madre** = Mother
- **Hermano** = Brother
- **Hermana** = Sister
- **Abuelo** = Grandfather
- **Abuela** = Grandmother
- **Tío** = Uncle
- **Tía** = Aunt
- **Primo** = Cousin (male)
- **Prima** = Cousin (female)

## Example Sentences

- Mi padre se llama Carlos. (My father&apos;s name is Carlos.)
- Tengo dos hermanos. (I have two brothers.)
- Mi abuela vive en Madrid. (My grandmother lives in Madrid.)

## Practice

Try saying these family relationships in Spanish:
- My mother and father
- My brother and sister
- My grandparents

Remember: Family is very important in Spanish culture, so these words are used frequently!`,
  courseName: "Spanish Basics",
  courseSlug: "spanish-basics",
  orderIndex: 7,
  totalStages: 16,
};

export default function LearningStagePage() {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
    alert("Demo: Stage completed! You can now take the quiz.");
  };

  const handleContinue = () => {
    alert("Demo: Continue to next stage or quiz");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Demo: Back to course")}
            >
              ← Back to Course
            </Button>
            <div className="text-sm text-gray-500">
              Stage {demoStage.orderIndex} of {demoStage.totalStages}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {demoStage.name}
          </h1>
          <p className="text-gray-600">Course: {demoStage.courseName}</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Course Progress</span>
            <span>
              {Math.round((demoStage.orderIndex / demoStage.totalStages) * 100)}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-blue-600"
              style={{
                width: `${(demoStage.orderIndex / demoStage.totalStages) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Content Card */}
        <Card className="mb-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-700 leading-relaxed">
              {demoStage.content}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => alert("Demo: Previous stage")}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => alert("Demo: Save progress")}
            >
              Save Progress
            </Button>
          </div>

          <div className="flex space-x-3">
            {!isCompleted ? (
              <Button variant="primary" size="lg" onClick={handleComplete}>
                Mark as Complete
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={handleContinue}>
                Continue to Quiz
              </Button>
            )}
          </div>
        </div>

        {/* Completion Status */}
        {isCompleted && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className="font-semibold text-green-900">
                  Stage Completed!
                </h3>
                <p className="text-green-700">
                  Great job! You can now proceed to the quiz.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Help */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Navigation Tips</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>
              • Use &quot;Mark as Complete&quot; when you&apos;ve finished
              reading
            </li>
            <li>• After completion, you&apos;ll be able to take the quiz</li>
            <li>• You can review previous stages anytime</li>
            <li>• Progress is automatically saved</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
