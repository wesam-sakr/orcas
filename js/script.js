/* ================================================
   ORCAS – script.js
   ================================================ */

/* ── Shared canvas config ── */
const W_BASE = 1440;
const H_BASE = 1024;
const SCREEN_DUR = 3000; /* ms per screen transition */
const NUM_SCREENS = 5;
const NUM_LINES = 14;

const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const lerp = (a, b, t) => a + (b - a) * t;

let t0 = null; /* shared start timestamp */

/* ── Helper: draw orbs + lines on any canvas ── */
function drawBg(ctx, cW, cH, screens, cur, nxt, t, orbAlpha = 0.75) {
  const sx = cW / W_BASE;
  const sy = cH / H_BASE;

  ctx.clearRect(0, 0, cW, cH);
  ctx.fillStyle = "#000E1A";
  ctx.fillRect(0, 0, cW, cH);

  /* Orbs */
  ctx.save();
  ctx.globalAlpha = orbAlpha;
  for (let i = 0; i < 4; i++) {
    const f = screens[cur].orbs[i];
    const n = screens[nxt].orbs[i];
    const cx = lerp(f.x, n.x, t) * sx;
    const cy = lerp(f.y, n.y, t) * sy;
    const r = lerp(f.r, n.r, t) * Math.max(sx, sy);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, "rgba(0,145,255,0.9)");
    g.addColorStop(0.4, "rgba(0,110,220,0.5)");
    g.addColorStop(1, "rgba(0,60,180,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
  ctx.restore();

  /* Vertical lines overlay */
  const lw = (105 / W_BASE) * cW;
  const sp = cW / NUM_LINES;
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.28;
  for (let i = 0; i < NUM_LINES; i++) {
    const lx = i * sp;
    const g = ctx.createLinearGradient(lx + lw, 0, lx, 0);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.261, "rgba(18,18,18,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(lx, 0, lw, cH);
  }
  ctx.restore();
}

/* ── Helper: resize canvas to physical pixels ── */
function resizeCanvas(canvas) {
  canvas.width = canvas.offsetWidth * devicePixelRatio;
  canvas.height = canvas.offsetHeight * devicePixelRatio;
}

/* ── Orb data per section ── */
const heroScreens = [
  {
    orbs: [
      { x: 356.5, y: 695.5, r: 309.5 },
      { x: 1106, y: 956, r: 282 },
      { x: 1453.5, y: 795.5, r: 209.5 },
      { x: 776.5, y: 859.5, r: 309.5 },
    ],
  },
  {
    orbs: [
      { x: 673.5, y: 613.5, r: 309.5 },
      { x: 911, y: 995, r: 282 },
      { x: 1297.5, y: 922.5, r: 209.5 },
      { x: 399.5, y: 922.5, r: 309.5 },
    ],
  },
  {
    orbs: [
      { x: 1082.5, y: 486.5, r: 309.5 },
      { x: 582, y: 988, r: 282 },
      { x: 983.5, y: 841.5, r: 209.5 },
      { x: 526.5, y: 586.5, r: 309.5 },
    ],
  },
  {
    orbs: [
      { x: 953.5, y: 947.5, r: 309.5 },
      { x: 563, y: 718, r: 282 },
      { x: 458.5, y: 1023.5, r: 209.5 },
      { x: 953.5, y: 511.5, r: 309.5 },
    ],
  },
  {
    orbs: [
      { x: 410.5, y: 999.5, r: 309.5 },
      { x: 477, y: 623, r: 282 },
      { x: 1088.5, y: 999.5, r: 209.5 },
      { x: 819.5, y: 821.5, r: 309.5 },
    ],
  },
];

const footerScreens = [
  {
    orbs: [
      { x: 200, y: 600, r: 340 },
      { x: 900, y: 900, r: 280 },
      { x: 1350, y: 700, r: 220 },
      { x: 650, y: 800, r: 320 },
    ],
  },
  {
    orbs: [
      { x: 500, y: 500, r: 320 },
      { x: 1100, y: 850, r: 300 },
      { x: 300, y: 750, r: 210 },
      { x: 1000, y: 600, r: 340 },
    ],
  },
  {
    orbs: [
      { x: 800, y: 650, r: 300 },
      { x: 400, y: 900, r: 280 },
      { x: 1200, y: 800, r: 240 },
      { x: 700, y: 500, r: 330 },
    ],
  },
  {
    orbs: [
      { x: 1100, y: 700, r: 320 },
      { x: 250, y: 600, r: 260 },
      { x: 900, y: 850, r: 210 },
      { x: 500, y: 750, r: 310 },
    ],
  },
  {
    orbs: [
      { x: 600, y: 800, r: 340 },
      { x: 1200, y: 550, r: 290 },
      { x: 350, y: 700, r: 220 },
      { x: 850, y: 900, r: 300 },
    ],
  },
];

const featScreens = [
  {
    orbs: [
      { x: 800, y: 900, r: 380 },
      { x: 200, y: 700, r: 280 },
      { x: 1300, y: 600, r: 240 },
      { x: 600, y: 400, r: 300 },
    ],
  },
  {
    orbs: [
      { x: 400, y: 600, r: 340 },
      { x: 1100, y: 800, r: 300 },
      { x: 300, y: 300, r: 200 },
      { x: 900, y: 500, r: 350 },
    ],
  },
  {
    orbs: [
      { x: 1200, y: 700, r: 360 },
      { x: 500, y: 900, r: 260 },
      { x: 800, y: 200, r: 220 },
      { x: 200, y: 500, r: 320 },
    ],
  },
  {
    orbs: [
      { x: 600, y: 800, r: 300 },
      { x: 1000, y: 400, r: 280 },
      { x: 400, y: 200, r: 250 },
      { x: 1200, y: 900, r: 340 },
    ],
  },
  {
    orbs: [
      { x: 300, y: 400, r: 350 },
      { x: 900, y: 700, r: 290 },
      { x: 1100, y: 300, r: 210 },
      { x: 500, y: 900, r: 310 },
    ],
  },
];

const F_OFFSET = SCREEN_DUR * 1.5; /* footer time offset   */
const F2_OFFSET = SCREEN_DUR * 2.7; /* feature time offset  */

/* ── Canvas setup ── */
const heroCanvas = document.getElementById("bgCanvas");
const heroCtx = heroCanvas.getContext("2d");

const fCanvas = document.getElementById("footerCanvas");
const fCtx = fCanvas.getContext("2d");

const featCanvas = document.getElementById("featureCanvas");
const featCtx = featCanvas.getContext("2d");

/* Resize all on load + window resize */
function resizeAll() {
  resizeCanvas(heroCanvas);
  resizeCanvas(fCanvas);
  resizeCanvas(featCanvas);
}
resizeAll();
window.addEventListener("resize", resizeAll);

/* ── Main RAF loop ── */
function tick(ts) {
  if (!t0) t0 = ts;
  const el = ts - t0;
  const totalCycle = SCREEN_DUR * NUM_SCREENS;

  /* Hero */
  {
    const cp = el % totalCycle;
    const cur = Math.floor(cp / SCREEN_DUR);
    const nxt = (cur + 1) % NUM_SCREENS;
    const t = ease((cp % SCREEN_DUR) / SCREEN_DUR);
    drawBg(
      heroCtx,
      heroCanvas.width,
      heroCanvas.height,
      heroScreens,
      cur,
      nxt,
      t,
      0.75,
    );
  }

  /* Footer */
  {
    const cp = (el + F_OFFSET) % totalCycle;
    const cur = Math.floor(cp / SCREEN_DUR);
    const nxt = (cur + 1) % NUM_SCREENS;
    const t = ease((cp % SCREEN_DUR) / SCREEN_DUR);
    drawBg(
      fCtx,
      fCanvas.width,
      fCanvas.height,
      footerScreens,
      cur,
      nxt,
      t,
      0.85,
    );
  }

  /* Feature card */
  {
    const cp = (el + F2_OFFSET) % totalCycle;
    const cur = Math.floor(cp / SCREEN_DUR);
    const nxt = (cur + 1) % NUM_SCREENS;
    const t = ease((cp % SCREEN_DUR) / SCREEN_DUR);
    drawBg(
      featCtx,
      featCanvas.width,
      featCanvas.height,
      featScreens,
      cur,
      nxt,
      t,
      0.85,
    );
  }

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);

/* ── Full-screen menu ── */
const menu = document.getElementById("fullmenu");
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");

function openMenu() {
  menu.classList.add("open");
  menu.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menu.classList.remove("open");
  menu.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// make navbar fixed while scrolling
window.addEventListener("scroll", () =>
  document
    .getElementById("mainNav")
    .classList.toggle("fixed", window.scrollY > 40),
);


// select input active state
$("select").each(function () {
  // الحالة الأولية
  if ($(this).val()) {
    $(this).addClass("active");
  }

  $(this).on("change", function () {
    $(this).toggleClass("active", !!$(this).val());
  });
});
