import { supabase } from "@/src/lib/supabase";

export const handleVideoUpload = async (file: File): Promise<string | null> => {
  if (!file) return null;

  const fileName = `video-${Date.now()}.${file.name.split(".").pop()}`;
  const { data, error } = await supabase.storage
    .from("videos") 
    .upload(fileName, file, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("videos")
    .getPublicUrl(fileName);

  return publicUrlData?.publicUrl || null;
};