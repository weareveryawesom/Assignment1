let prevSecond = -1;
let prevMinute = -1;
let prevHour = -1;

let flyingBars = [];

const BAR_X = 140;
const BAR_WIDTH = 480;
const BAR_HEIGHT = 32;

const Y_HOURS = 80;
const Y_MINUTES = 160;
const Y_SECONDS = 240;

function setup() {
  createCanvas(680, 360);
  textFont('monospace');
}

function draw() {
  background(255);

  let now = new Date();
  let hr = now.getHours();
  let mn = now.getMinutes();
  let sc = now.getSeconds();
  let ms = now.getMilliseconds();

  if (mn !== prevMinute) {
    if (prevMinute !== -1) {
      console.log("Current Minute:", mn);
    }
    if (prevMinute === 59 && mn === 0) {
      triggerShootOff(Y_MINUTES);
    }
    prevMinute = mn;
  }

  // Detect second rollover (59 -> 0)
  if (sc !== prevSecond) {
    if (prevSecond === 59 && sc === 0) {
      triggerShootOff(Y_SECONDS);
    }
    prevSecond = sc;
  }

  // Detect hour rollover (23 -> 0)
  if (hr !== prevHour) {
    if (prevHour === 23 && hr === 0) {
      triggerShootOff(Y_HOURS);
    }
    prevHour = hr;
  }

  let smoothSec = sc + ms / 1000.0;
  let smoothMin = mn + smoothSec / 60.0;
  let smoothHr = (hr % 24) + smoothMin / 60.0;

  drawLoadingRow("HOURS", Y_HOURS, smoothHr, 24, nf(hr, 2) + " / 24");
  drawLoadingRow("MINUTES", Y_MINUTES, smoothMin, 60, nf(mn, 2) + " / 60");
  drawLoadingRow("SECONDS", Y_SECONDS, smoothSec, 60, nf(sc, 2) + " / 60");

  renderFlyingBars();
}

function drawLoadingRow(label, y, currentValue, maxValue, readout) {
  push();

  // Label
  fill(0);
  noStroke();
  textSize(14);
  textAlign(LEFT, CENTER);
  text(label, 30, y + BAR_HEIGHT / 2);

  fill(240);
  noStroke();
  rect(BAR_X, y, BAR_WIDTH, BAR_HEIGHT);

  let fillWidth = map(currentValue, 0, maxValue, 0, BAR_WIDTH);
  fill(34, 197, 94);
  rect(BAR_X, y, fillWidth, BAR_HEIGHT);

  fill(100);
  textSize(12);
  textAlign(LEFT, CENTER);
  text(readout, BAR_X + BAR_WIDTH + 15, y + BAR_HEIGHT / 2);

  pop();
}

function triggerShootOff(yPos) {
  flyingBars.push({
    x: BAR_X,
    y: yPos,
    w: BAR_WIDTH,
    h: BAR_HEIGHT,
    vx: 15
  });
}

function renderFlyingBars() {
  for (let i = flyingBars.length - 1; i >= 0; i--) {
    let bar = flyingBars[i];

    bar.x += bar.vx;
    bar.vx *= 1.15;

    push();
    noStroke();
    fill(34, 197, 94);
    rect(bar.x, bar.y, bar.w, bar.h);
    pop();

    if (bar.x > width + 50) {
      flyingBars.splice(i, 1);
    }
  }
}