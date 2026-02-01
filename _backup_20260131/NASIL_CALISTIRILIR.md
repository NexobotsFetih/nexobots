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

## 4. Adım: Buluta (InfinityFree) Yükleme

Uygulama artık tamamen sunucusuz (Serverless) çalışacak şekilde hazırlandı.

1.  **Build Alın:** Terminalde `cd client` ve `npm run build` yazın. (Bu işlem bittiğinde `client/dist` adında bir klasör oluşur).
2.  **Dosyaları Hazırlayın:** `client/dist` klasörünün içindeki **tüm dosyaları** (klasörün kendisini değil, içindekileri) seçin.
3.  **InfinityFree'ye Yükleyin:**
    *   InfinityFree paneline girin ve **File Manager**'ı açın.
    *   `htdocs` klasörünün içine girin.
    *   `client/dist` içindeki tüm dosyaları buraya sürükleyip bırakın.
4.  **Firebase Ayarı:** Firebase console üzerinden projenizin "Authorized Domains" kısmına `nexobots.ct.ws` adresini eklediğinizden emin olun.

**Not:** Backend (server klasörü) artık devre dışıdır. Tüm işlemler Firebase ve Frontend üzerinden dönmektedir.
