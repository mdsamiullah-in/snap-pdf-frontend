import React, { useState } from "react";
import http from "../../../util/http";
import useSWR, { mutate } from "swr";
import fetcher from "../../../util/fetcher";
import Swal from "sweetalert2";

const PdfModel = ({ onClose }) => {
  const { data: session, error: sessionErr, isLoading: sessionLoading } = useSWR(
    "/api/user/session",
    "/api/storage/all",
    fetcher
  );

  const [uploading, setUploading] = useState(false);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    const title = formData.get("title");
    const file = formData.get("path");

    if (session?.usedCredits === session?.credit) {
      Swal.fire({
        icon: "error",
        title: "No Credits Left",
        text: "❌ You don't have any credits left.",
      });
      return;
    }

    if (!title || !file || file.size === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "❗ Please provide a title and select a PDF file.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      Swal.fire({
        icon: "error",
        title: "File Too Large",
        text: "❌ PDF size must be less than or equal to 2MB.",
      });
      return;
    }

    try {
      setUploading(true);

      Swal.fire({
        title: "Uploading...",
        text: "Please wait while we upload your file.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await http.post("/api/storage/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await http.get("/api/user/refresh-token");
      mutate("/api/user/session");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "✅ PDF uploaded successfully!",
      }).then((result) => {
        if (result.isConfirmed) {
          form.reset();
          if (onClose) onClose(),
          window.location = location.href; // ✅ Close modal after success
        }
      });

    } catch (err) {
      console.error("Upload failed:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "❌ Something went wrong. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl w-full max-w-md mx-auto z-[100000]">
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-xl font-bold text-gray-800 text-center">📄 Upload PDF</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Enter PDF Title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="path" className="text-sm font-medium text-gray-700">
            Choose PDF (Max 2MB)
          </label>
          <input
            type="file"
            name="path"
            id="path"
            accept="application/pdf"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none file:cursor-pointer text-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || session?.credit <= 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
    </div>
  );
};

export default PdfModel;
