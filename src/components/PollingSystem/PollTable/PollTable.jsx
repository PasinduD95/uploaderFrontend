/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import NavBar from "../../navbar/NavBar";
import SideBar from "../../sidebar/SideBar";
import Footer from "../../footer/Footer";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PollTable = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPoll, setSelectedPoll] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [chartData, setChartData] = useState(null);
  const USER = localStorage.getItem('username');
  // const USER = "TEST";
  


  useEffect(() => {
  
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/poll/get/${USER}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPolls(data.data || data.polls); 
      
        } else {
          console.error("Error fetching poll data:", data.message); 
        }
      })
      .catch((error) => {
        console.error("Error fetching poll data:", error); 
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []); 

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedPoll || !selectedPoll.POLL_ID) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/poll/polloptions/${selectedPoll.POLL_ID}`);
        const result = await response.json();

        if (result.success && result.data.length) {
          const labels = result.data.map(option => option.POLL_OPTIONS);
          const dataValues = result.data.map(option => option.RESPONSE_COUNT);

          setChartData({
            labels,
            datasets: [
              {
                label: "Responses",
                data: dataValues,
                backgroundColor: ["#16415e"],
                borderColor: "#ddd",
                borderWidth: 1
              }
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching poll data:", error);
      }
    };

    fetchData();
  }, [selectedPoll]);


  if (loading) {
    return <div>Loading...</div>;
  }

  const handleRowClick = (poll) => {
    setSelectedPoll(poll);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };


  const handleDelete = (pollId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this poll?");

    if (isConfirmed) {
      deletePoll(pollId);
    }
  };

  const deletePoll = async (pollId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/poll/delete/${pollId}`, {
        method: 'DELETE',
      });

      const rslt = await response.json();

      if (rslt.success) {
        alert("Poll Deleted successfully...!");
        setPolls((prevPolls) => prevPolls.filter(poll => poll.POLL_ID !== pollId));
        setShowModal(false);
      } else {
        alert("Unable to delete your Poll...!");
      }
    } catch (error) {
      alert("Server error, Please try again later...!");
    }
  };

  const handleStatusChange = async (pollId, newStatus) => {
    const action = newStatus === 0 ? "activate" : "hold";
    const isConfirmed = window.confirm(`Are you sure you want to ${action} this poll?`);

    if (!isConfirmed) return; 

    try {

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/poll/update_state/${pollId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ POLL_STATUS: String(newStatus) }), 
      });

      const result = await response.json();

      if (result.success) {
        setPolls((prevPolls) =>
          prevPolls.map((poll) =>
            poll.POLL_ID === pollId ? { ...poll, POLL_STATUS: String(newStatus) } : poll
          )
        );

        if (selectedPoll && selectedPoll.POLL_ID === pollId) {
          setSelectedPoll((prev) => ({ ...prev, POLL_STATUS: String(newStatus) }));
        }
        alert(`Poll status updated successfully to ${newStatus === 0 ? 'Active' : 'Hold'}!`);
      } else {
        alert(`Failed to update poll status: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Server error. Please try again later.");
      console.error("Error:", error);
    }
  };




  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      <NavBar isLoginPage={false} />

      <div className="flex flex-1 ">
        <SideBar isLoginPage={false} />
        <div className="content-wrapper flex-grow">
          <div className="main-content pb-16">
            <div className="container mx-auto items-center justify-center mt-[50px]">
              <div className="flex justify-center">
                <div className="w-full max-w-[90%] bg-white p-6 rounded-lg shadow-md mx-auto">
                  <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    Poll Details
                  </h1>

                  {/* Search Bar Section */}
                  <div className="flex justify-start mb-4">
                    <input
                      type="text"
                      placeholder="Search Polls..."
                      className="border border-gray-300 rounded-lg px-4 py-2 w-1/3"
                      onChange={handleSearch}
                    />
                  </div>
                  <table className="table-auto w-full bg-gray-50 border border-gray-300">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="border border-slate-400 px-4 py-1 text-left"> </th>
                        <th className="border border-slate-400 px-4 py-1 text-left">Poll Title</th>
                        <th className="border border-slate-400 px-4 py-1 text-left">Poll Type</th>
                        <th className="border border-slate-400 px-4 py-1 text-left">Status</th>
                        <th className="border border-slate-400 px-4 py-1 text-left">Created By</th>
                        <th className="border border-slate-400 px-4 py-1 text-left">Created Date</th>
                        <th className="border border-slate-400 px-4 py-1 text-left">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {polls
                        .slice()
                        .sort((a, b) => new Date(b.POLL_STATUSDATE) - new Date(a.POLL_STATUSDATE))
                        .filter((poll) => {
                          // Filter poll based on the search term
                          return (
                            poll.POLL_NAME.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            poll.POLL_TYPE.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            poll.POLL_UPDATED_USER.toLowerCase().includes(searchTerm.toLowerCase())
                          );
                        })
                        .map((poll, index) => (
                          <tr key={poll.POLL_ID} className="border-t">
                            <td className="border border-slate-400 px-4 py-1">{index + 1}</td>
                            <td
                              className="border border-slate-400 px-4 py-1 cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition"
                              onClick={() => handleRowClick(poll)}
                            >
                              {poll.POLL_NAME}
                            </td>
                            <td className="border border-slate-400 px-4 py-1">{poll.POLL_TYPE}</td>
                            <td
                              className={`border border-slate-400 px-4 py-1 font-semibold ${poll.POLL_STATUS === "0" ? "text-green-600" : "text-red-600"
                                }`}
                            >
                              {poll.POLL_STATUS === "0" ? "Active" : "Hold"}
                            </td>
                            <td className="border border-slate-400 px-4 py-1">{poll.POLL_UPDATED_USER}</td>
                            <td className="border border-slate-400 px-4 py-1">
                              {new Date(poll.POLL_STATUSDATE).toLocaleDateString()}
                            </td>
                            <td className="border border-slate-400 px-4 py-1">
                              {new Date(poll.POLL_STATUSDATE).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedPoll && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1050]">
          {/* Modal Container */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-4xl relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              ✖
            </button>

            {/* Poll Title */}
            <h2 className="text-2xl font-bold mb-4 text-center">{selectedPoll.POLL_NAME}</h2>

            {/* Current Mode Status */}
            <div className="text-right text-sm font-semibold text-gray-600 mb-4">
              Current Mode:{" "}
              <span
                className={`px-2 py-1 rounded ${selectedPoll.POLL_STATUS === "0"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {selectedPoll.POLL_STATUS === "0" ? "Active" : "Hold"}
              </span>
            </div>

            {/* Buttons Below Current Mode */}
            <div className="flex justify-end space-x-2 mt-4">
              {/* Delete Button */}
              <button
                className="bg-red-500 text-white text-xs px-4 py-1 rounded-lg shadow-lg transform transition-all hover:bg-red-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 w-20"
                onClick={() => handleDelete(selectedPoll.POLL_ID)}
              >
                <span className="font-medium">Delete</span>
              </button>

              {/* Hold Button */}
              <button
                className={`text-white text-xs px-4 py-1 rounded-lg shadow-lg transform transition-all w-20
            ${selectedPoll.POLL_STATUS === "1"
                    ? "bg-gray-400"
                    : "bg-yellow-500 hover:bg-yellow-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  }`}
                onClick={() => handleStatusChange(selectedPoll.POLL_ID, 1)}
                disabled={selectedPoll.POLL_STATUS === "1"}
              >
                <span className="font-medium">Hold</span>
              </button>

              {/* Activate Button */}
              <button
                className={`text-white text-xs px-4 py-1 rounded-lg shadow-lg transform transition-all w-20
            ${selectedPoll.POLL_STATUS === "0"
                    ? "bg-gray-400"
                    : "bg-green-500 hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                  }`}
                onClick={() => handleStatusChange(selectedPoll.POLL_ID, 0)}
                disabled={selectedPoll.POLL_STATUS === "0"}
              >
                <span className="font-medium">Activate</span>
              </button>
            </div>

            {/* Chart Section */}
            <div className="mb-4">
              {chartData ? <Bar data={chartData} /> : <p className="text-center text-gray-500">Loading chart...</p>}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PollTable;
