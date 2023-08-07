export default function formatTime(time) {
    const date = time ? new Date(time) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    const second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth() + 1;
    const nowDay = now.getDate();

    if (year === nowYear && month === nowMonth && day === nowDay) {
        return "今天" + " " + [hour, minute, second].join(":");
    } else if (year === nowYear && month === nowMonth && day === nowDay - 1) {
        return "昨天" + " " + [hour, minute, second].join(":");
    } else if (year === nowYear && month === nowMonth && day === nowDay - 2) {
        return "前天" + " " + [hour, minute, second].join(":");
    }

    return (
        [year, month, day].join("/") + " " + [hour, minute, second].join(":")
    );
}