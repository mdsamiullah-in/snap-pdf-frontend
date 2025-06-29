import React, { useEffect, useState } from "react";
import http from "../../../util/http";
import { useLocation } from "react-router-dom";
import useSWR, { mutate } from "swr";
import fetcher from "../../../util/fetcher";
import Swal from "sweetalert2";

const Upgrade = () => {
  const location = useLocation();
  const [plans, setPlans] = useState([]);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const { data: session, isLoading: sessionLoading } = useSWR(
    "/api/user/session",
    fetcher
  );

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await http.get("/api/plan");

        // Sort so "Free" plan comes first
        const sortedPlans = [...data.data].sort((a, b) => {
          if (a.name.toLowerCase() === "free") return -1;
          if (b.name.toLowerCase() === "free") return 1;
          return 0;
        });

        setPlans(sortedPlans);
      } catch (error) {
        console.error("❌ Failed to fetch plans:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load plans. Please try again.",
        });
      }
    };

    fetchPlans();
  }, []);

  const checkoutHandler = async (planId) => {
    setLoadingPlanId(planId);
    try {
      const {
        data: { order },
      } = await http.post(`/api/plan/checkout/${planId}`);

      const options = {
        key: "rzp_test_Nrw1kdoIFjEHH7", // Replace with live key in production
        amount: order.amount,
        currency: "INR",
        name: "SnapPdf",
        description: "Plan Purchase",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await http.post(
              `/api/plan/payment/verify/${planId}`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            Swal.fire({
              icon: "success",
              title: "Payment Successful",
              text: verifyRes.data.message || "Your plan has been upgraded!",
              confirmButtonColor: "#2EA9ED",
            });

            await http.get("/api/user/refresh-token");
            mutate("/api/user/session");
          } catch (err) {
            console.error("❌ Verification Error:", err);
            Swal.fire({
              icon: "error",
              title: "Payment Verification Failed",
              text: "Something went wrong during verification. Please contact support.",
            });
          }
        },
        prefill: {
          name: session?.user?.name || "User",
          email: session?.user?.email || "user@example.com",
        },
        theme: {
          color: "#2EA9ED",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Checkout Error:", err);
      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text: "Something went wrong while initiating payment.",
      });
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex flex-col gap-4 bg-white mx-auto rounded-lg max-w-5xl w-full">
        <p className="text-gray-500 tracking-[3px] text-sm">{location.pathname}</p>

        <div>
          <h1 className="text-2xl tracking-[3px]">Plans</h1>
          <p className="text-gray-500 text-md font-[calibri]">
            Update your plan to upload multiple PDFs & take notes
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-12">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="border border-gray-200 rounded-xl p-6 space-y-4 w-full sm:w-[48%] md:w-[30%]"
            >
              <h2 className="text-xl font-bold text-gray-800 text-center">{plan.name}</h2>

              <div className="text-center">
                <span className="text-4xl font-bold text-indigo-600">{plan.price} ₹</span>
                <span className="text-sm text-gray-500">
                  {plan.name.toLowerCase() === "free"
                    ? " / lifetime"
                    : ` / ${plan.credits} credits`}
                </span>
              </div>

              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  {plan.credits || 0} PDF credits
                </li>
                <li className="flex items-center gap-2">
                  <i className="ri-check-line text-green-500"></i>
                  {plan.note || "Unlimited notes"}
                </li>
              </ul>

              <div className="text-center pt-4">
                <button
                  onClick={() => checkoutHandler(plan._id)}
                  className={`w-full py-2 border rounded-lg transition ${
                    plan.name.toLowerCase() === "free"
                      ? "border-gray-300 text-gray-500 cursor-not-allowed"
                      : "border-[#4F39F6] text-[#4F39F6] hover:bg-indigo-50 cursor-pointer"
                  }`}
                  disabled={
                    plan.name.toLowerCase() === "free" || loadingPlanId === plan._id
                  }
                >
                  {plan.name.toLowerCase() === "free"
                    ? "Current Plan"
                    : loadingPlanId === plan._id
                    ? "Processing..."
                    : "Purchase Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
