document.addEventListener('DOMContentLoaded', () => {

    // 0. Tanımlamalar
    const gateOverlay = document.getElementById('password-gate');
    const dateInput = document.getElementById('date-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const errorMsg = document.getElementById('error-msg');

    // Müzik Elemanları
    const bgMusic = document.getElementById('bg-music');
    const musicFab = document.getElementById('music-fab');
    const musicIcon = document.getElementById('music-icon');

    // Şifre: 04.07.2025 (Kabul edilen varyasyonlar)
    const acceptedVariations = [
        "04.07.2025", 
        "4.7.2025", 
        "04/07/2025", 
        "4/7/2025",
        "04-07-2025"
    ];

    function checkDate() {
        // Girilen değeri temizle ve boşlukları sil
        const inputVal = dateInput.value.trim();

        if (acceptedVariations.includes(inputVal)) {
            // ŞİFRE DOĞRU -> Kilidi Aç
            gateOverlay.classList.add('hidden');
            document.body.classList.add('unlocked');

            // Müziği Başlat (Kullanıcı etkileşimi olduğu için izin verilir)
            if (bgMusic) {
                bgMusic.volume = 0.5; // Ses seviyesi %50
                bgMusic.play().then(() => {
                    musicFab.style.display = 'flex';
                    musicFab.classList.add('music-playing');
                }).catch(e => console.log("Müzik çalma hatası (Tarayıcı izin vermedi):", e));
            }

            // Overlay tamamen kalkınca display:none yap
            setTimeout(() => {
                gateOverlay.style.display = 'none';
            }, 1000);
        } else {
            // ŞİFRE YANLIŞ
            errorMsg.textContent = "Maalesef yanlış tarih...";
            dateInput.classList.add('shake');
            
            // Titreme animasyonu bitince class'ı sil
            setTimeout(() => {
                dateInput.classList.remove('shake');
            }, 500);
        }
    }

    // Butona tıklayınca kontrol et
    if (unlockBtn) unlockBtn.addEventListener('click', checkDate);

    // Enter tuşuna basınca kontrol et
    if (dateInput) {
        dateInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkDate();
        });
    }

    // Sağ alttaki müzik butonu kontrolü
    if (musicFab) {
        musicFab.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                musicFab.classList.add('music-playing');
                musicIcon.textContent = '🎵';
            } else {
                bgMusic.pause();
                musicFab.classList.remove('music-playing');
                musicIcon.textContent = '🔇';
            }
        });
    }

    // 1. Scroll Animasyonları (Yazıların ekrana girince belirmesi)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // %15'i görünür olduğunda tetikle
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const chapters = document.querySelectorAll('.chapter, .finale');
    chapters.forEach(section => {
        observer.observe(section);
    });

    // 2. Video Otomatik Oynatma Mantığı (Ekrana girince oyna, çıkınca dur)
    // Bu, telefonun pilini korur ve sayfa performansını artırır.
    const videoObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video görünür olunca oynat
                video.play().catch(e => console.log("Otomatik video oynatma hatası:", e));
            } else {
                // Video ekrandan çıkınca durdur (Performans için)
                video.pause();
            }
        });
    }, videoObserverOptions);

    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        videoObserver.observe(video);
    });

});
