var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var personSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, lowercase: true, required: true},
    password: {type: String, select: false, required: true},
    active: {type: Boolean, default: true},
    confirmed: {type: Boolean, default: false},
    admin: {type: Boolean, default: false},
    bets: [{type: mongoose.Schema.Types.ObjectId, ref: 'bets'}]
}, {versionKey: false});


personSchema.options.toJSON = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

personSchema.options.toObject = {
    transform: function(doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    }
};

personSchema.pre('save', function (next) {
    var person = this;

    // only hash the password if it has been modified (or is new)
    if (!person.isModified('password'))
        return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return next(err);

        // hash the password using our new salt
        bcrypt.hash(person.password, salt, function (err, hash) {
            if (err)
                return next(err);

            // override the cleartext password with the hashed one
            person.password = hash;
            next();
        });
    });
});

personSchema.methods.validPassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

personSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports = mongoose.model('person', personSchema);