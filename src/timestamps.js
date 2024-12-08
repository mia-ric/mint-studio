
/**
 * Get Voice-Actor Timestamps
 * @returns 
 */
function getTimestamps() {
    if (AUDIO_FILE == '1.00_prolog.mp3') {
        return [
            [169.0, 170.0, 'karai'],
            [178.0, 179.0, 'primary'],
            [193.0, 194.0, 'karai'],
            [203.0, 204.0, 'primary'],
            [215.0, 216.0, 'karai'],
            [221.0, 222.0, 'primary'],
            [269.0, 270.0, 'karai'],
            [273.0, 274.0, 'primary'],
            [343.0, 344.0, 'ninja'],
            [346.0, 347.0, 'primary'],
            [349.0, 350.0, 'karai'],
            [356.0, 357.0, 'primary'],
            [360.0, 361.0, 'karai'],
            [366.0, 367.0, 'primary'],
        ];
    } else {
        return [];
    }
}
