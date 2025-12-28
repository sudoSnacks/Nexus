interface CalendarEvent {
    title: string;
    description: string;
    location: string;
    startTime: string; // ISO String
    endTime: string;   // ISO String
}

export function generateGoogleCalendarUrl(event: CalendarEvent): string {
    const start = new Date(event.startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.endTime).toISOString().replace(/-|:|\.\d\d\d/g, "");

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.append("action", "TEMPLATE");
    url.searchParams.append("text", event.title);
    url.searchParams.append("details", event.description);
    url.searchParams.append("location", event.location);
    url.searchParams.append("dates", `${start}/${end}`);

    return url.toString();
}

export function generateOutlookCalendarUrl(event: CalendarEvent): string {
    const url = new URL("https://outlook.live.com/calendar/0/deeplink/compose");
    url.searchParams.append("subject", event.title);
    url.searchParams.append("body", event.description);
    url.searchParams.append("location", event.location);
    url.searchParams.append("startdt", event.startTime);
    url.searchParams.append("enddt", event.endTime);
    url.searchParams.append("path", "/calendar/action/compose");
    url.searchParams.append("rru", "addevent");

    return url.toString();
}

export function generateIcsFileContent(event: CalendarEvent): string {
    const start = new Date(event.startTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.endTime).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const now = new Date().toISOString().replace(/-|:|\.\d\d\d/g, "");

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GDG Nexus//NONSGML Event//EN
BEGIN:VEVENT
UID:${now}-${start}@nexus.event
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;
}

export function downloadIcsFile(event: CalendarEvent) {
    const content = generateIcsFileContent(event);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
