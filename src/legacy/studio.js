
class Studio {
    /**
     * Primary Container
     * @var {HTMLElement}
     */
    studio;

    /**
     * Current Playing State
     * @var {boolean}
     */
    playing = false;

    /**
     * Current Recording State
     * @var {boolean}
     */
    recording = false;

    /**
     * Audio Markers
     */
    markers;

    /**
     * Create a new Studio instance
     * @param {HTMLElement} parent 
     */
    constructor(parent) {
        this.studio = document.createElement('div');
        this.studio.style.width = `${SCREEN_WIDTH}px`;
        this.studio.style.height = `${SCREEN_HEIGHT}px`;
        this.studio.className = 'studio';
        this.studio.innerHTML = `
            <div class="studio-bar">
                <button type="button" data-action="play" class="play-pause">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.841Z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
                    </svg>
                </button>
                <button type="button" data-action="stop">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path d="M5.25 3A2.25 2.25 0 0 0 3 5.25v9.5A2.25 2.25 0 0 0 5.25 17h9.5A2.25 2.25 0 0 0 17 14.75v-9.5A2.25 2.25 0 0 0 14.75 3h-9.5Z" />
                    </svg>
                </button>
                <button type="button" data-action="backward">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path d="M7.712 4.818A1.5 1.5 0 0 1 10 6.095v2.972c.104-.13.234-.248.389-.343l6.323-3.906A1.5 1.5 0 0 1 19 6.095v7.81a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.505 1.505 0 0 1-.389-.344v2.973a1.5 1.5 0 0 1-2.288 1.276l-6.323-3.905a1.5 1.5 0 0 1 0-2.552l6.323-3.906Z" />
                    </svg>
                </button>
                <button type="button" data-action="forward">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path d="M3.288 4.818A1.5 1.5 0 0 0 1 6.095v7.81a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905c.155-.096.285-.213.389-.344v2.973a1.5 1.5 0 0 0 2.288 1.276l6.323-3.905a1.5 1.5 0 0 0 0-2.552l-6.323-3.906A1.5 1.5 0 0 0 10 6.095v2.972a1.506 1.506 0 0 0-.389-.343L3.288 4.818Z" />
                    </svg>
                </button>
                <div class="timer">
                    <span class="first">00:00</span>
                    <span class="separator">-</span>
                    <span class="second">00:00</span>
                    <span class="separator">:</span>
                    <span class="third">000.0</span>
                </div>
                <button type="button" class="btn-danger" data-action="record">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658Z" clip-rule="evenodd" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm5-2.25A.75.75 0 0 1 7.75 7h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-4.5Z" clip-rule="evenodd" />
                    </svg>
                </button>
                <button type="button" data-action="marker">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                        <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>

            <div class="markers"></div>
            <div class="marker-timeline" style="width:${SCREEN_WIDTH}px;"></div>
        `;

        // Attach Events
        Array.from(this.studio.querySelectorAll('button')).map(btn => {
            if ((btn.dataset.action || '') == 'play' || (btn.dataset.action || '') == 'pause' || (btn.dataset.action || '') == 'stop') {
                btn.addEventListener('click', this.player.bind(this));
            } else if ((btn.dataset.action || '') == 'backward' || (btn.dataset.action || '') == 'forward') {
                btn.addEventListener('click', this.fast.bind(this));
            } else if ((btn.dataset.action || '') == 'record') {
                btn.addEventListener('click', this.record.bind(this));
            } else if ((btn.dataset.action || '') == 'marker') {
                btn.addEventListener('click', this.marker.bind(this));
            }
        });

        // Add to DOM
        parent.append(this.studio);

        // Parse Markers
        this.markers = new Map;
        for (const marker of initialTimestamps()) {
            this.markers.set(marker.start, {
                start: marker.start,
                end: marker.end,
                actor: marker.actor,
            });
        }
        this.refreshMarkers();
    }

    /**
     * Add a new Marker
     * @param {number} start
     * @param {number} end
     * @param {string} actor
     */
    addMarker(start, end, actor) {
        // @todo implement marker logic
    }

    /**
     * Receive a marker by the passed timestamp
     * @param {number} time 
     */
    getMarker(time) {
        for (const marker of this.markers.values()) {
            if (time >= marker.start && time <= marker.end) {
                return marker;
            }
        }
        return null;
    }

    /**
     * Delete an existing Marker
     * @param {number} start
     */
    deleteMarker(start) {
        this.markers.delete(start);
        this.refreshMarkers();
    }

    /**
     * Highlight Marker
     */
    highlightMarker(marker, time) {
        Array.from(this.studio.querySelectorAll(`.marker.highlighted:not([data-marker="${marker.start}"])`)).map(el => {
            el.classList.remove('highlighted');
            let progress = el.querySelector('.progress');
            if (progress) {
                progress.style.width = '0%';
            }
        })

        let element = this.studio.querySelector(`.marker[data-marker="${marker.start}"]`);
        if (!element) {
            return;
        }

        element.classList.add('highlighted');
        let percent = map(time, marker.start, marker.end, 0, 100);
        let progress = element.querySelector('.progress');
        if (progress) {
            progress.style.width = `${percent}%`;
        }
    }

    /**
     * Refresh Markers
     */
    refreshMarkers() {
        let timeline = this.studio.querySelector('.marker-timeline');
        timeline.innerHTML = `<div class="timeline-cursor"></div>`;

        // Set Marker
        const duration = parseInt(audio.duration());
        for (const marker of this.markers.values()) {
            let start = parseInt(marker.start);
            let startPosition = start == 0 ? 0 : (100 / duration) * start;

            let end = parseInt(marker.end);
            let endPosition = end >= duration ? 100 : (100 / duration) * end;

            let markerElement = document.createElement('DIV')
            markerElement.className = 'timeline-marker';
            markerElement.style.left = `${startPosition}%`;
            markerElement.style.width = `${endPosition - startPosition}%`;
            markerElement.style.backgroundColor = `${getActor(marker.actor).color.toString()}`;
            timeline.append(markerElement);
        }

        let root = this.studio.querySelector('.markers');
        root.innerHTML = ``;
        for (const marker of this.markers.values()) {
            let startTime = parseInt(marker.start);
            let startMinutes = startTime > 0 ? Math.floor(startTime / 60) : 0;
            let startSeconds = startTime > 0 ? startTime - (startMinutes * 60) : 0;
            let startText = `${('00' + startMinutes.toString()).slice(-2)}:${('00' + startSeconds.toString()).slice(-2)}`;

            let endTime = parseInt(marker.end);
            let endMinutes = endTime > 0 ? Math.floor(endTime / 60) : 0;
            let endSeconds = endTime > 0 ? endTime - (endMinutes * 60) : 0;
            let endText = `${('00' + endMinutes.toString()).slice(-2)}:${('00' + endSeconds.toString()).slice(-2)}`;

            let markerElement = document.createElement('div');
            markerElement.dataset.marker = marker.start;
            markerElement.className = 'marker';
            markerElement.innerHTML = `
                <span class="actor" style="background-color: ${getActor(marker.actor).color.toString()};"></span>
                <div class="timer">
                    <span class="first">${startText}</span>
                    <span class="separator">-</span>
                    <span class="second">${endText}</span>
                </div>
                <button type="button" data-action="view">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                        <path fill-rule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clip-rule="evenodd" />
                    </svg>
                </button>
                <button type="button" data-action="delete">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                        <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd" />
                    </svg>
                </button>
                <div class="progress" style="width: 0%;"></div>
            `;
            markerElement.querySelector('[data-action="view"]').addEventListener('click', ev => {
                ev.preventDefault();
                audio.jump(marker.start);
            });
            markerElement.querySelector('[data-action="delete"]').addEventListener('click', ev => {
                ev.preventDefault();
                this.deleteMarker(marker.start);
            });
            root.append(markerElement);
        }
    }

    /**
     * Update Handler
     */
    async update() {
        let current = this.studio.querySelector('.first');
        let duration = this.studio.querySelector('.second');
        let third = this.studio.querySelector('.third');

        let currentTime = parseInt(audio.currentTime());
        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = currentTime - (currentMinutes * 60);
        current.innerText = `${('00' + currentMinutes.toString()).slice(-2)}:${('00' + currentSeconds.toString()).slice(-2)}`;

        let durationTime = parseInt(audio.duration());
        let durationMinutes = Math.floor(durationTime / 60);
        let durationSeconds = durationTime - (durationMinutes * 60);
        duration.innerText = `${('00' + durationMinutes.toString()).slice(-2)}:${('00' + durationSeconds.toString()).slice(-2)}`;

        let thirdFloat = audio.currentTime().toFixed(1);
        if (!thirdFloat.includes('.')) {
            thirdFloat = `${thirdFloat}.0`;
        }
        third.innerText = `${('000' + thirdFloat).slice(-5)}`;

        let cursor = this.studio.querySelector('.timeline-cursor');
        if (cursor) {
            let current = parseInt(audio.currentTime());
            let duration = parseInt(audio.duration());
            cursor.style.left = `${100 / duration * current}%`;
        }
    }

    /**
     * Handle Player
     */
    async player(ev) {
        let button = getNode(ev.target, 'button');
        if (!button) {
            return;
        }
        ev.preventDefault();
        
        if (button.dataset.action == 'play') {
            await this.play();
        } else if (button.dataset.action == 'pause') {
            await this.pause();
        } else if (button.dataset.action == 'stop') {
            await this.stop();
        }
    }

    /**
     * Update PlayerButton
     */
    async playerButton() {
        let playPause = this.studio.querySelector('.play-pause');
        if (this.playing) {
            playPause.dataset.action = 'pause';
        } else {
            playPause.dataset.action = 'play';
        }
    }

    /**
     * Play
     */
    async play() {
        this.playing = true;
        await audio.play();
        this.playerButton();

        if (this.recording) {
            if (recorder.state == 'paused') {
                this.startRecording();
            } else {
                this.resumeRecording();
            }
        }
    }
    
    /**
     * Pause
     */
    async pause() {
        this.playing = false;
        await audio.pause();
        this.playerButton();

        if (this.recording) {
            this.pauseRecording();
        }
    }

    /**
     * Stop
     */
    async stop() {
        this.playing = false;
        Particle.stack = [];
        await audio.jump(0);
        await wait(10);
        await audio.stop();
        this.playerButton();

        if (this.recording) {
            this.stopRecording();
        }
    }
    
    /**
     * Fast Forward / Backward
     */
    async fast(ev) {
        let button = getNode(ev.target, 'button');
        if (!button) {
            return;
        }
        ev.preventDefault();
        
        if (button.dataset.action == 'backward') {
            audio.jump(Math.max(audio.currentTime()-2, 0));
        } else if (button.dataset.action == 'forward') {
            audio.jump(Math.min(audio.currentTime()+2, audio.duration()));
        }
    }

    /**
     * Start|Stop Recording
     */
    async record(ev) {
        let button = getNode(ev.target, 'button');
        if (!button) {
            return;
        }
        ev.preventDefault();

        if (this.recording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    /**
     * Start Recording
     */
    async startRecording() {
        this.studio.classList.add('is-recording');

        await recorder.start();
        await this.play();
        this.recording = true; // Prevent Looping
    }

    /**
     * Pause Recording
     */
    async pauseRecording() {
        await recorder.pause();
    }

    /**
     * Pause Recording
     */
    async resumeRecording() {
        await recorder.resume();
    }

    /**
     * Stop Recording
     */
    async stopRecording() {
        this.studio.classList.remove('is-recording');

        this.recording = false; // Prevent Looping
        await this.stop();
        await recorder.stop();
        await recorder.download();
    }

    /**
     * Set Marker
     */
    async marker(ev) {
        let button = getNode(ev.target, 'button');
        if (!button) {
            return;
        }
        ev.preventDefault();

        // Add Marker
        this.addMarker(audio.currentTime());
    }
}
