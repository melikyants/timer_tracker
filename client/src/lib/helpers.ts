export const milliSecToString = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / 1000 / 60) % 60);
  const hours = Math.floor(ms / 1000 / 60 / 60);

  const humanized = [
    pad(hours.toString(), 2),
    pad(minutes.toString(), 2),
    pad(seconds.toString(), 2),
  ].join(':');

  return humanized;
}

function pad(numberString: string, size: number) {
  let padded = numberString;
  while (padded.length < size) padded = `0${padded}`;
  return padded;
}

export const isToday = (someDate: Date) => {
  const today = new Date()
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
}

export const sortByDates = (a: string, b: string) => {
  let dateA = new Date(a)
  let dateB = new Date(b)
  if (dateA > dateB) return -1;
  if (dateA === dateB) return 0;
  if (dateA < dateB) return 1;
  return 0
}