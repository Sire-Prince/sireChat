export const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!UPLOAD_PRESET || !CLOUD_NAME) {
    console.error("Cloudinary environment variables are not set");
    return null;
  }

  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;
    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      public_id: data.public_id,
      resource_type: data.resource_type,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error?.message || error);
    return null;
  }
};
