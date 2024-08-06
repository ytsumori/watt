export function getUTCFromJST(dayOfWeek: number, hour: number) {
  const utcHour = hour - 9;
  if (utcHour < 0) {
    return {
      utcDayOfWeek: dayOfWeek === 0 ? 6 : dayOfWeek - 1,
      utcHour: utcHour + 24
    };
  } else {
    return { utcDayOfWeek: dayOfWeek, utcHour };
  }
}

export function getJSTFromUTC(dayOfWeek: number, hour: number) {
  const jstHour = hour + 9;
  if (jstHour > 23) {
    return {
      jstDayOfWeek: dayOfWeek === 6 ? 0 : dayOfWeek + 1,
      jstHour: jstHour - 24
    };
  } else {
    return { jstDayOfWeek: dayOfWeek, jstHour };
  }
}
