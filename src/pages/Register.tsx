import axios from "axios";
import { useState } from "react";
import {Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'

function Register(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSaveChanges = async(e: React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/join`,{
          username: name,
          email : email,
          password : password
        });
        
        if(response.status === 200){
            navigate("/login");
            alert("회원 가입 되었습니다.");
        }
      } catch (error) {
        console.error('Registration failed:', error);
        alert("회원가입에 실패했습니다.");
      }
    }

    return(
        <Form onSubmit={handleSaveChanges}> 
      <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
        <Form.Label column sm={2}>
          Email
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
        <Form.Label column sm={2}>
         Name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="Name" placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
        <Form.Label column sm={2}>
          Password
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit">Sign in</Button>
        </Col>
      </Form.Group>
    </Form>



    )
}

export default Register;