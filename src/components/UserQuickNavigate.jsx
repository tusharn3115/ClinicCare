import { FaFilePdf } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";

const UserQuickNavigate = () => {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col space-y z-50 shadow-lg">
      {/* File Icon */}
      <Link to={"/user/user-appointment?tab=all&limit=10"}>
        <div className="p-2 bg-black-100 rounded-tl-md hover:bg-black-200 cursor-pointer">
          <FaFilePdf className="h-8 w-8 text-black-700 " />
        </div>
      </Link>

      {/* Appointment Icon */}
      <Link to={"/book-appointment"}>
      <div className="p-2 bg-black-100 rounded-bl-md hover:bg-black-200 cursor-pointer">
        <SlCalender className="h-8 w-8 text-black-700" />
      </div>
      </Link>
    </div>
  );
};

export default UserQuickNavigate;
