const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const MY_NUMBER = 'whatsapp:+905449559033'; 
const TWILIO_NUMBER = 'whatsapp:+14155238886';

// --- GELİŞMİŞ HİTAP VE KELİME HAVUZLARI ---
const hitaplar = ["askbahcem", "bitaneemm", "guzelimm", "yavrum", "yavrusum", "gulum", "gulom", "canim", "sevgilim", "kusum", "kuzum", "ask", "askitom"];
const getH = () => hitaplar[Math.floor(Math.random() * hitaplar.length)];

const iltifatHavuzu = [
    "yazdigim en kusursuz java classindan bile daha guzelsin",
    "senin gulusun hayatimdaki en guzel success mesaji",
    "iskenderun teknik seninle anlam kazaniyo valla",
    "gozlerin rifterin led farlarindan daha cok parliyo",
    "senin yaninda oop finalleri bile vız gelir",
    "sen benim hayatimdaki en onemli algoritmasin",
    "rifterin sag koltugu sonsuza kadar sana ait",
    "dunyanin en guzel kizi su an benim kodlarimi okuyo"
];

const randevuHavuzu = [
    "rifterla sahil yolculugu yapalim derim",
    "sessiz sakin bi kahve icmeye ne dersin",
    "kuzenlerle efsane bi kart gecesi planlayalim",
    "seninle rotasiz bi sahil turu su an en iyisi",
    "mutfagi birbirine katip beraber yemek yapalim mi"
];

// --- NORMALİZASYON ---
const temizle = (text) => {
    return text.toLowerCase()
        .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^\w\s]/gi, '').trim();
};

app.post('/whatsapp', async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const hamMesaj = req.body.Body || '';
    const gonderenNo = req.body.From;
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Bildirim (Sana rapor gelir)
    if (gonderenNo !== MY_NUMBER) {
        try {
            await client.messages.create({
                from: TWILIO_NUMBER, to: MY_NUMBER,
                body: `🔔 rapor: ${getH()} yazdi: "${hamMesaj}"`
            });
        } catch (err) { console.error(err); }
    }

    let cevap = "";
    const m = temizle(hamMesaj);
    const h = getH();

    // --- 1. OYUN MOTORU (TAŞ-KAĞIT-MAKAS) ---
    if (m.includes('oyun') || m.includes('oynayalim') || m.includes('tas kagit')) {
        cevap = `hazirim ${h}. sen secimini yap: tas, kagit ya da makas? bakalim beni yenebilecek misin.`;
    }
    else if (m === 'tas' || m === 'kagit' || m === 'makas') {
        const objeler = {
            tas: { e: '🪨', yener: 'makas' },
            kagit: { e: '📄', yener: 'tas' },
            makas: { e: '✂️', yener: 'kagit' }
        };
        const botSecim = ['tas', 'kagit', 'makas'][Math.floor(Math.random() * 3)];
        const b = objeler[botSecim];

        if (m === botSecim) {
            cevap = `ikimizde ${botSecim} ${b.e} sectik. berabere kaldik ${h}. bi daha dene bakalim.`;
        } else if (b.yener === m) {
            cevap = `ben ${botSecim} ${b.e} sectim ve kazandim. ama uzulme ${h}, benim kalbim her turlu senin.`;
        } else {
            cevap = `sen kazandin ${h}! ben ${botSecim} ${b.e} secmistim. seninle yarisilmaz zaten.`;
        }
    }

    // --- 2. GELİŞMİŞ SELAMLAŞMA ---
    else if (/(selam|slm|mrb|merhaba|sa|hey|sea|askim|njs)/.test(m)) {
        const selamlar = [
            `selam ${h}, hosgeldin. ibothem2.0 su an emrinde.`,
            `merhaba ${h}, sonunda yazdin. seni bekliyodum valla.`,
            `oov kimleri goruyorum, hosgeldin ${h}. sevgililer gunun kutlu olsun.`
        ];
        cevap = `${selamlar[Math.floor(Math.random() * selamlar.length)]} \n\nneler yapalim? \n1-modum dusuk \n2-iltifat et \n3-ne yapalim \n4-buyuk sir \n5-not birak \n\nya da fal bak, ask olcer gibi seyleri dene.`;
    }

    // --- 3. SEVGİ VE DURUM ---
    else if (/(seviyorum|seviyom|asigim|degerli|bitanem)/.test(m)) {
        const askMesajlari = [
            `bende seni cok seviyorum ${h}, her sey senin gulusun icin.`,
            `senin sevgin benim sistemimin tek enerji kaynagi ${h}.`,
            `iyiki hayatimdasin ${h}, sensiz bu kodlar bile calismazdi.`
        ];
        cevap = askMesajlari[Math.floor(Math.random() * askMesajlari.length)];
    }
    else if (m.includes('napiyon') || m.includes('napion') || m === 'napuon') {
        cevap = `seni dusunuyorum ${h}. bi yandan da bu botun kodlarini senin icin gelistiriyorum. sen naptin?`;
    }

    // --- 4. MENÜ VE ÖZEL KOMUTLAR ---
    else if (m === '1') {
        cevap = `git aynaya bak ve dunyanin en sansli adaminin sevgilisini gor ${h}. gulumsemen yeter.`;
    }
    else if (m === '2') {
        cevap = `${iltifatHavuzu[Math.floor(Math.random() * iltifatHavuzu.length)]} ${h}.`;
    }
    else if (m === '3') {
        cevap = `${randevuHavuzu[Math.floor(Math.random() * randevuHavuzu.length)]} derim ${h}.`;
    }
    else if (m === '4') {
        cevap = `buyuk sir: oop calisirken defterin her yerine senin adini yazdim ${h}. hoca gorse kesin birakmisti.`;
    }
    else if (m === '5') {
        cevap = `notunu aldim ${h}, direkt etheme ilettim. o da su an telefon basinda seni bekliyo.`;
    }
    else if (m.includes('ask olcer')) {
        cevap = `❤️ ask olcer sonucu: %${Math.floor(Math.random() * 5) + 95} \n\nnot: bu makine senin guzelligini gorunce sapitti ${h}.`;
    }
    else if (m.includes('fal')) {
        cevap = `🔮 falinda cok mutlu bi gelecek ve rifterla gidilecek uzun yollar cikti ${h}.`;
    }

    // --- 5. HATA YÖNETİMİ ---
    else {
        cevap = `tam anlayamadim ${h}. sadece rakamlari (1-5) veya 'oyun oynayalim' gibi seyleri yazarsan hemen anlarim.`;
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 ibothem2.0 Black Edition Yayinda!`); });
