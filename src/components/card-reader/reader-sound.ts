let bytes: Promise<ArrayBuffer | null> | null = null;
let context: AudioContext | null = null;
let decoded: Promise<AudioBuffer | null> | null = null;

/** Downloads the sound ahead of time without touching audio, so no autoplay warning fires. */
export function preloadReaderSound(src: string) {
  bytes ??= fetch(src)
    .then((res) => (res.ok ? res.arrayBuffer() : null))
    .catch(() => null);
}

/**
 * Schedules the sound `delay` seconds from now. Must be called synchronously inside the click
 * handler: creating and resuming the AudioContext there is what browser autoplay rules require.
 */
export function playReaderSound(src: string, delay: number, volume = 0.6) {
  if (typeof window === "undefined" || !window.AudioContext) return;
  preloadReaderSound(src);
  context ??= new AudioContext();
  const ctx = context;
  void ctx.resume();
  decoded ??= bytes!.then((data) => (data ? ctx.decodeAudioData(data) : null)).catch(() => null);

  const at = ctx.currentTime + delay;
  void decoded.then((buffer) => {
    if (!buffer) return;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain).connect(ctx.destination);
    source.start(Math.max(at, ctx.currentTime));
  });
}
