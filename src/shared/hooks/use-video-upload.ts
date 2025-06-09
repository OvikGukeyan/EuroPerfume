import { supabase } from "@/src/lib/supabase";
import { useCallback, useState } from "react";

export const useVideoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = useCallback(async (file: File): Promise<string | null> => {
    if (!file) return null;

    setLoading(true);
    setError(null);

    try {
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
        setError(error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      const url = publicUrlData?.publicUrl || null;
      return url;
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    uploadVideo,
    loading,
    error,
  };
};