import axios from "axios";
import api from "../api/axios";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../store/LoginStatusSlice';
import { useDispatch } from 'react-redux';

function OAuthAccessTokenProvider() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        axios.post('http://localhost:8080/reissue',{} ,{ withCredentials: true })
        .then((response) =>{
          console.log(response.headers);
          const accessToken = response.headers['access'];
           if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        
            api.get("/api/v2/book/mybooks")
            .then((res) => {
                console.log(res)
                if (res.data && res.data.length > 0) {
                    const hasAccessToken = !!localStorage.getItem('accessToken');
                    dispatch(loginSuccess({ accessToken: hasAccessToken}))
                    navigate("/"); // Navigate to home if data exists
                } else {
                    console.error("No books found or empty data.");
                    navigate("/book");
                }
            })
            .catch((error) => {
                console.error("Error fetching books:", error);
            });
            }
        }).catch((error) => {
            console.error('Access token reissue failed:', error);
       
        });
      }, []);

      return null;

}

export default OAuthAccessTokenProvider;