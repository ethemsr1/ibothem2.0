const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// AYARLAR
const MY_NUMBER = 'whatsapp:+905449559033'; 
const TWILIO_NUMBER = 'whatsapp:+14155238886';

const iltifatlar = [
    "Gülüm, yazılan en kusursuz Java class'ından bile daha güzelsin.",
    "Dünyadaki bütün sunucular çökse bile sana olan aşkım 7/24 up and running.",
    "İskenderun Teknik'teki hiçbir zorlu sınav, senin gözlerine bakmak kadar büyüleyici olamaz.",
    "Senin gülüşün, hayatımdaki en güzel 'Compiled Successfully' mesajı."
];

const randevuFikirleri = [
    "Peugeot Rifter GT ile rotasız, sadece ikimizin olduğu uzun bir sahil yolculuğu. 🚙💨",
    "Telefonları tamamen kapatıp, sadece birbirimize odaklandığımız kahve ve tatlı krizli bir akşam. ☕🍰",
    "Kuzenimle planladığımız o efsane kart oyunu gecesi! 🃏",
    "Beraber mutfağa girip en sevdiğin yemeği yapma denemesi. 🍝"
];

app.post('/whatsapp', async (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const gelenMesaj = req.body.Body ? req.body.Body.trim() : '';
    const gonderenNo = req.body.From;

    // Twilio Client kurulumu (Bildirim göndermek için)
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // EĞER MESAJ SENDEN GELMİYORSA (YANİ GÜLÜM YAZIYORSA) SANA HABER VER
    if (gonderenNo !== MY_NUMBER) {
        try {
            await client.messages.create({
                from: TWILIO_NUMBER,
                to: MY_NUMBER,
                body: `🔔 ibothem2.0 Raporu: Gülüm bota şunu yazdı: "${gelenMesaj}"`
            });
        } catch (err) {
            console.error("Bildirim gönderilemedi:", err);
        }
    }

    let cevap = "";
    const mesajAlt = gelenMesaj.toLowerCase();

    if (mesajAlt === 'merhaba' || mesajAlt === 'selam' || mesajAlt === 'menü') {
        cevap = `🌹 Hoş geldin Gülüm...\n\nBen ibothem2.0! Sevgilinin senin için kodladığı Sanal Asistanın.\n\nSana nasıl yardımcı olabilirim? Lütfen bir numara seç:\n\n1️⃣ Modum Düşük\n2️⃣ Bana İltifat Et\n3️⃣ Ne Yapsak?\n4️⃣ Büyük Sır\n5️⃣ Geliştiriciye Not Bırak`;
    } 
    else if (gelenMesaj === '1') {
        cevap = `✨ Hemen modunu yükseltiyorum! Şunu asla unutma: Sen bu dünyadaki en özel insansın ve ben OOP finaline çalışırken bile sadece seni düşünüyordum. 🥰`;
    } 
    else if (gelenMesaj === '2') {
        cevap = `💻 Sistem Mesajı: ${iltifatlar[Math.floor(Math.random() * iltifatlar.length)]}`;
    } 
    else if (gelenMesaj === '3') {
        cevap = `🎯 ibothem2.0 Randevu Modülü: ${randevuFikirleri[Math.floor(Math.random() * randevuFikirleri.length)]}`;
    } 
    else if (gelenMesaj === '4') {
        cevap = `🚨 GİZLİ VERİ: Peugeot Rifter GT'nin sağ koltuğu sonsuza kadar sadece sana rezerve edildi. Seni çok seviyorum Gülüm. 💖`;
    } 
    else if (gelenMesaj === '5') {
        cevap = `💌 Sistem: Sevgiline notun iletildi (aslında her yazdığını görüyor şu an 😉).`;
    } 
    else {
        cevap = `🤖 Gülüm, sadece 'Menü' ya da rakamları (1-5) anlıyorum.`;
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 ibothem2.0 Yayında!`);
});
