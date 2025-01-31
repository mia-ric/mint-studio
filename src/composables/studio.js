
function useStudio(audio, recorder) {
    const playing = Vue.ref(false);
    const recording = Vue.ref(false);
    const currentTime = Vue.ref(audio.currentTime());
    const duration = Vue.ref(audio.duration());

    // Special Formats
    const currentTimestamp = Vue.computed(() => {
        let value = currentTime.value.toFixed(1);
        let length = parseInt(duration.value).toString().length+2;
        return ('0'.repeat(length) + (value.includes('.') ? value : `${value}.0`)).slice(-length);
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
    const durationSeconds = Vue.computed(() => {
        return duration.value.toFixed(1);
    });

    // Current Time Watcher
    setInterval(() => { currentTime.value = audio.currentTime(); }, 50);

    // Keep Markers
    const markers = Vue.reactive(clone(data.timestamps, (el, idx) => {
        el.status = idx == 0 ? 'current' : 'next';
        return el; 
    }));

    // Current Marker
    const marker = Vue.ref(markers[0]);
    const markerIdx = Vue.ref(0);

    // Toggle current marker
    Vue.watch(currentTime, (time) => {
        for (let i = 0, l = markers.length; i < l; i++) {
            if (time >= markers[i].time) {
                if (time <= (markers[i+1]?.time || durationSeconds.value)) {
                    markers[i].status = 'current';
                } else {
                    markers[i].status = 'finished';
                }
            } else {
                markers[i].status = 'next';
            }
        }
    });

    // Assign current marker
    Vue.watch(markers, (newValue) => {
        marker.value = currentMarker = markers.find(item => item.status == 'current');
        markerIdx.value = markers.findIndex(item => item.status == 'current');
    }, { immediate: true });

    /**
     * Trigger Event
     * @param {string} event 
     */
    function triggerEvent(event) {
        const playerEvent = new CustomEvent('player', { detail: event });
        document.dispatchEvent(playerEvent);
    }

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
        triggerEvent('play');
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
        triggerEvent('pause');
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
        triggerEvent('stop');
    }

    /**
     * Go to Previous Marker
     */
    async function prevMarker() {
        let marker = markerIdx.value == 0 ? null : markers[markerIdx.value-1];
        let time = marker ? marker.time : 0;

        if (!playing.value) {
            await play(); // We cannot seamlessly jump without playing.
            await wait(10);
        }
        await audio.jump(time);
    }

    /**
     * Go to next Marker
     */
    async function nextMarker() {
        let marker = markerIdx.value >= (markers.length-1) ? null : markers[markerIdx.value+1];
        let time = marker ? marker.time : (parseFloat(durationSeconds.value)-0.1);

        if (!playing.value) {
            await play(); // We cannot seamlessly jump without playing.
            await wait(10);
        }
        await audio.jump(time);
    }
    
    /**
     * Fast-Backwards
     * @param {number} time
     */
    async function backward(time) {
        if (!playing.value) {
            await play(); // We cannot seamlessly jump without playing.
            await wait(10);
        }
        await audio.jump(Math.max(currentTime.value - time, 0));
    }
    
    /**
     * Fast-Forwards
     * @param {number} time
     */
    async function forward(time) {
        if (!playing.value) {
            await play(); // We cannot seamlessly jump without playing.
            await wait(10);
        }
        await audio.jump(Math.min(currentTime.value + time, audio.duration()));
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
        durationSeconds,
        markers,
        marker,
        play,
        pause,
        stop,
        prevMarker,
        nextMarker,
        backward,
        forward,
        jumpTo,
        startRecording,
    	stopRecording,
        recorder
    };
}
