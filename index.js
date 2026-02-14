const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const MY_NUMBER = 'whatsapp:+905449559033'; 
const TWILIO_NUMBER = 'whatsapp:+14155238886';

app.post('/whatsapp', async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const gelenMesaj = req.body.Body ? req.body.Body.trim() : '';
    const gonderenNo = req.body.From;
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Bildirim Sistemi (Senin telefonuna rapor gelir)
    if (gonderenNo !== MY_NUMBER) {
        try {
            await client.messages.create({
                from: TWILIO_NUMBER, to: MY_NUMBER,
                body: `🔔 rapor: gulum yazdi: "${gelenMesaj}"`
            });
        } catch (err) { console.error(err); }
    }

    let cevap = "";
    const m = gelenMesaj.toLowerCase()
        .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c');

    // --- GELISMIS FONKSIYONLAR ---

    // 1. Ask Olcer (Random % veriyor)
    if (m.includes('ask olcer') || m.includes('seviye')) {
        const yuzde = Math.floor(Math.random() * 11) + 90; // %90-100 arasi cikar hep :)
        cevap = `❤️ ask olcer sonucu: %${yuzde}\n\nsistem notu: bu deger ethemin kalbindeki gercek sevginin sadece binde biri gulum.`;
    }

    // 2. Fal Bakma (Eglencesine)
    else if (m.includes('fal bak') || m.includes('falci')) {
        const fallar = [
            "fincaninda bir rifter goruyorum, cok yakinda guzel bi yola cikacaksiniz.",
            "kalbin cok temiz gulum, ethem adinda bi genc senin icin koca gece kod yazmis.",
            "uc vakte kadar bi mesaj alacaksin, icinde 'seni cok seviyorum' yazacak."
        ];
        cevap = `🔮 ibothem2.0 falci modu: ${fallar[Math.floor(Math.random() * fallar.length)]}`;
    }

    // 3. Oyun (Tas Kagit Makas)
    else if (m === 'tas' || m === 'kagit' || m === 'makas') {
        const secenek = ['tas', 'kagit', 'makas'];
        const botSecim = secenek[Math.floor(Math.random() * 3)];
        cevap = `ben ${botSecim} sectim! \n\n${botSecim === m ? 'berabere, bi daha dene gulum.' : 'nese kimin kazandigi onemli degil her turlu kalbimi sen kazandin zaten.'}`;
    }

    // 4. Hava Durumu / Yemek / Mod (Akilli Tahminler)
    else if (m.includes('hava')) {
        cevap = "valla disarda hava nasil bilmem ama benim kalbimde firtinalar kopuyo gulum. (iskenderun da hava her turlu sicaktir zaten bosver)";
    }
    else if (m.includes('aciktim') || m.includes('yemek')) {
        cevap = "hemen etheme (yani bana) yaz, rifterla seni en sevdigin yere gotursun. emir bekliyorum.";
    }

    // 5. Klasik Kelime Yakalayıcılar (Gelistirilmis)
    else if (m === 'sa' || m === 'sea' || m === 'slm') {
        cevap = "as gulum, sevgililer gunun kutlu olsun tekrar. bugun kraliçe sensin.";
    }
    else if (m.includes('napiyosun') || m.includes('napion') || m.includes('napuon')) {
        cevap = "seni dusunuyorum, bi de bu botun kodlariyla ugrasiyorum gulum her sey senin gulusun icin.";
    }
    else if (m.includes('seviyorum') || m.includes('asigim')) {
        cevap = "bende seni seviyorum gulum, seninle gecen her saniye benim icin bir 'success' mesajidir.";
    }
    else if (m.length > 5 && (m.includes('asdf') || m.includes('haha') || m.includes('sjsj'))) {
        cevap = "o gulusune kurban be gulum, sen hep boyle mutlu ol diye ugrasiyorum zaten.";
    }

    // 6. Ana Menu ve Yardim
    else if (m === 'merhaba' || m === 'selam' || m === 'menu' || m === 'yardim') {
        cevap = `🌹 hosgeldin gulum, ben senin icin kodlanmis ibothem2.0.\n\nneler yapabilirim bak:\n\n1️⃣ modum dusuk (beni guldur)\n2️⃣ bana guzel bisey soyle\n3️⃣ ne yapalim?\n4️⃣ buyuk sir\n5️⃣ bana not birak\n\nveya su komutlari dene: 'fal bak', 'ask olcer', 'tas-kagit-makas' oyna.`;
    }

    // 7. Numara Menuleri
    else if (m === '1') cevap = "git aynaya bak, dunyanin en sansli adamiyla sevgili olan o guzelligi gor. gulumse gulum!";
    else if (m === '2') {
        const sozler = ["yazdigim en kusursuz kod bile senin gulusun kadar temiz degil.", "iskenderun teknikten mezun olurum ama senden asla vazgecmem.", "rifterin sag koltugu senin icin dunyanin en guvenli yeri."];
        cevap = sozler[Math.floor(Math.random() * sozler.length)];
    }
    else if (m === '3') cevap = "rifterla sahile mi sursek, yoksa kuzenlerle kart mi oynasak? sen sec gulum.";
    else if (m === '4') cevap = "buyuk sir: oop calisirken bile kagitlara adini yaziyorum, hoca gorse diplomayi yakar.";
    else if (m === '5') cevap = "notunu aldim, direkt etheme (yani bana) ilettim. o da su an telefon basinda seni bekliyo.";

    // 8. Error Handling (Kibarca sacmaliyor)
    else {
        cevap = "gulum tam anlayamadim, ibothem2.0 biraz acemi daha. sadece rakamlari veya basit seyleri yazarsan anlarim hemen.";
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`🚀 ibothem2.0 ultimate yayinda!`); });
