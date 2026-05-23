/* =========================
   CANVAS SETUP
========================= */

const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalculate letters if screen size adjustments occur
    initConstellationPoints();
}

/* =========================
   STARS & CONSTELLATION SETUP
========================= */

const stars = [];
const totalStars = 90;

// High-fidelity structural coordinate blueprints mapping the word: S - H - A - F - A
const letterBlueprints = {
    'S': [[3,1], [2,1], [1,1.5], [1,2], [2,2.5], [3,3], [3,3.5], [2,4], [1,4]],
    'H': [[5,1], [5,4], [5,2.5], [7,2.5], [7,1], [7,4]],
    'A': [[9,4], [10,2], [11,1], [12,2], [13,4], [10.2,2.8], [11.8,2.8]],
    'F': [[15,4], [15,1], [17,1], [15,2.3], [16.5,2.3]],
    'A_2': [[19,4], [20,2], [21,1], [22,2], [23,4], [20.2,2.8], [22,2.8]]
};

let constellationPoints = [];
let constellationActive = false;
let lineProgress = 0; 

function initConstellationPoints() {
    constellationPoints = [];
    
    const isMobile = window.innerWidth < 768;
    const gridScale = isMobile ? Math.min(window.innerWidth / 28, 14) : 22; 
    
    const totalGridWidth = 24; 
    const totalGridHeight = 5;
    
    // Perfectly center the coordinates inside the upper-middle region of the viewport
    const startX = (canvas.width - (totalGridWidth * gridScale)) / 2;
    const startY = (canvas.height * 0.38) - ((totalGridHeight * gridScale) / 2);

    for (const key in letterBlueprints) {
        const points = letterBlueprints[key];
        const strokePoints = [];
        
        points.forEach(pt => {
            const x = startX + (pt[0] * gridScale);
            const y = startY + (pt[1] * gridScale);
            strokePoints.push({ x, y });
        });
        
        constellationPoints.push(strokePoints);
    }
}

function getFlatTargets() {
    let flat = [];
    constellationPoints.forEach(letterStrokes => {
        letterStrokes.forEach(pt => {
            flat.push(pt);
        });
    });
    return flat;
}

// Generate the star cluster
for(let i = 0; i < totalStars; i++){
    stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        origX: 0,
        origY: 0,
        radius: Math.random() * 1.8,
        speed: Math.random() * 0.2,
        opacity: Math.random(),
        color: Math.random() > 0.5 ? "#ffffff" : "#ffd6f2",
        
        // Target positioning configurations
        targetX: null,
        targetY: null,
        isConstellationStar: false
    });
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* =========================
   CONSTELLATION ANIMATION TRIGGER
========================= */

const constellationNameElem = document.getElementById("constellation-name");

function triggerConstellation() {
    // 🌌 NEW UPGRADE: Start the song the exact millisecond the constellation triggers!
    if (music) {
        music.play().catch(err => {
            console.log("Waiting for her first touch to activate music channel.");
        });
    }

    initConstellationPoints();
    const targets = getFlatTargets();
    
    // Shuffle stars array dynamically to assign random background stars...
    
    // Scramble stars array to assign random canvas points to the vector targets
    const shuffledStars = [...stars].sort(() => 0.5 - Math.random());
    
    stars.forEach(s => {
        s.isConstellationStar = false;
        s.targetX = null;
        s.targetY = null;
    });

    for (let i = 0; i < targets.length; i++) {
        if (shuffledStars[i]) {
            shuffledStars[i].isConstellationStar = true;
            shuffledStars[i].targetX = targets[i].x;
            shuffledStars[i].targetY = targets[i].y;
            shuffledStars[i].origX = shuffledStars[i].x;
            shuffledStars[i].origY = shuffledStars[i].y;
        }
    }

    constellationActive = true;
    lineProgress = 0;
    
    if (constellationNameElem) {
        constellationNameElem.classList.add("show");
    }
    // Maintain alignment for 7 seconds, then cleanly dissolve back to orbit stream
    setTimeout(() => {
        constellationActive = false;
        if (constellationNameElem) {
            constellationNameElem.classList.remove("show");
        }
        stars.forEach(s => s.isConstellationStar = false);
    }, 20000);
}

// Automatically loops constellation assembly every 14 seconds
setInterval(triggerConstellation, 20000);

// Delayed initial trigger to give her a moment to look at the screen first
setTimeout(triggerConstellation, 3000);

/* =========================
   SHOOTING STARS
========================= */

const shootingStars = [];

function createShootingStar(){
    shootingStars.push({
        x: Math.random() * canvas.width,
        y: -50,
        length: Math.random() * 100 + 80,
        speed: Math.random() * 6 + 5,
        opacity: 1
    });
}

setInterval(createShootingStar, 3500);

/* =========================
   PARALLAX EFFECT
========================= */

let parallaxX = 0;
let parallaxY = 0;

window.addEventListener("mousemove", (e)=>{
    parallaxX = (e.clientX - window.innerWidth / 2) * 0.01;
    parallaxY = (e.clientY - window.innerHeight / 2) * 0.01;
});

window.addEventListener("touchmove", (e)=>{
    const touch = e.touches[0];
    parallaxX = (touch.clientX - window.innerWidth / 2) * 0.01;
    parallaxY = (touch.clientY - window.innerHeight / 2) * 0.01;
});

/* =========================
   MAIN ANIMATION LOOP
========================= */

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* 1. Star Updates & Rendering */
    let starsArrived = 0;
    let totalConstellationStars = 0;

    for(let star of stars){
        ctx.beginPath();

        if (star.isConstellationStar && constellationActive) {
            totalConstellationStars++;
            
            // Linear interpolation vector calculations for smooth drift-into-place physics
            const dx = star.targetX - star.x;
            const dy = star.targetY - star.y;
            star.x += dx * 0.06; 
            star.y += dy * 0.06;

            if (Math.abs(dx) < 1.5 && Math.abs(dy) < 1.5) {
                starsArrived++;
            }
            
            // Give her name stars an extra intense structural cosmic glow
            ctx.arc(star.x, star.y, star.radius + 0.8, 0, Math.PI * 2);
            ctx.fillStyle = "#ffffff";
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 14;
            ctx.shadowColor = "#ffffff";
        } else {
            // Standard sky movement logic
            ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.opacity;
            ctx.shadowBlur = 8;
            ctx.shadowColor = star.color;

            star.y += star.speed;

            if(star.y > canvas.height){
                star.y = 0;
            }
            
            if (star.targetX !== null) {
                star.targetX = null;
                star.targetY = null;
            }
        }

        ctx.fill();
    }

    /* 2. Drawing Interactive Constellation Vector Lines */
    // Trigger vector line drawing mechanisms once 85% of active nodes drop into targeted slots
    if (constellationActive && totalConstellationStars > 0 && (starsArrived / totalConstellationStars) >= 0.85) {
        if (lineProgress < 1) lineProgress += 0.03; 

        ctx.save();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, ${lineProgress * 0.9})';
        ctx.shadowBlur = 18;
        ctx.shadowColor = "rgba(255, 105, 180, 0.85)"; // Magical pink outer aura glow

        constellationPoints.forEach(letterStrokes => {
            if (letterStrokes.length < 2) return;
            
            const totalSegments = letterStrokes.length - 1;
            const segmentsToDraw = Math.floor(totalSegments * lineProgress);
            const partialSegmentRatio = (totalSegments * lineProgress) % 1;
            ctx.beginPath();
            ctx.moveTo(letterStrokes[0].x, letterStrokes[0].y);

            for (let i = 0; i < segmentsToDraw; i++) {
                ctx.lineTo(letterStrokes[i+1].x, letterStrokes[i+1].y);
            }

            if (segmentsToDraw < totalSegments) {
                const lastPt = letterStrokes[segmentsToDraw];
                const nextPt = letterStrokes[segmentsToDraw + 1];
                const currentX = lastPt.x + (nextPt.x - lastPt.x) * partialSegmentRatio;
                const currentY = lastPt.y + (nextPt.y - lastPt.y) * partialSegmentRatio;
                ctx.lineTo(currentX, currentY);
            }
            ctx.stroke();
        });
        ctx.restore();
    }

    /* 3. Shooting Stars Rendering Pipeline */
    for(let i = 0; i < shootingStars.length; i++){
        const s = shootingStars[i];
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.length, s.y + s.length);
        ctx.strokeStyle = "rgba(255,255,255," + s.opacity + ")";
        ctx.lineWidth = 2;
        ctx.stroke();

        s.x += s.speed;
        s.y += s.speed;
        s.opacity -= 0.008;

        if(s.opacity <= 0){
            shootingStars.splice(i,1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}

animate();

/* =========================
   FLOATING QUOTES
========================= */

const quotes = [
    "You are my peace 💖",
    "Somewhere between stars... it's you ✨",
    "You changed my universe 🌌",
    "Forever feels softer with you 🌙",
    "You feel like home 🌸"
];

function createQuote(){
    const quote = document.createElement("div");
    quote.classList.add("quote");
    quote.innerText = quotes[Math.floor(Math.random() * quotes.length)];
    quote.style.left = Math.random() * 80 + "%";
    quote.style.top = Math.random() * 80 + "%";
    document.body.appendChild(quote);

    setTimeout(()=>{
        quote.remove();
    }, 10000);
}

setInterval(createQuote, 5000);

/* =========================
   SPARKLES
========================= */

function createSparkle(){
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.style.left = Math.random() * window.innerWidth + "px";
    sparkle.style.top = Math.random() * window.innerHeight + "px";
    document.body.appendChild(sparkle);

    setTimeout(()=>{
        sparkle.remove();
    }, 4000);
}

setInterval(createSparkle, 700);

/* =========================
   CURSOR GLOW
========================= */

const cursorGlow = document.getElementById("cursor-glow");
window.addEventListener("mousemove", (e)=>{
    if(cursorGlow) {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top = e.clientY + "px";
    }
});

/* =========================
   GALAXY DUST
========================= */

function createDust(x, y){
    const dust = document.createElement("div");
    dust.classList.add("dust");
    dust.style.left = x + "px";
    dust.style.top = y + "px";
    document.body.appendChild(dust);

    setTimeout(()=>{
        dust.remove();
    }, 1200);
}

let dustCooldown = false;

window.addEventListener("mousemove", (e)=>{
    if(dustCooldown) return;
    dustCooldown = true;
    createDust(e.clientX, e.clientY);
    setTimeout(()=>{
        dustCooldown = false;
    }, 60);
});

window.addEventListener("touchmove", (e)=>{
    if(dustCooldown) return;
    dustCooldown = true;
    const touch = e.touches[0];
    createDust(touch.clientX, touch.clientY);
    setTimeout(()=>{
        dustCooldown = false;
    }, 60);
});

/* =========================
   MUSIC CONTROL
========================= */

const music = document.getElementById("bg-music");

function playAudioEngine() {
    if (music) {
        // This forces the music to play on her first interaction anywhere on screen
        music.play().catch(err => {
            console.log("Browser blocked autoplay. Waiting for user interaction.");
        });
    }
}

// Triggers the music the split-second she touches or clicks ANYWHERE on the screen
document.addEventListener("click", playAudioEngine, { once: true });
document.addEventListener("touchstart", playAudioEngine, { once: true });
document.addEventListener("mousemove", playAudioEngine, { once: true });

/* =========================
   LOVE MESSAGE RAIN
========================= */
const loveMessages = [
    "Forever yours ✨",
    "You are my peace 💖",
    "You feel like home 🌸",
    "My favorite person 🌙"
];

function createLoveMessage(){
    const msg = document.createElement("div");
    msg.classList.add("love-message");
    msg.innerText = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    msg.style.left = (Math.random() * 80 + 10) + "%";
    msg.style.top = (Math.random() * 80 + 10) + "%";
    document.body.appendChild(msg);

    setTimeout(()=>{
        msg.remove();
    }, 12000);
}

setInterval(createLoveMessage, 5000);

/* =========================
   PLANET CLICK / TOUCH INTERACTIVE ACTIONS
========================= */

const planets = document.querySelectorAll(".planet");
const memoryCard = document.getElementById("memory-card");
const cardTitle = document.getElementById("card-title");
const cardDate = document.getElementById("card-date");
const cardMemory = document.getElementById("card-memory");
const closeBtn = document.getElementById("close-btn");

function openMemory(planet){
    cardTitle.innerText = planet.dataset.title;
    cardDate.innerText = planet.dataset.date;
    cardMemory.innerText = planet.dataset.memory;
    memoryCard.classList.add("active");
}

planets.forEach((planet)=>{
    planet.addEventListener("click", () => openMemory(planet));
    planet.addEventListener("touchstart", () => openMemory(planet));
});

function closeMemoryModule() {
    memoryCard.classList.remove("active");
}


if(closeBtn) {
    closeBtn.addEventListener("click", closeMemoryModule);
    closeBtn.addEventListener("touchstart", closeMemoryModule);
}
/* ==========================================================================
   UPGRADE MODULES: RELATIONSHIP TIMELINE CLOCK & SHOOTING STAR WISH MAKER
   ========================================================================== */

/* --- MODULE A: THE LIVE RELATIONSHIP TIMELINE CLOCK --- */
// Change this string variable to your specific official anniversary or date when you two met!
// Format must strictly remain: YYYY-MM-DDTHH:MM:SS
const RELATIONSHIP_START_DATE = "2025-11-13T00:53:10"; 

function updateRelationshipTimelineClock() {
    const clockDigitsElem = document.getElementById("clock-digits");
    if (!clockDigitsElem) return;

    const startDate = new Date(RELATIONSHIP_START_DATE);
    const now = new Date();
    const differenceInMs = now - startDate;

    // Standard cosmic mathematical conversion mechanics
    const totalSeconds = Math.floor(differenceInMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    // Force values into cleanly formatted digit representations
    const displayDays = String(days).padStart(3, '0');
    const displayHours = String(hours).padStart(2, '0');
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(seconds).padStart(2, '0');

    clockDigitsElem.innerText = `${displayDays}d : ${displayHours}h : ${displayMinutes}m : ${displaySeconds}s`;
}

// Keep countdown ticking cleanly live every single second
setInterval(updateRelationshipTimelineClock, 1000);
updateRelationshipTimelineClock();


/* --- MODULE B: FLOATING LOVE LETTER WISH TRIGGER --- */
const wishCard = document.getElementById("wish-card");
const wishSuccessCard = document.getElementById("wish-success-card");
const wishText = document.getElementById("wish-text");
const submitWishBtn = document.getElementById("submit-wish-btn");
const closeWishBtn = document.getElementById("close-wish-btn");
const closeSuccessBtn = document.getElementById("close-success-btn");
const wishTriggerPlanet = document.querySelector(".wish-trigger-planet");

// Open the wish module when she clicks the love letter planet
if (wishTriggerPlanet) {
    wishTriggerPlanet.addEventListener("click", (e) => {
        // Prevent it from opening the standard planet memory card
        e.stopPropagation(); 
        openWishWindow();
    });
    wishTriggerPlanet.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        openWishWindow();
    });
}

function openWishWindow() {
    if (wishText) wishText.value = ""; // Clear out previous text cleanly
    if (wishCard) wishCard.classList.add("active");
}

/* --- CLICK ACTION INTERACTION HANDLERS --- */

// Right-down corner "Make Your Wish" action trigger pipeline
if (submitWishBtn) {
    submitWishBtn.addEventListener("click", () => {
        if (wishCard) wishCard.classList.remove("active");
        if (wishSuccessCard) wishSuccessCard.classList.add("active");
    });
}

// Clean close handlers
if (closeWishBtn) {
    closeWishBtn.addEventListener("click", () => wishCard.classList.remove("active"));
}
if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener("click", () => wishSuccessCard.classList.remove("active"));
}
/* ==========================================================
   PERFORMANCE HYPER-DRIVE: FRAME-RATE STABILIZER INTERCEPTOR
   ========================================================== */
(function() {
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function(callback) {
        return originalRAF(function(timestamp) {
            // Regulates frame timing perfectly so the phone's processor never chokes
            setTimeout(() => {
                callback(timestamp);
            }, 0);
        });
    };
})();
