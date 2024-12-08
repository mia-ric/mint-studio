
class Recorder {
    /**
     * Create a new Recorder instance
     * @param {MediaStream} stream 
     * @param {number} frames 
     */
    constructor(stream, frames) {
        this.chunks = [];

        this.frames = frames;
        this.stream = stream;
        this.recorder = new MediaRecorder(stream, {
            mimeType: 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"'
        });
        this.recorder.ondataavailable = e => {
            this.chunks.push(e.data);
        };
    }

    /**
     * Get current MediaRecorder State
     */
    get state() {
        return this.recorder.state;
    }

    /**
     * Start MediaRecorder
     */
    start() {
        if (this.state != 'inactive') {
            return;
        }
        if (DEBUG) {
            console.log('[recorder] start');
        }

        this.recorder.start();
    }

    /**
     * Pause MediaRecorder
     */
    async pause() {
        if (this.state != 'recording') {
            return;
        }
        if (DEBUG) {
            console.log('[recorder] pause');
        }
        this.recorder.requestData();
        this.recorder.pause();
        await wait(10);
    }

    /**
     * Resume MediaRecorder
     */
    resume() {
        if (this.state != 'paused') {
            return;
        }
        if (DEBUG) {
            console.log('[recorder] resume');
        }
        this.recorder.resume();
    }

    /**
     * Stop MediaRecorder
     */
    async stop() {
        if (this.state != 'recording') {
            return;
        }
        if (DEBUG) {
            console.log('[recorder] stop');
        }

        this.recorder.requestData();
        this.recorder.stop();
        await wait(10);
    }

    /**
     * Finalize Video Data using ffmpeg.js
     */
    async finalize(blob) {
        const ffmpeg = FFmpeg.createFFmpeg({ log: true });
        
        let result = false;
        try {
            await ffmpeg.load();
            
            const videoData = new Uint8Array(await blob.arrayBuffer());
            ffmpeg.FS('writeFile', 'input.mp4', videoData);
            await ffmpeg.run('-i', 'input.mp4', '-c', 'copy', 'output.mp4');

            const correctedData = ffmpeg.FS('readFile', 'output.mp4');
            result = new Blob([correctedData.buffer], { type: this.recorder.mimeType });
        } catch (error) {
            console.error('ffmpeg.js error:', error);
        } finally {
            ffmpeg.exit();
        }
        return result;
    }

    /**
     * Download Video
     */
    async download() {
        if (DEBUG) {
            console.log('[recorder] download');
        }
        const blob = await this.finalize(
            new Blob(this.chunks, { 'type' : this.recorder.mimeType })
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
    }
}
