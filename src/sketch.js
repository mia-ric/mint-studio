var recorder = null;
var studio = null;
var fft = null;

// Assets
var audio;
var fontNormal;
var fontMedium;

// Scene Details
var endScene = false;
var currentActor = 'narrator';
var currentMarker = null;
var currentColor = null;


/**
 * Preload Script
 */
function preload() {
    loadScript('src/support/functions.js');
    loadScript('src/support/particles.js');
    loadScript('src/composables/recorder.js');
    loadScript('src/composables/studio.js');
    loadScript('src/components/markers.js');
    loadScript('src/components/recorder-frame.js');
    loadScript('src/components/studio.js');
    loadScript('src/components/studio-bar.js');
    loadScript('src/data/actors.js');
    loadScript('src/data/timestamps.js');

    // Load Audio
    audio = loadSound('assets/media/' + AUDIO_FILE);

    // Load Fonts
    fontNormal = loadFont('assets/fonts/agencyfb_regular.ttf');
    fontMedium = loadFont('assets/fonts/agencyfb_bold.ttf');

    // Handle Colors
    currentColor = color(0, 0, 0);
}

/**
 * Setup Script
 */
function setup() {
    const app = Vue.createApp({
        setup() {
            const recorder = useRecorder(audio);
            const studio = useStudio(audio, recorder);
            Vue.provide('studio', studio);
            return { };
        },
        template: `<StudioComponent />`
    });
    app.component('MarkersComponent', MarkersComponent);
    app.component('RecorderFrameComponent', RecorderFrameComponent);
    app.component('StudioBarComponent', StudioBarComponent);
    app.component('StudioComponent', StudioComponent);

    // Initialize Canvas
    createCanvas(SCREEN_WIDTH, SCREEN_HEIGHT);
    frameRate(FRAMES);
    angleMode(DEGREES);

    // Analyse frequency spectrum and waveform of sounds
    //@see https://p5js.org/reference/p5.sound/p5.FFT/
    fft = new p5.FFT();
    audio.onended(async () => {
        if (parseInt(audio.currentTime()) >= parseInt(audio.duration())) {
            await ending();
        }
    });

    // Mount Vue3 application
    app.mount('#app');
}

/**
 * Draw Script
 */
function draw() {
    background(0);

    // p5.js sound
    fft.analyze();
    let amp = fft.getEnergy(20, 200);
    let wave = fft.waveform();

    // Text
    if (audio.currentTime() > 0) {
        let current = parseFloat(audio.currentTime().toFixed(2));
        let opacity = Math.min(current * 30, 255);

        noStroke();
        strokeWeight(0);
        fill(color(255, 255, 255, opacity));

        textAlign(LEFT)
        textFont(fontMedium, 40);
        text('MINT', 120, 120);
        
        textAlign(LEFT)
        textFont(fontMedium, 100);
        text('THE FOOT CLAN', 120, 204);

        textAlign(RIGHT)
        textFont(fontMedium, 36);
        text('A TEENAGE MUTANT NINJA TURTLES', 634, 244);
        text('FANFICTION', 634, 280);

        textAlign(RIGHT)
        textFont(fontMedium, 120);
        text('PROLOG', width - 120, 400);
    } else {
        noStroke();
    }

    // Set Stroke
    strokeWeight(3);

    // Color
    let time = parseFloat(audio.currentTime().toFixed(2));
    let from = getActor(currentActor).color;
    let to = null;
    let pct = null;

    // Lerp Color
    let marker = currentMarker;
    if (marker) {
        if (time >= marker.start && time <= marker.start+1) {
            to = getActor(marker.actor).color;
            pct = map(time, marker.start, marker.start+1, 0, 1);
        } else if (time >= marker.start+1 && currentActor != marker.actor) {
            currentActor = marker.actor;
            from = getActor(marker.actor).color;
        }
    }
    currentColor = to ? lerpColor(from, to, pct) : from;

    // Line
    stroke(currentColor);
    let duration = parseFloat(audio.duration().toFixed(1));
    let lineWidth = map(time, 0, duration, 0, width);
    line(0, 3, lineWidth, 3);

    // Translate the other drawings
    translate(width, height);
    noStroke();
    
    // Render Particles
    if (audio.isPlaying()) {
        new Particle;
    }
    
    for (let i = Particle.stack.length - 1; i >= 0; i--) {
        let particle = Particle.stack[i];
        if (!particle.visible()) {
            Particle.stack.splice(i, 1);
        } else {
            if (endScene || audio.isPlaying()) {
                particle.update(amp > 170);
            }
            particle.render();
        }
    }

    // Render Gradients
    let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, 100);
    gradient.addColorStop(0, `${currentColor.toString()}`);
    gradient.addColorStop(0.5, `${currentColor.toString()}`);
    gradient.addColorStop(0.5, `${currentColor.toString().replace('1)', '.2)')}`);
    gradient.addColorStop(1.0, `${currentColor.toString().replace('1)', '.2)')}`);
    drawingContext.fillStyle = gradient;

    // Render Circle
    for (let t = -1; t <= 1; t += 2) {
        beginShape();
        for (let i = 0; i <= 180; i += 0.5) {
            let idx = floor(map(i, 0, 180, 0, wave.length -1));
    
            let r = map(wave[idx], -1, 1, 50, 100);
            let x = r * sin(i) * t;
            let y = r * cos(i);
            vertex(x - 100, y - 100);
        }
        endShape();
    }

    // Draw Circle
    fill(currentColor);
    circle(-100, -100, 80);

    // Draw
    translate(-width, -height);
    {
        let current = parseFloat(audio.currentTime().toFixed(2));
        let duration = parseFloat(audio.duration().toFixed(2));
        let opacity = 0.0;
        if (current > 3.0 && current < 35.0) {
            opacity = Math.min((current-3) / 10, 0.3);
        } else if (current > 34.0 && current < (duration - 10.0)) {
            opacity = 0.3;
        } else if (current >= duration - 10.0) {
            opacity = Math.max(0.3 - ((current - (duration - 10.0)) / 10), 0.0);
        }

        let gradient = drawingContext.createRadialGradient(1280 / 2, 720 / 2, 900, 1280 / 2, 720 / 2, 120);
        gradient.addColorStop(0, `${currentColor.toString().replace('1)', `${opacity})`)}`);
        gradient.addColorStop(0.4, `${currentColor.toString().replace('1)', '0.0)')}`);
        gradient.addColorStop(1.0, `${currentColor.toString().replace('1)', '0.0)')}`);
        drawingContext.fillStyle = gradient;
        rect(0, 0, 1280, 720);
    }
}

/**
 * Ending Scene
 * @returns 
 */
function ending() {
    endScene = true;
    return new Promise(res => {
        function temp() {
            if (Particle.stack.length == 0) {
                res();
            } else {
                setTimeout(temp, 25);
            }
        }
        setTimeout(temp, 25);
    });
}
