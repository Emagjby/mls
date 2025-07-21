"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

// Mock stage data - we'll replace this with real data later
const mockStages = {
  "spanish-basics": [
    {
      id: "1",
      title: "Greetings and Introductions",
      content: `
        <h2>Welcome to Spanish Basics!</h2>
        <p>In this lesson, you'll learn the most common Spanish greetings and how to introduce yourself.</p>
        
        <h3>Basic Greetings</h3>
        <ul>
          <li><strong>Hola</strong> - Hello</li>
          <li><strong>Buenos días</strong> - Good morning</li>
          <li><strong>Buenas tardes</strong> - Good afternoon</li>
          <li><strong>Buenas noches</strong> - Good night</li>
          <li><strong>¿Cómo estás?</strong> - How are you?</li>
        </ul>
        
        <h3>Introducing Yourself</h3>
        <ul>
          <li><strong>Me llamo [name]</strong> - My name is [name]</li>
          <li><strong>Soy [name]</strong> - I am [name]</li>
          <li><strong>Mucho gusto</strong> - Nice to meet you</li>
          <li><strong>Encantado/a</strong> - Delighted to meet you</li>
        </ul>
        
        <h3>Practice Examples</h3>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p><strong>Conversation 1:</strong></p>
          <p>A: ¡Hola! ¿Cómo estás?</p>
          <p>B: ¡Hola! Muy bien, gracias. ¿Y tú?</p>
          <p>A: Muy bien también. Me llamo María.</p>
          <p>B: Mucho gusto, María. Soy Juan.</p>
        </div>
      `,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Placeholder
      duration: 15,
      completed: false,
    },
    {
      id: "2",
      title: "Numbers 1-10",
      content: `
        <h2>Learning Numbers in Spanish</h2>
        <p>Numbers are essential for everyday communication. Let's learn the numbers from 1 to 10.</p>
        
        <h3>Numbers 1-10</h3>
        <ul>
          <li><strong>Uno</strong> - 1</li>
          <li><strong>Dos</strong> - 2</li>
          <li><strong>Tres</strong> - 3</li>
          <li><strong>Cuatro</strong> - 4</li>
          <li><strong>Cinco</strong> - 5</li>
          <li><strong>Seis</strong> - 6</li>
          <li><strong>Siete</strong> - 7</li>
          <li><strong>Ocho</strong> - 8</li>
          <li><strong>Nueve</strong> - 9</li>
          <li><strong>Diez</strong> - 10</li>
        </ul>
        
        <h3>Pronunciation Tips</h3>
        <p>Pay attention to the pronunciation of these numbers. The "r" in "tres" is rolled, and "cinco" has a soft "c" sound.</p>
      `,
      videoUrl: null,
      duration: 10,
      completed: false,
    },
    {
      id: "3",
      title: "Colors",
      content: `
        <h2>Colors in Spanish</h2>
        <p>Colors are everywhere! Learn the basic colors in Spanish.</p>
        
        <h3>Basic Colors</h3>
        <ul>
          <li><strong>Rojo</strong> - Red</li>
          <li><strong>Azul</strong> - Blue</li>
          <li><strong>Verde</strong> - Green</li>
          <li><strong>Amarillo</strong> - Yellow</li>
          <li><strong>Negro</strong> - Black</li>
          <li><strong>Blanco</strong> - White</li>
          <li><strong>Gris</strong> - Gray</li>
          <li><strong>Marrón</strong> - Brown</li>
        </ul>
      `,
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      duration: 12,
      completed: false,
    },
  ],
};

// Course name mapping
const courseNames = {
  "spanish-basics": "Spanish Basics",
  "javascript-fundamentals": "JavaScript Fundamentals",
  "python-basics": "Python Basics",
  "web-development": "Web Development",
};

export default function StagePage() {
  const params = useParams();
  const router = useRouter();
  const { slug, stageId } = params;

  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get course and stage data
  const courseSlug = slug as string;
  const currentStageId = stageId as string;
  const stages = mockStages[courseSlug as keyof typeof mockStages] || [];
  const currentStage = stages.find((stage) => stage.id === currentStageId);
  const currentStageIndex = stages.findIndex(
    (stage) => stage.id === currentStageId,
  );

  if (!currentStage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Stage Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The stage you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push(`/course/${courseSlug}`)}
          >
            Back to Course
          </Button>
        </div>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLessonCompleted(true);
    setIsLoading(false);
  };

  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      const nextStage = stages[currentStageIndex + 1];
      router.push(`/course/${courseSlug}/stage/${nextStage.id}`);
    } else {
      // Course completed
      router.push(`/course/${courseSlug}`);
    }
  };

  const handlePreviousStage = () => {
    if (currentStageIndex > 0) {
      const prevStage = stages[currentStageIndex - 1];
      router.push(`/course/${courseSlug}/stage/${prevStage.id}`);
    } else {
      router.push(`/course/${courseSlug}`);
    }
  };

  const handleTakeQuiz = () => {
    router.push(`/course/${courseSlug}/stage/${currentStageId}/quiz`);
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
            {courseNames[courseSlug as keyof typeof courseNames] || courseSlug}
          </button>
          <span>›</span>
          <span className="text-gray-900">Stage {currentStageId}</span>
        </nav>

        {/* Stage Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStage.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Duration: {currentStage.duration} minutes</span>
                <span>
                  Stage {currentStageIndex + 1} of {stages.length}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Progress</div>
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(((currentStageIndex + 1) / stages.length) * 100)}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="h-2 bg-blue-600 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStageIndex + 1) / stages.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {/* Video Section */}
          {currentStage.videoUrl && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Video Lesson
              </h2>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={currentStage.videoUrl}
                  title={currentStage.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentStage.content }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handlePreviousStage}
                disabled={currentStageIndex === 0}
              >
                ← Previous Stage
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push(`/course/${courseSlug}`)}
              >
                Back to Course
              </Button>
            </div>

            <div className="flex space-x-3">
              {!lessonCompleted ? (
                <Button
                  variant="primary"
                  onClick={handleMarkComplete}
                  disabled={isLoading}
                >
                  {isLoading ? "Marking Complete..." : "Mark Lesson Complete"}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleTakeQuiz}>
                  Take Quiz →
                </Button>
              )}

              {currentStageIndex < stages.length - 1 && (
                <Button variant="outline" onClick={handleNextStage}>
                  Next Stage →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
