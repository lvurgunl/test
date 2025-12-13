document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // %20'si görünür olduğunda tetikle
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Sadece bir kez animasyon oynaması için:
                // observer.unobserve(entry.target); 
                // Tekrar tekrar oynaması için unobserve'u kaldırdım.
            }
        });
    }, observerOptions);

    const chapters = document.querySelectorAll('.chapter, .finale');
    chapters.forEach(section => {
        observer.observe(section);
    });


    // 2. Video Autoplay Logic
    // Videolar ekrana gelince oynasın, çıkınca dursun (Performans ve dikkat yönetimi)
    const videoObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5 // Videonun yarısı görünür olduğunda
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            
            if (entry.isIntersecting) {
                // Görünürse oynat
                video.play().catch(error => {
                    console.log("Otomatik oynatma engellendi:", error);
                });
            } else {
                // Görünmezse durdur
                video.pause();
            }
        });
    }, videoObserverOptions);

    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        videoObserver.observe(video);
    });

});
