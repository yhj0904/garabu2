import api from '../api/axios';
import { useEffect, useState } from 'react';
import {updateMemberTransaction} from '../store/Member'
import { useDispatch, } from "react-redux";


function Mypage() {
    
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const dispatch = useDispatch();

    const newTransaction = {
      username, // id는 예시로 현재 시간의 타임스탬프를 사용
      email, // 'YYYY-MM-DD'
      error,
  };

    useEffect(()=>{
      api.get('/user/me')
        .then((res:any) => {
            setEmail(res.data.email);
            setUserName(res.data.username);
            dispatch(updateMemberTransaction(newTransaction));
            console.log(res);
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                // Handling 401 error
                setError('Please log in to continue.');
            }
        })
    },[]);

    return(
      <div>
      <h2>My Page</h2>
      <div>
        <strong>Username:</strong> {username}
      </div>
      <div>
        <strong>Email:</strong> {email}
      </div>
    </div>
    )
}

export default Mypage;