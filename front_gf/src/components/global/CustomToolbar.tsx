import { JSX } from "react";
import { ToolbarProps, Views, View } from "react-big-calendar";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../button/IconButton";
import Button from "../button/Button";
import { CalendarEvent } from "./MainCalendar";
import "../../styles/calendar.css"
import "react-big-calendar/lib/css/react-big-calendar.css";

const CustomToolbar = (
    props: ToolbarProps<CalendarEvent, object>
): JSX.Element => {
    const goToBack = () => props.onNavigate("PREV");
    const goToNext = () => props.onNavigate("NEXT");
    const goToToday = () => props.onNavigate("TODAY");

    const handleViewChange = (view: View) => {
        props.onView(view);
    };

    return (
        <div className="rbc-toolbar" style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "1.5rem",
            height: "1.5rem",
        }}>
            <div className="monthPrevNext">
                <IconButton icon={faAngleLeft} onClick={goToBack} />
                <div style={{ fontWeight: "bold", fontSize: "1rem", width: "9vh", justifyContent: "center" }}>
                    {props.label}
                </div>
                <IconButton icon={faAngleRight} onClick={goToNext} />
                <Button iconPosition="right" onClick={goToToday}>TODAY</Button>
            </div>

            <div className="monthWeekDay">
                <Button iconPosition="right" onClick={() => handleViewChange(Views.MONTH)}>월</Button>
                <Button iconPosition="right" onClick={() => handleViewChange(Views.WEEK)}>주</Button>
                <Button iconPosition="right" onClick={() => handleViewChange(Views.DAY)}>일</Button>
            </div>
        </div>
    );
};

export default CustomToolbar;
