document.addEventListener("DOMContentLoaded", () => {
  const envelopeScreen = document.getElementById("envelope-screen");
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const lightBurst = document.getElementById("light-burst");
  const confettiContainer = document.getElementById("confetti-container");
  const invitationContainer = document.getElementById("invitation-container");
  const bgVideo = document.getElementById("bg-video");

  let isOpened = false;

  function spawnPetals() {
    if (!confettiContainer) return;
    const colors = ["#f8bbd0", "#f48fb1", "#ec407a", "#e7c785", "#fff3e0"];
    for (let i = 0; i < 34; i++) {
      const petal = document.createElement("span");
      petal.className = "petal";
      const size = Math.random() * 10 + 8;
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 0.75}px`;
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      petal.style.animationDuration = `${Math.random() * 2.2 + 2.4}s`;
      petal.style.animationDelay = `${Math.random() * 0.6}s`;
      confettiContainer.appendChild(petal);

      setTimeout(() => {
        petal.remove();
      }, 5200);
    }
  }

  function revealVisibleSections() {
    const reveals = document.querySelectorAll(".reveal");
    const triggerBottom = window.innerHeight * 0.9;
    reveals.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }

  function openInvitation() {
    if (isOpened) return;
    isOpened = true;

    if (envelopeWrapper) {
      envelopeWrapper.classList.add("open");
    }
    if (lightBurst) {
      lightBurst.classList.add("active");
    }

    spawnPetals();

    setTimeout(() => {
      if (envelopeScreen) {
        envelopeScreen.classList.add("fade-out");
      }
      if (invitationContainer) {
        invitationContainer.classList.remove("hidden");
      }
      if (bgVideo && typeof bgVideo.play === "function") {
        bgVideo.play().catch(() => {});
      }
      revealVisibleSections();
    }, 650);

    setTimeout(() => {
      if (envelopeScreen) {
        envelopeScreen.style.display = "none";
      }
    }, 1400);
  }

  if (envelopeWrapper) {
    envelopeWrapper.addEventListener("click", openInvitation);
    envelopeWrapper.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvitation();
      }
    });
  }

  window.addEventListener("scroll", revealVisibleSections, { passive: true });
  window.addEventListener("resize", revealVisibleSections, { passive: true });

  /* ================= HEART SCRATCH CANVAS ================= */
  const canvas = document.getElementById("scratch-canvas");
  const scratchHeading = document.getElementById("scratch-heading");

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    let isDrawing = false;
    let isCompleted = false;

    function drawHeartPath(context, w, h) {
      context.beginPath();
      const topCurveHeight = h * 0.3;
      context.moveTo(w / 2, h * 0.88);
      context.bezierCurveTo(
        w * 0.1,
        h * 0.62,
        w * 0.02,
        topCurveHeight,
        w * 0.27,
        topCurveHeight
      );
      context.bezierCurveTo(
        w * 0.42,
        topCurveHeight,
        w * 0.5,
        h * 0.42,
        w / 2,
        h * 0.46
      );
      context.bezierCurveTo(
        w * 0.5,
        h * 0.42,
        w * 0.58,
        topCurveHeight,
        w * 0.73,
        topCurveHeight
      );
      context.bezierCurveTo(
        w * 0.98,
        topCurveHeight,
        w * 0.9,
        h * 0.62,
        w / 2,
        h * 0.88
      );
      context.closePath();
    }

    function initScratchLayer() {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, "#f8bbd0");
      grad.addColorStop(0.5, "#ec407a");
      grad.addColorStop(1, "#c99b4e");

      drawHeartPath(ctx, width, height);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.lineWidth = 3;
      ctx.strokeStyle = "#ffffff";
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "600 16px Cinzel, serif";
      ctx.textAlign = "center";
      ctx.fillText("SCRATCH HEART", width / 2, height * 0.52);
    }

    initScratchLayer();

    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
      return {
        x: ((clientX - rect.left) / rect.width) * width,
        y: ((clientY - rect.top) / rect.height) * height
      };
    }

    function checkScratchPercent() {
      if (isCompleted) return;
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let transparentPixels = 0;
      let totalPixels = 0;

      for (let i = 3; i < imageData.length; i += 16) {
        totalPixels++;
        if (imageData[i] === 0) {
          transparentPixels++;
        }
      }

      if (totalPixels > 0 && transparentPixels / totalPixels > 0.36) {
        isCompleted = true;
        canvas.classList.add("revealed");
        if (scratchHeading) {
          scratchHeading.textContent = "Save the Date";
        }
      }
    }

    function scratchAt(e) {
      if (!isDrawing || isCompleted) return;
      const pos = getPointerPos(e);
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
      ctx.fill();
      checkScratchPercent();
    }

    canvas.addEventListener("pointerdown", (e) => {
      isDrawing = true;
      scratchAt(e);
    });
    canvas.addEventListener("pointermove", scratchAt);
    window.addEventListener("pointerup", () => {
      isDrawing = false;
    });
  }

  /* ================= LIVE COUNTDOWN (20-12-2026, 8:00 PM) ================= */
  const targetDate = new Date("2026-12-20T20:00:00").getTime();
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ================= SIMPLE RSVP / MESSAGE FEEDBACK ================= */
  const rsvpForm = document.getElementById("rsvp-form");
  const rsvpMessage = document.getElementById("rsvp-message");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const guestName = document.getElementById("guest-name")?.value.trim() || "Guest";
      if (rsvpMessage) {
        rsvpMessage.textContent = `JazakAllah Khair, ${guestName}! Your message has been recorded.`;
      }
      rsvpForm.reset();
    });
  }
});
        
