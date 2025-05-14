import { JSX, useState } from "react";
import { ToolbarProps, Views, View } from "react-big-calendar";
import { faAngleLeft, faAngleRight, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import IconButton from "../button/IconButton";
import Button from "../button/Button";
import { CalendarEvent } from "./MainCalendar";
import "../../styles/calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ColorCategoryForm from "./ColorCategoryForm";
import Modal from "../global/Modal";

const CustomToolbar = (
    props: ToolbarProps<CalendarEvent, object>
): JSX.Element => {
    const [showColorModal, setShowColorModal] = useState(false);

    const goToBack = () => props.onNavigate("PREV");
    const goToNext = () => props.onNavigate("NEXT");
    const goToToday = () => props.onNavigate("TODAY");

    const handleViewChange = (view: View) => {
        props.onView(view);
    };

    return (
        <>
            <div className="rbc-toolbar">
                <div className="prev-next">
                    <IconButton icon={faAngleLeft} onClick={goToBack} />
                    <div
                        style={{
                            fontWeight: "bold",
                            fontSize: "1rem",
                            width: "9vh",
                            justifyContent: "center"
                        }}
                    >
                        {props.label}
                    </div>
                    <IconButton icon={faAngleRight} onClick={goToNext} />
                    <Button iconPosition="right" onClick={goToToday}>TODAY</Button>
                </div>

                <div className="month-week-day">
                    <Button iconPosition="right" onClick={() => handleViewChange(Views.MONTH)}>월</Button>
                    <Button iconPosition="right" onClick={() => handleViewChange(Views.WEEK)}>주</Button>
                    <Button iconPosition="right" onClick={() => handleViewChange(Views.DAY)}>일</Button>
                    <IconButton icon={faCalendarPlus} onClick={() => setShowColorModal(true)} />
                </div>
            </div>

            {showColorModal && (
                <Modal
                    isOpen={showColorModal}
                    onClose={() => setShowColorModal(false)}
                    title="일정 분류 추가"
                >
                    <ColorCategoryForm
                        onSave={() => setShowColorModal(false)}
                        onCancel={() => setShowColorModal(false)}
                    />
                </Modal>
            )}
        </>
    );
};

export default CustomToolbar;
