import { useState, useEffect } from "react";
import {
    Calendar,
    dateFnsLocalizer,
    Views,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale/ko";

// 이벤트 타입
interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
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

    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        setEvents([
            {
                id: 1,
                title: "오늘의 일정",
                start: today,
                end: today,
                allDay: true,
            },
            {
                id: 2,
                title: "내일 미팅",
                start: new Date(tomorrow.setHours(10, 0)),
                end: new Date(tomorrow.setHours(12, 0)),
                allDay: false,
            },
        ]);
    }, []);

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
            };
            setEvents([...events, newEvent]);
        }
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        window.alert(event.title);
    };

    const moveEvent = ({ event, start, end, isAllDay }: EventDropResizeArgs) => {
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

    const resizeEvent = ({ event, start, end }: EventDropResizeArgs) => {
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

    return (
        <div style={{ height: "70vh", padding: "1rem" }}>
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
                onEventDrop={moveEvent as any}
                onEventResize={resizeEvent as any}
                onNavigate={handleNavigate}
                date={date}
                messages={{
                    allDay: "종일",
                    previous: "이전",
                    next: "다음",
                    today: "오늘",
                    month: "월",
                    week: "주",
                    day: "일",
                    agenda: "일정",
                    date: "날짜",
                    time: "시간",
                    event: "이벤트",
                    showMore: (total) => `+${total} 더보기`,
                }}
                formats={{
                    dateFormat: "dd",
                    monthHeaderFormat: "yyyy. MM",
                    dayHeaderFormat: "yyyy년 MM월 dd일 EEEE",
                    dayRangeHeaderFormat: ({ start, end }) =>
                        `${format(start, "yyyy년 MM월 dd일")} - ${format(end, "yyyy년 MM월 dd일")}`,
                    timeGutterFormat: "HH:mm",
                }}
            />
        </div>
    );
}