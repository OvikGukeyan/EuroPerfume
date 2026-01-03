"use client";

import imageCompression from "browser-image-compression";

export const imageCompressor = async (
  file: File,
  outputType: "image/jpeg" | "image/webp" = "image/jpeg"
): Promise<File> => {
  let fileToCompress = file;

  if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
    const heic2any = (await import("heic2any")).default;
    const convertedBlobOrArray = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });

    const convertedBlob = Array.isArray(convertedBlobOrArray)
      ? convertedBlobOrArray[0]
      : convertedBlobOrArray;

    fileToCompress = new File(
      [convertedBlob],
      file.name.replace(/\.heic$/i, ".jpg"),
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );
  }

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: outputType,
  };

  const compressedBlob = await imageCompression(fileToCompress, options);

  const originalName = file.name.replace(/\.[^/.]+$/, ""); // чуть надежнее
  const newExtension = outputType === "image/webp" ? ".webp" : ".jpg";
  const newFileName = originalName + newExtension;

  return new File([compressedBlob], newFileName, {
    type: outputType,
    lastModified: Date.now(),
  });
};
