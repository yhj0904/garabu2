import axios from "axios";
import api from "../../api/axios";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../../store/LoginStatusSlice';
import { useDispatch } from 'react-redux';

function OAuthAccessTokenProvider() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/reissue`, {}, { withCredentials: true });
                const accessToken = response.headers['access'];
                
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    
                    const res = await api.get("/api/v2/book/mybooks");
                    if (res.data && res.data.length > 0) {
                        const hasAccessToken = !!localStorage.getItem('accessToken');
                        dispatch(loginSuccess({ accessToken: hasAccessToken }));
                        navigate("/"); // Navigate to home if data exists
                    } else {
                        console.error("No books found or empty data.");
                        navigate("/book");
                    }
                }
            } catch (error) {
                console.error('Access token reissue failed:', error);
            }
        };
        
        fetchData();
    }, [dispatch, navigate]);

      return null;

}

export default OAuthAccessTokenProvider;