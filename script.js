const $ = (s) => document.querySelector(s);
const step1 = $("#step1");
const step2 = $("#step2");
const step3 = $("#step3");
const step4 = $("#step4");
const bgm = $("#bgm");
const startBtn = $("#startBtn");
const loading = $("#loading");

// Start screen
startBtn.addEventListener("click", () => {
  loading.classList.add("hide");
  playMusic();
});

function playMusic() {
  bgm.muted = false;
  bgm.play().catch(() => {});
}

function show(step) {
  [step1, step2, step3, step4].forEach((s) => s.classList.remove("show"));
  step.classList.add("show");
}

function revealLines() {
  setTimeout(() => ($("#line2").style.opacity = 1), 900);
  setTimeout(() => ($("#line3").style.opacity = 1), 1800);
}

revealLines();

// Proposal flow
$("#toProposal").addEventListener("click", () => {
  show(step2);
});

// Buttons
const yesBtn = $("#yesBtn");
const noBtn = $("#noBtn");
const actionArea = $("#actionArea");
let isNoRunning = true;

yesBtn.addEventListener("click", () => {
  show(step3);
  setTimeout(() => $("#heartCollage").classList.add("show"), 300);
  startSparkles();
});

noBtn.addEventListener("pointerenter", moveNoAway);
actionArea.addEventListener("pointermove", (e) =>
  moveNoAway(e.clientX, e.clientY)
);

function moveNoAway(px, py) {
  const rect = actionArea.getBoundingClientRect();
  const x = Math.random() * (rect.width - noBtn.offsetWidth);
  const y = Math.random() * (rect.height - noBtn.offsetHeight);
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
}

// Floating hearts animation (kept same)
const canvas = $("#hearts");
const ctx = canvas.getContext("2d");
let W,
  H,
  hearts = [];
function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

function spawnHeart() {
  hearts.push({
    x: Math.random() * W,
    y: H + 20,
    r: 6 + Math.random() * 10,
    vy: 0.5 + Math.random(),
    alpha: 0.8,
  });
}
function drawHeart(h) {
  ctx.save();
  ctx.translate(h.x, h.y);
  ctx.scale(h.r / 10, h.r / 10);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(0, 0, -10, 0, -10, 6);
  ctx.bezierCurveTo(-10, 12, 0, 16, 0, 22);
  ctx.bezierCurveTo(0, 16, 10, 12, 10, 6);
  ctx.closePath();
  const g = ctx.createLinearGradient(-10, -5, 10, 22);
  g.addColorStop(0, "#ff99ac");
  g.addColorStop(1, "#ff4d6d");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
}
function tick() {
  ctx.clearRect(0, 0, W, H);
  if (Math.random() < 0.15) spawnHeart();
  hearts.forEach((h) => {
    h.y -= h.vy;
    h.alpha -= 0.002;
  });
  hearts = hearts.filter((h) => h.y > -20 && h.alpha > 0);
  hearts.forEach(drawHeart);
  requestAnimationFrame(tick);
}
tick();

// Sparkles
function startSparkles() {
  const c = document.getElementById("sparkles");
  const ctx = c.getContext("2d");
  c.width = c.parentElement.clientWidth;
  c.height = c.parentElement.clientHeight;
  const parts = Array.from({ length: 60 }, () => ({
    x: Math.random() * c.width,
    y: Math.random() * c.height,
    r: Math.random() * 3 + 0.5,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5,
    life: 1,
  }));
  function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,200,230,${p.life})`;
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 0.008;
    });
    if (parts.some((p) => p.life > 0)) requestAnimationFrame(draw);
  }
  draw();
}

// Music toggle
const audioToggle = $("#audioToggle");
audioToggle.addEventListener("click", () => {
  bgm.muted = !bgm.muted;
  audioToggle.textContent = bgm.muted ? "🔈 Music: Off" : "🔊 Music: On";
});
