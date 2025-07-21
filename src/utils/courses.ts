import { createClient } from "@/utils/supabase/client";

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  totalStages: number;
  completedStages: number;
  difficulty: string;
  duration: string;
}

// Interface for the raw database course data
interface DatabaseCourse {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  stages: number;
  difficulty: string;
  duration: string;
}

export async function fetchCourses(): Promise<Course[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching courses:", error);
      return [];
    }

    // Transform the data to match our interface
    const courses: Course[] = data.map((course: DatabaseCourse) => ({
      id: course.id,
      name: course.name,
      slug: course.slug,
      description: course.description,
      icon: course.icon,
      color: course.color,
      progress: 0, // For now, always 0
      totalStages: course.stages,
      completedStages: 0, // For now, always 0
      difficulty: course.difficulty,
      duration: course.duration,
    }));

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching course:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform the data to match our interface
    const course: Course = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      color: data.color,
      progress: 0, // For now, always 0
      totalStages: data.stages,
      completedStages: 0, // For now, always 0
      difficulty: data.difficulty,
      duration: data.duration,
    };

    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}
