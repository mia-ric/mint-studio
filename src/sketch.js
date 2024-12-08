var recorder = null;

var audio;
var fontNormal;
var fontMedium;

var fft;
var particles = [];
var colors = {}
var currentColor = 'primary';
var usedColor =  null;

var colorTimeStamps = [
    [169.0, 170.0, 'karai'],
    [178.0, 179.0, 'primary'],
    [193.0, 194.0, 'karai'],
    [203.0, 204.0, 'primary'],
    [215.0, 216.0, 'karai'],
    [221.0, 222.0, 'primary'],
    [269.0, 270.0, 'karai'],
    [273.0, 274.0, 'primary'],
    [343.0, 344.0, 'ninja'],
    [346.0, 347.0, 'primary'],
    [349.0, 350.0, 'karai'],
    [356.0, 357.0, 'primary'],
    [360.0, 361.0, 'karai'],
    [366.0, 367.0, 'primary'],
];

/**
 * Preload Script
 */
function preload() {
    /** SoundFile */
    //audio = loadSound('assets/media/demo.wav');

    // Load Fonts
    fontNormal = loadFont('assets/fonts/agencyfb_regular.ttf');
    fontMedium = loadFont('assets/fonts/agencyfb_bold.ttf');

    // Handle Colors
    usedColor = color(0, 0, 0);
    colors.primary = color(192, 38, 211);
    colors.karai = color(185, 28, 28);
    colors.ninja = color(2, 132, 199);
}

/**
 * Setup Script
 */
function setup() {
    audio = select('audio').elt;
    audio.loop = false;
    audio.muted = false;
    audio.volume = 1.0;

    // Prepare
    createCanvas(RECORDING ? RECORDING_WIDTH : windowWidth, RECORDING ? RECORDING_HEIGHT : windowHeight);
    frameRate(FRAMES);
    angleMode(DEGREES);

    // Initialize Recorder instance
    if (RECORDING) {
        const canvasStream = select('canvas').elt.captureStream(FRAMES);
        const audioStream = audio.captureStream(FRAMES);

        const mediaStream = new MediaStream([
            ...canvasStream.getVideoTracks(),
            ...audioStream.getAudioTracks(),
        ]);

        recorder = new Recorder(mediaStream, FRAMES);
        audio.addEventListener('play', async () => {
            if (recorder.state == 'paused') {
                await recorder.resume();
            } else {
                await recorder.start();
            }
        });
        audio.addEventListener('pause', async () => {
            if (audio.currentTime < audio.duration) {
                await recorder.pause();
            }
        });
        audio.addEventListener('ended', async () => {
            await recorder.stop();
            await recorder.download();
        });
    }

    // Analyse frequency spectrum and waveform of sounds
    //@see https://p5js.org/reference/p5.sound/p5.FFT/
    fft = new p5.FFT();
}

/**
 * Draw Script
 */
function draw() {
    background(0);

    // Energy
    fft.analyze();
    amp = fft.getEnergy(20, 200);

    // WaveForm
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
    let time = parseFloat(audio.currentTime.toFixed(1));
    let from = colors[currentColor];
    let to = null;
    let pct = null;

    // Lerp Color
    if (colorTimeStamps.length > 0) {
        if (time >= colorTimeStamps[0][0] && time <= colorTimeStamps[0][1]) {
            if (time == colorTimeStamps[0][1]) {
                currentColor = colorTimeStamps[0][2];
                from = colors[currentColor];
                colorTimeStamps.shift();
            } else {
                to = colors[colorTimeStamps[0][2]];
                pct = map(time, colorTimeStamps[0][0], colorTimeStamps[0][1], 0, 1);
            }
        }
    }
    usedColor = to ? lerpColor(from, to, pct) : from;

    // Line
    stroke(usedColor);
    let duration = parseFloat(audio.duration.toFixed(1));
    let lineWidth = map(time, 0, duration, 0, width);
    line(0, 3, lineWidth, 3);

    // Translate the other drawings
    translate(width, height);
    
    // Render Particles
    if (!audio.paused) {
        particles.push(new Particle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].edges()) {
            particles.splice(1, i);
        } else {
            if (!audio.paused) {
                particles[i].update(amp > 170);
            }
            particles[i].render();
        }
    }

    // Render Gradients
    let gradient = drawingContext.createRadialGradient(0, 0, 0, 0, 0, 100);
    gradient.addColorStop(0, `${usedColor.toString()}`);
    gradient.addColorStop(0.5, `${usedColor.toString()}`);
    gradient.addColorStop(0.5, `${usedColor.toString().replace('1)', '.2)')}`);
    gradient.addColorStop(1, `${usedColor.toString().replace('1)', '.2)')}`);
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
    fill(usedColor);
    circle(-100, -100, 80);
}

/**
 * Event Mouse Clicked
 */
async function mouseClicked(ev) {
    if (!(ev.target == select('canvas').elt || ev.target.contains(select('canvas').elt))) {
        return;
    }

    if (!audio.paused) {
        await audio.pause();
    } else {
        await audio.play();
    }
}
