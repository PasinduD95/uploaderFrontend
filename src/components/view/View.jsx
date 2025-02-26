import React, { useEffect, useState } from "react";
import Tabs from "../tabs/Tabs";
import NavBar from "../navbar/NavBar";
import SideBar from "../sidebar/SideBar"
import Footer from '../footer/Footer';
import { format } from 'date-fns';

const FormComponent = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Circular", "Training"];
  const [files, setFiles] = useState([]);
  const filePath = `${process.env.REACT_APP_API_BASE_URL}/uploadFiles`;

  useEffect(() => {
    const init = async () => {
      
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/file/view?index=${activeTab}`);
        console.log(files)
        const result = await response.json();
        setFiles(result);
      
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    init();
  }, [activeTab]);

  return (
    <div className='bg-blue-50 min-h-screen flex flex-col'>
      <NavBar isLoginPage={false} />

      <div className="flex flex-1">
        <SideBar isLoginPage={false} />

        <div className="content-wrapper flex-grow">
          <div className="main-content py-16">
            <div className="container mx-auto items-center justify-center">
              <div className="flex justify-center">
                <div className="w-full max-w-[90%] bg-white p-6 rounded-lg shadow-md mx-auto mt-10">
                  <Tabs tabs={tabs} onTabChange={setActiveTab}/>
                  <div>

                    <table className="table-auto w-full bg-gray-50 border border-gray-200">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="border border-slate-400 px-4 py-1">ID</th>
                          <th className="border border-slate-400 px-16 py-1">Name</th>
                          <th className="border border-slate-400 px-4 py-1">Type</th>
                          <th className="border border-slate-400 px-4 py-1">Date & Time</th>
                          <th className="border border-slate-400 px-1 py-1"></th>
                        </tr>
                      </thead>
                      <tbody>
                        { files && files.length > 0 ? (
                            files.map((file) => (
                              <tr key={file[0]}>
                                <td className="align-middle text-center bg-gray-50 border border-gray-300">{file[0]}</td>
                                <td className="text-center bg-gray-50 border border-gray-300">{file[1]}</td>
                                <td className="text-center bg-gray-50 border border-gray-300">{file[4]}</td>
                                <td className="text-center bg-gray-50 border border-gray-300">{format(new Date(file[3]), 'yyyy-MM-dd HH:mm:ss')}</td>
                                <td className="py-2 px-4 text-center bg-gray-50 border border-gray-300">
                                  <a
                                    href={`${filePath}/${file[4]}/${file[2]}`}
                                    className="bg-blue-700 px-4 text-white font-medium p-1 rounded-md"
                                    target="_blank"
                                  >
                                    View
                                  </a>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center text-gray-500">No records found.</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                    <div className="pb-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};


export default FormComponent;
