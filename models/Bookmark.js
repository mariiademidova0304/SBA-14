const { Schema, model } = require('mongoose');

//bookmark will have a name, and also a user that'll hold the id of the user
const bookmarkSchema = new Schema({ 
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Bookmark = model('Bookmark', bookmarkSchema);
module.exports = Bookmark;