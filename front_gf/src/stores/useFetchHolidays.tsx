import { useState } from "react";
import { CalendarEvent } from "../components/calendar/MainCalendar";

const formatDateType = (dateNum: number): Date => {
    const year = Math.floor(dateNum / 10000);
    const month = Math.floor((dateNum % 10000) / 100) - 1; // 0-11 월 표현
    const day = dateNum % 100;
    return new Date(year, month, day);
};

interface THoliday {
    dateName: string;
    locdate: number;
    isHoliday: string;
}

const BASE_URL = "https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo";
const SERVICE_KEY = "Ans2m7PMmUcqziRVm6tqrPGnk4%2Ba%2BhPmaBeCZttXQ0GLUCRfLtmubGU7md2fqYi4eK8UKD4P0C%2Bo6fKZT8kUZg%3D%3D"; // 공공데이터포털에서 발급받은 서비스 키

export function useFetchHolidays() {
    const [holidays, setHolidays] = useState<CalendarEvent[]>([]);
    
    const fetchHolidaysByYear = async (year: string) => {
        try {
            const data = await fetch(`${BASE_URL}?solYear=${year}&ServiceKey=${SERVICE_KEY}&numOfRows=20&_type=json`);
            const { response } = await data.json();
            const _holidays = response?.body?.items?.item;
            
            if (!_holidays) return;
            
            const formatHolidays: CalendarEvent[] = (_holidays as THoliday[]).map((item, index) => {
                const date = formatDateType(item.locdate);
                return { 
                    id: 10000 + index,
                    title: item.dateName, 
                    start: date, 
                    end: date, 
                    type: "HOLIDAY", 
                    editable: false,
                    allDay: true 
                };
            });
            setHolidays(formatHolidays);
        } catch (e) {
            console.error("공휴일 데이터를 가져오는 중 오류 발생:", e);
        }
    };
    
    return { holidays, fetchHolidaysByYear };
};