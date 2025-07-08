import axios from "axios";
import { useState } from "react";
import {Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'

function Register(){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSaveChanges = async(e:any) =>{
      e.preventDefault();
      axios.post('http://localhost:8080/join',{
        username: name,
        email : email,
        password : password
      }).then((e)=>{
        if(e.request.status === 200){
            navigate("/login");
            alert("회원 가입 되었습니다.");
        }
      }).catch((error) =>{
        alert(error);
      })
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