
const isoTimeFormat = (dateTime) => {
    try {
        if (!dateTime) return 'N/A';
        
        const date = new Date(dateTime);
        
        if (isNaN(date.getTime())) {
            return 'Invalid Time';
        }
        
        const localTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        return localTime;
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'N/A';
    }
}


export default isoTimeFormat;

