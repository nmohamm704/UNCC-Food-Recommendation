// global error handler – catches ANY error passed to next(err)
module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') console.error(err);

    /* ─── 1) express-validator list ─── */
    if (typeof err.array === 'function') {
        const errors = err.array().map(e => ({
            msg:   e.msg,
            param: e.param || e.path         // param for v6, path for v7
        }));
        return res.status(400).json({ errors });
    }

    /* ─── 2) Multer file-type rejection ─── */
    if (err.message?.startsWith('Invalid file type')) {
        return res.status(400).json({
            errors: [{ msg: err.message, param: 'profileImage' }]
        });
    }

    /* ─── 3) Custom errors thrown in controllers ─── */
    if (err.message) {
        // if controller set err.status use it, else 500
        const status = err.status || 500;
        return res.status(status).json({
            errors: [{ msg: err.message }]
        });
    }

    /* ─── 4) Fallback ── something we didn't anticipate ── */
    res.status(500).json({
        errors: [{ msg: 'Internal Server Error' }]
    });
};