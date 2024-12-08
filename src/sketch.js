var recorder = null;
var fft = null;

// Assets
var audio;
var fontNormal;
var fontMedium;

// Scene Details
var endScene = false;
var colors = {}
var colorCurrent = 'primary';
var colorUsed =  null;
var colorTimeStamps = getTimestamps();


/**
 * Preload Script
 */
function preload() {
    /** SoundFile */
    audio = loadSound('assets/media/' + AUDIO_FILE);

    // Load Fonts
    fontNormal = loadFont('assets/fonts/agencyfb_regular.ttf');
    fontMedium = loadFont('assets/fonts/agencyfb_bold.ttf');

    // Handle Colors
    colorUsed = color(0, 0, 0);
    colors.primary = color(192, 38, 211);
    colors.karai = color(185, 28, 28);
    colors.ninja = color(2, 132, 199);
}

/**
 * Setup Script
 */
function setup() {
    createCanvas(RECORDING ? RECORDING_WIDTH : windowWidth, RECORDING ? RECORDING_HEIGHT : windowHeight);
    frameRate(FRAMES);
    angleMode(DEGREES);

    // Analyse frequency spectrum and waveform of sounds
    //@see https://p5js.org/reference/p5.sound/p5.FFT/
    fft = new p5.FFT();

    // Initialize Recorder instance
    if (RECORDING) {
        const canvasStream = select('canvas').elt.captureStream(FRAMES);
        const audioContext = getAudioContext();
        const audioStream = audioContext.createMediaStreamDestination();
        audio.connect(audioStream);

        const mediaStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...audioStream.stream.getAudioTracks(),
        ]);

        recorder = new Recorder(mediaStream, FRAMES);
        audio.onended(async () => {
            if (parseInt(audio.currentTime()) >= parseInt(audio.duration())) {
                await ending();
                await recorder.stop();
                await recorder.download();
            }
        });
    } else {
        audio.onended(async () => {
            if (parseInt(audio.currentTime()) >= parseInt(audio.duration())) {
                await ending();
            }
        });
    }
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
    noStroke();
    strokeWeight(0);
    fill('white');

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

    // Set Stroke
    strokeWeight(3);

    // Color
    let time = parseFloat(audio.currentTime().toFixed(1));
    let from = colors[colorCurrent];
    let to = null;
    let pct = null;

    // Lerp Color
    if (colorTimeStamps.length > 0) {
        if (time >= colorTimeStamps[0][0] && time <= colorTimeStamps[0][1]) {
            if (time == colorTimeStamps[0][1]) {
                colorCurrent = colorTimeStamps[0][2];
                from = colors[colorCurrent];
                colorTimeStamps.shift();
            } else {
                to = colors[colorTimeStamps[0][2]];
                pct = map(time, colorTimeStamps[0][0], colorTimeStamps[0][1], 0, 1);
            }
        }
    }
    colorUsed = to ? lerpColor(from, to, pct) : from;

    // Line
    stroke(colorUsed);
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
    gradient.addColorStop(0, `${colorUsed.toString()}`);
    gradient.addColorStop(0.5, `${colorUsed.toString()}`);
    gradient.addColorStop(0.5, `${colorUsed.toString().replace('1)', '.2)')}`);
    gradient.addColorStop(1, `${colorUsed.toString().replace('1)', '.2)')}`);
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
    fill(colorUsed);
    circle(-100, -100, 80);
}

/**
 * Event Mouse Clicked
 */
async function mouseClicked(ev) {
    if (!(ev.target == select('canvas').elt || ev.target.contains(select('canvas').elt))) {
        return;
    }

    if (audio.isPlaying()) {
        if (RECORDING && recorder.state == 'recording') {
            if (audio.currentTime() < audio.duration()) {
                await recorder.pause();
            }
        }
        await audio.pause();
    } else {
        if (RECORDING) {
            if (recorder.state == 'paused') {
                await recorder.resume();
            } else {
                await recorder.start();
            }
        }
        await audio.play();
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
