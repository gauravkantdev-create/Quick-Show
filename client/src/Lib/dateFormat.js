
export const dateFormat = (dateTime) => {
  if (!dateTime) return '-'

  // If input is a short time like '10:30' treat it as today at that time
  let dt
  if (typeof dateTime === 'string' && /^\d{1,2}:\d{2}$/.test(dateTime)) {
    const [h, m] = dateTime.split(':').map(Number)
    dt = new Date()
    dt.setHours(h, m, 0, 0)
  } else {
    dt = new Date(dateTime)
  }

  if (Number.isNaN(dt.getTime())) return '-'

  // Return a concise time string like "10:30 AM"
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}


