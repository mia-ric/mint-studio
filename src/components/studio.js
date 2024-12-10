
const StudioComponent = {
    setup() {
        const count = Vue.ref(0)
        return { count }
    },

    template: `
        <MarkersComponent />
        <RecorderFrameComponent />
        <StudioBarComponent />
    `
};
