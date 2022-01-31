const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    // graphQL will stipulate this field is required, hence no !
    username: String,
    password: String,
    email: String,
    createdAt: String
})

module.exports = model('User', userSchema);