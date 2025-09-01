function diffInMinutes(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.round(ms / 60000);
}
module.exports = { diffInMinutes };
