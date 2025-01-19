
const MarkersComponent = {
    setup() {
        const studio = Vue.inject('studio');

        return {
            markers: studio.markers,
            marker: studio.marker.value,
            jumpTo(idx) {
                let marker = studio.markers[idx];
                studio.jumpTo(marker.time);
            },
            color(idx) {
                let marker = studio.markers[idx];
                return `background-color: ${getActor(marker.actor).color.toString()}`;
            },
            progress(idx) {
                let marker = studio.markers[idx];
                let startTime = marker.time;

                let nextMarker = studio.markers.length >= (idx+1) ? studio.markers[idx+1] : null;
                let endTime = nextMarker ? nextMarker.time : studio.durationSeconds.value;

                let percent = map(studio.currentTime.value, startTime, endTime, 0, 100);

                return marker.status != 'next' ? `
                    --var-radial: radial-gradient(closest-side, #101214 85%, transparent 0 100%);
                    --var-conic: conic-gradient(${getActor(marker.actor).color.toString()} calc(${percent}%), transparent 0);
                ` : '';
            }
        };
    },

    template: `
        <div class="markers">
            <template v-for="(marker, idx) of markers">
                <div class="marker" :class="'is-' + marker.status" :style="progress(idx)" @click="jumpTo(idx)">
                    <div class="marker-color" :style="color(idx)"></div>
                </div>
            </template>
        </div>
    `
};
