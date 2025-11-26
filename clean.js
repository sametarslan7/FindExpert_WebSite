const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Modelleri çağır
const User = require('./models/User');
const MarketJob = require('./models/MarketJob');
const Job = require('./models/Job');
const Message = require('./models/Message');

dotenv.config();

const cleanDB = async () => {
    try {
        console.log("⏳ Veritabanına bağlanılıyor...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Bağlantı Başarılı!");

        console.log("🗑️  Tüm veriler siliniyor (Kullanıcılar, İlanlar, Mesajlar)...");
        
        // Tüm koleksiyonları temizle
        await User.deleteMany({});
        await MarketJob.deleteMany({});
        await Job.deleteMany({});
        await Message.deleteMany({});

        console.log("✨ Veritabanı TERTEMİZ oldu! Sıfırdan başlayabilirsin.");
        
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Hata:", err);
    }
};

cleanDB();