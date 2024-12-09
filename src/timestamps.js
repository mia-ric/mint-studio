
/**
 * Get Voice-Actor Timestamp Marker
 * @returns 
 */
function initialTimestamps() {
    if (AUDIO_FILE == '1.00_prolog.mp3') {
        return [
            { start:   0.0, end: 170.0, actor: 'narrator' },
            { start: 170.0, end: 178.0, actor: 'karai' },
            { start: 178.0, end: 194.0, actor: 'narrator' },
            { start: 194.0, end: 202.0, actor: 'karai' },
            { start: 202.0, end: 216.0, actor: 'narrator' },
            { start: 216.0, end: 221.0, actor: 'karai' },
            { start: 221.0, end: 268.0, actor: 'narrator' }, // <--
            { start: 268.0, end: 273.0, actor: 'karai' },
            { start: 273.0, end: 343.0, actor: 'narrator' },
            { start: 343.0, end: 346.0, actor: 'ninja' },
            { start: 346.0, end: 349.0, actor: 'narrator' },
            { start: 349.0, end: 356.0, actor: 'karai' },
            { start: 356.0, end: 360.0, actor: 'narrator' },
            { start: 360.0, end: 366.0, actor: 'karai' },
            { start: 366.0, end: 424.0, actor: 'narrator' },
        ];
    } else {
        return [];
    }
}
