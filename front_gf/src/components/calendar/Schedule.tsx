import { useState, useEffect } from "react";
import { CalendarEvent } from "./MainCalendar";
import "../../styles/schedule.css";
import { ScheduleColorDto, ScheduleDto, ScheduleType } from "../../stores/types";
import { getScheduleColor, saveSchedule, modifySchedule } from "../../api/api.calendar";

interface ScheduleProps {
    selectedDate?: Date;
    dateRange?: {start: Date; end: Date};
    event?: CalendarEvent;
    onSave: (event: Omit<CalendarEvent, "id">) => void;
    onClose: () => void;
    readOnly?: boolean;
    isAdmin?: boolean;
    allDay: boolean;
}

export default function Schedule({
    selectedDate,
    dateRange,
    event,
    onSave,
    onClose,
    readOnly = false,
    isAdmin = false,
    allDay: propAllDay,
}: ScheduleProps) {
    const isReadOnly = readOnly || !isAdmin;

    const [title, setTitle] = useState(event?.title || "");
    const [content, setContent] = useState("");
    const [startDate, setStartDate] = useState<Date>(
        dateRange?.start || selectedDate || new Date()
    );
    const [endDate, setEndDate] = useState<Date>(
        dateRange?.end || selectedDate || new Date()
    );
    const [allDay, setAllDay] = useState<boolean>(
        propAllDay ?? event?.allDay ??
        (dateRange
            ? (dateRange.start.getHours() === 0 && dateRange.end.getHours() === 23
                ? true
                : false)
            : false)
    );
    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [selectedColorName, setSelectedColorName] = useState<string | undefined>(undefined);

    const [colorOptions, setColorOptions] = useState<ScheduleColorDto[]>([]);
    
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setStartDate(event.start);
            setEndDate(event.end);
            setAllDay(event.allDay ?? false);
            setContent(event.resource?.schedule_content || ""); 
            if (event?.resource?.schedule_color) {
                setSelectedColor(event.resource.schedule_color);
            }
            if (event?.resource?.schedule_color_name) {
                setSelectedColorName(event.resource.schedule_color_name);
            }

        }
    }, [event]);

    useEffect(() => {
        if (endDate < startDate) {
            setError("종료일은 시작일보다 빠를 수 없습니다.");
        } else {
            setError(null);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        const loadColors = async () => {
            try {
                const colors = await getScheduleColor();
                setColorOptions(colors);
            } catch (error) {
                console.error("색상 옵션을 불러오는 데 실패했습니다.");
            }
        };

        loadColors();
    }, []);

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

    const handleSave = async () => {
        if (isReadOnly || error) return;

        try {
            const newEvent: Omit<CalendarEvent, "id"> = {
                title,
                start: new Date(startDate),
                end: new Date(endDate),
                allDay,
                type: "USER",
                editable: true,
                resource: {
                    schedule_content: content,
                    schedule_color: selectedColor,
                    schedule_color_name: selectedColorName
                }
            };

            // ScheduleDto 형식으로 변환
            const scheduleData: ScheduleDto = {
                scheduleTitle: title,
                scheduleContent: content,
                scheduleStart: startDate,
                scheduleEnd: endDate,
                scheduleAllDay: allDay,
                scheduleType: ScheduleType.USER,
                scheduleEditable: true,
                scheduleColor: selectedColor || undefined,
                scheduleColorName: selectedColorName
            };

            
            if (event?.id) {
                // 수정 API 호출 - 오류 발생 시 더 많은 정보 기록
                try {
                    const updatedSchedule = await modifySchedule(event.id, scheduleData);
                } catch (apiError) {
                    throw apiError;
                }
            } else {
                // 저장 API 호출
                const savedSchedule = await saveSchedule(scheduleData);
            }
            
            onSave(newEvent);
            onClose();
        } catch (error) {
            setError("일정 저장에 실패했습니다.");
        }
    };

    const handleAllDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isReadOnly) return;

        setAllDay(event.target.checked);
        if (event.target.checked) {
            const newStartDate = new Date(startDate);
            newStartDate.setHours(0, 0, 0, 0);

            const newEndDate = new Date(endDate);
            newEndDate.setHours(23, 59, 59, 999);

            setStartDate(newStartDate);
            setEndDate(newEndDate);
        }
    };

    return (
        <div className="schedule-content">
            <div className="schedule-item">
                <label htmlFor="title" />
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(event) => !isReadOnly && setTitle(event.target.value)}
                    placeholder="일정"
                    className="schedule-input"
                    readOnly={isReadOnly}
                />
            </div>

            <div className="schedule-checkbox">
                <input
                    type="checkbox"
                    id="allDay"
                    onChange={handleAllDayChange}
                    className="checkbox-input"
                    disabled={isReadOnly}
                    checked={allDay}
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
                            if (isReadOnly) return;
                            const [year, month, day] = event.target.value.split('-').map(Number);
                            const newDate = new Date(startDate);
                            newDate.setFullYear(year, month - 1, day);
                            setStartDate(newDate);
                        }}
                        className="schedule-input"
                        disabled={isReadOnly}
                    />
                    {!allDay && (
                        <input
                            type="time"
                            id="startTime"
                            value={startFormatted.time}
                            onChange={(event) => {
                                if (isReadOnly) return;
                                const [hours, minutes] = event.target.value.split(':').map(Number);
                                const newDate = new Date(startDate);
                                newDate.setHours(hours, minutes);
                                setStartDate(newDate);
                            }}
                            className="schedule-input time-input"
                            disabled={isReadOnly}
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
                            if (isReadOnly) return;
                            const [year, month, day] = event.target.value.split('-').map(Number);
                            const newDate = new Date(endDate);
                            newDate.setFullYear(year, month - 1, day);
                            setEndDate(newDate);
                        }}
                        className="schedule-input"
                        disabled={isReadOnly}
                    />
                    {!allDay && (
                        <input
                            type="time"
                            id="endTime"
                            value={endFormatted.time}
                            onChange={(event) => {
                                if (isReadOnly) return;
                                const [hours, minutes] = event.target.value.split(':').map(Number);
                                const newDate = new Date(endDate);
                                newDate.setHours(hours, minutes);
                                setEndDate(newDate);
                            }}
                            className="schedule-input time-input"
                            disabled={isReadOnly}
                        />
                    )}
                </div>
            </div>

            <div className="schedul-row">
                {error && <p className="error-message">{error}</p>}
            </div>

            <div className="schedule-row">
                <div className="schedule-item">
                    <label htmlFor="content" />
                    <textarea
                        id="content"
                        value={content}
                        onChange={(event) => !isReadOnly && setContent(event.target.value)}
                        placeholder="내용을 입력하세요"
                        className="schedule-textarea"
                        rows={4}
                        readOnly={isReadOnly}
                    />
                </div>
            </div>


            <div className="schedule-row">
                <div className="schedule-item">
                    <label htmlFor="scheduleColor">일정 분류</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                        {isReadOnly
                            ?  // 읽기 전용일 때: 선택된 색상 하나만 보여주기
                            colorOptions
                                .filter(color => color.scheduleColorNo === selectedColor)
                                .map(color => (
                                    <div
                                        key={color.scheduleColorNo}
                                        style={{
                                            backgroundColor: `${color.scheduleColor}1A`,
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: `2px solid ${color.scheduleColor}`,
                                            color: color.scheduleColor,
                                            fontWeight: "bold",
                                            cursor: "default"
                                        }}
                                    >
                                        {color.scheduleColorName}
                                    </div>
                                ))
                            :  // 수정/생성 모드일 때: 전체 리스트 보여주기
                            colorOptions.map(color => {
                                const isSelected = selectedColor === color.scheduleColorNo;
                                return (
                                    <div
                                        key={color.scheduleColorNo ?? color.scheduleColorName}
                                        onClick={() => setSelectedColor(color.scheduleColorNo || null)}
                                        style={{
                                            backgroundColor: `${color.scheduleColor}1A`,
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            border: isSelected ? `2px solid ${color.scheduleColor}` : "1px solid #ccc",
                                            color: color.scheduleColor,
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {color.scheduleColorName}
                                    </div>
                                );
                            })}
                    </div>
                </div>

                {isAdmin && (
                    <div className="button-row">
                        <button
                            className="button1"
                            onClick={handleSave}
                            disabled={isReadOnly || !title || !!error}
                        >
                            저장
                        </button>
                    </div>
                 )}

                </div>
        </div>
    );
}