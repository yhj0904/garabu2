import { useState } from "react";
import {
    StyledCalendarWrapper,
    StyledCalendar,
    StyledDate,
    StyledToday,
    StyledDot,
  } from "../style/style";
  import moment from "moment";
import { Content } from "react-bootstrap/lib/Tab";
  
  type ValuePiece = Date | null;
  type Value = ValuePiece | [ValuePiece, ValuePiece];
  
  const CalendarPage = () => {
    const today = new Date();
    const [date, setDate] = useState<Value>(today);
    const [activeStartDate, setActiveStartDate] = useState<Date | null>(
      new Date()
    );
    const attendDay = ["2023-12-03", "2023-12-13"]; // 출석한 날짜 예시
  
    const dayToAmount = [
        //일에 표시될햣 총 지출, 수입 데이터
    ]

    const addContent =({amount}:any)=>{
        const content =[];

        //각 타일에 컨텐츠 추가.

    }

    const handleDateChange = (newDate: Value) => {
      setDate(newDate);
    };
  
    const handleTodayClick = () => {
      const today = new Date();
      setActiveStartDate(today);
      setDate(today);
    };
  
    return (
        <StyledCalendarWrapper>
          <StyledCalendar
            value={date}
            onChange={handleDateChange}
            formatDay={(locale, date) => moment(date).format("D")}
            formatYear={(locale, date) => moment(date).format("YYYY")}
            formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
            calendarType="gregory"
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            minDetail="year"
            // 오늘 날짜로 돌아오는 기능을 위해 필요한 옵션 설정
            activeStartDate={
              activeStartDate === null ? undefined : activeStartDate
            }
            onActiveStartDateChange={({ activeStartDate }) =>
              setActiveStartDate(activeStartDate)
            }
            // 오늘 날짜에 '오늘' 텍스트 삽입하고 출석한 날짜에 점 표시를 위한 설정
            tileContent={({ date, view }) => {
              let html = [];
              if (
                view === "month" &&
                date.getMonth() === today.getMonth() &&
                date.getDate() === today.getDate()
              ) {
                html.push(<StyledToday key={"today"}>오늘</StyledToday>);
              }
              if (
                attendDay.find((x) => x === moment(date).format("YYYY-MM-DD"))
              ) {
                html.push(<StyledDot key={moment(date).format("YYYY-MM-DD")} />);
              }
              return <>{html}</>;
            }}
          />
          
          <StyledDate onClick={handleTodayClick}>오늘</StyledDate>
        </StyledCalendarWrapper>
    );
  };
  // 오늘 버튼 추가
  export default CalendarPage;