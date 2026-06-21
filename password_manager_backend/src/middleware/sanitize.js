import mongoSanitize from 'mongo-sanitize';

function sanitizeValue(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [mongoSanitize(key), sanitizeValue(item)])
    );
  }
  return mongoSanitize(value);
}

export function sanitizeInput(req, res, next) {
  req.body = sanitizeValue(req.body || {});
  req.params = sanitizeValue(req.params || {});
  req.query = sanitizeValue(req.query || {});
  next();
}

