// ===========================
// EMILIA JS (FINAL)
// ===========================

const emilia = document.querySelector(".emilia");

// ---- audio ----
const audio = {
  welcome: new Audio("../assets/welcome.mp3"),
  angry: new Audio("../assets/angry.mp3"),
  laugh: new Audio("../assets/laugh.mp3"),
};

// ---- state ----
let state = "idle";
let lastTouch = Date.now();
let idleTimer = null;
let sleepTimer = null;
let walkTimer = null;
let angryTimer = null;
let runTimer = null;
let laughTimer = null;

// ---- prevent multiple states ----
function setState(newState) {
  if (state === newState) return;

  emilia.className = "emilia " + newState;
  state = newState;
}

// ---- welcome on load ----
window.addEventListener("load", () => {
  setState("welcome");
  audio.welcome.play();

  setTimeout(() => {
    setState("idle");
    startIdleTimer();
  }, 2000);
});

// ---- idle timer ----
function startIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    randomWalk();
  }, 8000);
}

// ---- random walk ----
function randomWalk() {
  setState("walk");

  // walk for random duration
  const duration = 2000 + Math.random() * 3000;

  walkTimer = setTimeout(() => {
    setState("idle");
    startIdleTimer();
  }, duration);

  // move randomly on screen
  const x = Math.random() * (window.innerWidth - 150);
  const y = Math.random() * (window.innerHeight - 150);

  emilia.style.transition = "all 2s ease";
  emilia.style.left = x + "px";
  emilia.style.top = y + "px";
}

// ---- sleep after 5 minutes of inactivity ----
function startSleepTimer() {
  clearTimeout(sleepTimer);
  sleepTimer = setTimeout(() => {
    setState("sleep");
  }, 300000);
}

// ---- eat random once ----
function randomEat() {
  setState("eat");
  setTimeout(() => setState("idle"), 1400);
}

// ---- angry reaction ----
function angryReaction() {
  setState("angry");
  audio.angry.play();
  setTimeout(() => setState("idle"), 1400);
}

// ---- run reaction ----
function runReaction() {
  setState("run");

  // move fast away
  const x = Math.random() * (window.innerWidth - 150);
  const y = Math.random() * (window.innerHeight - 150);

  emilia.style.transition = "all 0.6s ease";
  emilia.style.left = x + "px";
  emilia.style.top = y + "px";

  runTimer = setTimeout(() => {
    setState("idle");
    startIdleTimer();
  }, 1800);
}

// ---- laugh reaction ----
function laughReaction() {
  setState("laugh");
  audio.laugh.play();
  setTimeout(() => setState("idle"), 1200);
}

// ---- drag and move ----
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

emilia.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - emilia.getBoundingClientRect().left;
  offsetY = e.clientY - emilia.getBoundingClientRect().top;
  emilia.style.cursor = "grabbing";
  clearAllTimers();
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;

  emilia.style.left = Math.max(0, Math.min(window.innerWidth - 140, x)) + "px";
  emilia.style.top = Math.max(0, Math.min(window.innerHeight - 140, y)) + "px";
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  emilia.style.cursor = "grab";
  startIdleTimer();
  startSleepTimer();
});

emilia.addEventListener("click", () => {
  laughReaction();
  lastTouch = Date.now();
  clearAllTimers();
  startIdleTimer();
  startSleepTimer();
});

// ---- touch support ----
emilia.addEventListener("touchstart", (e) => {
  isDragging = true;
  const touch = e.touches[0];
  offsetX = touch.clientX - emilia.getBoundingClientRect().left;
  offsetY = touch.clientY - emilia.getBoundingClientRect().top;
  clearAllTimers();
});

document.addEventListener("touchmove", (e) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const x = touch.clientX - offsetX;
  const y = touch.clientY - offsetY;

  emilia.style.left = Math.max(0, Math.min(window.innerWidth - 140, x)) + "px";
  emilia.style.top = Math.max(0, Math.min(window.innerHeight - 140, y)) + "px";
});

document.addEventListener("touchend", () => {
  isDragging = false;
  startIdleTimer();
  startSleepTimer();
});

// ---- clear all timers ----
function clearAllTimers() {
  clearTimeout(idleTimer);
  clearTimeout(sleepTimer);
  clearTimeout(walkTimer);
  clearTimeout(runTimer);
}

// ---- random events ----
setInterval(() => {
  if (state !== "idle") return;

  const rand = Math.random();
  if (rand < 0.1) randomEat();
  else if (rand < 0.2) laughReaction();
}, 20000);

// ---- angry if spam click (dragging) ----
let clickCount = 0;
setInterval(() => {
  clickCount = 0;
}, 2000);

emilia.addEventListener("mousedown", () => {
  clickCount++;
  if (clickCount >= 8) {
    angryReaction();
    clickCount = 0;
  }
});

// ---- sleep timer start ----
startSleepTimer();
startIdleTimer();