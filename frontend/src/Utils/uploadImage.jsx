import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post("/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure correct header
      },
    });
    return response.data; // Should contain { profilePicUrl }
  } catch (error) {
    console.error("Error uploading the image:", error.response?.data || error.message);
    throw error;
  }
};

export default uploadImage;
