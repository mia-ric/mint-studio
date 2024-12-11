
const MarkersComponent = {
    setup() {
        const studio = Vue.inject('studio');
        const markers = Vue.reactive(initialTimestamps());
        const marker = Vue.ref(null);

        Vue.watch(markers, (newValue) => {
            marker.value = currentMarker = markers.find(item => item.status == 'current');
        }, { immediate: true });
        
        Vue.watch(studio.currentTime, (time) => {
            for (const marker of markers) {
                if (time >= marker.start && time <= marker.end) {
                    marker.status = 'current';
                } else {
                    marker.status = null;
                }
            }
        });

        return {
            markers,
            marker,
            jumpTo(marker) {
                studio.jumpTo(marker.start);
            },
            color(marker) {
                return `background-color: ${getActor(marker.actor).color.toString()}`;
            },
            progress(marker) {
                let percent = map(studio.currentTime.value, marker.start, marker.end, 0, 100);
                console.log(percent);
                return marker.status == 'current' ? `
                    --var-radial: radial-gradient(closest-side, #101214 85%, transparent 0 100%);
                    --var-conic: conic-gradient(${getActor(marker.actor).color.toString()} calc(${percent}%), transparent 0);
                ` : '';
            }
        };
    },

    template: `
        <div class="markers">
            <template v-for="marker of markers">
                <div class="marker" :class="marker.status == 'current' ? 'is-current' : null" :style="progress(marker)" @click="jumpTo(marker)">
                    <div class="marker-color" :style="color(marker)"></div>
                </div>
            </template>
        </div>
    `
};
