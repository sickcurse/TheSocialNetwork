// Function to add date suffix (st, nd, rd, th)
const addDateSuffix = (day) => {
    const dayString = day.toString();
    const lastChar = dayString.charAt(dayString.length - 1);
  
    if (lastChar === '1' && dayString !== '11') {
      return `${dayString}st`;
    } else if (lastChar === '2' && dayString !== '12') {
      return `${dayString}nd`;
    } else if (lastChar === '3' && dayString !== '13') {
      return `${dayString}rd`;
    }
    return `${dayString}th`;
  };
  
  // Function to format timestamp with options for month length and date suffix
  module.exports = (
    timestamp,
    { monthLength = 'short', dateSuffix = true } = {}
  ) => {
    const months = [
      monthLength === 'short' ? 'Jan' : 'January',
      monthLength === 'short' ? 'Feb' : 'February',
      monthLength === 'short' ? 'Mar' : 'March',
      monthLength === 'short' ? 'Apr' : 'April',
      monthLength === 'short' ? 'May' : 'May',
      monthLength === 'short' ? 'Jun' : 'June',
      monthLength === 'short' ? 'Jul' : 'July',
      monthLength === 'short' ? 'Aug' : 'August',
      monthLength === 'short' ? 'Sep' : 'September',
      monthLength === 'short' ? 'Oct' : 'October',
      monthLength === 'short' ? 'Nov' : 'November',
      monthLength === 'short' ? 'Dec' : 'December',
    ];
  
    const dateObj = new Date(timestamp);
    const month = months[dateObj.getMonth()];
  
    const day = dateSuffix ? addDateSuffix(dateObj.getDate()) : dateObj.getDate();
    const year = dateObj.getFullYear();
    let hours = dateObj.getHours() % 12 || 12; // Convert 24-hour to 12-hour format
    const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // Add leading zero
    const period = dateObj.getHours() >= 12 ? 'pm' : 'am';
  
    return `${month} ${day}, ${year} at ${hours}:${minutes} ${period}`;
  };
  