
const StudioBarComponent = {
    setup() {
        const studio = Vue.inject('studio');
        return {
            ...studio,
            toggle() {
                if (studio.playing.value) {
                    studio.pause();
                } else {
                    studio.play();
                }
            },
            toggleRecording() {
                if (studio.recording.value) {
                    studio.stopRecording();
                } else {
                    studio.startRecording();
                }
            }
        };
    },

    template: `
        <div class="studio-bar" :class="[recording || playing ? 'is-active' : '', recording ? 'is-recording' : '']">
            <button type="button" @click="toggle">
                <svg v-if="!playing" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /><path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" /></svg>
            </button>
            <button type="button" @click="stop">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z" /></svg>
            </button>
            <button type="button" @click="prevMarker">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-track-prev"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20.341 4.247l-8 7a1 1 0 0 0 0 1.506l8 7c.647 .565 1.659 .106 1.659 -.753v-14c0 -.86 -1.012 -1.318 -1.659 -.753z" /><path d="M9.341 4.247l-8 7a1 1 0 0 0 0 1.506l8 7c.647 .565 1.659 .106 1.659 -.753v-14c0 -.86 -1.012 -1.318 -1.659 -.753z" /></svg>
            </button>
            <button type="button" @click="nextMarker">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-track-next"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 5v14c0 .86 1.012 1.318 1.659 .753l8 -7a1 1 0 0 0 0 -1.506l-8 -7c-.647 -.565 -1.659 -.106 -1.659 .753z" /><path d="M13 5v14c0 .86 1.012 1.318 1.659 .753l8 -7a1 1 0 0 0 0 -1.506l-8 -7c-.647 -.565 -1.659 -.106 -1.659 .753z" /></svg>
            </button>

            <span class="btn-separator"></span>

            <button type="button" @click="() => backward(60)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-backward-60"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.007 16.466a6 6 0 0 0 -4.007 -10.466h-11" /><path d="M7 9l-3 -3l3 -3" /><path d="M12 15.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0z" /><path d="M9 14h-2a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2" /></svg>
            </button>
            <button type="button" @click="() => backward(30)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-backward-30"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.007 16.466a6 6 0 0 0 -4.007 -10.466h-11" /><path d="M12 15.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0z" /><path d="M6 14h1.5a1.5 1.5 0 0 1 0 3h-.5h.5a1.5 1.5 0 0 1 0 3h-1.5" /><path d="M7 9l-3 -3l3 -3" /></svg>
            </button>
            <button type="button" @click="() => backward(15)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-backward-15"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 20h2a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2v-3h3" /><path d="M15 18a6 6 0 1 0 0 -12h-11" /><path d="M5 14v6" /><path d="M7 9l-3 -3l3 -3" /></svg>
            </button>
            <button type="button" @click="() => backward(5)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-backward-5"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 18a6 6 0 1 0 0 -12h-11" /><path d="M7 9l-3 -3l3 -3" /><path d="M8 20h2a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2v-3h3" /></svg>
            </button>
            <button type="button" @click="() => forward(5)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-forward-5"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 18a6 6 0 1 1 0 -12h11" /><path d="M13 20h2a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2v-3h3" /><path d="M17 9l3 -3l-3 -3" /></svg>
            </button>
            <button type="button" @click="() => forward(15)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-forward-15"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 9l3 -3l-3 -3" /><path d="M9 18a6 6 0 1 1 0 -12h11" /><path d="M16 20h2a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2v-3h3" /><path d="M13 14v6" /></svg>
            </button>
            <button type="button" @click="() => forward(30)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-forward-30"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.007 16.478a6 6 0 0 1 3.993 -10.478h11" /><path d="M15 15.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0z" /><path d="M17 9l3 -3l-3 -3" /><path d="M9 14h1.5a1.5 1.5 0 0 1 0 3h-.5h.5a1.5 1.5 0 0 1 0 3h-1.5" /></svg>
            </button>
            <button type="button" @click="() => forward(60)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-rewind-forward-60"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5.007 16.478a6 6 0 0 1 3.993 -10.478h11" /><path d="M15 15.5v3a1.5 1.5 0 0 0 3 0v-3a1.5 1.5 0 0 0 -3 0z" /><path d="M17 9l3 -3l-3 -3" /><path d="M12 14h-2a1 1 0 0 0 -1 1v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2" /></svg>
            </button>

            <span class="btn-separator"></span>

            <div class="timer">
                <span class="first">{{ currentTimeFormat }}</span>
                <span class="separator">-</span>
                <span class="second">{{ durationTimeFormat }}</span>
                <span class="separator">:</span>
                <span class="third">{{ currentTimestamp }}</span>
                <span class="separator">-</span>
                <span class="third">{{ durationSeconds }}</span>
            </div>

            <span class="btn-separator"></span>

            <button type="button" class="btn-danger" @click="toggleRecording">
                <svg v-if="!recording" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-record"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 5.072a8 8 0 1 1 -3.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 3.995 -6.643z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-player-stop"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 5m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /></svg>
            </button>
            <button type="button" data-action="marker">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                    <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    `
};
