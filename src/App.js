import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/login/Login";
import UploadPage from "./components/upload/FileUploader";
import ViewPage from "./components/view/View";
import CreatePoll from "./components/PollingSystem/CreatePoll/CreatePoll";
import PollTable from "./components/PollingSystem/PollTable/PollTable";
import ProtectedRoute from './components/protect/ProtectedRoute';


const App = () => {

  // const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        {/* <Route 
          path="/" 
          element={isAuthenticated ? <UploadPage /> : <LoginPage />} 
        /> */}
        {/* <Route path="/upload" element={<UploadPage />} /> */}
        <Route
          path="/upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
         <Route
          path="/upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="/view" element={
          <ProtectedRoute>
            <ViewPage />
          </ProtectedRoute>} />
        {/* <Route path="/view" 
          element={
              isAuthenticated ? <ViewPage /> : <Navigate to="/" replace />
          } 
        /> */}
         <Route path="/createpoll" element={
          <ProtectedRoute>
            <CreatePoll />
          </ProtectedRoute>} />

          <Route path="/polltable" element={
          <ProtectedRoute>
            <PollTable />
          </ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
