
export const domainEnv = process.env.ENV === 'prod' ? '' : '/api';

export function getMonthCalendar(year: number, month: number): string[][] {
    const calendar: string[][] = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();

    let week: string[] = [];
    // 前置空白：填充第一週的空白天數
    for (let i = 0; i < firstDay.getDay(); i++) {
        week.push("");
    }

    // 填充日期
    for (let day = 1; day <= daysInMonth; day++) {
        const formattedDate = `${String(day)}`;
        week.push(formattedDate);

        // 每到週日結束一週
        if (week.length === 7) {
            calendar.push(week);
            week = [];
        }
    }

    // 後置空白：填充最後一週的空白天數
    if (week.length > 0) {
        while (week.length < 7) {
            week.push("");
        }
        calendar.push(week);
    }

    return calendar;
}
