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
    <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md">
      <input
        type="file"
        name="file"
        accept="image/*"
        className="mb-4 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
      />
      <button
        onClick={uploadFile}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-200"
      >
        Get Description
      </button>
      {response && (
        <div className="mt-4 text-gray-700 text-center">{response}</div>
      )}
    </div>
  );
};

export default UploadImage;
