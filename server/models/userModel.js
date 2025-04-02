const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'}]
});

// Password Hashing Before Saving
userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10)
        .then(hash => {
            user.password = hash;
            next();
        })
        .catch(err => next(err));
});

// Password Comparison Method
userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);

