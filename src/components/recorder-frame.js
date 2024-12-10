
const RecorderFrameComponent = {
    setup() {
        const studio = Vue.inject('studio');
        const style = `width:${SCREEN_WIDTH}px;height:${SCREEN_HEIGHT}px;`;

        return {
            ...studio,
            style,
        };
    },

    template: `
        <div 
            class="recorder-frame" 
            :class="['is-' + recorder.state.value]" 
            :style="style" />
        
        <div class="recorder-badge" :class="['is-' + recorder.state.value]">
            <template v-if="recorder.state.value == 'exporting'">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-loader-quarter"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6l0 -3" /><path d="M6 12l-3 0" /><path d="M7.75 7.75l-2.15 -2.15" /></svg>
                <span>{{ recorder.state }}</span>
            </template>
            <template v-else-if="recorder.state.value == 'paused'">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-player-pause"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /></svg>
                <span>{{ recorder.state }}</span>
            </template>
            <template v-else-if="recorder.state.value == 'recording'">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-player-record"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 5.072a8 8 0 1 1 -3.995 7.213l-.005 -.285l.005 -.285a8 8 0 0 1 3.995 -6.643z" /></svg>
                <span>{{ recorder.state }}</span>
            </template>
            <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-player-record"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /></svg>
                <span>{{ recorder.state }}</span>
            </template>
        </div>
    `
};
