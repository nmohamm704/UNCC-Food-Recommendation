// Wraps any async controller and forwards errors to next()
module.exports = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
