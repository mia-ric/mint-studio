
function useStudio(audio, recorder) {
    const playing = Vue.ref(false);
    const recording = Vue.ref(false);
    const currentTime = Vue.ref(audio.currentTime());
    const duration = Vue.ref(audio.duration());

    // Special Formats
    const currentTimestamp = Vue.computed(() => {
        let value = currentTime.value.toFixed(1);
        return ('000' + (value.includes('.') ? value : `${value}.0`)).slice(-5);
    });
    const currentTimeFormat = Vue.computed(() => {
        let startTime = parseInt(currentTime.value);
        let startMinutes = startTime > 0 ? Math.floor(startTime / 60) : 0;
        let startSeconds = startTime > 0 ? startTime - (startMinutes * 60) : 0;
        return `${('00' + startMinutes.toString()).slice(-2)}:${('00' + startSeconds.toString()).slice(-2)}`;
    });
    const durationTimeFormat = Vue.computed(() => {
        let startTime = parseInt(duration.value);
        let startMinutes = startTime > 0 ? Math.floor(startTime / 60) : 0;
        let startSeconds = startTime > 0 ? startTime - (startMinutes * 60) : 0;
        return `${('00' + startMinutes.toString()).slice(-2)}:${('00' + startSeconds.toString()).slice(-2)}`;
    });

    // Current Time Watcher
    setInterval(() => { currentTime.value = audio.currentTime(); }, 50);

    /**
     * Play Audio
     */
    async function play() {
        playing.value = true;
        if (!audio.isPlaying()) {
            audio.play();
        }

        if (recording.value && recorder.state.value == 'paused') {
            recorder.resume();
        }
    }
    
    /**
     * Pause Audio
     */
    async function pause() {
        playing.value = false;
        if (audio.isPlaying()) {
            audio.pause();
        }

        if (recording.value && recorder.state.value == 'recording') {
            recorder.pause();
        }
    }
    
    /**
     * Stop Audio
     */
    async function stop() {
        if (!playing.value) {
            await audio.play(); // We need to start before stopping. Hilarious, i know.
        }
        playing.value = false;

        await audio.jump(0);
        await wait(20);
        await audio.stop();

        // Reset Particles
        Particle.stack = [];

        if (recording.value) {
            recorder.reset();
            recording.value = false;
        }
    }

    /**
     * Fast-Backwards
     */
    async function backward() {
        if (!playing.value) {
            await play(); // We cannot seamlessly jump without playing.
            await wait(10);
        }
        await audio.jump(Math.max(currentTime.value - 2, 0));
    }
    
    /**
     * Fast-Forwards
     */
    async function forward() {
        if (!playing.value) {
            await play(); // We cannot seamlessly jump without playing.
            await wait(10);
        }
        await audio.jump(Math.min(currentTime.value + 2, audio.duration()));
    }
    
    /**
     * Jump to a specific point
     * @param {number} time
     */
    async function jumpTo(time) {
        if (!playing.value) {
            await play(); // We cannot seamlessly jump without playing.
            await wait(10);
        }
        await audio.jump(Math.min(Math.max(time, 0), audio.duration()));
    }

    /**
     * Start Recording
     */
    async function startRecording() {
        if (recording.value) {
            return;
        }
        recording.value = true;
        await recorder.start();
        await play();
    }

    /**
     * Stop Recording
     */
    async function stopRecording() {
        if (!recording.value) {
            return;
        }
        await recorder.stop();
        recording.value = false;
        await stop();
        await recorder.download();
    }
    
    // Return Functions
    return {
        playing,
        recording,
        currentTime,
        duration,
        currentTimestamp,
        currentTimeFormat,
        durationTimeFormat,
        play,
        pause,
        stop,
        backward,
        forward,
        jumpTo,
        startRecording,
    	stopRecording,
        recorder
    };
}
