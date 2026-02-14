const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const MY_NUMBER = 'whatsapp:+905449559033'; 
const TWILIO_NUMBER = 'whatsapp:+14155238886';

// --- DEVASA VERİ HAVUZLARI ---
const hitaplar = ["askbahcem", "bitaneemm", "guzelimm", "yavrum", "yavrusum", "gulum", "gulom", "canim", "sevgilim", "kusum", "kuzum", "ask", "askitom"];

const selamlar = [
    "selam", "merhaba", "oo hosgeldin", "sonunda yazdin", "gozum yollarda kaldi", 
    "seni bekliyodum", "buyur canim benim", "hosgeldin hayatimin anlami"
];

const iltifatlar = [
    "yazdigim en hatasiz kod bile senin gulusun kadar kusursuz degil",
    "iskenderun teknik seninle gurur duyuyo valla",
    "rifterin sag koltugu sonsuza kadar sadece sana ait",
    "senin gulusun hayatimdaki en guzel success mesaji",
    "gozlerin rifterin led farlarindan daha parlak",
    "sen benim hayatimdaki en onemli algoritmasin",
    "senin yaninda oop finalleri bile vız gelir gecer",
    "dunyanin en guzel kizi su an benim kodlarimi okuyo",
    "senin gulusun en agir buglari bile temizler",
    "seni sevmek en kolay hello world kodu gibi hic bitmiyo",
    "kalbinin guzelligi kodlarima bile yansidi",
    "dunyanin butun serverlari cokse bile sana olan askim up and running",
    "seni dusunmekten oop dersinde hoca ne anlatti hic duymadim",
    "bi gulusun var sanki butun testler basariyla gecmis gibi",
    "seninle gecen her saniye benim icin bi bayram havasinda"
];

const aktiviteler = [
    "rifterla sahil turu mu yapsak acaba",
    "sessiz sakin bi kahve icelim mi ne dersin",
    "kuzenlerle efsane bi kart gecesi planlayalim mi",
    "seninle rotasiz bi sahil turu su an en iyisi olur",
    "mutfagi birbirine katip beraber yemek yapalim diyorum",
    "iskenderun sahilinde bi yuruyus yapalim mi",
    "arabaya atlayip uzaklara mi sursek acaba",
    "sen ne istersen o ama kart oyunu da fena olmazdi hani"
];

const sakalar = [
    "git aynaya bak dunyanin en sansli adamiyla sevgili olan kizi gor",
    "sana bi sır vereyim mi ama aramizda kalsin... cok guzelsin",
    "benim icin dunyadaki en buyuk hata seni bi saniye bile dusunmemek",
    "saka maka bi yana senin gulusun benim en buyuk odulum",
    "dunyanin en guzel kizi listesinde birinci siradasin valla"
];

// --- YARDIMCI FONKSIYONLAR ---
const getR = (arr) => arr[Math.floor(Math.random() * arr.length)];

const temizle = (text) => {
    return text.toLowerCase()
        .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^\w\s]/gi, '').trim();
};

app.post('/whatsapp', async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const hamMesaj = req.body.Body || '';
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    console.log(`Gelen Mesaj: ${hamMesaj}`);

    let cevap = "";
    const m = temizle(hamMesaj);
    const h = getR(hitaplar);

    // --- 1. BRIDGE MODE (SANA MESAJ İLETME) ---
    if (m.startsWith('hayatimin anlami')) {
        const asilMesaj = hamMesaj.substring(16).trim();
        try {
            await client.messages.create({
                from: TWILIO_NUMBER, to: MY_NUMBER,
                body: `🚨 OZEL NOT: ${h} yazdi: "${asilMesaj}"`
            });
            cevap = `notunu aldim ${h}, su an etheme direkt ilettim. en kisa surede doner sana.`;
        } catch (err) {
            cevap = `eyvah ${h}, notunu iletirken bi sorun oldu ama ben denemeye devam ediyorum.`;
        }
    }

    // --- 2. GELİŞMİŞ OYUN MOTORU ---
    else if (m.includes('oyun') || m.includes('oynayalim') || m.includes('tas kagit')) {
        cevap = `hazirim ${h}. sen secimini yap: tas, kagit ya da makas? bakalim sansli misin bugun.`;
    }
    else if (m === 'tas' || m === 'kagit' || m === 'makas') {
        const objeler = { tas: 'tas', kagit: 'kagit', makas: 'makas' };
        const botSecim = getR(['tas', 'kagit', 'makas']);
        
        if (m === botSecim) {
            cevap = `ikimizde ${botSecim} sectik. berabere kaldik ${h}. bi daha dene bakalim.`;
        } else {
            cevap = `ben ${botSecim} sectim ama sonuc ne olursa olsun kalbimi sen kazandin ${h}. bi tur daha?`;
        }
    }

    // --- 3. AKILLI CEVAP MOTORU ---
    else if (/(selam|slm|mrb|merhaba|sa|njs|hey|askim)/.test(m)) {
        cevap = `${getR(selamlar)} ${h}. bugun sevgililer gunu ve ben tamamen emrindeyim. \n\n1-beni guldur\n2-iltifat et\n3-ne yapalim\n4-buyuk sir\n\nya da 'ask olcer' veya 'fal bak' komutlarini dene. bana not iletmek istersen 'hayatimin anlami' diye basla.`;
    }
    else if (m === '1') {
        cevap = `${getR(sakalar)} ${h}.`;
    }
    else if (m === '2') {
        cevap = `${getR(iltifatlar)} ${h}.`;
    }
    else if (m === '3') {
        cevap = `valla ${h} ${getR(aktiviteler)}. sen ne dersen o olur bugun.`;
    }
    else if (m === '4') {
        cevap = `buyuk sir: oop finalinde kagida adini yazdim diye hoca bana ters ters bakmisti ${h}. senin icin deger her seye.`;
    }
    else if (/(seviyorum|seviyom|asigim|canim|bitanem)/.test(m)) {
        cevap = `bende seni cok seviyorum ${h}, iyiki varsin. senin gulusun benim hayatimdaki en buyuk basari.`;
    }
    else if (m.includes('napiyon') || m.includes('napion') || m === 'napuon') {
        cevap = `seni dusunuyorum ${h}. bi yandan da bu botu senin icin daha akilli hale getiriyorum. sen naptin?`;
    }
    else if (m.includes('ask olcer')) {
        cevap = `ask olcer sonucu: %${Math.floor(Math.random() * 5) + 95} \n\nbu makine senin guzelligin karsisinda hata verdi ${h}.`;
    }
    else if (m.includes('fal')) {
        cevap = `falin kapali gulum ama icinde bi rifter ve cok mutlu bi gelecek goruyorum valla.`;
    }
    else if (/(asdf|haha|sjsj|komik)/.test(m)) {
        cevap = `sen hep boyle mutlu ol ${h}, senin gulusun her seye bedel.`;
    }
    else {
        cevap = `canim ${h}, su an ibothem2.0 olarak emrindeyim ama her dedigini anlayamiyorum bazen. 1-4 arasi rakam ver ya da 'oyun' de, gerisini bana birak.`;
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 ibothem2.0 INFINITY Yayinda!`); });
