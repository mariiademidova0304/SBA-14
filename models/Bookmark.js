const { Schema, model } = require('mongoose');

const bookmarkSchema = new Schema({ 
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Bookmark = model('Bookmark', bookmarkSchema);
module.exports = Bookmark;