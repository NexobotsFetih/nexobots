# Projeyi Başlatma Kılavuzu (NexoBots)

Uygulamayı çalıştırmak için bilgisayarınızda **Node.js** yüklü olmalıdır. Şu an sisteminizde yüklü görünmüyor.

## 1. Adım: Node.js Kurulumu
1. [Node.js İndir](https://nodejs.org/) adresine gidin.
2. "LTS" (Önerilen) sürümü indirin ve kurun.
3. Kurulum bittikten sonra bilgisayarınızı veya VS Code'u kapatıp açın.

## 2. Adım: Sunucuyu (Server) Başlatma
Arka plan işlemlerini (veritabanı, chat sistemi) başlatmak için:

1. VS Code'da üst menüden **Terminal > New Terminal** seçin.
2. Açılan terminale şu komutları sırasıyla yazıp Enter'a basın:

```powershell
cd nexobots/server
npm install
npx prisma db push
npm run dev
```

Ekranda "Server running on port 5000" yazısını görmelisiniz. **Bu terminali kapatmayın!**

## 3. Adım: Ön Yüzü (Client) Başlatma
Siteyi görüntülemek için:

1. Sağ üstteki **+** ikonuna (veya tekrar Terminal > New Terminal) tıklayarak **yeni bir terminal** daha açın.
2. Bu yeni terminale şu komutları yazın:

```powershell
cd nexobots/client
npm install
npm run dev
```

Ekranda "Local: http://localhost:5173/" gibi bir link çıkacaktır.
Ctrl tuşuna basılı tutarak o linke tıklayın veya tarayıcınızda açın.

## Özet
İki ayrı terminal çalışıyor olmalı:
1. `server` klasöründe: Arka plan için.
2. `client` klasöründe: Siteyi görmek için.

İyi çalışmalar!
