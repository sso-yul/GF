import { useState, useEffect } from "react";
import {
    Calendar,
    dateFnsLocalizer,
    Views,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../../styles/calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale/ko";
import IconButton from "../button/IconButton";
import CustomToolbar from "./CustomToolbar";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

// 공휴일 API 타입
interface THoliday {
    dateName: string;
    locdate: number; // YYYYMMDD 형식의 숫자
    isHoliday: string; // "Y" | "N"
}

// 이벤트 타입
export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
    type: "HOLIDAY" | "USER"; // 통합된 이벤트 타입
    editable?: boolean; // 편집 가능 여부 (드래그, 리사이즈 등)
}

// 드래그/리사이즈 타입
interface EventDropResizeArgs {
    event: CalendarEvent;
    start: Date;
    end: Date;
    isAllDay?: boolean;
}

// 로케일 설정
const locales = { ko };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: (date: Date) => startOfWeek(date, { locale: ko }),
    getDay,
    locales,
});

// 날짜 포맷 변환 (YYYYMMDD -> Date)
const formatDateType = (dateNum: number): Date => {
    const year = Math.floor(dateNum / 10000);
    const month = Math.floor((dateNum % 10000) / 100) - 1; // 0-11 월 표현
    const day = dateNum % 100;
    return new Date(year, month, day);
};

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
                    id: 10000 + index, // 기존 ID와 충돌 방지
                    title: item.dateName, 
                    start: date, 
                    end: date, 
                    type: "HOLIDAY", 
                    editable: false, // 공휴일은 편집 불가능
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

// 드래그 앤 드롭 캘린더 생성
const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

// View 타입 정의
type CustomView = "month" | "week" | "day" | "agenda";

export default function MainCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [view, setView] = useState<CustomView>("month");
    const [date, setDate] = useState<Date>(new Date());
    const { holidays, fetchHolidaysByYear } = useFetchHolidays();

    // 현재 연도의 공휴일 가져오기
    useEffect(() => {
        const currentYear = date.getFullYear().toString();
        fetchHolidaysByYear(currentYear);
    }, [date.getFullYear()]);

    // 기본 이벤트와 공휴일 합치기
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const defaultEvents: CalendarEvent[] = [
            {
                id: 1,
                title: "오늘의 일정",
                start: today,
                end: today,
                allDay: true,
                type: "USER", // 사용자 생성 일정
                editable: true
            },
            {
                id: 2,
                title: "내일 미팅",
                start: new Date(tomorrow.setHours(10, 0)),
                end: new Date(tomorrow.setHours(12, 0)),
                allDay: false,
                type: "USER", // 사용자 생성 일정
                editable: true
            }
        ];

        // 기본 이벤트와 공휴일을 합침
        setEvents([...defaultEvents, ...holidays]);
    }, [holidays]);

    const handleSelectSlot = ({
        start,
        end,
        slots,
    }: {
        start: Date;
        end: Date;
        slots: Date[];
        action: "select" | "click" | "doubleClick";
    }) => {
        const title = window.prompt("새 일정 제목:");
        if (title) {
            const newEvent: CalendarEvent = {
                id: events.length + 1,
                title,
                start,
                end,
                allDay: slots.length === 1,
                type: "USER",
                editable: true
            };
            setEvents([...events, newEvent]);
        }
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        window.alert(event.title);
    };

    const handleMoveEvent = ({ event, start, end, isAllDay }: EventDropResizeArgs) => {
        const idx = events.findIndex((e) => e.id === event.id);
        if (idx === -1) return;

        const updated = [...events];
        updated[idx] = {
            ...event,
            start,
            end,
            allDay: isAllDay ?? event.allDay,
        };
        setEvents(updated);
    };

    const handleResizeEvent = ({ event, start, end }: EventDropResizeArgs) => {
        const idx = events.findIndex((e) => e.id === event.id);
        if (idx === -1) return;

        const updated = [...events];
        updated[idx] = {
            ...event,
            start,
            end,
        };
        setEvents(updated);
    };

    // 날짜 변경 핸들러
    const handleNavigate = (newDate: Date) => {
        setDate(newDate);
    };

    // 내가 직접 입력한 항목만 드래그 가능하도록 설정
    const isDraggable = (event: CalendarEvent) => {
        // 편집 가능 속성이 명시적으로 있는 경우 그 값을 사용
        if (event.editable !== undefined) {
            return event.editable;
        }
        // 타입에 따라 기본값 설정
        return event.type === "USER";
    };

    return (
        <div style={{ height: "70vh", padding: "1rem" }}>
            <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                <IconButton
                    icon={faAngleLeft}
                    onClick={() => {
                        const prevYear = new Date(date);
                        prevYear.setFullYear(date.getFullYear() - 1);
                        setDate(prevYear);
                    }}
                />
                <span style={{ margin: "auto 0", fontWeight: "bold" }}>
                    {date.getFullYear()}
                </span>
                <IconButton
                    icon={faAngleRight}
                    onClick={() => {
                        const prevYear = new Date(date);
                        prevYear.setFullYear(date.getFullYear() + 1);
                        setDate(prevYear);
                    }}
                />
            </div>
            
            {/* 공휴일 표시 스타일 지정 */}
            <DnDCalendar
                localizer={localizer}
                events={events}
                view={view}
                onView={(view: string) => setView(view as CustomView)}
                defaultView={Views.MONTH}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                startAccessor="start"
                endAccessor="end"
                selectable
                resizable
                popup
                style={{ height: "100%" }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={handleMoveEvent as any}
                onEventResize={handleResizeEvent as any}
                onNavigate={handleNavigate}
                date={date}
                draggableAccessor={isDraggable}
                resizableAccessor={isDraggable}
                eventPropGetter={(event) => {
                    // 이벤트 타입에 따른 스타일 적용
                    if (event.type === "HOLIDAY") {
                        return {
                            style: {
                                backgroundColor: "#ffeae8",
                                color: "#d62e20",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "default" // 드래그 불가능한 아이템의 커서 스타일
                            }
                        };
                    }
                    return {};
                }}
                messages={{
                    // allDay: "종일",
                    // previous: <span><FontAwesomeIcon icon={faAngleLeft} /></span>,
                    // next: <span><FontAwesomeIcon icon={faAngleRight} /></span>,
                    // today: "오늘",
                    // month: "월",
                    // week: "주",
                    // day: "일",
                    // agenda: "일정",
                    // date: "날짜",
                    // time: "시간",
                    // event: "이벤트",
                    showMore: (total) => `+${total} 더보기`,
                }}
                formats={{
                    dateFormat: "dd",
                    monthHeaderFormat: "MMMM",
                    dayHeaderFormat: "MM월 dd일 EEEE",
                    dayRangeHeaderFormat: ({ start, end }) =>
                        `${format(start, "MM월 dd일")} - ${format(end, "MM월 dd일")}`,
                    timeGutterFormat: "HH:mm",
                }}
                components={{
                    toolbar: CustomToolbar
                }}
            />
        </div>
    );
}