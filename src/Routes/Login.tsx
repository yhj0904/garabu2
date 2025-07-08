import axios from "axios";
import { useState } from "react";
import {Col, Row, Form, Button,Container } from "react-bootstrap";
import OAuth2Login from "../components/OAuth2Login";
import { useNavigate } from 'react-router-dom'

function Login(){

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSaveChanges = async(e:any) =>{
      e.preventDefault();

      axios.post('http://localhost:8080/login', {
        username: name,
        password: password
      }).then((response) => {
       // console.log(response.headers);
        // 여기에서 응답 헤더에서 토큰을 추출하고 저장합니다.
        const accessToken = response.headers['access'];
       if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        //console.log('Access token saved to localStorage');
        navigate("/");
        alert("로그인 완료");
    
        }else{
          alert("토큰저장실패")
        }
      }).catch((error) => {
       // console.error('Login failed:', error);
      });
    }

    return(
      <div>
        <Form onSubmit={handleSaveChanges}> 
      <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
        <Form.Label column sm={2}>
          name
        </Form.Label>
        <Col sm={10}>
          <Form.Control type="username" placeholder="username" onChange={(e)=>setName(e.target.value)} />
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
      
      <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck">
        <Col sm={{ span: 10, offset: 2 }}>
          <Form.Check label="Remember me" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="submit">Login</Button>
        </Col>
      </Form.Group>
    </Form>

      <Container>
        <OAuth2Login />
      </Container>

    </div>
    )
}

export default Login;