import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactStars from 'react-stars'
export default function DoctorRating() {
  // State for service rating
  const [serviceRate, setServiceRate] = useState(0);
  const [userName, setUserName] = useState("John Doe"); // Static user name
  const [userMessage, setUserMessage] = useState("");

  const handleServiceRate = (rate) => setServiceRate(rate);

  const submitRating = (e) => {
    e.preventDefault();

    if (!userName) {
      toast.error("Please Login with client ID", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    if (!userMessage) {
      toast.warn("Please Enter Something in Message", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    if (serviceRate === 0) {
      toast.warn("Please Give Service Rating", {
        position: "bottom-right",
        autoClose: 2000,
      });
      return;
    }

    // Simulate successful submission
    setServiceRate(0);
    setUserMessage("");
    toast.success("Thanks For Giving Valuable Feedback", {
      position: "bottom-right",
      autoClose: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-black-50 flex items-center justify-center py-8">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-black-800 text-center mb-6">
          Leave Your Feedback
        </h1>
        <form>
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-black-600"
            >
              Client Name
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              readOnly
              className="mt-1 w-full border border-black-300 rounded-md shadow-sm py-2 px-3 text-black-800 bg-black-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-black-600"
            >
              Your Review
            </label>
            <textarea
              id="message"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Write your review here..."
              className="mt-1 w-full border border-black-300 rounded-md shadow-sm py-2 px-3 text-black-800 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-black-600 mb-2">
              Service Rating
            </label>
            <div className="rateSection">
              <div className="rateClient">
                <ReactStars
                  count={5}
                  value={serviceRate}
                  onChange={handleServiceRate}
                  size={60} 
                  color1={"#d1d1d1"} 
                  color2={"rgb(247 133 35)"} 
                  className="sizesofStar"
                  isHalf={true}
                />
              </div>
            </div>


          </div>
          <button
            onClick={submitRating}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}