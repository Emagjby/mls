import { createClient } from "./supabase/client";

export interface AvatarUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<AvatarUploadResult> {
  try {
    const supabase = createClient();

    // Validate file type - now supports more formats since we compress to JPEG
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Only JPG, PNG, and WebP files are allowed",
      };
    }

    // Validate file size (max 2MB for compressed files)
    if (file.size > 2 * 1024 * 1024) {
      return {
        success: false,
        error: "File size must be less than 2MB",
      };
    }

    // Determine file extension - compressed files are typically JPEG
    const fileExt =
      file.type === "image/jpeg" || file.type === "image/jpg" ? "jpg" : "png";
    const filePath = `${userId}.${fileExt}`;

    // Upload with upsert to replace old image
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error("Upload failed:", error.message);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    return {
      success: true,
      url: `${urlData.publicUrl}?t=${Date.now()}`,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    return {
      success: false,
      error: "Upload failed. Please try again.",
    };
  }
}

export async function getAvatarUrl(userId: string): Promise<string | null> {
  try {
    const supabase = createClient();

    // Try to get avatar URL for common extensions
    const extensions = ["jpg", "jpeg", "png"];

    for (const ext of extensions) {
      const filePath = `${userId}.${ext}`;

      // Check if the file exists by trying to get its metadata
      const { data: metadata } = await supabase.storage
        .from("avatars")
        .list("", {
          search: filePath,
        });

      if (metadata && metadata.length > 0) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        const url = `${data.publicUrl}?t=${Date.now()}`;
        return url;
      }
    }

    return null;
  } catch (error) {
    console.error("Error getting avatar URL:", error);
    return null;
  }
}

export async function deleteAvatar(userId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    // Try to delete avatar for common extensions
    const extensions = ["jpg", "jpeg", "png"];
    let deletedAny = false;

    for (const ext of extensions) {
      const filePath = `${userId}.${ext}`;

      const { error } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (!error) {
        deletedAny = true;
      }
    }

    return deletedAny;
  } catch (error) {
    console.error("Error deleting avatar:", error);
    return false;
  }
}
