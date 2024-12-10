
function useRecorder(audio) {
    const state = Vue.ref('inactive');
    const chunks = [];

    // Initialize Stream
    const canvasStream = select('canvas').elt.captureStream(FRAMES);
    const audioContext = getAudioContext();
    const audioStream = audioContext.createMediaStreamDestination();
    audio.connect(audioStream);
    const stream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.stream.getAudioTracks(),
    ]);

    // Initialize Recorder
    const recorder = new MediaRecorder(stream, {
        mimeType: 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"'
    });
    recorder.onstart = () => {
        state.value = recorder.state;
    };
    recorder.onstop = () => {
        state.value = recorder.state;
    };
    recorder.onpause = () => {
        state.value = recorder.state;
    };
    recorder.onresume = () => {
        state.value = recorder.state;
    };
    recorder.onerror = (err) => {
        console.error('[recorder] error:', err);
    };
    recorder.ondataavailable = e => {
        chunks.push(e.data);
    };

    /**
     * Start Recording
     */
    async function start() {
        if (state.value != 'inactive') {
            return;
        }
        if (DEBUG) console.log('[recorder] start');
        recorder.start();
    }

    /**
     * Pause Recording
     */
    async function pause() {
        if (state.value != 'recording') {
            return;
        }
        if (DEBUG) console.log('[recorder] pause');

        recorder.requestData();
        recorder.pause();
        await wait(10);
    }

    /**
     * Resume Recording
     * @returns 
     */
    async function resume() {
        if (state.value != 'paused') {
            return;
        }
        if (DEBUG) console.log('[recorder] resume');

        recorder.resume();
    }

    /**
     * Stop Recording
     * @returns 
     */
    async function stop() {
        if (state.value != 'recording') {
            return;
        }
        if (DEBUG) console.log('[recorder] stop');

        recorder.requestData();
        recorder.stop();
        await wait(10);
    }

    /**
     * Stop Recording
     * @returns 
     */
    async function reset() {
        if (state.value == 'recording') {
            recorder.stop();
            await wait(10);
        }
        if (DEBUG) console.log('[recorder] reset');

        chunks.splice(0, chunks.length);
        state.value = recorder.state;
    }

    /**
     * Finalize recorded Chunks
     * @internal 
     * @returns 
     */
    async function finalize(blob) {
        const ffmpeg = FFmpeg.createFFmpeg({ log: true });
        
        let result = false;
        try {
            await ffmpeg.load();
            
            const videoData = new Uint8Array(await blob.arrayBuffer());
            ffmpeg.FS('writeFile', 'input.mp4', videoData);
            await ffmpeg.run('-i', 'input.mp4', '-c', 'copy', 'output.mp4');

            const correctedData = ffmpeg.FS('readFile', 'output.mp4');
            result = new Blob([correctedData.buffer], { type: recorder.mimeType });
        } catch (error) {
            console.error('[ffmpeg.js] error:', error);
        } finally {
            ffmpeg.exit();
        }
        return result;
    }
    
    /**
     * Download Video
     */
    async function download() {
        if (DEBUG) console.log('[recorder] download');
        state.value = 'exporting';

        // Finalize Blob
        const blob = await finalize(
            new Blob(chunks, { 'type' : recorder.mimeType })
        );
        const url = URL.createObjectURL(blob);
        
        // Download the video 
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.style = 'display: none';
        link.href = url;
        link.download = `recording-${now()}.mp4`;
        link.addEventListener('click', ev => { ev.stopPropagation(); ev.stopImmediatePropagation(); });
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();

        // Clean up
        chunks.splice(0, chunks.length);
        state.value = recorder.state;
    }

    // Export
    return {
        recorder,
        state,
        start,
        pause,
        resume,
        stop,
        reset,
        download,
    };
}
