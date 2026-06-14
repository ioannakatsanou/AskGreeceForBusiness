// Wraps an async route handler so rejected promises reach the error middleware
// (Express 4 doesn't forward async errors automatically).
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
