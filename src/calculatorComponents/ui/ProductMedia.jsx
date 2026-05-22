import React, { useEffect, useRef, useState } from "react";

/**
 * Shows a product's photo by default and swaps to its video when "active".
 * Active state:
 *   - hover-capable devices (desktop with mouse): on pointer hover.
 *   - touch devices (mobile/tablet): the single card whose center is closest
 *     to the viewport center AND within the central 70% band wins; everyone
 *     else stays on photo. Coordinated by a module-level singleton so only
 *     one video plays at a time, no matter how many cards are visible.
 *
 * Falls back gracefully when `media.video` or `media.photo` is missing.
 */

// ---- Touch-mode "closest to center" coordinator (module-scoped) ------------
const touchRegistry = new Set();
let touchListenerInstalled = false;
let touchRafScheduled = false;

function evaluateTouchActive() {
  touchRafScheduled = false;
  if (touchRegistry.size === 0) return;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const centerY = vh / 2;
  const halfBand = vh * 0.35; // central 70% = ±35% from center
  let winner = null;
  let bestDist = Infinity;
  touchRegistry.forEach((entry) => {
    const el = entry.getEl();
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cy = rect.top + rect.height / 2;
    const dist = Math.abs(cy - centerY);
    if (dist <= halfBand && dist < bestDist) {
      bestDist = dist;
      winner = entry;
    }
  });
  touchRegistry.forEach((entry) => entry.setActive(entry === winner));
}

function scheduleTouchEvaluate() {
  if (touchRafScheduled) return;
  touchRafScheduled = true;
  requestAnimationFrame(evaluateTouchActive);
}

function registerTouchEntry(entry) {
  touchRegistry.add(entry);
  if (!touchListenerInstalled && typeof window !== "undefined") {
    touchListenerInstalled = true;
    // Capture phase on document so scrolls inside nested overflow:auto
    // containers (e.g. the product picker modal) also fire — scroll events
    // don't bubble, so a window-level listener would miss them.
    document.addEventListener("scroll", scheduleTouchEvaluate, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", scheduleTouchEvaluate);
  }
  scheduleTouchEvaluate();
}

function unregisterTouchEntry(entry) {
  touchRegistry.delete(entry);
  scheduleTouchEvaluate();
}
// ----------------------------------------------------------------------------

export default function ProductMedia({ media, alt = "" }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  // Initialize synchronously so the first render already knows whether we're
  // on a hover device. Without this, isActive briefly flips to true via the
  // IntersectionObserver before the matchMedia effect promotes canHover, and
  // every visible card autoplays its video on laptop.
  const [canHover, setCanHover] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });
  const [isActive, setIsActive] = useState(false);
  // Lazy-mount the <video>: only render it after the card has been activated
  // at least once. Keeps the picker from spawning N concurrent video network
  // requests when 6–12 cards mount at once.
  const [hasActivated, setHasActivated] = useState(false);
  // Video is "ready" once `canplay` has fired; we drop back to the photo if
  // playback stalls (`waiting`) so the user never stares at a frozen frame.
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Reset on capability change so a stale isActive from one mode doesn't bleed
  // into the other (e.g. tablet plugs in a mouse).
  useEffect(() => {
    setIsActive(false);
  }, [canHover]);

  useEffect(() => {
    if (canHover) return;
    const entry = {
      getEl: () => wrapRef.current,
      setActive: setIsActive,
    };
    registerTouchEntry(entry);
    return () => unregisterTouchEntry(entry);
  }, [canHover]);

  // Promote to "activated" the first time the card becomes active. After that
  // the <video> stays mounted so the browser HTTP cache can be reused without
  // re-fetching on every subsequent hover.
  useEffect(() => {
    if (isActive && !hasActivated) setHasActivated(true);
  }, [isActive, hasActivated]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isActive, hasActivated]);

  const hoverProps = canHover
    ? {
        onMouseEnter: () => setIsActive(true),
        onMouseLeave: () => setIsActive(false),
      }
    : {};

  const showVideo = isActive && videoReady && media?.video;

  return (
    <div
      ref={wrapRef}
      className="relative w-full aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden"
      {...hoverProps}
    >
      {media?.photo && (
        <img
          src={media.photo}
          alt={alt}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            showVideo ? "opacity-0" : "opacity-100"
          }`}
        />
      )}
      {media?.video && hasActivated && (
        <video
          ref={videoRef}
          src={media.video}
          poster={media.photo}
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          onWaiting={() => setVideoReady(false)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            showVideo ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {!media?.photo && !media?.video && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          Фото
        </div>
      )}
    </div>
  );
}
