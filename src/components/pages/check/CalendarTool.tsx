import { memo } from "react"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg, DatesSetArg, EventInput } from '@fullcalendar/core';
import "./index.scss";

interface I_props {
    onEventClick?: (arg: EventClickArg) => void;
    onDatesSet?: (arg: DatesSetArg) => void;
    events: EventInput[];
    className?: string;
}

function CalendarTool ({ events, onEventClick, onDatesSet, className = "" }: I_props) {
    return (
        <section className={"calendar-container" + " " + `${className}`}>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={onEventClick}
                datesSet={onDatesSet}
                headerToolbar={{
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                }}
            />
        </section>

    )
}

export default memo(CalendarTool);