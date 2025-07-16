const url = `https://api.cloudinary.com/v1_1/dacotr4pz/auto/upload`;

export const uploadFile = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "dev-2-win");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });
  const responseData = await response.json();

  return responseData;
};
