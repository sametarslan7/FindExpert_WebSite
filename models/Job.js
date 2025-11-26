const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    type: String, 
    workerId: String, // Number -> String OLDU
    workerName: String,
    jobDescription: String,
    status: { type: String, default: 'Bekliyor' },
    paymentStatus: { type: String, default: 'Yok' },
    receiptUploaded: { type: Boolean, default: false }
});

module.exports = mongoose.model('Job', jobSchema);