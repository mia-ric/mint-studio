
const RECORDING = true;
const FRAMES = 30;

var recordingState = 'idle';
var recorder = null;
var chunks = [];

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

P5Capture.setDefaultOptions({
    format: "webm",
    framerate: 22,
    quality: 1.0,
    width: 1280,
    height: 720,
    disableUi: true
});

/**
 * Preload Script
 */
function preload() {
    audio = loadSound('assets/temp.wav');
    audio.onended(() => {
        if (RECORDING && recordingState == 'recording') {
            recordingState = 'exporting';
            recorder.stop();
        }
    });

    fontNormal = loadFont('assets/agencyfb_regular.ttf');
    fontMedium = loadFont('assets/agencyfb_bold.ttf');

    usedColor = color(0, 0, 0);
    colors.primary = color(192, 38, 211);
    colors.karai = color(185, 28, 28);
    colors.ninja = color(2, 132, 199);
}

/**
 * Setup Script
 */
function setup() {
    if (RECORDING) {
        createCanvas(1280, 720);
    } else {
        createCanvas(windowWidth, windowHeight);
    }
    frameRate(FRAMES);
    angleMode(DEGREES);
    record();
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

    // Font Shadow
    /*
    {
        let textGradient = drawingContext.createLinearGradient(120 + 33, 128, 120 + 33, 128 + 34);
        textGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        textGradient.addColorStop(1, 'rgba(0, 0, 0, .5)');
        drawingContext.fillStyle = textGradient;
        rect(160, 128, 66, 34);
    }
    {
        let textGradient = drawingContext.createLinearGradient(120 + 33, 166, 120 + 33, 166 + 80);
        textGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        textGradient.addColorStop(1, 'rgba(0, 0, 0, .5)');
        drawingContext.fillStyle = textGradient;
        rect(160, 166, 514, 80);
    }
    {
        let textGradient = drawingContext.createLinearGradient(242 + 217, 254, 242 + 217, 254 + 32);
        textGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        textGradient.addColorStop(1, 'rgba(0, 0, 0, .5)');
        drawingContext.fillStyle = textGradient;
        rect(242, 254, 434, 32);
    }
    {
        let textGradient = drawingContext.createLinearGradient(532 + 72, 290, 532 + 72, 290 + 32);
        textGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        textGradient.addColorStop(1, 'rgba(0, 0, 0, .5)');
        drawingContext.fillStyle = textGradient;
        rect(532, 290, 144, 32);
    }
    {
        let textGradient = drawingContext.createLinearGradient((width - 590) + 248, 314, (width - 590) + 248, 314 + 130);
        textGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        textGradient.addColorStop(1, 'rgba(0, 0, 0, .5)');
        drawingContext.fillStyle = textGradient;
        rect(width - 590, 314, 428, 130);
    }
        */

    // Set Stroke
    strokeWeight(3);

    // Color
    let time = parseFloat(audio.currentTime().toFixed(1));
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
    let duration = parseFloat(audio.duration().toFixed(1));
    let lineWidth = map(time, 0, duration, 0, width);
    line(0, 3, lineWidth, 3);

    // Translate the other drawings
    translate(width, height);
    
    // Render Particles
    if (audio.isPlaying()) {
        particles.push(new Particle());
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].edges()) {
            particles.splice(1, i);
        } else {
            if (audio.isPlaying()) {
                particles[i].update(amp > 170);
            }
            particles[i].show();
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
function mouseClicked() {
    if (audio.isPlaying()) {
        audio.pause();
    } else {
        if (RECORDING && recordingState == 'idle') {
            recordingState = 'recording';
            recorder.start();
        }
        audio.play();
    }
}

function record() {
    chunks.length = 0;
    
    let stream = document.querySelector('canvas').captureStream(FRAMES);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        if (e.data.size) {
            chunks.push(e.data);
        }
    };
    recorder.onstop = exportVideo;
}

function exportVideo(e) {
    var blob = new Blob(chunks, { 'type' : 'video/webm' });

    // Draw video to screen
    var videoElement = document.createElement('video');
    videoElement.setAttribute("id", Date.now());
    videoElement.controls = true;
    document.body.appendChild(videoElement);
    videoElement.src = window.URL.createObjectURL(blob);
    
    // Download the video 
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'newVid.webm';
    a.click();
    window.URL.revokeObjectURL(url);
}

class Particle {
    constructor() {
        this.pos = p5.Vector.random2D().mult(20);
        this.vel = createVector(0, 0);
        this.acc = this.pos.copy().mult(random(0.0005, 0.00001));

        this.w = random(3, 5);
    }

    color() {
        let c = [
            usedColor.levels[0],
            usedColor.levels[1],
            usedColor.levels[2],
        ];
        return [
            c[0] + Math.min(255 - c[0], random(0, 255 - c[0])),
            c[1],
            c[2] + Math.min(255 - c[2], random(0, 255 - c[2])),
            80
        ]
    }

    update(doubleTime) {
        fill(this.color());
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        
        if (doubleTime) {
            this.pos.add(this.vel / 2);
        }
    }

    edges() {
        return this.pos.x > (width * 2) || this.pos.y > (height * 2);
    }

    show() {
        noStroke();
        fill(this.color());
        ellipse(this.pos.x - 100, this.pos.y - 100, this.w);
    }
}