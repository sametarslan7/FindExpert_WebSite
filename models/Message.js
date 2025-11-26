const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: String, // Number -> String OLDU
    receiverId: String, // Number -> String OLDU
    content: String,
    date: String
});

module.exports = mongoose.model('Message', messageSchema);