export function buildSafeMailtoPayload({ name, contact, inquiryType, message }) {
  const targetEmail = "titashdev@gmail.com";
  const safeName = String(name || "Unknown").slice(0, 120);
  const safeContact = String(contact || "not provided").slice(0, 180);
  const safeType = String(inquiryType || "Inquiry").slice(0, 160);
  const safeMessage = String(message || "").slice(0, 1600);

  const subject = encodeURIComponent(`[Portfolio brief] ${safeType} — ${safeName}`);

  const timestamp = new Date().toISOString();
  const resolution = typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "Unknown";
  const locale = typeof navigator !== "undefined" ? navigator.language : "Unknown";

  const body = encodeURIComponent(
    `Name: ${safeName}\n` +
      `Reply-to: ${safeContact}\n` +
      `Inquiry: ${safeType}\n\n` +
      `${safeMessage}\n\n` +
      `--\n` +
      `Sent from the Titash Dev command-matrix portfolio\n` +
      `${timestamp} · ${resolution} · ${locale}`,
  );

  return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
}

let sharedAudioContext = null;

function getSharedAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;

  try {
    if (!sharedAudioContext || sharedAudioContext.state === "closed") {
      sharedAudioContext = new AudioContextClass();
    }
    if (sharedAudioContext.state === "suspended") {
      sharedAudioContext.resume().catch(() => {});
    }
    return sharedAudioContext;
  } catch (e) {
    console.warn("Failed to initialize AudioContext", e);
    return null;
  }
}

export function safeAudioContextTrigger(audioCtxRef) {
  try {
    const ctx = getSharedAudioContext();
    if (audioCtxRef) {
      audioCtxRef.current = ctx;
    }
    return ctx;
  } catch (e) {
    console.warn("Audio alert blocked by browser.", e);
    return null;
  }
}

export function playTactileClickSound() {
  if (typeof window !== "undefined") {
    window._hudEngagement = (window._hudEngagement || 0) + 1;
  }

  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.015);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect();
      gainNode.disconnect();
    };

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch (e) {
    console.warn("Audio tactile feedback blocked by browser.", e);
  }
}

export function playTactileAudio(frequency = 800, type = "sine", duration = 0.04) {
  try {
    const ctx = getSharedAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.onended = () => {
      osc.disconnect();
      gainNode.disconnect();
    };

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn("Audio tactile feedback blocked by browser.", e);
  }
}
