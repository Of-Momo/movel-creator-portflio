let sentinel: WakeLockSentinel | null = null;

export async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      sentinel = await (navigator as any).wakeLock.request("screen");
    }
  } catch {
    // Not available/allowed — fine, compression still runs, screen may just dim.
  }
}

export async function releaseWakeLock() {
  try {
    await sentinel?.release();
  } catch {
    // ignore
  } finally {
    sentinel = null;
  }
}
