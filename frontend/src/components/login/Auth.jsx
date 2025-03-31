import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // You need to use the default import
import { useNavigate } from 'react-router-dom';

const Auth = (WrappedComponent) => {
  return (props) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Function to check and refresh the access token if needed
    const checkAuthStatus = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        try {
          const decoded = jwtDecode(accessToken);

          //Server Verification
          const response = await axios.post('/auth/verify',{},{headers: { Authorization: `Bearer ${accessToken}` },withCredentials: true,}
          );

          if (response?.data?.valid){
            setUser({userID: decoded.userID,role: decoded.role,name: decoded.name,});
            setLoading(false);
          }
          else {
            //Initial verification failed, attempt to request a refresh token..
            if (refreshToken){
              refreshAccessToken(refreshToken)
            }
            else{
              navigate('/login');
            }
            
          }
          
          
        } catch (error) {
          await refreshAccessToken(refreshToken);
        }
      } 
      //Alternatively, if no Auth Token, Try Refresh Token
      else if (refreshToken) {
        await refreshAccessToken(refreshToken);
      }
      // No tokens, go to login
      else {
        setLoading(false); 
      }
    };







    // Function to refresh the access token using refresh token
    const refreshAccessToken = async (refreshToken) => {
      try {
        const response = await axios.post('/auth/token', { token: refreshToken });

        if (response?.data?.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          const decoded = jwtDecode(response.data.accessToken);
          console.log(decoded)
          setUser({userID: decoded.userID,role: decoded.role,name: decoded.name,});
          setLoading(false);
        } 
        else {
          //No Valid Token
          navigate('/login');
        }
      } catch (error) {
        navigate('/login'); // Navigate to login on error
      }
    };

    useEffect(() => {
      checkAuthStatus();
    }, []);

    // Loading state while checking auth
    if (loading) {
      return <div>Loading...</div>; 
    }

    // If no user ID is found, navigate to login
    if (!user?.userID) {
      navigate('/login'); 
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

export default Auth;
