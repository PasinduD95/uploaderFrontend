import React, { useEffect, useState } from 'react';
import NavBar from "../navbar/NavBar";
import SideBar from "../sidebar/SideBar"
import Footer from '../footer/Footer';
import { FaFileUpload } from 'react-icons/fa';


const MessageAlert = ({ status, message }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setVisible(false);
        window.location.reload();
      }, 2000); 
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !visible) return null;
  const alertClass = status === 1 ? 'text-green-700' : 'text-red-700';

  return (
    <div className={`text-center ${alertClass}`}>
      <p>{message}</p>
    </div>
  );
};

const FormComponent = () => {
  const [name, setName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(0);

  const handleChange = (e) => {
    setName(e.target.value);
  };
  
  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setSelectedFile(selectedFile);
    } else {
        setMessage('Please select a pdf file');
        setSelectedFile(null);
        setStatus(0);
        return;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("selectedOption", selectedOption);
    formData.append("file", selectedFile);

    try {

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/file/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      setMessage(result.message);
      setStatus(1);  
    
    } catch (error) {
      setMessage('Error submitting the form. Please try again.');
      setStatus(0);
    } 

  };

  return (
    <div className="bg-blue-50 flex flex-col min-h-screen">
      <NavBar isLoginPage={false} />
      
      <div className="flex flex-1">
        <SideBar isLoginPage={false} />
        
        <div className="content-wrapper flex-grow">
          <div className="main-content py-16">
            <div className="container mx-auto items-center justify-center mt-[30px]">
              <div className="flex justify-center">
                <div className="w-full sm:w-4/12 md:w-5/12">
                  <div className="card relative shadow-xl bg-white rounded-lg bg-opacity-70 border-none">
                    <div className="card-body p-4">
                    <div className="flex items-center justify-center mb-[60px]">
                      <FaFileUpload className="mr-2 text-xl text-gray-600" />
                      <h2 className="text-2xl font-bold text-center text-gray-600">DocUploader</h2>
                    </div>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">File Name</label>
                          <input
                            type="text"
                            value={name}
                            name="name"
                            onChange={handleChange}
                            className="w-full pl-[10px] py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                        <br/>
                        <div>
                          <span className="block font-bold text-gray-600 mb-2">Select Option</span>
                          <label className="inline-flex items-center mr-6">
                            <input
                              type="radio"
                              value='CIRCULAR'
                              name='selectedOption'
                              checked={selectedOption === "CIRCULAR"}
                              onChange={handleRadioChange}
                              className="form-radio text-blue-500"
                            />
                            <span className="ml-2">Circular</span>
                          </label>
                          &emsp;
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              value="TRAINING"
                              name='selectedOption'
                              checked={selectedOption === 'TRAINING'}
                              onChange={handleRadioChange}
                              className="form-radio text-blue-500"
                              required
                            />
                            <span className="ml-2">Training</span>
                          </label>
                        </div>
                        <br/>
                        <div>
                          <label className="block font-bold text-gray-600 mb-1">Upload File (PDF only)</label>
                          <input
                            type="file"
                            name='file'
                            id='file'
                            onChange={handleFileChange}
                            className="w-full py-2 pl-[10px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <MessageAlert status={status} message={message} />
                        <button
                          type="submit"
                          className="w-full bg-blue-700 text-white py-2 !mt-[40px] rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                          Submit
                        </button>
                      </form>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>

      <Footer />
    </div>
    // <div className="bg-blue-50 min-h-screen flex flex-col">
    //   <NavBar isLoginPage={false} />
    //   <div className="flex flex-grow">
    //     <div className="w-64 bg-gray-800 text-white h-[90%]">
    //       <SideBar isLoginPage={false} />
    //     </div>
    //     <div className="content-wrapper flex-grow">
    //       <div className="main-content py-16">
    //         <div className="container mx-auto items-center justify-center mt-[50px]">
    //           <div className="flex justify-center">
    //             <div className="w-full sm:w-4/12 md:w-5/12">
    //               <div className="card shadow-xl bg-white rounded-lg bg-opacity-70 border-none">
    //                 <div className="card-body p-4">
    //                   <div className="flex items-center justify-center mb-[50px]">
    //                     <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Upload file</h2>
    //                   </div>
    //                   <form onSubmit={handleSubmit} className="space-y-4">
    //                     <div>
    //                       <label className="block font-bold text-gray-600 mb-1">File Name</label>
    //                       <input
    //                         type="text"
    //                         value={name}
    //                         name="name"
    //                         onChange={handleChange}
    //                         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                         placeholder="Enter your name"
    //                         required
    //                       />
    //                     </div>
    //                     <br/>
    //                     <div>
    //                       <span className="block font-bold text-gray-600 mb-2">Select Option</span>
    //                       <label className="inline-flex items-center mr-6">
    //                         <input
    //                           type="radio"
    //                           value='Circular'
    //                           name='selectedOption'
    //                           checked={selectedOption === "Circular"}
    //                           onChange={handleRadioChange}
    //                           className="form-radio text-blue-500"
    //                         />
    //                         <span className="ml-2">Circular</span>
    //                       </label>
    //                       &emsp;
    //                       <label className="inline-flex items-center">
    //                         <input
    //                           type="radio"
    //                           value="Training"
    //                           name='selectedOption'
    //                           checked={selectedOption === 'Training'}
    //                           onChange={handleRadioChange}
    //                           className="form-radio text-blue-500"
    //                           required
    //                         />
    //                         <span className="ml-2">Training</span>
    //                       </label>
    //                     </div>
    //                     <br/>
    //                     <div>
    //                       <label className="block font-bold text-gray-600 mb-1">Upload File (PDF only)</label>
    //                       <input
    //                         type="file"
    //                         name='file'
    //                         onChange={handleFileChange}
    //                         className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                         required
    //                       />
    //                     </div>
    //                     <MessageAlert status={status} message={message} />
    //                     <button
    //                       type="submit"
    //                       className="w-full bg-blue-700 text-white py-2 !mt-[40px] rounded-lg hover:bg-blue-600 transition duration-300"
    //                     >
    //                       Submit
    //                     </button>
    //                   </form>
                      
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <Footer/>
    // </div>
  );
};

export default FormComponent;
