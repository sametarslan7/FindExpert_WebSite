const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Temel Bilgiler (Herkes İçin)
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    
    // İşveren Özellikleri (Puan, Rozet vb.)
    employerScore: { type: Number, default: 10 },
    
    // İşçi Özellikleri (Varsayılan boş veya 0)
    isWorkerActive: { type: Boolean, default: false }, // Profilini işçi olarak açtı mı?
    job: { type: String, default: 'Belirtilmedi' }, // Örn: Boyacı
    experience: { type: String, default: '' }, // Örn: 5 Yıl
    dailyRate: { type: Number, default: 0 },
    about: { type: String, default: '' },
    phone: { type: String, default: '' },
    workerRating: { type: Number, default: 0 }, // İşçi puanı ayrı
    image: { type: String, default: 'https://randomuser.me/api/portraits/lego/1.jpg' },
    
    // Yorumlar (Hem işveren hem işçi olarak aldığı yorumlar karışabilir veya ayrılabilir, şimdilik genel tutuyoruz)
    reviews: [{
        ownerName: String,
        comment: String,
        score: Number,
        type: String // 'worker_review' veya 'employer_review'
    }]
});

module.exports = mongoose.model('User', userSchema);