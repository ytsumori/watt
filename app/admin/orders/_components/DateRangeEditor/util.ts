import { add, sub, getHours, getMinutes, getSeconds, setMilliseconds } from "date-fns";

export const calculateDateRange = (searchParams: { [key: string]: string | undefined }) => {
  const { start, end } = searchParams;

  const now = new Date();
  const current = { hour: getHours(now), minute: getMinutes(now), second: getSeconds(now) };
  const duration = { hours: 23 - current.hour, minutes: 59 - current.minute, seconds: 59 - current.second };
  const subTime = { hours: current.hour, minutes: current.minute, seconds: current.second, months: 1 };

  // searchParamsがない時は、1ヶ月前の00:00:00から今日の23:59:59までのデータを取得している
  // searchParamsがある時は、startとendの日付の00:00:00から23:59:59までのデータを取得している
  return {
    start: start ? sub(new Date(start), { hours: 9 }) : setMilliseconds(sub(now, subTime), 0),
    end: end
      ? setMilliseconds(add(new Date(end), { hours: 14, minutes: 59, seconds: 59 }), 999)
      : setMilliseconds(add(now, duration), 999)
  };
};
