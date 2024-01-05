"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

const events: {
  id: string;
  day: number;
  beginTime: string;
  endTime: string;
}[] = [
  { id: "a", day: 1, beginTime: "10:00", endTime: "15:00" },
  { id: "b", day: 2, beginTime: "18:00", endTime: "20:00" },
  { id: "c", day: 3, beginTime: "10:00", endTime: "15:00" },
];

export function DashboardSchedule() {
  const today = new Date();
  const currentDay = today.getDay(); // Sunday - Saturday : 0 - 6

  return (
    <FullCalendar
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      allDaySlot={false}
      slotEventOverlap={false}
      nowIndicator
      dayHeaderFormat={{ weekday: "long" }}
      locale="ja"
      headerToolbar={{
        left: "",
        center: "",
        right: "",
      }}
    />
  );
}
