const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const MY_NUMBER = 'whatsapp:+905449559033'; 
const TWILIO_NUMBER = 'whatsapp:+14155238886';

// --- HİTAP HAVUZU (Senin istediğin gibi) ---
const hitaplar = ["askbahcem", "bitaneemm", "guzelimm", "yavrum", "yavrusum", "gulum", "gulom", "canim", "sevgilim", "kusum", "kuzum", "ask", "askitom"];
const getHitap = () => hitaplar[Math.floor(Math.random() * hitaplar.length)];

// --- NORMALİZASYON (İmla ve Karakter Düzeltme) ---
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

    // Bildirim Sistemi
    if (gonderenNo !== MY_NUMBER) {
        try {
            await client.messages.create({
                from: TWILIO_NUMBER, to: MY_NUMBER,
                body: `🔔 rapor: ${getHitap()} yazdi: "${hamMesaj}"`
            });
        } catch (err) { console.error("Hata:", err); }
    }

    let cevap = "";
    const m = temizle(hamMesaj);
    const h = getHitap(); // Her cevapta farklı bir hitap kullanması için

    // --- 1. OYUN MANTIĞI (Taş-Kağıt-Makas) ---
    if (m.includes('oynayalim') || m.includes('oyun')) {
        cevap = `tamam ${h}, hazirim! hadi sec bakalim: tas mi, kagit mi, makas mi? 🧐`;
    }
    else if (m === 'tas' || m === 'kagit' || m === 'makas') {
        const secenekler = [
            { ad: 'tas', emoji: '🪨' },
            { ad: 'kagit', emoji: '📄' },
            { ad: 'makas', emoji: '✂️' }
        ];
        const botSecimi = secenekler[Math.floor(Math.random() * 3)];
        
        let sonucMetni = "";
        if (m === botSecimi.ad) {
            sonucMetni = `berabere kaldik ${h}! ama seninle her sey keyifli... bi daha dene bakalim. 🤭`;
        } else {
            sonucMetni = `ben ${botSecimi.ad} sectim ama sonuc ne olursa olsun kalbimi sen kazandin ${h}. ❤️`;
        }
        cevap = `benim secimim: ${botSecimi.ad} ${botSecimi.emoji}\n\n${sonucMetni}`;
    }

    // --- 2. SELAMLAŞMA HAVUZU ---
    else if (/(selam|slm|mrb|merhaba|sa|njs|hey|askim)/.test(m)) {
        const selamlar = [
            `selam ${h}, bugun dunyanin en sansli botuyum cunku bana sen yazdin. 🥰`,
            `merhaba ${h}, ibothem2.0 senin icin 7/24 calisiyo biliyosun.`,
            `oov kimleri goruyorum, hosgeldin ${h}. sevgililer gunun kutlu olsun!`
        ];
        cevap = `${selamlar[Math.floor(Math.random() * selamlar.length)]}\n\nneler yapalim? \n1-beni guldur \n2-iltifat et \n3-ne yapalim \n4-buyuk sir \n5-not birak`;
    }

    // --- 3. SEVGİ VE İLTİFAT HAVUZU (Çok Geniş) ---
    else if (/(seviyorum|seviyom|asigim|degerli)/.test(m)) {
        const askMesajlari = [
            `bende seni cok seviyorum ${h}, senin icin koca serverlari ayaga kaldirdim valla.`,
            `senin sevgin benim sistemimin tek enerji kaynagi ${h}.`,
            `rifterla sahilde tur atmaktan bile daha guzel bi sey varsa o da seninle konusmak ${h}.`
        ];
        cevap = askMesajlari[Math.floor(Math.random() * askMesajlari.length)];
    }

    // --- 4. MENÜ NUMARALARI VE DİĞERLERİ ---
    else if (m === '1') {
        cevap = `git aynaya bak ve dunyanin en tatli kizini gor ${h}. gulumsemen dunyayi aydinlatir! 🌟`;
    }
    else if (m === '2') {
        const iltifatlar = [
            `guzelligin java kodlarindan daha duzenli ${h}.`,
            `iskenderun teknik senin gibi bi guzellik gormedi hic.`,
            `senin gulusun 'compiled successfully' mesajindan daha huzurlu.`,
            `gozlerin rifterin led farlarindan daha cok parladigi kesin ${h}.`
        ];
        cevap = iltifatlar[Math.floor(Math.random() * iltifatlar.length)];
    }
    else if (m === '3') {
        cevap = `bugun planlar sende ${h}. ister sahil turu, ister kart oyunu... ethem (yani ben) her turlu yaninda!`;
    }
    else if (m === '4') {
        cevap = `buyuk sir: oop calisirken defterin kenarina senin adini yazdigim icin az kalsin dersten kaliyodum ${h}. 😅`;
    }
    else if (m === '5') {
        cevap = `notunu aldim ${h}, direkt etheme ilettim. o da su an telefon basinda senin icin deliriyo.`;
    }

    // --- 5. RANDOM TEPKİLER ---
    else if (/(asdf|haha|sjsj|komik)/.test(m)) {
        cevap = `sen hep boyle gul ${h}, senin mutlulugun benim en buyuk 'update'im.`;
    }
    else if (m.includes('napiyon') || m.includes('napion') || m.includes('napuon')) {
        cevap = `seni dusunuyorum ${h}, bi de bu kodlari senin icin optimize ediyorum. sen naptin?`;
    }

    // --- 6. HATA / ANLAŞILAMAYAN DURUMLAR ---
    else {
        cevap = `canim ${h}, malum ben bi robotum bazen devrelerim karisiyo. bana 1-5 arasi rakam ver ya da 'oyun oynayalim' de, gerisini ben hallederim.`;
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 ibothem2.0 God Mode: Ultimate Yayinda!`); });
