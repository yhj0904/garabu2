import { Tabs, Tab } from "react-bootstrap";
import CategoryDetail from "../components/CategoryDetail";
import PaymentDetail from "../components/PaymentDetail";

function Category() {
  return (
  <div>
    <Tabs
      defaultActiveKey="home"
      id="justify-tab-example"
      className="mb-3"
      justify
    >
      <Tab eventKey="home" title="카테고리">
       <CategoryDetail />
      </Tab>
      <Tab eventKey="profile" title="지불 방법">
        <PaymentDetail />
      </Tab>
      <Tab eventKey="longer-tab" title="Tab">
        Tab content for Loooonger Tab
      </Tab>
      <Tab eventKey="contact" title="상세 카테고리" disabled>
        상세 카테고리
      </Tab>
    </Tabs>

  </div>
  )
}

export default Category;

//payment도 함께 추가

/*  카테고리 설정은 기본설정과 상세 설정이 있다.
    기본설정이 default값이며 기본설정으로 되어있을경우
    카테고리의 입력은 disabled상태이다.
    사용자지정을 클릭하면 카테고리의 입력값들이 active.

*/

/**
 *  상세 카테고리는 카테고리내의 카테고리일것이다.
 *  카테고리가 식비이면 술, 외식, 배달 ~~~~ 등등.
 *  기늘 구현할지는 미정.
 */

// <Fade in={open}>

// </Fade>