// Wraps a promise with a hard timeout. Rejects with a tagged error if the work
// outruns the budget. Mock work resolves instantly, but the guard is in place so
// the real (slow) ESIDIS/KIMDIS adapters in a later phase can't hang a request.
export class TimeoutError extends Error {
  constructor(ms) {
    super(`Operation timed out after ${ms}ms`);
    this.name = "TimeoutError";
    this.code = "TIMEOUT";
  }
}

export function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(ms)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
