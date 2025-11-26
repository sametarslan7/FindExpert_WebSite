const mongoose = require('mongoose');

const marketJobSchema = new mongoose.Schema({
    employerId: String, // Number -> String OLDU
    employerName: String,
    category: String,
    description: String,
    location: String,
    budget: Number,
    proposals: [{
        workerId: String, // Number -> String OLDU
        workerName: String,
        date: String,
        status: { type: String, default: 'Bekliyor' }
    }]
});

module.exports = mongoose.model('MarketJob', marketJobSchema);