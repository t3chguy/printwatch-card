/**
 * Format remaining time duration into human readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return 'Complete';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

/**
 * Calculate and format the end time based on remaining minutes
 * @param {number} remainingMinutes - Remaining time in minutes
 * @param {object} hass - Home Assistant instance
 * @returns {string} Formatted end time
 */
export const formatEndTime = (remainingMinutes, hass) => {
  if (!remainingMinutes || remainingMinutes <= 0) return '---';
  const endTime = new Date(Date.now() + remainingMinutes * 60000);
  const timeFormat = hass.locale.hour_24 ? 
    { hour: '2-digit', minute: '2-digit', hour12: false } :
    { hour: 'numeric', minute: '2-digit', hour12: true };
  return new Intl.DateTimeFormat(hass.locale.language, timeFormat)
    .format(endTime)
    .toLowerCase()
    .replace(' ', '');
};