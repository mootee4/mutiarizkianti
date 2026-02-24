// script.js - Animasi Kreatif dan Interaktif - DISESUAIKAN UNTUK FOTO INLINE
// REVISI: Menghapus semua kode yang berhubungan dengan progress bar
// DITAMBAH: Navbar sticky, popup sertifikat, smooth scroll

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

    // ========== NAVBAR STICKY ==========
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle menu mobile
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Close menu saat link diklik
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = navToggle?.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link berdasarkan scroll position
        updateActiveNavLink();
    });

    // Function untuk update active nav link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // Offset untuk navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Smooth scroll untuk nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - 80; // Offset navbar
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== POPUP SERTIFIKAT ==========
    const popup = document.getElementById('certPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupClose = document.getElementById('popupClose');
    const popupImage = document.getElementById('popupImage');
    const popupCaption = document.getElementById('popupCaption');
    const popupLoading = document.getElementById('popupLoading');
    const certCards = document.querySelectorAll('.cert-image-card');

    function openPopup(imageSrc, caption) {
        if (!popup || !popupImage || !popupLoading) return;
        
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset dan show loading
        popupImage.classList.remove('loaded');
        popupLoading.style.display = 'flex';
        popupImage.src = '';
        
        // Set caption
        if (popupCaption) {
            popupCaption.textContent = caption;
        }
        
        // Load image
        const img = new Image();
        img.onload = () => {
            popupImage.src = imageSrc;
            popupImage.classList.add('loaded');
            popupLoading.style.display = 'none';
        };
        img.onerror = () => {
            popupLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal memuat gambar';
            setTimeout(() => {
                if (popup.classList.contains('active')) {
                    closePopup();
                }
            }, 2000);
        };
        img.src = imageSrc;
    }

    function closePopup() {
        if (!popup) return;
        popup.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset image setelah animasi selesai
        setTimeout(() => {
            if (popupImage) {
                popupImage.src = '';
                popupImage.classList.remove('loaded');
            }
            if (popupLoading) {
                popupLoading.style.display = 'flex';
                popupLoading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat gambar...';
            }
        }, 300);
    }

    // Event listeners untuk popup
    certCards.forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-src');
            const title = card.querySelector('.cert-info h4')?.textContent || 'Sertifikat';
            const subtitle = card.querySelector('.cert-info p')?.textContent || '';
            const caption = `${title} - ${subtitle}`;
            
            openPopup(imgSrc, caption);
        });
    });

    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
    }

    // Close popup dengan tombol ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup?.classList.contains('active')) {
            closePopup();
        }
    });

    // ========== INTERSECTION OBSERVER ==========
    const faders = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
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
                observer.unobserve(fader);
            }
        });
        
        // Preload gambar sertifikat (opsional)
        certCards.forEach(card => {
            const imgSrc = card.getAttribute('data-src');
            if (imgSrc) {
                const img = new Image();
                img.src = imgSrc;
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

    canvas.addEventListener('mouseleave', () => {
        mouseX = -1000;
        mouseY = -1000;
    });

    function initParticles() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const particleCount = Math.min(100, Math.floor(width * height / 10000));
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
                    ctx.shadowBlur = 5;
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
        const target = parseInt(stat.getAttribute('data-count') || '0');
        if (target === 0) return;
        
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
        
        if (stat) observer2.observe(stat);
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
    const glassCards = document.querySelectorAll('.glass-card:not(.flip-card *):not(.cert-image-card)');
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

    // ========== ANIMASI UNTUK CLOUD TAGS ==========
    const cloudTags = document.querySelectorAll('.cloud-tag');
    cloudTags.forEach(tag => {
        const weight = tag.getAttribute('data-weight') || '50';
        const size = 0.8 + (parseInt(weight) / 500);
        tag.style.fontSize = `${size}rem`;
        tag.style.fontWeight = parseInt(weight) > 80 ? '600' : '400';
    });

    // ========== LAZY LOADING UNTUK GAMBAR ==========
    const imagesToLoad = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.add('loading');
                img.onload = () => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                };
                imageObserver.unobserve(img);
            }
        });
    });

    imagesToLoad.forEach(img => imageObserver.observe(img));

    // ========== CLEANUP INTERVAL SAAT PAGE HIDDEN ==========
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(slideInterval);
        } else {
            slideInterval = setInterval(nextPhoto, 3500);
        }
    });

    // ========== PREVENT DEFAULT UNTUK TOUCH DEVICES ==========
    if ('ontouchstart' in window) {
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('touchstart', function(e) {
                e.preventDefault();
                this.classList.toggle('hover');
            });
        });
    }

    // ========== INITIAL ACTIVE NAV LINK ==========
    setTimeout(() => {
        updateActiveNavLink();
    }, 100);

    console.log('Script loaded successfully with popup and navbar features!');
});

// ========== ADDITIONAL UTILITY FUNCTIONS ==========

// Function untuk mengecek apakah elemen berada di viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Function untuk debounce (membatasi frekuensi eksekusi)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimasi resize event
window.addEventListener('resize', debounce(() => {
    // Update particles on resize handled by initParticles
    if (typeof initParticles === 'function') {
        // initParticles sudah dipanggil di event listener terpisah
    }
}, 250));

// Handle scroll performance
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Update active nav link
            if (typeof updateActiveNavLink === 'function') {
                updateActiveNavLink();
            }
            ticking = false;
        });
        ticking = true;
    }
});