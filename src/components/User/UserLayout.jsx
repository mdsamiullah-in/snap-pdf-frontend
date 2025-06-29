import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import PdfModel from "./PdfModel";
import useSWR, { mutate } from "swr";
import fetcher from "../../../util/fetcher";
import http from "../../../util/http";
import { toast } from "react-toastify";

  const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [width, setWidth] = useState(280);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);

    const { data: session, error: sessionErr, isLoading: sessionLoading } = useSWR(
      "/api/user/session",
      fetcher
    );

    //image upload
    const handleImageUpload = async (e) => {
      try {
        const file = e.target.files[0];
        if (!file) return;

        setImageUploading(true);

        const formData = new FormData();
        formData.append("image", file);

        const { data } = await http.post("/api/storage/upload-logo", formData);

        await Promise.all([
          http.put("/api/user/update-image", { image: data.url }),
          http.get("/api/user/refresh-token"),
        ]);

        mutate("/api/user/session");
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(err.response?.data?.message || err.message);
      } finally {
        setImageUploading(false);
      }
    };
    

    //handle logout
    const handleLogout = async () => {
      try {
        await http.post("/api/user/logout");
        navigate("/login");
      } catch (err) {
        toast.error(err.response?.data?.message || "Logout failed");
      }
    };

    return (
      <div className="bg-gray-100">
        {/* Sidebar */}
        <div
          className="fixed top-0 left-0 h-full py-8 bg-white border-r border-gray-200 transition-all overflow-hidden"
          style={{ width }}
        >
          <div className="cursor-pointer">
            <div className="relative w-[120px] h-[120px] mx-auto border rounded-full mb-8 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute top-0 left-0 w-full h-full rounded-full cursor-pointer opacity-0"
              />
              {sessionLoading || imageUploading ? (
                <div className="w-10 h-10 border-[4px] border-gray-300 border-t-[#02A0C7] rounded-full animate-spin" />
              ) : session?.image ? (
                <img
                  src={`${session.image}?t=${Date.now()}`}
                  className="rounded-full w-full h-full object-cover"
                  alt="User"
                />
              ) : (
                <i className="ri-user-line font-medium text-[#02A0C7] text-4xl"></i>
              )}
            </div>
            <p className="text-gray-700 text-center mt-[-20px]">
              {session?.fullname || "User Name"}
            </p>
            <p className="text-gray-700 text-center">
              {session?.email || "Email Address"}
            </p>
          </div>

          {/* Sidebar Links */}
          <ul className="flex flex-col list-none mt-8">
            <li
              onClick={() => setShowPdfModal(true)}
              className="py-3 px-4 w-[90%] mx-auto text-gray-600 tracking-[2px] border border-gray-200 rounded hover:bg-gray-100 cursor-pointer transition"
            >
              <i className="ri-upload-line"></i> Upload PDF
            </li>
            <Link to="/user/layout/workspace">
              <li
                className={`py-3 px-4 w-full mt-8 tracking-[2px] border border-gray-200 hover:bg-gray-50 cursor-pointer transition ${location.pathname === "/user/layout/workspace"
                  ? "bg-gray-50"
                  : "text-gray-600"
                  }`}
              >
                <i className="ri-file-text-line text-lg"></i> Workspace
              </li>
            </Link>

            <Link to="/user/layout/upgrade">
              <li
                className={`py-3 px-4 w-full tracking-[2px] border border-gray-200 hover:bg-gray-50 rounded cursor-pointer transition ${location.pathname === "/user/layout/upgrade"
                  ? "bg-gray-50"
                  : "text-gray-600"
                  }`}
              >
                <i className="ri-star-line text-lg"></i> Upgrade
              </li>
            </Link>
            {session && session.role === "admin" && (
              <Link to="/admin/plan/create">
                <li
                  className={`py-3 px-4 w-full tracking-[2px] border border-gray-200 text-gray-600 hover:bg-gray-50 rounded cursor-pointer transition ${location.pathname === "/user/layout/upgrade"}`}
                >
                  <i className="ri-star-line text-lg"></i> Create Plan
                </li>
              </Link>
            )}

          </ul>

          {/* ✅ Dynamic Progress Bar or Unlimited for Admin */}
          <div className="px-4 absolute bottom-4 left-0 w-full">
            {session?.role === "admin" ? (
              <>
                <div className="w-full h-2 bg-green-500 rounded"></div>
                <p className="text-green-600 text-sm mt-2 font-[calibri]">
                  Unlimited Credits (Admin)
                </p>
              </>
            ) : (
              <>
                <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className="h-2 bg-black rounded transition-all duration-500"
                    style={{
                      width: `${session?.credit
                        ? Math.min((session.usedCredits / session.credit) * 100, 100)
                        : 0
                        }%`,
                    }}
                  ></div>
                </div>
                <p className="text-gray-500 text-sm mt-2 font-[calibri]">
                  Used {session?.usedCredits || 0} of {session?.credit || 0} Credits
                </p>
              </>
            )}
          </div>

        </div>

        {/* Main Content */}
        <div
          className="py-24"
          style={{
            marginLeft: width,
            transition: "0.3s",
            width: `calc(100% - ${width}px)`,
          }}
        >
          <nav
            className="bg-white p-6 fixed top-0 z-[5] border-b border-gray-200"
            style={{
              left: width,
              width: `calc(100% - ${width}px)`,
              transition: "0.3s",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setWidth(width === 0 ? 280 : 0)}
                  className="text-xl cursor-pointer"
                >
                  <i className="ri-bar-chart-horizontal-line"></i>
                </button>
                <div className="flex items-center h-[30px]">
                  <img src="/images/logos.png" className="w-[120px]" />
                </div>
              </div>
              <div>
                <button title="logout" onClick={handleLogout}>
                  <i className="ri-logout-circle-r-line text-xl hover:text-red-600 cursor-pointer"></i>
                </button>
              </div>
            </div>
          </nav>

          <div className="w-11/12 bg-white p-8 mx-auto rounded-lg flex">
            <Outlet />
          </div>
        </div>

        {/* PDF Upload Modal */}
        {showPdfModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
              <button
                onClick={() => setShowPdfModal(false)}
                className="absolute top-3 right-4 text-xl text-gray-600 hover:text-black cursor-pointer"
              >
                <i className="ri-close-large-line"></i>
              </button>
              {/* ✅ Pass onClose prop to PdfModel */}
              <PdfModel onClose={() => setShowPdfModal(false)} />
            </div>
          </div>
        )}

      </div>
    );
  };

  export default UserLayout;
