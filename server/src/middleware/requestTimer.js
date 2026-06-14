// Records request start time so handlers can report meta.tookMs.
export function requestTimer(req, res, next) {
  req.startedAt = Date.now();
  next();
}

export function elapsed(req) {
  return Date.now() - (req.startedAt || Date.now());
}
