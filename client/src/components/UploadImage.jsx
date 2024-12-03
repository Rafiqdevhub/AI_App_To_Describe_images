import { useState } from "react";

const UploadImage = () => {
  const [file, setFile] = useState(0);
  const [response, setResponse] = useState("");

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.text();
      setResponse(data);
    } catch (error) {
      console.log("Error is ", error);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <input
        type="file"
        name="file"
        accept="image/*"
        className="mb-4 border border-gray-300 rounded-lg p-2"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white p-2 rounded-lg"
      >
        Get Description
      </button>
      <div>{response}</div>
    </div>
  );
};

export default UploadImage;
