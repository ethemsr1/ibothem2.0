const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const MY_NUMBER = 'whatsapp:+905449559033'; 
const TWILIO_NUMBER = 'whatsapp:+14155238886';

// --- OYUN HAFIZASI ---
const aktifOyunlar = {}; // Sayı tahmin oyunu için akılda tutma sistemi

// --- DEVASA VERİ HAVUZLARI ---
const hitaplar = ["askbahcem", "bitaneemm", "guzelimm", "yavrumm", "yavrusum", "gulum", "gulom", "caniminiciii", "sevgilim", "kusum", "kuzum", "ask", "askitom"];

const selamlar = [
    "selam", "merhaba", "oo hosgeldin", "sonunda yazdin", "gozum yollarda kaldi", 
    "seni bekliyodum", "buyur canim benim", "hosgeldin hayatimin anlami"
];

const iltifatlar = [
    "gelecegimiz saçların kadar parlak, gözlerin kadar güzel, gülüsün kadar tatlı, memelerin kadar büyük bir aşkımız olur inşşşşallahh",
    "seni çok seviyorum seninle yeni şeyler yapmayı yani aslında her şeyi seninle seviyorum parkta da otursak guzel yerlere de gitsek oyun oynayıp kaybetsem de okadar çok seviyorum keyif alıyorum ki tarif edemem benim için pahabiçilmez hisler. sana baktıkça beni sarhoş eden gözlerini gülünce görünen dişlerini altın sarısı saçlarını okadar çok seviyorum ki iyiki varsın bitanem<3",
    "dunyanin en guzel kizi su an benim kodlarimi okuyo:)",
    "seni sevmek sana aşık olmak oooofff yannii çok şanslıyım çokkkkkkkkk",
    "yuzunun, kalbinin guzelligi beni sana hayran bırakıyor hem merhametli hem melek gibi güzel(gormuş gibi konuşuom ama hiç melek görmedim. bence sen olmalısın çünkü tasvirleri seni anlatıyor )",
    "dunyanin butun serverlari cokse bile sana olan askim up and running",
    "seni dusunurken bazen okadar dalıyorum ki kendimi kaybediyorum seninle birlikte olmak o kadar şanslı hissettiriyorki keşke sen de bilsen ama senin meryem in yok ama ben sana anlatmaya calışıyorum işte sen de bil asşık olduğum kadını",
    "bi gulusun var valla omur uzatır. okadar guzelsin okadar tatlısın ki yemin ederim kelimelerle tarif edilmez",
    "seninle gecen her saniye benim icin haarika iyiki hayatimdasin seni cookk seviyorum canım sevgilimm kurban olduguummmm"
];

const aktiviteler = [
    "askım gelince ps atak ama yenecem bu sefer ciddiliii",
    "aşkım bowling + sinema yapalım geldigimde",
    "kutuphane date ?",
    "deeptalk yapalım yavrum biara ya",
    "yerimize gidelim mi ozlediimm",
    "farketmez"
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
    const gonderenNo = req.body.From; // Oyun hafızası ve kimin yazdığını bilmek için eklendi
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    console.log(`Gelen Mesaj: ${hamMesaj}`);

    let cevap = "";
    const m = temizle(hamMesaj);
    const h = getR(hitaplar);

    // --- 0. SAYI TAHMİN OYUNU İÇİNDE Mİ? (Sıra Bekleyen Tahminler) ---
    if (aktifOyunlar[gonderenNo] && !isNaN(m) && m !== '') {
        let oyun = aktifOyunlar[gonderenNo];
        let tahmin = parseInt(m);
        
        if (tahmin === oyun.sayi) {
            cevap = `helal olsun ${h}, bildin valla! sayi ${oyun.sayi} idi. en kisa surede benden bi odul kazandin. seni cok seviyorum.`;
            delete aktifOyunlar[gonderenNo]; // Oyunu bitir
        } else {
            oyun.hak--;
            if (oyun.hak <= 0) {
                cevap = `bilemedin ki ${h}... tuttugum sayi ${oyun.sayi} idi. ama uzulme, bu oyunu kaybetsen de kalbimi kazandin. bi daha oynamak istersen 'sayi tahmin' yazman yeterli.`;
                delete aktifOyunlar[gonderenNo];
            } else {
                let yon = tahmin > oyun.sayi ? "asagi" : "yukari";
                cevap = `malesef bilemedin ${h}. biraz ${yon} inmen lazim. kalan hakkin: ${oyun.hak}. tekrar tahmin et bakalim.`;
            }
        }
    }

    // --- 1. BRIDGE MODE (SANA MESAJ İLETME) ---
    else if (m.startsWith('hayatimin anlami')) {
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

    // --- 2. YENİ OYUNLAR (Yazı-Tura & Sayı Tahmin) ---
    else if (m.includes('yazi tura')) {
        const sonuc = Math.random() < 0.5 ? 'yazi' : 'tura';
        cevap = `para havada takla atiyor... veee ${sonuc} geldi ${h}! kader bile bizim yanimizda, sen ne istersen o olacak.`;
    }
    else if (m.includes('sayi tahmin') || m.includes('sayi tut')) {
        // 1 ile 20 arası sayı tutuyor ve 3 hak veriyor
        aktifOyunlar[gonderenNo] = { sayi: Math.floor(Math.random() * 20) + 1, hak: 3 };
        cevap = `tamam ${h}, 1 ile 20 arasinda bi sayi tuttum. 3 hakkin var, bil bakalim kaci tuttum? (sadece sayiyi yaz)`;
    }

    // --- 3. ESKİ OYUN MOTORU (Taş Kağıt Makas) ---
    else if (m.includes('oyun') || m.includes('oynayalim') || m.includes('tas kagit')) {
        cevap = `hazirim ${h}. sen secimini yap: tas, kagit ya da makas? bakalim sansli misin bugun.`;
    }
    else if (m === 'tas' || m === 'kagit' || m === 'makas') {
        const botSecim = getR(['tas', 'kagit', 'makas']);
        if (m === botSecim) {
            cevap = `ikimizde ${botSecim} sectik. berabere kaldik ${h}. bi daha dene bakalim.`;
        } else {
            cevap = `ben ${botSecim} sectim ama sonuc ne olursa olsun kalbimi sen kazandin ${h}. bi tur daha?`;
        }
    }

    // --- 4. AKILLI CEVAP MOTORU VE MENÜ ---
    else if (/(selam|slm|mrb|merhaba|sa|njs|hey|askim)/.test(m)) {
        cevap = `${getR(selamlar)} ${h}. ask ben ibothem2.0 olarak emrindeyim. \n\n1️⃣ - Bana iltifat et\n2️⃣ - Ne Yapsak?\n\nya da 'ask olcer', 'fal bak', 'yazi tura' veya 'sayi tahmin' komutlarini dene. bana not iletmek istersen 'hayatimin anlami' diye basla.`;
    }
    else if (m === '1') {
        cevap = `${getR(iltifatlar)} ${h}.`;
    }
    else if (m === '2') {
        cevap = `valla ${h} ${getR(aktiviteler)}. sen ne dersen o olur bugun.`;
    }
    else if (m === '3') {
        cevap = `${h}. senin icin deger her seye.`;
    }
    else if (/(seviyorum|seviyom|asigim|canim|bitanem)/.test(m)) {
        cevap = `bende seni cok seviyorum ${h}, iyiki varsin. senin varlıgın benim hayatimdaki en guzel şey.`;
    }
    else if (m.includes('napiyon') || m.includes('napion') || m === 'napuon') {
        cevap = `seni dusunuyorum ${h}. bi yandan da bu botu senin icin daha akilli hale getiriyorum. sen naptin gulom?`;
    }
    else if (m.includes('ask olcer')) {
        cevap = `ask olcer sonucu: %${Math.floor(Math.random() * 5) + 95} \n\nbu makine senin guzelligin karsisinda hata verdi ${h}.`;
    }
    else if (m.includes('fal')) {
        cevap = `falin kapali gulum ama icinde bi kara cocuk var(ben:0) ve onunla seni cok mutlu bi gelecekte goruyorum valla.`;
    }
    else if (/(asdf|haha|sjsj|komik)/.test(m)) {
        cevap = `sen hep boyle mutlu ol ${h}, senin gulusun her seye bedel.`;
    }
    else {
        // Menünün yeni halini (1-2) yansıtacak şekilde hata mesajını düzenledik
        cevap = `canim ${h}, su an ibothem2.0 olarak emrindeyim ama her dedigini anlayamiyorum bazen. 1-2 arasi rakam ver ya da 'oyun', 'yazi tura', 'sayi tahmin' falan de gerisini bana birak.`;
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 ibothem2.0 INFINITY Yayinda!`); });
