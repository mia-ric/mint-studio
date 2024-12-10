
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
     * Loading State
     * @param {boolean} state 
     */
    loading(state) {
        if (state) {
            let loader = document.querySelector('.loader');
            if (!loader) {
                loader = document.createElement('DIV');
                loader.className = 'loader';
                loader.innerHTML = `
                    <div class="loader-message">
                        <svg class="w-64 h-64" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 16 16" fill="currentColor"><path fill="currentColor" d="M12.9 3.1c1.3 1.2 2.1 3 2.1 4.9 0 3.9-3.1 7-7 7s-7-3.1-7-7c0-1.9 0.8-3.7 2.1-4.9l-0.8-0.8c-1.4 1.5-2.3 3.5-2.3 5.7 0 4.4 3.6 8 8 8s8-3.6 8-8c0-2.2-0.9-4.2-2.3-5.7l-0.8 0.8z"></path></svg>
                        <span>Converting Video...</span>
                    </div>
                `;
                document.body.append(loader);
            }
            if (!loader.classList.contains('visible')) {
                setTimeout(() => loader.classList.add('visible'), 15);
            }
        } else {
            let loader = document.querySelector('.loader');
            if (loader) {
                loader.classList.remove('visible');
                setTimeout(() => loader.remove(), 300);
            }
        }
    }

    /**
     * Download Video
     */
    async download() {
        if (DEBUG) {
            console.log('[recorder] download');
        }
        this.loading(true);

        // Finalize Blob
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

        // Stop Loading 
        this.loading(false);
    }
}
