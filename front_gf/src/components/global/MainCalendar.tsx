import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const allViews: View[] = ["month", "week", "day", "agenda"];

const events = [
    {
        title: "Test Event",
        start: new Date(),
        end: new Date()
    }
];

export default function MainCalendar() {
    return (
        <div style={{ height: "100vh", padding: "1rem" }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={allViews}
                defaultView="month"
                defaultDate={new Date()}
                style={{ height: "50%" }}
            />
        </div>
    );
}
