import React from "react";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center text-center">
    <div>
      <h1 className="text-3xl font-bold text-red-600 mb-4">⛔ Access Denied</h1>
      <p className="text-lg text-gray-600">You are not authorized to view this page.</p>
    </div>
  </div>
);

export default Unauthorized;
