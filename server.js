const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
const port = 3000;

dotenv.config();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'gizli-anahtar',
    resave: false,
    saveUninitialized: false
}));

// MODELLER
const User = require('./models/User');
const MarketJob = require('./models/MarketJob');
const Job = require('./models/Job');
const Message = require('./models/Message');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Veritabanına Bağlandı"))
    .catch(err => console.error("❌ Hata:", err));

const CATEGORIES = ["Tümü", "Sıva ve Alçı", "Boya ve Badana", "Demirçilik", "Fayans ve Seramik", "Elektrik Tesisatı", "Su Tesisatı", "Kalıpçı"];

// --- MIDDLEWARE ---
function requireLogin(req, res, next) {
    if (!req.session.userId) return res.redirect('/login');
    next();
}

// GLOBAL DEĞİŞKENLER
app.use(async (req, res, next) => {
    res.locals.user = req.session.user || null;
    
    if(req.session.userId) {
        // Bildirim sayılarını hesapla
        const allMarketJobs = await MarketJob.find();
        const myMarketJobs = allMarketJobs.filter(j => j.employerId == req.session.userId);
        let empCount = 0;
        myMarketJobs.forEach(job => { 
            empCount += job.proposals.filter(p => p.status === 'Bekliyor').length; 
        });

        const workerOffers = await Job.find({ workerId: req.session.userId, type: 'direct', status: 'Bekliyor' });
        let workerCount = workerOffers.length;

        res.locals.empNotificationCount = empCount;
        res.locals.workerNotificationCount = workerCount;
        res.locals.totalNotificationCount = empCount + workerCount;
    } else {
        res.locals.empNotificationCount = 0;
        res.locals.workerNotificationCount = 0;
        res.locals.totalNotificationCount = 0;
    }
    next();
});

// --- AUTH (GİRİŞ/KAYIT) ---
app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        req.session.user = user;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Hatalı bilgiler!' });
    }
});

app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.send("Kayıt hatası: Email kullanılıyor olabilir.");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/')); 
});

// --- SAYFALAR ---

// 1. ANASAYFA
app.get('/', async (req, res) => {
    const filter = req.query.category;
    let query = { job: { $ne: 'Belirtilmedi' } };
    if(filter && filter !== "Tümü") query.job = filter;
    const workers = await User.find(query);
    res.render('index', { workers, categories: CATEGORIES, selectedCategory: filter || "Tümü", navContext: 'public' });
});

// 2. İŞÇİ PROFİLİ (!!! DİKKAT: BU ROTA :id'den ÖNCE GELMELİDİR !!!)
app.get('/worker/profile', requireLogin, async (req, res) => {
    const user = await User.findById(req.session.userId);
    const myJobs = await Job.find({ workerId: req.session.userId }); 
    
    res.render('worker-profile', { 
        user: user, 
        worker: user, // worker-profile.ejs içinde worker değişkeni kullanıyorsan diye
        myJobs: myJobs, 
        navContext: 'worker' 
    });
});

// İŞÇİ PROFİL GÜNCELLEME
app.post('/worker/update-profile', requireLogin, async (req, res) => {
    const { job, dailyRate, experience, about, phone } = req.body;
    await User.findByIdAndUpdate(req.session.userId, { job, dailyRate, experience, about, phone, isWorkerActive: true });
    // Session'ı da güncelle ki isim vs. hemen değişsin
    req.session.user = await User.findById(req.session.userId);
    res.redirect('/worker/profile');
});

// 3. DETAY SAYFASI (BAŞKASININ PROFİLİ)
app.get('/worker/:id', async (req, res) => {
    try {
        const worker = await User.findById(req.params.id);
        if (!worker) return res.redirect('/');
        res.render('detail', { worker, navContext: 'public' });
    } catch (e) {
        res.redirect('/');
    }
});

// 4. İŞVEREN PROFİLİ
app.get('/profile', requireLogin, async (req, res) => {
    const allMarketJobs = await MarketJob.find().sort({ _id: -1 });
    const myMarketJobs = allMarketJobs.filter(j => j.employerId == req.session.userId);
    const jobsWithProposals = myMarketJobs.filter(job => job.proposals.length > 0);
    const activeJobs = await Job.find().sort({ _id: -1 }); // İleride buraya employerId filtresi eklenebilir
    const user = await User.findById(req.session.userId);

    res.render('profile', {
        employer: user,
        jobs: activeJobs, 
        marketJobs: myMarketJobs, 
        jobsWithProposals: jobsWithProposals, 
        categories: CATEGORIES,
        navContext: 'employer'
    });
});

// 5. İŞ PAZARI
app.get('/worker-panel', async (req, res) => {
    const filter = req.query.category;
    let query = {};
    if(filter && filter !== "Tümü") query.category = filter;
    const marketJobs = await MarketJob.find(query);
    
    res.render('worker-panel', { 
        workerName: req.session.user ? req.session.user.name : null, 
        openJobs: marketJobs, 
        categories: CATEGORIES, 
        selectedCategory: filter || "Tümü", 
        navContext: 'public' 
    });
});

// 6. MESAJLAR
app.get('/inbox', requireLogin, async (req, res) => {
    const myId = req.session.userId;
    const allMessages = await Message.find({ $or: [{ senderId: myId }, { receiverId: myId }] });
    const contactIds = new Set();
    allMessages.forEach(m => {
        if(m.senderId == myId) contactIds.add(m.receiverId);
        if(m.receiverId == myId) contactIds.add(m.senderId);
    });
    let conversations = [];
    for (let id of contactIds) {
        const contact = await User.findById(id);
        if(contact) conversations.push({ id: contact._id, name: contact.name, type: "Kullanıcı" });
    }
    res.render('inbox', { conversations, role: 'user', navContext: 'user' });
});

app.get('/chat/:targetId', requireLogin, async (req, res) => {
    const myId = req.session.userId;
    const targetId = req.params.targetId;
    const contact = await User.findById(targetId);
    const chatHistory = await Message.find({ $or: [{ senderId: myId, receiverId: targetId }, { senderId: targetId, receiverId: myId }] });
    res.render('chat', { history: chatHistory, myId, targetId, targetName: contact ? contact.name : "Kullanıcı", myRole: 'user', navContext: 'user' });
});

// --- POST AKSİYONLARI ---

app.post('/send-message', requireLogin, async (req, res) => {
    const { receiverId, content } = req.body;
    await new Message({ senderId: req.session.userId, receiverId, content, date: new Date().toLocaleString() }).save();
    res.redirect(`/chat/${receiverId}`);
});

app.post('/employer/create-job', requireLogin, async (req, res) => {
    const { description, category, location, budget } = req.body;
    await new MarketJob({ employerId: req.session.userId, employerName: req.session.user.name, category, description, location, budget, proposals: [] }).save();
    res.redirect('/profile');
});

app.post('/employer/delete-job/:id', requireLogin, async (req, res) => {
    await MarketJob.findOneAndDelete({ _id: req.params.id, employerId: req.session.userId });
    res.redirect('/profile');
});

app.post('/employer/update-job/:id', requireLogin, async (req, res) => {
    const { description, budget, location } = req.body;
    await MarketJob.findOneAndUpdate({ _id: req.params.id, employerId: req.session.userId }, { description, budget, location });
    res.redirect('/profile');
});

app.post('/send-offer/:workerId', requireLogin, async (req, res) => {
    if(req.params.workerId == req.session.userId) return res.send("<script>alert('Kendinize teklif gönderemezsiniz!'); window.history.back();</script>");
    const worker = await User.findById(req.params.workerId);
    if(worker) await new Job({ type: "direct", workerId: worker._id, workerName: worker.name, jobDescription: req.body.jobDescription }).save();
    res.redirect('/profile');
});

app.post('/worker/propose/:marketId', requireLogin, async (req, res) => {
    const marketJob = await MarketJob.findById(req.params.marketId);
    if(marketJob) {
        if(marketJob.employerId == req.session.userId) return res.send("<script>alert('Kendi ilanınıza başvuramazsınız!'); window.history.back();</script>");
        
        const alreadyProposed = marketJob.proposals.some(p => p.workerId == req.session.userId);
        if(!alreadyProposed) {
            marketJob.proposals.push({ workerId: req.session.userId, workerName: req.session.user.name, date: new Date().toLocaleDateString(), status: "Bekliyor" });
            await marketJob.save();
        }
    }
    res.redirect('/worker-panel');
});

app.post('/employer/accept-proposal/:marketId/:workerId', requireLogin, async (req, res) => {
    const marketJob = await MarketJob.findById(req.params.marketId);
    if(marketJob) {
        const proposal = marketJob.proposals.find(p => p.workerId == req.params.workerId);
        if (proposal) {
            await new Job({ type: "market", workerId: proposal.workerId, workerName: proposal.workerName, jobDescription: marketJob.description, status: "Devam Ediyor" }).save();
            await MarketJob.findByIdAndDelete(req.params.marketId);
        }
    }
    res.redirect('/profile');
});

app.post('/employer/reject-proposal/:marketId/:workerId', requireLogin, async (req, res) => {
    const marketJob = await MarketJob.findById(req.params.marketId);
    if(marketJob) {
        const proposal = marketJob.proposals.find(p => p.workerId == req.params.workerId);
        if(proposal) { proposal.status = "Reddedildi"; await marketJob.save(); }
    }
    res.redirect('/profile');
});

app.post('/upload-receipt/:jobId', requireLogin, async (req, res) => {
    await Job.findByIdAndUpdate(req.params.jobId, { receiptUploaded: true });
    res.redirect('/profile');
});

app.post('/worker/complete-job/:jobId', requireLogin, async (req, res) => {
    await Job.findByIdAndUpdate(req.params.jobId, { status: "Tamamlandı" });
    res.redirect('/worker/profile');
});

app.post('/worker/accept-job/:jobId', requireLogin, async (req, res) => {
    await Job.findByIdAndUpdate(req.params.jobId, { status: "Devam Ediyor" });
    res.redirect('/worker/profile');
});

app.listen(port, () => { console.log(`Sunucu çalışıyor: http://localhost:${port}`); });

// İŞÇİ: İŞİ REDDETME (YENİ EKLENDİ)
app.post('/worker/reject-job/:jobId', requireLogin, async (req, res) => {
    // İşi 'Reddedildi' durumuna çekiyoruz
    await Job.findByIdAndUpdate(req.params.jobId, { status: "Reddedildi" });
    res.redirect('/worker/profile');
});