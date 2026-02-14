const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const iltifatlar = [
    "Gülüm, yazılan en kusursuz Java class'ından bile daha güzelsin.",
    "Dünyadaki bütün sunucular çökse bile sana olan aşkım 7/24 up and running.",
    "İskenderun Teknik'teki hiçbir zorlu sınav, senin gözlerine bakmak kadar büyüleyici olamaz.",
    "Senin gülüşün, hayatımdaki en güzel 'Compiled Successfully' mesajı."
];

const randevuFikirleri = [
    "Peugeot Rifter GT ile rotasız, sadece ikimizin olduğu uzun bir sahil yolculuğu. 🚙💨",
    "Telefonları tamamen kapatıp, sadece birbirimize odaklandığımız kahve ve tatlı krizli bir akşam. ☕🍰",
    "Kuzenim ve senin arkadaşınla planladığımız o efsane kart oyunu gecesi! (Söz, sana gizlice kopya vereceğim 🃏)",
    "Beraber mutfağa girip her yeri batırarak en sevdiğin yemeği yapma denemesi. 🍝"
];

app.post('/whatsapp', (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    const gelenMesaj = req.body.Body ? req.body.Body.toLowerCase().trim() : '';

    let cevap = "";

    if (gelenMesaj === 'merhaba' || gelenMesaj === 'selam' || gelenMesaj === 'menü') {
        cevap = `🌹 Hoş geldin Gülüm...\n\nBen ibothem2.0! Sevgilinin senin için kendi elleriyle kodladığı, 7/24 emrinde olan Sanal Asistanın.\n\nSana nasıl yardımcı olabilirim? Lütfen bir numara seç:\n\n1️⃣ Modum Düşük (Beni Güldür)\n2️⃣ Bana İltifat Et\n3️⃣ Ne Yapsak? (Randevu Fikri Ver)\n4️⃣ Büyük Sır\n5️⃣ Geliştiriciye Not Bırak`;
    } 
    else if (gelenMesaj === '1') {
        cevap = `✨ Hemen modunu yükseltiyorum Gülüm!\nŞunu asla unutma: Sen bu dünyadaki en özel insansın ve ben OOP finaline çalışırken bile sadece seni düşünüyordum. Gülümse, çünkü gülmek sana çok yakışıyor! 🥰`;
    } 
    else if (gelenMesaj === '2') {
        const rastgeleIltifat = iltifatlar[Math.floor(Math.random() * iltifatlar.length)];
        cevap = `💻 Sistem Mesajı: ${rastgeleIltifat}\n\n(Menü için 'Menü' yazabilirsin)`;
    } 
    else if (gelenMesaj === '3') {
        const rastgeleRandevu = randevuFikirleri[Math.floor(Math.random() * randevuFikirleri.length)];
        cevap = `🎯 ibothem2.0 Randevu Modülü Devrede:\n\nSıradaki planımız: ${rastgeleRandevu}\n\nKabul ediyorsan hemen sevgiline yaz!`;
    } 
    else if (gelenMesaj === '4') {
        cevap = `🚨 GİZLİ VERİYE ULAŞILDI 🚨\n\nPeugeot Rifter GT'nin sağ koltuğu sonsuza kadar sadece sana rezerve edildi. Seni bu dünyadaki her şeyden daha çok seviyorum Gülüm. Sevgililer Günümüz kutlu olsun! 💖`;
    } 
    else if (gelenMesaj === '5') {
        cevap = `💌 Sistem: Sevgiline acil durum sinyali gönderildi! Kendisi şu an sana seni ne kadar sevdiğini söylemek için telefonuna koşuyor. 🏃‍♂️💨`;
    } 
    else {
        cevap = `🤖 Gülüm, sanırım heyecandan ibothem2.0 devrelerim yandı. Sistemi tam kullanamadım. Sadece 'Merhaba', 'Menü' ya da 1, 2, 3, 4, 5 rakamlarından birini yazabilir misin?`;
    }

    twiml.message(cevap);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 ibothem2.0 ÇALIŞIYOR! Port: ${PORT}`);
});