const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    // Default value of createdAt will be defined via graphQL
    createdAt: String,
    comments: [ 
        {
            body: String,
            username: String,
            createdAt: String,
        }
    ],
    likes: [
        {
            username: String,
            createdAt: Strings
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = model('Post,' postSchema);