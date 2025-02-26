import { useState } from "react";
import NavBar from "../../navbar/NavBar";
import SideBar from "../../sidebar/SideBar";
import Footer from "../../footer/Footer";

const CreatePoll = () => {
  const [POLL_NAME, setTopic] = useState("");
  const [POLL_TYPE, setPollType] = useState("SINGLE");
  const [numberOfOptions, setNumberOfOptions] = useState(2);
  const [includeImages, setIncludeImages] = useState(false);
  const [options, setOptions] = useState([
    { text: "Yes", image: null }, // Default for SINGLE
    { text: "No", image: null },  // Default for SINGLE
  ]);

  const handlePollTypeChange = (e) => {
    const selectedType = e.target.value;
    setPollType(selectedType);

    // Reset options if switching to a poll type that doesn't use them
    if (selectedType === "SINGLE") {
      setNumberOfOptions(2);
      setOptions([1, 2]);
      setOptions([
        { text: "Yes", image: null }, // Clear text and image for option 1
        { text: "No", image: null }, // Clear text and image for option 2
      ]);
      setIncludeImages(false); // Disable image uploads
    }
    else {
      setOptions([
        { text: "", image: null },
        { text: "", image: null },
      ]);
    }
  };

  const handleNumberOfOptionsChange = (e) => {
    const num = parseInt(e.target.value, 10);
    setNumberOfOptions(num);
  
    setOptions((prevOptions) => {
      // If the number of options is greater, add new empty options
      if (num > prevOptions.length) {
        return [
          ...prevOptions,
          ...new Array(num - prevOptions.length).fill({ text: "", image: null }),
        ];
      }
      // If the number of options is less, trim the array
      else {
        return prevOptions.slice(0, num);
      }
    });
  };
  
  

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    if (field === "image" && value) {
      updatedOptions[index] = { ...updatedOptions[index], file: value }; // Use 'file' field
    } else {
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    }
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pollData = {
      POLL_NAME,
      POLL_TYPE,
      numberOfOptions,
      includeImages,
      options,
    };

    // Create a FormData object to send both text and file data
    const formData = new FormData();

    // Append poll data to FormData
    formData.append("POLL_NAME", pollData.POLL_NAME);
    formData.append("POLL_TYPE", pollData.POLL_TYPE);
    formData.append("POLL_UPDATED_USER", localStorage.getItem('username')); // should be replaced with service_id
    formData.append("POLL_STATUS", "0");
    formData.append("POLL_STATUSDATE", new Date().toISOString());
    formData.append("POLL_USERTYPE", "ALL"); 
    formData.append("IsincludeImage", includeImages);

    // Append options (with text and images)
    options.forEach((option, index) => {
      formData.append(`options[${index}][text]`, option.text);
      if (option.file) {
        formData.append(`options[${index}][image]`, option.file); // File input
      }
    });

    // Log the entire FormData content
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/poll/upload`, {
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {  // Check if the response status is successful (status code 200-299)
        throw new Error("Failed to create poll, server responded with an error.");
      }
    
      const rslt = await response.json();
    
      if (rslt.success) {
        alert("Poll created successfully!");
        setTopic("");                // Reset POLL_NAME
        setPollType("SINGLE");       // Reset POLL_TYPE
        setNumberOfOptions(2);       // Reset numberOfOptions
        setIncludeImages(false);     // Reset includeImages
        setOptions([1, 2]); 
        setOptions([
          { text: "Yes", image: null }, // Clear text and image for option 1
          { text: "No", image: null },  // Clear text and image for option 2
        ]);
      } else {
        alert("Unable to create poll. Please try again later...!");
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("An error occurred while creating the poll. Please try again later.");
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
                <div className="w-full max-w-[80%] bg-white p-6 rounded-lg shadow-md mx-auto">
                  <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
                    Create a Poll
                  </h1>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Topic and Poll Type */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center space-x-6">
                        <label className="w-full font-medium text-gray-700">
                          Title
                        </label>
                        <input
                          type="text"
                          value={POLL_NAME}
                          onChange={(e) => setTopic(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter poll title"
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-6">
                        <label className="w-full font-medium text-gray-700">
                          Poll Type
                        </label>
                        <select
                          value={POLL_TYPE}
                          onChange={handlePollTypeChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="SINGLE">Single Poll (Yes/No)</option>
                          <option value="MULTIPLE">Multiple Choices</option>
                          <option value="SELECTONE">
                            Select One from Multiple
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Number of Options and Include Images */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex items-center space-x-6">
                        <label className="w-full font-medium text-gray-700">
                          Number of Options
                        </label>
                        <input
                          type="number"
                          value={numberOfOptions}
                          onChange={handleNumberOfOptionsChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="2"
                          placeholder="Enter number of options"
                          required
                          disabled={POLL_TYPE === "SINGLE"}
                        />
                      </div>
                      <div className="flex items-center space-x-4 pl-8">
                        <input
                          type="checkbox"
                          checked={includeImages}
                          onChange={(e) => setIncludeImages(e.target.checked)}
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500 "
                          disabled={POLL_TYPE === "SINGLE"}
                        />
                        <label
                          className={`font-medium ${
                            POLL_TYPE === "SINGLE"
                              ? "text-gray-400"
                              : "text-gray-700"
                          }`}
                        >
                          Include Images for Options
                        </label>
                      </div>
                    </div>

                    {/* Options and Choose File */}
                    {/* <div className="grid grid-cols-2 gap-6"> */}
                    {options.map((option, index) => (
                      <div
                        key={index}
                        className={`grid grid-cols-2 gap-4 ${
                          index % 2 === 0 ? "" : "col-span-2"
                        }`}
                      >
                        {/* Option Text */}
                        <div className="flex items-center space-x-4">
                          <label
                            className={`w-full font-medium ${
                              POLL_TYPE === "SINGLE"
                                ? "text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            Option {index + 1}
                          </label>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(index, "text", e.target.value)
                            }
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter option text"
                            disabled={POLL_TYPE === "SINGLE"}
                            required
                          />
                        </div>

                        {/* Option Image File Input */}
                        {includeImages && (
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  "image",
                                  e.target.files[0]
                                )
                              }
                              className="flex-1 file:px-4 file:py-2 file:border file:rounded-lg file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={POLL_TYPE === "SINGLE"}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {/* </div> */}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                        Submit Poll
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePoll;
