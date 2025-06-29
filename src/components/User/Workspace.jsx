import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import http from "../../../util/http";
import Swal from "sweetalert2";

const Workspace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await http.get("/api/storage/all");
        const result = Array.isArray(res.data) ? res.data : res.data.data || [];
        setFiles(result);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load files",
          text: "There was a problem fetching your PDFs. Please try again later.",
        });
        setFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      await http.delete(`/api/storage/${id}`);
      setFiles((prev) => prev.filter((file) => file._id !== id));
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "The file has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      Swal.fire({
        icon: "error",
        title: "Deletion Failed",
        text: "Could not delete the file. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 bg-white mx-auto rounded-lg">
          <p className="text-gray-500 tracking-[3px] text-sm">{location.pathname}</p>
          <div>
            <h1 className="text-2xl tracking-[3px]">Workspace</h1>
            <p className="text-gray-500 text-md font-[calibri]">
              Upload your PDFs to start taking clear and structured notes.
            </p>
          </div>
        </div>

        <div className="mt-12">
          {loading ? (
            <p className="text-center text-gray-500">Loading files...</p>
          ) : files.length === 0 ? (
            <p className="text-center text-gray-400">No PDFs uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div
                  key={file._id}
                  onClick={() =>
                    navigate(`/user/layout/chat/${file._id}`, { state: { file } })
                  }
                  className="cursor-pointer relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition duration-300 flex flex-col items-center text-center"
                >
                  <div
                    className="flex gap-4 mt-3 absolute top-0 right-0 pr-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                      title="Open URL"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="ri-link text-xl"></i>
                    </a>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete File"
                    >
                      <i className="ri-delete-bin-line text-xl cursor-pointer"></i>
                    </button>
                  </div>
                  <i className="ri-file-pdf-2-line text-6xl text-red-500 mb-4"></i>
                  <p className="text-base text-gray-700 font-medium uppercase">{file.title}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {file.createdAt
                      ? moment(file.createdAt).format("DD MMM YYYY, hh:mm A")
                      : "Unknown date"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
