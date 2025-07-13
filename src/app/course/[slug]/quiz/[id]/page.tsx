"use client";

import React, { useState } from "react";
import Button from "../../../../../components/ui/Button";
import Card from "../../../../../components/ui/Card";

// Demo quiz data
const demoQuiz = {
  id: "8",
  name: "Family Members Quiz",
  courseName: "Spanish Basics",
  courseSlug: "spanish-basics",
  questions: [
    {
      id: 1,
      question: 'What is the Spanish word for "Father"?',
      options: ["Madre", "Padre", "Hermano", "Abuelo"],
      correct: 1,
    },
    {
      id: 2,
      question: 'How do you say "Sister" in Spanish?',
      options: ["Hermano", "Hermana", "Tía", "Prima"],
      correct: 1,
    },
    {
      id: 3,
      question: 'What does "Abuela" mean?',
      options: ["Grandfather", "Grandmother", "Aunt", "Mother"],
      correct: 1,
    },
    {
      id: 4,
      question: 'Which word means "Uncle" in Spanish?',
      options: ["Tío", "Tía", "Primo", "Abuelo"],
      correct: 0,
    },
    {
      id: 5,
      question: 'What is the correct translation for "My brother"?',
      options: ["Mi hermana", "Mi hermano", "Mi padre", "Mi madre"],
      correct: 1,
    },
  ],
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQ = demoQuiz.questions[currentQuestion];
  const totalQuestions = demoQuiz.questions.length;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === demoQuiz.questions[index].correct) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const score = calculateScore();

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
              Quiz {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {demoQuiz.name}
          </h1>
          <p className="text-gray-600">Course: {demoQuiz.courseName}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Quiz Progress</span>
            <span>
              {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300 bg-purple-600"
              style={{
                width: `${((currentQuestion + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        {!showResults ? (
          <>
            {/* Question Card */}
            <Card className="mb-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Question {currentQuestion + 1}
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  {currentQ.question}
                </p>

                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border transition-colors ${
                        answers[currentQuestion] === index
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQuestion] === index
                              ? "border-purple-500 bg-purple-500"
                              : "border-gray-300"
                          }`}
                        >
                          {answers[currentQuestion] === index && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              <div className="flex space-x-3">
                {currentQuestion < totalQuestions - 1 ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleNext}
                    disabled={answers[currentQuestion] === undefined}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={answers.some((answer) => answer === undefined)}
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <Card>
            <div className="text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">
                  {score >= 80 ? "🎉" : score >= 60 ? "👍" : "📚"}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Quiz Complete!
                </h2>
                <p className="text-gray-600 mb-4">
                  You scored {score}% on this quiz
                </p>
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  {score}%
                </div>
                <div className="text-sm text-gray-500">
                  {score >= 80
                    ? "Excellent work!"
                    : score >= 60
                      ? "Good job! Keep practicing."
                      : "Keep studying! You'll get better with practice."}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      answers.filter(
                        (answer, index) =>
                          answer === demoQuiz.questions[index].correct,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-700">Correct Answers</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      answers.filter(
                        (answer, index) =>
                          answer !== demoQuiz.questions[index].correct,
                      ).length
                    }
                  </div>
                  <div className="text-sm text-red-700">Incorrect Answers</div>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => alert("Demo: Review quiz answers")}
                >
                  Review Answers
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => alert("Demo: Continue to next stage")}
                >
                  Continue Learning
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
