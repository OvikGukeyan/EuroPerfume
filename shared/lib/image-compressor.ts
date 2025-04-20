import imageCompression from "browser-image-compression";

export const imageCompressor = async (file: File): Promise<File> => {
    const originalName = file.name; // Сохраняем имя до сжатия
  
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
  
    const compressedBlob = await imageCompression(file, options);
  
    // Создаем File с тем же именем
    const compressedFile = new File([compressedBlob], originalName, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    });
  
    return compressedFile;
  };