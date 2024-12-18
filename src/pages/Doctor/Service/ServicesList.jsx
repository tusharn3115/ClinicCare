import { useEffect, useState, useCallback } from "react";
import BreadCrumbs from "../../../components/Common/BreadCrumbs";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { hideLoader, showLoader } from "../../../redux/Slices/LoaderState";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMyServiceApi, searchMyServiceApi, deleteServiceApi } from "../../../Utils/services/apis/Doctor/ServiceDoctorApi"; // Import the delete function
import { confirmAlert } from 'react-confirm-alert'; // Import the confirmAlert function
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import CSS for the alert
import { showAlert } from "../../../redux/Slices/AlertToggleState";

const ServicesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [clinics, setClinics] = useState([]);
  const [limit, setLimit] = useState(queryParams.get("limit") || 10);
  const [currentPage, setCurrentPage] = useState(Number(queryParams.get("page") || 1));
  const [totalPage, setTotalPage] = useState(1);
  const [prev, setPrev] = useState(false);
  const [next, setNext] = useState(false);

  // Fetch data function
  const dataFetch = useCallback(async () => {
    try {
      dispatch(showLoader());
      const res = await getMyServiceApi(currentPage, limit);
      if (res?.success) {
        setClinics(res.data);
        setTotalPage(res.pagination.totalPages);
        setNext(res.pagination.hasNextPage);
        setPrev(res.pagination.hasPrevPage);
      }
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      dispatch(hideLoader());
    }
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    dataFetch();
  }, [limit, currentPage]);

  const handleLimitChange = (e) => {
    const newLimit = e.target.value;
    setLimit(newLimit);
    setCurrentPage(1);
    navigate(`/doctor/services-list?limit=${newLimit}&page=1`);
  };

  const handlePrevPage = () => {
    if (prev && currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      navigate(`/doctor/services-list?limit=${limit}&page=${newPage}`);
    }
  };

  const handleNextPage = () => {
    if (next && currentPage < totalPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      navigate(`/doctor/services-list?limit=${limit}&page=${newPage}`);
    }
  };

  const searchBarHandle = async (e) => {
    const search = e.target.value;
    if (search === "") {
      dataFetch();
      navigate(`/doctor/services-list?limit=${limit}&page=${currentPage}`);
    } else {
      try {
        const searchData = await searchMyServiceApi(search);
        setClinics(searchData?.data || []);
      } catch (error) {
        console.error("Error searching clinics:", error);
      }
    }
  };

  // Function to handle service deletion
  const handleDeleteService = async (serviceId) => {
    try {
      dispatch(showLoader());
      const res = await deleteServiceApi(serviceId);
      if (res.success) {

      
          dispatch(showAlert({ message: res.message, type: "success" }));
       
        dataFetch(); 
      } 
    } catch (error) {
      console.error("Error deleting service:", error);
      dispatch(showAlert({ message: error?.response?.data?.message, type: "failed" }));

    } finally {
      dispatch(hideLoader());
    }
  };

  // Function to show confirmation alert
  const confirmDelete = (serviceId) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this service?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => handleDeleteService(serviceId)
        },
        {
          label: 'No',
          onClick: () => console.log('Delete action cancelled')
        }
      ]
    });
  };

  return (
    <div>
      <BreadCrumbs currentPath="Service List" />
      <div className="relative w-[97%] m-auto mt-10 mb-10 rounded-lg shadow-lg p-5">
        <div className="top flex items-center justify-between mb-14">
          <h1 className="text-xl font-semibold">Service List</h1>
          <Link to="/doctor/add-services">
            <button className="bg-blue-500 text-white shadow-sm shadow-secondary rounded-lg p-2">Add Service</button>
          </Link>
        </div>
        <div className="mb-4">
          <div className="topSelect flex items-center justify-between">
            <div className="flex gap-1">
              <p className="text-black-600 text-sm">Display</p>
              <select name="pages" id="pages" value={limit} onChange={handleLimitChange} className="bg-white border border-black-400 text-sm rounded-sm">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="75">75</option>
                <option value="100">100</option>
              </select>
              <p className="text-black-600 text-sm">Records Per Page</p>
            </div>
            <div className="flex gap-1 items-center">
              <label htmlFor="search" className="text-black-600">
                Search:{" "}
              </label>
              <input type="text" name="search" onChange={searchBarHandle} id="search" className="border border-black-500 pl-1 h-7 w-60 rounded-md" />
            </div>
          </div>
        </div>
        <div className="list w-[100%] border border-black-200 rounded-md">
  <div className="heading flex justify-between font-semibold border-b-2 border-black-400 pb-2 px-7 py-3 mb-2">
    <div className="w-[5%]">ID</div>
    <div className="w-[20%]">Treatment Name</div>
    <div className="w-[15%]">Specialty</div>
    <div className="w-[20%]">Clinic Name</div>
    <div className="w-[10%]">Fees</div>
    <div className="w-[10%]">Duration</div>
    <div className="w-[10%]">Action</div>
  </div>
  {clinics.map((clinic, index) => (
    <div key={clinic._id} className="flex items-center text-sm justify-between border-b border-black-200 px-5 py-2">
      <div className="w-[5%]">#{index + 1}</div>

      {/* Treatment Name Field */}
      <div className="w-[20%] truncate">
        {clinic.treatmentName.length > 20 ? clinic.treatmentName.slice(0, 20) + '...' : clinic.treatmentName}
      </div>

      {/* Specialty Field */}
      <div className="w-[15%] truncate">
        {clinic.specialty.length > 15 ? clinic.specialty.slice(0, 15) + '...' : clinic.specialty}
      </div>

      {/* Clinic Name Field */}
      <div className="w-[20%] truncate">
        {clinic.clinicId?.name?.length > 20 ? clinic.clinicId.name.slice(0, 20) + '...' : clinic.clinicId?.name}
      </div>

      {/* Fees Field */}
      <div className="w-[10%]">{clinic.fees}</div>

      {/* Duration Field */}
      <div className="w-[10%]">{clinic.duration}</div>

      {/* Actions */}
      <div className="w-[10%] flex items-center">
        <Link to={`/doctor/update-service/${clinic._id}`}>
          <FaEdit className="text-black-500 hover:text-black-800 text-xl cursor-pointer mr-5" />
        </Link>
        <MdDelete
          className="text-[#FF5B61] hover:text-[#FF0000] text-xl cursor-pointer"
          onClick={() => confirmDelete(clinic._id)}
        />
      </div>
    </div>
  ))}
  {clinics.length === 0 && <p className="text-center text-lg py-5 text-black-400">No data found</p>}
</div>

        <div className="last mt-6 flex items-center justify-between">
          <p className="text-sm pl-2">
            Showing Page {currentPage} of {totalPage}
          </p>
          <div className="flex items-center bg-black-100 border border-black-300 rounded-md">
            <button className="px-4 py-2 text-black-700 hover:text-black-900 focus:outline-none" disabled={!prev} onClick={handlePrevPage}>
              Previous
            </button>
            <div className="px-4 py-2 bg-blue-500 text-white">{currentPage}</div>
            <button className="px-4 py-2 text-black-700 hover:text-black-900 focus:outline-none" disabled={!next} onClick={handleNextPage}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesList;
