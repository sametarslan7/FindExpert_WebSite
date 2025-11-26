const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Modellerin yolunu kontrol et (models klasörünü oluşturduğunu varsayıyorum)
const Worker = require('./models/Worker');
const MarketJob = require('./models/MarketJob');
const Job = require('./models/Job');
const Message = require('./models/Message');

// .env dosyasındaki bağlantı linkini al
dotenv.config();

// --- HAZIR VERİLER ---
const workersData = [
    { name: "Ahmet Yılmaz", job: "Sıva ve Alçı", experience: "12 Yıl", dailyRate: 1500, rating: 9.4, image: "https://randomuser.me/api/portraits/men/32.jpg", about: "Alçıpan ve kara sıva uzmanı.", phone: "0532 555 00 01", reviews: [{ owner: "Mehmet Bey", comment: "Temiz iş.", score: 10 }] },
    { name: "Veli Demir", job: "Demirçilik", experience: "8 Yıl", dailyRate: 1800, rating: 8.7, image: "https://randomuser.me/api/portraits/men/45.jpg", about: "Demir doğrama ve kaynak işleri.", phone: "0555 444 33 22", reviews: [] },
    { name: "Hasan Çelik", job: "Boya ve Badana", experience: "5 Yıl", dailyRate: 1200, rating: 9.0, image: "https://randomuser.me/api/portraits/men/22.jpg", about: "İç ve dış cephe boyama.", phone: "0533 333 33 33", reviews: [] },
    { name: "Mustafa Can", job: "Fayans ve Seramik", experience: "15 Yıl", dailyRate: 2000, rating: 9.8, image: "https://randomuser.me/api/portraits/men/11.jpg", about: "Banyo ve mutfak fayans ustası.", phone: "0534 444 44 44", reviews: [] },
    { name: "İsmail Koç", job: "Elektrik Tesisatı", experience: "10 Yıl", dailyRate: 1600, rating: 9.2, image: "https://randomuser.me/api/portraits/men/65.jpg", about: "Anahtar teslim elektrik işleri.", phone: "0535 555 55 55", reviews: [] },
    { name: "Kenan Işık", job: "Kalıpçı", experience: "20 Yıl", dailyRate: 2200, rating: 8.5, image: "https://randomuser.me/api/portraits/men/78.jpg", about: "İnşaat kalıp ve beton işleri.", phone: "0536 666 66 66", reviews: [] },
    { name: "Burak Öz", job: "Su Tesisatı", experience: "6 Yıl", dailyRate: 1400, rating: 8.9, image: "https://randomuser.me/api/portraits/men/54.jpg", about: "Kaçak tespiti ve tamirat.", phone: "0537 777 77 77", reviews: [] },
    { name: "Orhan Gence", job: "Sıva ve Alçı", experience: "9 Yıl", dailyRate: 1550, rating: 9.1, image: "https://randomuser.me/api/portraits/men/33.jpg", about: "Dekoratif sıva işleri.", phone: "0538 888 88 88", reviews: [] },
    { name: "Serkan Dağ", job: "Demirçilik", experience: "7 Yıl", dailyRate: 1750, rating: 8.8, image: "https://randomuser.me/api/portraits/men/29.jpg", about: "Ferforje ve korkuluk.", phone: "0539 999 99 99", reviews: [] },
    { name: "Ali Vural", job: "Boya ve Badana", experience: "4 Yıl", dailyRate: 1100, rating: 8.6, image: "https://randomuser.me/api/portraits/men/14.jpg", about: "Hızlı ve temiz boya işleri.", phone: "0541 111 11 11", reviews: [] }
];

const marketJobsData = [
    { employerId: 999, employerName: "Samet Arslan", category: "Boya ve Badana", description: "3+1 Daire Komple Boya", location: "İstanbul / Kadıköy", budget: 5000, proposals: [] },
    { employerId: 999, employerName: "Samet Arslan", category: "Demirçilik", description: "Bahçe Duvarı Korkuluk", location: "İstanbul / Beykoz", budget: 10000, proposals: [] },
    { employerId: 999, employerName: "Samet Arslan", category: "Fayans ve Seramik", description: "Banyo Yenileme (20m2)", location: "İstanbul / Üsküdar", budget: 8000, proposals: [] },
    { employerId: 999, employerName: "Samet Arslan", category: "Elektrik Tesisatı", description: "Tüm Bina Elektrik Kablolama", location: "İstanbul / Maltepe", budget: 15000, proposals: [] },
    { employerId: 999, employerName: "Samet Arslan", category: "Sıva ve Alçı", description: "Salon Alçıpan Tavan", location: "İstanbul / Ataşehir", budget: 6000, proposals: [] },
    { employerId: 999, employerName: "Samet Arslan", category: "Su Tesisatı", description: "Mutfak Tesisat Değişimi", location: "İstanbul / Pendik", budget: 4000, proposals: [] }
];

// --- YÜKLEME İŞLEMİ ---
const seedDB = async () => {
    try {
        console.log("⏳ MongoDB'ye bağlanılıyor...");
        // .env dosyasındaki linki kullanıyoruz
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Bağlantısı Başarılı!");

        // Eski verileri temizle (Çakışma olmasın)
        console.log("🗑️ Eski veriler siliniyor...");
        await Worker.deleteMany({});
        await MarketJob.deleteMany({});
        await Job.deleteMany({});
        await Message.deleteMany({});

        // Yeni verileri yükle
        console.log("🌱 Yeni veriler ekleniyor...");
        await Worker.insertMany(workersData);
        await MarketJob.insertMany(marketJobsData);
        
        console.log("🎉 İŞLEM TAMAM! Veritabanı hazır.");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ HATA:", err);
    }
};

seedDB();