# 🏗️ UstaBul (FindExpert) - İnşaat ve Tadilat Platformu

**UstaBul**, inşaat ve tadilat işleri için hizmet veren ustalarla, bu hizmete ihtiyaç duyan işverenleri bir araya getiren modern bir web uygulamasıdır. 

Bu proje, kullanıcıların **tek bir hesap** üzerinden hem iş ilanı verebilmesine hem de başkalarının ilanlarına teklif vererek usta rolü üstlenebilmesine olanak tanır.

## 🌟 Özellikler

*   **🔐 Güvenli Kimlik Doğrulama:** Kullanıcı kayıt ve giriş işlemleri (Bcrypt ile şifreleme, Session yönetimi).
*   **👤 Tek Hesap, Çift Rol:** Her kullanıcı hem "İşveren" hem de "Usta" olabilir. Rol ayrımı yoktur.
*   **📋 İş Pazarı:** Açık ilanları listeleme, kategoriye göre filtreleme.
*   **bid Teklif Sistemi:** Ustalar ilanlara teklif verebilir, işverenler teklifleri kabul veya reddedebilir.
*   **💬 Mesajlaşma:** Kullanıcılar arası dahili mesajlaşma sistemi.
*   **🔔 Bildirimler:** Gelen teklifler ve mesajlar için anlık bildirim rozetleri.
*   **🛡️ Güvenlik Kontrolleri:** 
    *   Kullanıcı kendi ilanına başvuramaz.
    *   Kullanıcı kendine mesaj atamaz.
    *   Giriş yapmayan kullanıcılar işlem yapamaz (Misafir modu kısıtlaması).
*   **📱 Responsive Tasarım:** Bootstrap 5 ile mobil uyumlu arayüz.

## 🛠️ Kullanılan Teknolojiler

*   **Backend:** Node.js, Express.js
*   **Veritabanı:** MongoDB Atlas (Mongoose)
*   **Frontend:** EJS (Template Engine), Bootstrap 5, CSS3
*   **Diğer:** Dotenv, Bcryptjs, Express-Session

## 🚀 Kurulum ve Çalıştırma

Bu projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Projeyi Klonlayın

git clone https://github.com/KULLANICI_ADINIZ/FindExpert_WebSite.git
cd FindExpert_WebSite

### 2. Gerekli Paketleri Yükleyin

npm install

### 3. Çevre Değişkenlerini (.env) Ayarlayın

Ana dizinde .env adında bir dosya oluşturun ve MongoDB bağlantı adresinizi ekleyin:

MONGO_URI=mongodb+srv://KULLANICI:SIFRE@cluster0.xxxxx.mongodb.net/ustabul?retryWrites=true&w=majority

### 4. Uygulamayı Başlatın

node server.js

Tarayıcınızda http://localhost:3000 adresine giderek uygulamayı kullanabilirsiniz.


📂 Proje Yapısı

FindExpert/
├── models/           # Veritabanı şemaları (User, Job, MarketJob, Message)
├── public/           # Statik dosyalar (CSS, Resimler - Opsiyonel)
├── views/            # EJS arayüz dosyaları
│   ├── index.ejs     # Anasayfa
│   ├── login.ejs     # Giriş Sayfası
│   ├── profile.ejs   # İşveren Paneli
│   ├── worker-panel.ejs # Açık İş Pazarı
│   └── ...
├── .env              # Gizli anahtarlar (Git'e yüklenmez)
├── .gitignore        # Git tarafından yok sayılacaklar
├── server.js         # Ana sunucu dosyası
└── package.json      # Proje bağımlılıkları


🤝 Katkıda Bulunma
Bu repoyu Fork'layın.
Yeni bir dal (branch) oluşturun (git checkout -b yeni-ozellik).
Değişikliklerinizi yapın ve Commit edin (git commit -m 'Yeni özellik eklendi').
Dalınızı Push edin (git push origin yeni-ozellik).
Bir Pull Request oluşturun.

📄 Lisans
Bu proje MIT Lisansı ile lisanslanmıştır.
