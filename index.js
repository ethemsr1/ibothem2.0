const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const MY_NUMBER = 'whatsapp:+905449559033'; 
const TWILIO_NUMBER = 'whatsapp:+14155238886';

// --- MÜHENDİSLİK DOKUNUŞU: NORMALİZASYON FONKSİYONU ---
// Bu fonksiyon gelen mesajı temizler: Küçük harf yapar ve tüm Türkçe karakterleri İngilizceye çevirir.
const temizle = (text) => {
    return text.toLowerCase()
        .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^\w\s]/gi, '') // Noktalama işaretlerini siler
        .trim();
};

app.post('/whatsapp', async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const hamMesaj = req.body.Body || '';
    const gonderenNo = req.body.From;
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Bildirim Sistemi (Senin telefonuna rapor gelir)
    if (gonderenNo !== MY_NUMBER) {
        try {
            await client.messages.create({
                from: TWILIO_NUMBER, to: MY_NUMBER,
                body: `🔔 rapor: gulum yazdi: "${hamMesaj}"`
            });
        } catch (err) { console.error("Hata:", err); }
    }

    let cevap = "";
    const m = temizle(hamMesaj);

    // --- AKILLI CEVAP MOTORU ---

    // 1. Selamlaşma (Her türlü varyasyon: slm askm, mrb canim, selamlar...)
    if (/(selam|slm|mrb|merhaba|hey|sa|sea|selamlar|njs)/.test(m)) {
        cevap = "selam gulum, ibothem2.0 emrinde. bugun senin gunun biliyosun, seni mutlu etmek icin burdayim. \n\nneler yapalim? \n1-modum dusuk \n2-iltifat et \n3-ne yapalim \n4-buyuk sir \n5-not birak \n\nya da 'ask olcer' veya 'tas kagit makas' dene!";
    }

    // 2. Taş-Kağıt-Makas (Artık sadece kelimeyi içermesi yeterli)
    else if (m.includes('tas') || m.includes('kagit') || m.includes('makas')) {
        const secenekler = ['tas', 'kagit', 'makas'];
        const botSecimi = secenekler[Math.floor(Math.random() * 3)];
        
        let sonuc = "";
        if (m.includes(botSecimi)) sonuc = "berabere! bi daha dene bakalim.";
        else sonuc = "nese kimin kazandigi onemli degil, onemli olan senin gulusun gulum.";

        cevap = `benim secimim: ${botSecimi}! \n\n${sonuc}`;
    }

    // 3. Aşk ve Sevgi (Varyasyonlar: askim, canim, seni seviyom...)
    else if (/(seni seviyorum|seviyom|askim|canim|bitanem|hayatim)/.test(m)) {
        const askCevaplari = [
            "bende seni cok seviyorum gulum, senin icin koca serverlari ayaga kaldirdim.",
            "dunyanin en guzel kizi bana mesaj atiyo, su an devrelerim isiniyo valla.",
            "seni sevmek en kolay 'hello world' kodu gibi gulum, hic bitmiyo."
        ];
        cevap = askCevaplari[Math.floor(Math.random() * askCevaplari.length)];
    }

    // 4. Durum Soruları (napiyon, napuon, naber...)
    else if (/(napiyosun|napion|napuon|ne yapiyosun|naber|nolsun)/.test(m)) {
        cevap = "valla seni dusunuyorum, bi de bu botun kodlarini senin icin optimize ediyorum gulum. sen napiosun?";
    }

    // 5. Özel Fonksiyonlar (Aşk Ölçer, Fal)
    else if (m.includes('ask olcer') || m.includes('yuzde')) {
        cevap = `❤️ ask olcer sonucu: %${Math.floor(Math.random() * 10) + 95}\n\nsistem notu: bu makine senin guzelligini gorunce hata verdi, sevgimiz yuzdelere sigmaz gulum.`;
    }
    else if (m.includes('fal')) {
        cevap = "🔮 falinda bir rifter ve cok mutlu bir gelecek goruyorum gulum. kalbinin temizligi kodlarima yansidi.";
    }

    // 6. Menü Numaraları
    else if (m === '1') cevap = "hemen modunu yukseltelim: git aynaya bak ve dunyanin en tatli kizini gor. gulumse!";
    else if (m === '2') {
        const iltifatlar = ["guzelligin java kodlarindan daha duzenli", "iskenderun teknik seninle gurur duyuyo", "rifterin sag koltugu seninle guzel"];
        cevap = iltifatlar[Math.floor(Math.random() * iltifatlar.length)];
    }
    else if (m === '3') cevap = "ister sahilde tur atalim, ister kart oynayalim. bugun senin gunun.";
    else if (m === '4') cevap = "buyuk sir: oop calisirken kagitlara senin adini yazdigim icin hocadan azar isittim.";
    else if (m === '5') cevap = "notun sisteme dustu gulum, etheme (yani bana) iletildi bile. bekliyorum.";

    // 7. Random Gülüşler
    else if (/(asdf|haha|sjsj|haha)/.test(m)) {
        cevap = "o gulusune kurban be gulum, sen hep boyle mutlu ol diye ugrasiyorum zaten.";
    }

    // 8. Hiçbiri tutmazsa
    else {
        cevap = "gulum tam anlayamadim ne dedigini, malum ibothem2.0 senin kadar zeki degil. 'menu' yazarsan hatirlarim her seyi.";
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 ibothem2.0 God Mode Yayinda!`); });
