import imageCompression from "browser-image-compression";

export const imageCompressor = async (file: File, outputType: "image/jpeg" | "image/webp" = "image/jpeg"): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: outputType, // 👈 Принудительно указываем нужный формат
  };
  
  const compressedBlob = await imageCompression(file, options);

  // Изменяем расширение файла под новый формат
  const originalName = file.name.split(".")[0];
  const newExtension = outputType === "image/webp" ? ".webp" : ".jpg";
  const newFileName = originalName + newExtension;

  const compressedFile = new File([compressedBlob], newFileName, {
    type: outputType,
    lastModified: Date.now(),
  });

  return compressedFile;
};