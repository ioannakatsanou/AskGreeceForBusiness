// Standard response envelope: { ok, data?, error?, meta }.

export function ok(res, data, meta = {}, status = 200) {
  return res.status(status).json({ ok: true, data, meta });
}

export function fail(res, code, message, status = 400, meta = {}) {
  return res.status(status).json({ ok: false, error: { code, message }, meta });
}
