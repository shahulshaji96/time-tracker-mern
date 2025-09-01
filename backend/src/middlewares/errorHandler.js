function errorHandler(err, req, res, next) {
  console.error(err && err.stack ? err.stack : err);
  res.status(400).json({ error: err.message || 'Server error' });
}
module.exports = errorHandler;
