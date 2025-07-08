import api from '../api/axios';
import { useState } from 'react';
import {FloatingLabel,Form,ToggleButtonGroup,ToggleButton,Button ,Container   } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'

function LedgerBookName() {
  
    const [bookName, setBookName] = useState('');
    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();


    const handleSaveChanges = async(e:any) =>{
        e.preventDefault();
        api.post('/api/v2/book', {
            title : bookName,
        }).then((e)=>{
          navigate("/");
            //alert(JSON.stringify(e.data))
        })
    }
   

    const handleUserAddChanges = async(e:any) =>{  
        // 가계부에 유저 삽입 기능
        // 함께하기를 선택하면 유저를 초대할수 있음. 초대방식 미정. 여러 사용자가 한 가계부를 소유할수 있음. 소유한 가계부를 조회해야함
        e.preventDefault();

        api.post('/api/v2/userbook', {
            memberId : 2
        }).then((e)=>{
            alert(JSON.stringify(e.data))
        })
    }
   
    return(
    <div>
        <FloatingLabel
        controlId="floatingTextarea"
        label="가계부 이름"
        className="mb-3"
      >
        <Form.Control as="textarea" placeholder="Leave a comment here" onChange={(e) =>{setBookName(e.target.value)}} />
      </FloatingLabel>

      <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
        <ToggleButton  variant="outline-warning" id="tbg-radio-1" value={1}>
      혼자하기
        </ToggleButton>
        <ToggleButton  variant="outline-warning" id="tbg-radio-2" value={2}>
          같이하기
        </ToggleButton>
      </ToggleButtonGroup>

            <Container>
      {' '}<Button variant="outline-info" onClick={handleSaveChanges}>시작하기</Button>{' '}
      </Container>
      </div>
    )   
}

export default LedgerBookName;