import { useState, useEffect, useCallback } from "react";
import { useAdminCheck } from "../../stores/useAdminCheck";
import { useFetchHolidays } from "../../stores/useFetchHolidays";
import {
    Calendar,
    dateFnsLocalizer,
    Views,
    SlotInfo
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
import Modal from "../global/Modal";
import Schedule from "./Schedule";
import { getSchedule } from "../../api/api.calendar";

// 이벤트 타입
export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
    type: "HOLIDAY" | "USER";
    editable?: boolean;
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedDateRange, setSelectedDateRange] = useState<{start: Date; end: Date} | undefined>(undefined);
    const [userEvents, setUserEvents] = useState<CalendarEvent[]>([]);
    const [selectedAllDay, setSelectedAllDay] = useState<boolean>(true);


    useEffect(() => {
        const currentYear = date.getFullYear().toString();
        fetchHolidaysByYear(currentYear);
    }, [date.getFullYear()]);

    useEffect(() => {
        const loadUserEvents = async () => {
            try {
                const start = new Date(date.getFullYear(), 0, 1);
                const end = new Date(date.getFullYear(), 11, 31);
                const schedulesDto = await getSchedule(start, end);

                const mappedEvents: CalendarEvent[] = schedulesDto.map(dto => ({
                    id: dto.scheduleNo!,
                    title: dto.scheduleTitle,
                    start: new Date(dto.scheduleStart),
                    end: new Date(dto.scheduleEnd),
                    allDay: dto.scheduleAllDay,
                    type: "USER",
                    editable: dto.scheduleEditable,
                    resource: {
                        schedule_color: dto.scheduleColor,
                        schedule_content: dto.scheduleContent,
                        schedule_color_name: dto.scheduleColorName
                    }
                }));

                setUserEvents(mappedEvents);
                
                
            } catch (err) {
                console.error("사용자 일정 로드 실패:", err);
            }
        };

        loadUserEvents();
        
    }, [date.getFullYear()]);

    useEffect(() => {
        setEvents([...holidays, ...userEvents]);
    }, [holidays, userEvents]);

    const handleSelectSlot = useCallback((slotInfo: SlotInfo) => {
        if (!isAdmin) return;

        const { start, end, slots, action } = slotInfo;

        const isSingleDate = slots.length === 1 || action === "click";

        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(isSingleDate ? start : end);
        endDate.setHours(23, 59, 59, 999);

        setSelectedDate(new Date(start));
        setSelectedDateRange({
            start: startDate,
            end: endDate
        });

        setSelectedAllDay(true);
        setSelectedEvent(undefined);
        setIsModalOpen(true);
    }, [isAdmin]);

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        if (isDraggable(event)) {
            setSelectedEvent(event);
            setSelectedDate(undefined);
            setSelectedDateRange(undefined);
            setIsModalOpen(true);
        }
    }, []);

    const handleMoveEvent = useCallback(({ event, start, end, isAllDay }: EventDropResizeArgs) => {
        setEvents(prev => 
            prev.map(e => 
                e.id === event.id 
                ? { ...e, start: new Date(start), end: new Date(end), allDay: isAllDay ?? e.allDay }
                : e
            )
        );
    }, []);

    const handleSaveEvent = useCallback((eventData: Omit<CalendarEvent, "id">) => {
        if (selectedEvent) {
            // 기존 이벤트 수정
            setEvents(prev => 
                prev.map(event => 
                    event.id === selectedEvent.id 
                    ? { ...eventData, id: selectedEvent.id } 
                    : event
                )
            );
        } else {
            // 새 이벤트 추가
            const newEvent: CalendarEvent = {
                ...eventData,
                id: Date.now(), // 유니크한 ID 생성
                type: "USER",
                editable: true
            };
            setEvents(prev => [...prev, newEvent]);
        }
        
        // 모달 닫기
        handleCloseModal();
    }, [selectedEvent]);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedEvent(undefined);
        setSelectedDate(undefined);
        setSelectedDateRange(undefined);
    }, []);


    const handleResizeEvent = useCallback(({ event, start, end }: EventDropResizeArgs) => {
        setEvents(prev => 
            prev.map(e => 
                e.id === event.id 
                ? { ...e, start: new Date(start), end: new Date(end) }
                : e
            )
        );
    }, []);

    // 날짜 변경 핸들러
    const handleNavigate = useCallback((newDate: Date) => {
        setDate(newDate);
    }, []);

    // 날짜 변경 핸들러 (년도)
    const handleYearChange = useCallback((delta: number) => {
        const newDate = new Date(date);
        newDate.setFullYear(date.getFullYear() + delta);
        setDate(newDate);
    }, [date]);

    // 드래그 가능 여부 확인
    const isDraggable = useCallback((event: CalendarEvent) => {
        // 편집 가능 속성이 명시적으로 있는 경우 그 값을 사용
        if (event.editable !== undefined) {
            return event.editable;
        }
        // 타입에 따라 기본값 설정
        return event.type === "USER";
    }, []);

    return (
        <div style={{ height: "70vh", padding: "1rem" }}>
            <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                <IconButton
                    icon={faAngleLeft}
                    onClick={() => handleYearChange(-1)}
                />
                <span style={{ margin: "auto 0", fontWeight: "bold" }}>
                    {date.getFullYear()}
                </span>
                <IconButton
                    icon={faAngleRight}
                    onClick={() => handleYearChange(1)}
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
                    if (event.type === "USER") {
                        const color = event.resource?.schedule_color_name || "#000000";

                        // HEX → RGBA 변환
                        const hexToRGBA = (hex: string, alpha: number) => {
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);
                            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        };

                        const overlayColor = hexToRGBA(color, 0.1);

                        return {
                            style: {
                                backgroundColor: "#ffffff",
                                backgroundImage: `linear-gradient(${overlayColor}, ${overlayColor})`,
                                color: color,
                                borderRadius: "4px",
                                cursor: isAdmin ? "pointer" : "default"
                            }
                        };
                    }

                    return {};
                }}
                messages={{
                    showMore: (total) => `+${total}`,
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

            {isModalOpen && (
                <Modal isOpen={true} title={selectedEvent ? (isAdmin ? "일정 수정" : "일정") : "새 일정"} onClose={handleCloseModal}>
                    <Schedule 
                        selectedDate={selectedDate}
                        dateRange={selectedDateRange}
                        event={selectedEvent}
                        onSave={handleSaveEvent}
                        onClose={handleCloseModal}
                        readOnly={!isAdmin}
                        isAdmin={isAdmin}
                        allDay={true}
                    />
                </Modal>
            )}
        </div>
    );
}