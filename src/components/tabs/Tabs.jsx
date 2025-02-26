import React, { useState } from "react"

const Tabs = ({ tabs, onTabChange }) => {

    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index) => {
        // e.preventDefault();
        setActiveTab(index);
        onTabChange(index);
    };

    return (
        <div className="max-w-[100%] mx-left pb-14">
            <div className="flex border-b font-bold border-gray-500">
                {tabs.map((tab, index) => (
                    <button
                        key = {index}
                        className={`px-4 py-3 ${
                            activeTab === index ? "border-b-4 rounded-t-md bg-gray-100 border-blue-800" : ""
                        } `}
                        onClick={() => handleTabClick(index)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* <div className="py-4">
                {children.map((child) => {
                    if (child.props.label === activeTab) {
                        return <div key={child.props.label}> {child.props.children} </div>;
                    }
                    return null;
                })}
            </div> */}
        </div>
    );
};

// const Tab = ({ label, children }) => {
//     return (
//         <div label={label} className="hidden">
//             {children}
//         </div>
//     );
// };

export default Tabs;