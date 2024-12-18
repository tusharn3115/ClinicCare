import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaTrashAlt } from "react-icons/fa";
import clientRegister from "../../assets/clientRegister.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRegisterValidationSchema } from "../../Utils/services/FormValidation/UserValidation";
import { showAlert } from "../../redux/Slices/AlertToggleState";
import { hideLoader, showLoader } from "../../redux/Slices/LoaderState";
import { createUserAccountApi } from "../../Utils/services/apis/User/authApi";
import pincodeDirectory from "india-pincode-lookup";
const ClientRegister = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(userRegisterValidationSchema) });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0].message;

      dispatch(showAlert({ message: firstError, type: "warning" }));

      return;
    }
  }, [errors]);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    document.getElementById("profileImage").value = "";
  };

  const onSubmit = async (formData) => {
    const dob = new Date(formData.dob);

    const formattedDob = dob.getFullYear() + "-" + String(dob.getMonth() + 1).padStart(2, "0") + "-" + String(dob.getDate()).padStart(2, "0");

    let body = { ...formData, dob: formattedDob };

    if (!profileImage) {
      dispatch(showAlert({ message: "Please upload your profile pic", type: "warning" }));
      return;
    }

    dispatch(showLoader());

    const formDataToSend = new FormData();

    Object.entries(body).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    formDataToSend.append("profileImage", profileImage);

    try {
      const res = await createUserAccountApi(formDataToSend);
      dispatch(showAlert({ message: res.message, type: "success" }));

      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error) {
      dispatch(showAlert({ message: error?.response?.data?.message || "Failed to create account", type: "failed" }));
    } finally {
      dispatch(hideLoader());
    }
  };

  const handlePinCodeChange = (e) => {
    const pincode = e.target.value;
    if (pincode.length === 6) {
      const pincodeData = pincodeDirectory.lookup(pincode);

      if (pincodeData.length === 0) {
        dispatch(showAlert({ message: "Invalid Pincode", type: "warning" }));
      } else {
        // Set city, state, and country based on pincode data
        setValue("city", pincodeData[0].districtName);
        setValue("state", pincodeData[0].stateName);
        setValue("country", "India"); // Static country for this example
      }
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center py-16">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden w-3/4 flex">
          <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-b from-[#004AAD] to-[#0fa3d1]">
            <img src={clientRegister} alt="Register" className="w-[80%] object-cover rounded-lg shadow-md" />
          </div>
          <div className="w-full md:w-1/2 p-10">
            <h1 className="text-3xl font-bold mb-2 text-[#004AAD] text-center">Create Your Account</h1>
            <p className="text-black-600 mb-8 text-center">Get started with us in a few easy steps.</p>
            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm text-black-700 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  autoFocus
                  {...register("name")}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="email" className="block text-sm text-black-700 font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                  autoComplete="off"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="mt-1 flex space-x-6">
                  <label htmlFor="male" className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      id="male"
                      value="male"
                      {...register("gender")}
                      className="hidden peer"
                    />
                    <span className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 peer-checked:bg-[#004AAD] peer-checked:text-white peer-checked:border-transparent hover:bg-gray-100 transition-colors duration-200">
                      Male
                    </span>
                  </label>

                  <label htmlFor="female" className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      id="female"
                      value="female"
                      {...register("gender")}
                      className="hidden peer"
                    />
                    <span className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 peer-checked:bg-[#004AAD] peer-checked:text-white peer-checked:border-transparent hover:bg-gray-100 transition-colors duration-200">
                      Female
                    </span>
                  </label>

                  <label htmlFor="other" className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      id="other"
                      value="other"
                      {...register("gender")}
                      className="hidden peer"
                    />
                    <span className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 peer-checked:bg-[#004AAD] peer-checked:text-white peer-checked:border-transparent hover:bg-gray-100 transition-colors duration-200">
                      Other
                    </span>
                  </label>
                </div>
              </div>




              <div>
                <label htmlFor="mobile" className="block text-sm text-black-700 font-medium mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  {...register("mobile")}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm text-black-700 font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  {...register("dob")}
                  required
                  max={new Date().toISOString().split("T")[0]} // sets max to today's date
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="pincode" className="block text-sm text-black-700 font-medium mb-1">
                  Pincode
                </label>
                <input
                  type="number"
                  id="pincode"
                  name="pincode"
                  {...register("pincode")}
                  onWheel={(e) => e.target.blur()}
                  required
                  onChange={handlePinCodeChange}
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="bloodGroup" className="block text-sm text-black-700 font-medium mb-1">
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  {...register("bloodGroup")}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm text-black-700 font-medium mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  {...register("city")}
                  required
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm text-black-700 font-medium mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  {...register("state")}
                  required
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm text-black-700 font-medium mb-1">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  {...register("country")}
                  required
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="address" className="block text-sm text-black-700 font-medium mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  {...register("address")}
                  required
                  className="mt-1 resize-none block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                  rows="2"
                />
              </div>

              <div className="col-span-2 relative">
                <label htmlFor="password" className="block text-sm text-black-700 font-medium mb-1">
                  Password
                </label>
                <input
                  type={passwordVisible ? "password" : "text"}
                  id="password"
                  name="password"
                  {...register("password")}
                  required
                  className="mt-1 block w-full px-4 py-2 border border-black-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004AAD] focus:border-transparent transition duration-200"
                />
                <div className="absolute inset-y-0 right-4 top-[45%] flex items-center text-sm leading-5">
                  {passwordVisible ? (
                    <FaRegEyeSlash onClick={togglePasswordVisibility} className="cursor-pointer text-lg text-black-500" />
                  ) : (
                    <FaRegEye onClick={togglePasswordVisibility} className="cursor-pointer text-lg text-black-500" />
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label htmlFor="profileImage" className="block text-sm text-black-700 font-medium mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-black-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-[#004AAD] file:text-white hover:file:bg-[#0fa3d1] rounded-md cursor-pointer"
                />
                {profileImagePreview && (
                  <div className="mt-4 relative w-32 h-32">
                    <img src={profileImagePreview} alt="Profile Preview" className="w-full h-full object-cover rounded-md shadow-md border border-black-300" />
                    <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200">
                      <FaTrashAlt />
                    </button>
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <button type="submit" className="w-full py-3 px-4 bg-gradient-to-r from-[#004AAD] to-[#0fa3d1] text-white rounded-md hover:opacity-90 font-medium transition duration-200 shadow-lg">
                  Create Account
                </button>
              </div>
              <div className="col-span-2 mt-6 text-center">
                <span className="text-sm text-black-700 font-medium">Already have an account? </span>
                <Link to="/auth/login" className="text-sm text-[#004AAD] hover:underline font-medium">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegister;
