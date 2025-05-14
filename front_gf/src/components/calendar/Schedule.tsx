import { useState, useEffect } from "react";
import { CalendarEvent } from "./MainCalendar";
import "../../styles/schedule.css";

// ColorOption 인터페이스 추가
interface ColorOption {
  schedule_color_no: number;
  schedule_color_name: string;
  schedule_color: string;
}

interface ScheduleProps {
    selectedDate?: Date;
    dateRange?: {start: Date; end: Date};
    event?: CalendarEvent;
    onSave: (event: Omit<CalendarEvent, "id">) => void;
    onClose: () => void;
    colors: ColorOption[]; // ColorOption 타입으로 명시
}

export default function Schedule({
    selectedDate,
    dateRange,
    event,
    onSave,
    onClose,
    colors = []
}: ScheduleProps) {
    const [title, setTitle] = useState(event?.title || "");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState<Date>(selectedDate || dateRange?.start || new Date());
    const [endDate, setEndDate] = useState<Date>(selectedDate || dateRange?.end || new Date());
    const [allDay, setAllDay] = useState(event?.allDay || dateRange ? true : false);
    const [selectedColor, setSelectedColor] = useState<number | null>(null);

    function hexToRgba(hex: string, alpha: number): string {
        const sanitized = hex.replace("#", "");
        if (sanitized.length !== 6) return `rgba(0,0,0,${alpha})`;

        const r = parseInt(sanitized.slice(0, 2), 16);
        const g = parseInt(sanitized.slice(2, 4), 16);
        const b = parseInt(sanitized.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // 색상에 투명도를 적용하는 함수 추가
    function getColorWithOpacity(color: string, alpha: number = 0.1): string {
        if (color.startsWith('#')) {
            return hexToRgba(color, alpha);
        } else if (color.startsWith('rgb(')) {
            return color.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, `rgba($1, $2, $3, ${alpha})`);
        } else if (color.startsWith('rgba(')) {
            return color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${alpha})`);
        }
        return color;
    }

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setStartDate(event.start);
            setEndDate(event.end);
            setAllDay(event.allDay || false);
            if (event.resource?.schedule_color) {
                setSelectedColor(event.resource.schedule_color);
            }
        }
    }, [event]);

    const formatDateForInput = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`
        };
    };

    const startFormatted = formatDateForInput(startDate);
    const endFormatted = formatDateForInput(endDate);

    const handleSave = () => {
        const newEvent: Omit<CalendarEvent, "id"> = {
            title,
            start: new Date(startDate),
            end: new Date(endDate),
            allDay,
            type: "USER",
            editable: true,
            resource: {
                schedule_content: content,
                schedule_color: selectedColor
            }
        };
        onSave(newEvent);
        onClose();
    }

    const handleAllDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAllDay(event.target.checked);
        if (event.target.checked) {
            const newStartDate = new Date(startDate);
            newStartDate.setHours(0, 0, 0, 0)

            const newEndDate = new Date(endDate);
            newEndDate.setHours(23, 59, 59, 999);

            setStartDate(newStartDate);
            setEndDate(newEndDate);
        }
    };

    return(
        <>
            <div className="schedule-content">
                <div className="schedule-item">
                    <label htmlFor="title" />
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="일정"
                        className="schedule-input"
                    />
                </div>

                <div className="schedule-checkbox">
                    <input
                        type="checkbox"
                        id="allDay"
                        checked={allDay}
                        onChange={handleAllDayChange}
                        className="checkbox-input"
                    />
                    <label className="checkbox-label" htmlFor="allDay">
                        종일
                    </label>
                </div>

                <div className="schedule-row">
                    <div className="schedule-item">
                        <label htmlFor="startDate">시작일</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startFormatted.date}
                            onChange={(event) => {
                                const [year, month, day] = event.target.value.split('-').map(Number);
                                const newDate = new Date(startDate);
                                newDate.setFullYear(year, month - 1, day);
                                setStartDate(newDate);
                            }}
                            className="schedule-input"
                        />
                        {!allDay && (
                            <input
                                type="time"
                                id="startTime"
                                value={startFormatted.time}
                                onChange={(event) => {
                                    const [hours, minutes] = event.target.value.split(':').map(Number);
                                    const newDate = new Date(startDate);
                                    newDate.setHours(hours, minutes);
                                    setStartDate(newDate);
                                }}
                                className="schedule-input time-input"
                            />
                        )}
                    </div>

                    <div className="schedule-item">
                        <label htmlFor="endDate">종료일</label>
                        <input
                            type="date"
                            id="endDate"
                            value={endFormatted.date}
                            onChange={(event) => {
                                const [year, month, day] = event.target.value.split('-').map(Number);
                                const newDate = new Date(endDate);
                                newDate.setFullYear(year, month - 1, day);
                                setEndDate(newDate);
                            }}
                            className="schedule-input"
                        />
                        {!allDay && (
                            <input
                                type="time"
                                id="endTime"
                                value={endFormatted.time}
                                onChange={(event) => {
                                    const [hours, minutes] = event.target.value.split(':').map(Number);
                                    const newDate = new Date(endDate);
                                    newDate.setHours(hours, minutes);
                                    setEndDate(newDate);
                                }}
                                className="schedule-input time-input"
                            />
                        )}
                    </div>

                    <div className="schedule-item">
                        <label htmlFor="content" />
                        <textarea
                            id="content"
                            value={content}
                            onChange={(event) => setContent(event.target.value)}
                            placeholder="내용을 입력하세요"
                            className="schedule-textarea"
                            rows={4}
                        />
                    </div>

                    {colors.length > 0 && (
                        <div className="schedule-item">
                            <label>일정 분류</label>
                            {colors.map((color) => (
                                <div
                                    key={color.schedule_color_no}
                                    className={`color-option ${selectedColor === color.schedule_color_no ? 'selected' : ''}`}
                                    style={{ 
                                        color: color.schedule_color,
                                        backgroundColor: getColorWithOpacity(color.schedule_color, 0.1) // 10% 투명도
                                    }}
                                    onClick={() => setSelectedColor(color.schedule_color_no)}
                                    title={color.schedule_color_name}
                                ></div>
                            ))}
                        </div>
                    )}
                    <div className="button-row">
                        <button className="button1" onClick={handleSave} disabled={!title}>저장</button>
                    </div>




                </div>

            </div>
        </>
    )
}