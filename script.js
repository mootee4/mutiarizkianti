// script.js - Animasi Kreatif dan Interaktif - DISESUAIKAN UNTUK FOTO INLINE
// REVISI: Menghapus semua kode yang berhubungan dengan progress bar

document.addEventListener('DOMContentLoaded', () => {
    // ========== 5 FOTO ROTATING (INLINE VERSION) ==========
    // Menggunakan selector baru untuk inline photos
    const photoContainer = document.getElementById('rotatingPhotosInline');
    const indicators = document.querySelectorAll('.indicator-inline');
    
    // 5 foto sesuai path
    const images = [
        'assets/2.jpeg',
        'assets/3.jpeg',
        'assets/1.png',
        'assets/4.png',
        'assets/5.png'
    ];
    
    // Preload dan inject gambar
    if (photoContainer) {
        images.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Mutia ${index + 1}`;
            img.loading = 'lazy';
            if (index === 0) img.classList.add('active');
            photoContainer.appendChild(img);
        });
    }

    const photos = document.querySelectorAll('.rotating-photos-inline img');
    let currentIndex = 0;
    const totalPhotos = photos.length;

    function showPhoto(index) {
        photos.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        indicators.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function nextPhoto() {
        if (totalPhotos > 0) {
            currentIndex = (currentIndex + 1) % totalPhotos;
            showPhoto(currentIndex);
        }
    }

    // Auto slide setiap 3.5 detik
    let slideInterval = setInterval(nextPhoto, 3500);

    // Klik indicator
    indicators.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            currentIndex = idx;
            showPhoto(currentIndex);
            slideInterval = setInterval(nextPhoto, 3500);
        });
    });

    // ========== INTERSECTION OBSERVER ==========
    const faders = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // KODE PROGRESS BAR DIHAPUS DARI SINI
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    faders.forEach(fader => observer.observe(fader));

    // Trigger untuk elemen yang sudah terlihat saat load
    window.addEventListener('load', () => {
        faders.forEach(fader => {
            const rect = fader.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                fader.classList.add('visible');
                
                // KODE PROGRESS BAR DIHAPUS DARI SINI
                
                observer.unobserve(fader);
            }
        });
    });

    // ========== PARTICLE NETWORK INTERAKTIF ==========
    const canvas = document.getElementById('techCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouseX = 0, mouseY = 0;

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function initParticles() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const particleCount = 100;
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
                color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        
        // Update dan gambar partikel
        particles.forEach(p => {
            // Gerakan acak
            p.x += p.vx;
            p.y += p.vy;
            
            // Interaksi dengan mouse
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 1000;
                p.x -= Math.cos(angle) * force;
                p.y -= Math.sin(angle) * force;
            }
            
            // Wrap around
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            // Gambar partikel
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();
            
            // Hubungkan partikel yang berdekatan
            particles.forEach(p2 => {
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (distance2 < 80) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance2/80)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(drawParticles);
    }

    window.addEventListener('resize', () => {
        initParticles();
    });

    initParticles();
    drawParticles();

    // ========== ANIMASI ANGKA STATISTIK ==========
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        
        const updateNumber = () => {
            if (current < target) {
                current += increment;
                stat.innerHTML = Math.floor(current) + '+';
                requestAnimationFrame(updateNumber);
            } else {
                stat.innerHTML = target + '+';
            }
        };
        
        // Mulai animasi saat stat terlihat
        const observer2 = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateNumber();
                    observer2.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer2.observe(stat);
    });

    // ========== HOVER EFFECT UNTUK FLIP CARDS ==========
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });

    // ========== TILT EFFECT UNTUK GLASS CARDS ==========
    const glassCards = document.querySelectorAll('.glass-card:not(.flip-card *)');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========== CLEANUP INTERVAL SAAT PAGE HIDDEN ==========
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            slideInterval = setInterval(nextPhoto, 3500);
        }
    });
});