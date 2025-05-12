import { useState, useEffect } from "react";
import { useAdminCheck } from "../../stores/useAdminCheck";
import { useFetchHolidays } from "../../stores/useFetchHolidays";
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

// 드래그 앤 드롭 캘린더 생성
const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

// View 타입 정의
type CustomView = "month" | "week" | "day" | "agenda";

export default function MainCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [view, setView] = useState<CustomView>("month");
    const [date, setDate] = useState<Date>(new Date());
    const { holidays, fetchHolidaysByYear } = useFetchHolidays();
    const { isAdmin } = useAdminCheck();

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
                selectable={isAdmin}
                resizable={isAdmin}
                popup
                style={{ height: "100%" }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                onEventDrop={isAdmin ? handleMoveEvent as any : undefined}
                onEventResize={isAdmin ? handleResizeEvent as any : undefined}
                onNavigate={handleNavigate}
                date={date}
                draggableAccessor={(event)=> isAdmin && isDraggable(event)}
                resizableAccessor={(event)=> isAdmin && isDraggable(event)}
                eventPropGetter={(event) => {
                    if (event.type === "HOLIDAY") {
                        return {
                            style: {
                                backgroundColor: "#ffeae8",
                                color: "#d62e20",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "default"
                            }
                        };
                    }
                    if (!isAdmin) {
                        return {
                            style: {
                                cursor: "default"
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