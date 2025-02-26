import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // const response = await fetch('http://localhost/uploader/backend/login.php', {  
      const response = await fetch('/sltdevops/apiServices/ldap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sid: email,
          pwd: password,
        }),
      });

      const data = await response.json();
      console.log("data", data)
      if (data.result === "success") {
        // setIsAuthenticated(true);
      const getUserToken = await fetch(`${REACT_APP_API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sid: email,
            pwd: password,
          }),
        });

        const userToken = await getUserToken.json();
        localStorage.setItem('token', userToken.token);
        localStorage.setItem('username', userToken.user.username);
        navigate('/upload');
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      setError('There was an error processing your login. Please try again later.');
    }
  };

  return (
    <div className='bg-blue-50 min-h-screen flex flex-col'>
      <NavBar isLoginPage={true} />
      <div className="content-wrapper flex-grow">
        <div className="main-content py-16">
          <div className="container mx-auto items-center justify-center mt-[50px]">
            <div className="flex justify-center">
              <div className="w-full sm:w-4/12">
                <div className="card shadow-xl bg-white rounded-lg bg-opacity-70 border-none">
                  <div className="card-body p-4">
                    <div className="flex items-center justify-center mb-[50px]">
                      <img src="/slt_logo_1.png" alt="Logo" className="w-6" />
                      <h2 className="font-bold text-[#515151] text-2xl ml-2 mt-1">Login</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block font-bold text-gray-600 mb-1">Username</label>
                        <input
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-gray-600 mb-1">Password</label>
                        <input
                          type="password"
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      {error && (
                        <p className="text-red-600 text-center mt-4">{error}</p>
                      )}
                      <button type="submit"
                        className="w-full bg-blue-700 text-white py-2 !mt-[40px] !mb-[10px] rounded-lg hover:bg-blue-700 transition duration-300">Login
                      </button>
                    </form>
                  </div>
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

export default Login;
