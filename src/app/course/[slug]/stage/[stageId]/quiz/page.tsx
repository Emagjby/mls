"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

// Mock quiz data
const mockQuizzes = {
  "1": {
    title: "Greetings and Introductions Quiz",
    questions: [
      {
        id: "1",
        question: "What does 'Hola' mean in English?",
        options: ["Goodbye", "Hello", "Thank you", "Please"],
        correctAnswer: 1,
        explanation: "'Hola' is the most common way to say 'Hello' in Spanish.",
      },
      {
        id: "2",
        question: "How do you say 'My name is' in Spanish?",
        options: ["Soy", "Me llamo", "Es", "Tengo"],
        correctAnswer: 1,
        explanation:
          "'Me llamo' literally means 'I call myself' and is used to say 'My name is'.",
      },
      {
        id: "3",
        question: "What does '¿Cómo estás?' mean?",
        options: [
          "What is your name?",
          "How are you?",
          "Where are you from?",
          "How old are you?",
        ],
        correctAnswer: 1,
        explanation:
          "'¿Cómo estás?' is the informal way to ask 'How are you?' in Spanish.",
      },
      {
        id: "4",
        question: "Which phrase means 'Nice to meet you'?",
        options: ["Por favor", "Gracias", "Mucho gusto", "De nada"],
        correctAnswer: 2,
        explanation:
          "'Mucho gusto' literally means 'much pleasure' and is used to say 'Nice to meet you'.",
      },
      {
        id: "5",
        question: "What does 'Buenos días' mean?",
        options: [
          "Good afternoon",
          "Good morning",
          "Good night",
          "Good evening",
        ],
        correctAnswer: 1,
        explanation: "'Buenos días' is used to say 'Good morning' in Spanish.",
      },
    ],
    passingScore: 80,
  },
  "2": {
    title: "Numbers 1-10 Quiz",
    questions: [
      {
        id: "1",
        question: "What is the Spanish word for 'one'?",
        options: ["Dos", "Uno", "Tres", "Cuatro"],
        correctAnswer: 1,
        explanation: "'Uno' is the Spanish word for 'one'.",
      },
      {
        id: "2",
        question: "How do you say 'five' in Spanish?",
        options: ["Cuatro", "Cinco", "Seis", "Siete"],
        correctAnswer: 1,
        explanation: "'Cinco' is the Spanish word for 'five'.",
      },
      {
        id: "3",
        question: "What is 'diez' in English?",
        options: ["Eight", "Nine", "Ten", "Eleven"],
        correctAnswer: 2,
        explanation: "'Diez' is the Spanish word for 'ten'.",
      },
    ],
    passingScore: 80,
  },
  "3": {
    title: "Colors Quiz",
    questions: [
      {
        id: "1",
        question: "What is the Spanish word for 'red'?",
        options: ["Azul", "Rojo", "Verde", "Amarillo"],
        correctAnswer: 1,
        explanation: "'Rojo' is the Spanish word for 'red'.",
      },
      {
        id: "2",
        question: "How do you say 'blue' in Spanish?",
        options: ["Verde", "Azul", "Amarillo", "Negro"],
        correctAnswer: 1,
        explanation: "'Azul' is the Spanish word for 'blue'.",
      },
      {
        id: "3",
        question: "What is 'verde' in English?",
        options: ["Green", "Yellow", "Blue", "Red"],
        correctAnswer: 0,
        explanation: "'Verde' is the Spanish word for 'green'.",
      },
    ],
    passingScore: 80,
  },
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const { slug, stageId } = params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const courseSlug = slug as string;
  const currentStageId = stageId as string;
  const quiz = mockQuizzes[currentStageId as keyof typeof mockQuizzes];

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Quiz Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The quiz for this stage doesn&apos;t exist.
          </p>
          <Button
            variant="primary"
            onClick={() =>
              router.push(`/course/${courseSlug}/stage/${currentStageId}`)
            }
          >
            Back to Lesson
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowResults(true);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });
    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const score = calculateScore();
  const passed = score >= quiz.passingScore;

  const handleContinue = () => {
    // Navigate to next stage or back to course
    const nextStageId = parseInt(currentStageId) + 1;
    const nextStageKey = nextStageId.toString() as keyof typeof mockQuizzes;
    if (mockQuizzes[nextStageKey]) {
      router.push(`/course/${courseSlug}/stage/${nextStageId}`);
    } else {
      router.push(`/course/${courseSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <button
            onClick={() => router.push(`/course/${courseSlug}`)}
            className="hover:text-gray-700 transition-colors"
          >
            Spanish Basics
          </button>
          <span>›</span>
          <button
            onClick={() =>
              router.push(`/course/${courseSlug}/stage/${currentStageId}`)
            }
            className="hover:text-gray-700 transition-colors"
          >
            Stage {currentStageId}
          </button>
          <span>›</span>
          <span className="text-gray-900">Quiz</span>
        </nav>

        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {quiz.title}
          </h1>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className="text-sm text-gray-600">
              Passing Score: {quiz.passingScore}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!showResults ? (
          /* Question View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    userAnswers[currentQuestionIndex] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium text-gray-900">{option}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </Button>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/course/${courseSlug}/stage/${currentStageId}`)
                  }
                >
                  Back to Lesson
                </Button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <Button
                    variant="primary"
                    onClick={handleNextQuestion}
                    disabled={userAnswers[currentQuestionIndex] === undefined}
                  >
                    Next Question →
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmitQuiz}
                    disabled={
                      userAnswers.some((answer) => answer === undefined) ||
                      isSubmitting
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center mb-8">
              <div
                className={`text-6xl mb-4 ${passed ? "text-green-500" : "text-red-500"}`}
              >
                {passed ? "🎉" : "😔"}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {passed ? "Congratulations!" : "Keep Learning!"}
              </h2>
              <p className="text-gray-600 mb-4">
                You scored {score}% on this quiz.
              </p>
              <div
                className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
              >
                {passed
                  ? "You passed!"
                  : `You need ${quiz.passingScore}% to pass`}
              </div>
            </div>

            {/* Question Review */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-bold text-gray-900">
                Question Review
              </h3>
              {quiz.questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      isCorrect
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`text-xl ${isCorrect ? "text-green-500" : "text-red-500"}`}
                      >
                        {isCorrect ? "✅" : "❌"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {question.question}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Your answer:{" "}
                          <span className="font-medium">
                            {question.options[userAnswer]}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm text-gray-600 mb-2">
                            Correct answer:{" "}
                            <span className="font-medium text-green-600">
                              {question.options[question.correctAnswer]}
                            </span>
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          {question.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/course/${courseSlug}/stage/${currentStageId}`)
                }
              >
                Review Lesson
              </Button>

              {passed ? (
                <Button variant="primary" onClick={handleContinue}>
                  Continue to Next Stage →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowResults(false);
                    setCurrentQuestionIndex(0);
                    setUserAnswers([]);
                  }}
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
