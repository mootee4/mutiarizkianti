// script.js - Versi Final dengan Floating Button Tampil di Semua Ukuran

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - Memulai inisialisasi');
    
    initPhotoRotator();
    initFloatingMenu();
    initDraggableFloatingButton();
    initCertPopup();
    initFadeObserver();
    initParticleCanvas();
    initCloudTags();
    initTouchDevices();
    
    console.log('Inisialisasi selesai');
});

// ========== FOTO ROTATING ==========
function initPhotoRotator() {
    const photoContainer = document.getElementById('rotatingPhotosInline');
    const indicators = document.querySelectorAll('.indicator-inline');
    
    if (!photoContainer) return;
    
    const images = [
        'assets/2.jpeg',
        'assets/3.jpeg',
        'assets/1.png',
        'assets/4.png',
        'assets/5.png'
    ];
    
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Mutia ${index + 1}`;
        img.loading = 'lazy';
        if (index === 0) img.classList.add('active');
        photoContainer.appendChild(img);
    });

    const photos = document.querySelectorAll('.rotating-photos-inline img');
    let currentIndex = 0;
    const totalPhotos = photos.length;
    let slideInterval;

    function showPhoto(index) {
        if (!photos.length) return;
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

    if (totalPhotos > 0) {
        slideInterval = setInterval(nextPhoto, 4000);

        indicators.forEach((dot, idx) => {
            dot.addEventListener('click', function(e) {
                e.stopPropagation();
                clearInterval(slideInterval);
                currentIndex = idx;
                showPhoto(currentIndex);
                slideInterval = setInterval(nextPhoto, 4000);
            });
        });
    }
    
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (slideInterval) clearInterval(slideInterval);
        } else {
            if (totalPhotos > 0 && !slideInterval) {
                slideInterval = setInterval(nextPhoto, 4000);
            }
        }
    });
}

// ========== FLOATING MENU ==========
function initFloatingMenu() {
    const menuBtn = document.getElementById('floatingMenuBtn');
    const menuItems = document.getElementById('floatingMenuItems');
    const menuLinks = document.querySelectorAll('.floating-menu-link');
    
    if (!menuBtn || !menuItems) return;
    
    // Toggle menu
    menuBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        menuItems.classList.toggle('active');
        
        const icon = this.querySelector('i');
        if (icon) {
            if (menuItems.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Close menu saat link diklik
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuItems.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Click outside to close
    document.addEventListener('click', function(e) {
        if (menuItems.classList.contains('active')) {
            if (!menuItems.contains(e.target) && !menuBtn.contains(e.target)) {
                menuItems.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });
    
    // Prevent click on menu from closing
    menuItems.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // ===== NAVIGASI SEDERHANA =====
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const targetPosition = targetSection.offsetTop - 60;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                menuLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active state on scroll
    window.addEventListener('scroll', function() {
        requestAnimationFrame(function() {
            updateActiveMenuLink(menuLinks);
        });
    });
    
    setTimeout(function() {
        updateActiveMenuLink(menuLinks);
    }, 500);
}

// ========== UPDATE ACTIVE MENU LINK ==========
function updateActiveMenuLink(menuLinks) {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            menuLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========== DRAGGABLE FLOATING BUTTON ==========
function initDraggableFloatingButton() {
    const container = document.getElementById('floatingMenuContainer');
    const btn = document.getElementById('floatingMenuBtn');
    
    if (!container || !btn) return;
    
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    const startDrag = (e) => {
        e.preventDefault();
        isDragging = true;
        
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        const rect = container.getBoundingClientRect();
        
        startX = clientX;
        startY = clientY;
        startLeft = rect.left;
        startTop = rect.top;
        
        container.style.cursor = 'grabbing';
        
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    };
    
    const onDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        const maxLeft = window.innerWidth - container.offsetWidth;
        const maxTop = window.innerHeight - container.offsetHeight;
        
        newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        newTop = Math.max(0, Math.min(newTop, maxTop));
        
        container.style.left = newLeft + 'px';
        container.style.right = 'auto';
        container.style.bottom = 'auto';
        container.style.top = newTop + 'px';
    };
    
    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        
        container.style.cursor = 'grab';
        
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('touchend', stopDrag);
    };
    
    btn.addEventListener('mousedown', startDrag);
    btn.addEventListener('touchstart', startDrag, { passive: false });
    
    const menuItems = document.getElementById('floatingMenuItems');
    if (menuItems) {
        menuItems.addEventListener('mousedown', (e) => e.stopPropagation());
        menuItems.addEventListener('touchstart', (e) => e.stopPropagation());
    }
}

// ========== POPUP SERTIFIKAT ==========
function initCertPopup() {
    const popup = document.getElementById('certPopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const popupClose = document.getElementById('popupClose');
    const popupImage = document.getElementById('popupImage');
    const popupCaption = document.getElementById('popupCaption');
    const popupLoading = document.getElementById('popupLoading');
    const certCards = document.querySelectorAll('.cert-image-card');

    if (!popup || !popupImage) return;

    function openPopup(imageSrc, caption) {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        popupImage.classList.remove('loaded');
        popupLoading.style.display = 'flex';
        popupImage.removeAttribute('src');
        
        if (popupCaption) {
            popupCaption.textContent = caption || 'Sertifikat Kompetensi';
        }
        
        const img = new Image();
        let timeoutId = setTimeout(function() {
            popupLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Waktu habis';
            setTimeout(function() {
                if (popup.classList.contains('active')) {
                    closePopup();
                }
            }, 1500);
        }, 8000);

        img.onload = function() {
            clearTimeout(timeoutId);
            popupImage.src = imageSrc;
            popupImage.classList.add('loaded');
            popupLoading.style.display = 'none';
        };
        
        img.onerror = function() {
            clearTimeout(timeoutId);
            popupLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Gagal memuat';
            setTimeout(function() {
                if (popup.classList.contains('active')) {
                    closePopup();
                }
            }, 1500);
        };
        
        img.src = imageSrc;
    }

    function closePopup() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(function() {
            popupImage.removeAttribute('src');
            popupImage.classList.remove('loaded');
            popupLoading.style.display = 'flex';
            popupLoading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memuat...';
        }, 300);
    }

    certCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const imgSrc = this.getAttribute('data-src');
            if (!imgSrc) return;
            
            const title = this.querySelector('.cert-info h4')?.textContent || 'Sertifikat';
            const subtitle = this.querySelector('.cert-info p')?.textContent || '';
            const caption = `${title} ${subtitle ? '· ' + subtitle : ''}`;
            
            openPopup(imgSrc, caption);
        });
    });

    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', closePopup);
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });

    // Preload sertifikat pertama
    certCards.forEach(function(card, index) {
        if (index < 3) {
            const imgSrc = card.getAttribute('data-src');
            if (imgSrc) {
                const img = new Image();
                img.src = imgSrc;
            }
        }
    });
}

// ========== FADE OBSERVER ==========
function initFadeObserver() {
    const faders = document.querySelectorAll('.fade-section');
    
    if (faders.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        faders.forEach(fader => observer.observe(fader));
    }
}

// ========== PARTICLE CANVAS ==========
function initParticleCanvas() {
    const canvas = document.getElementById('techCanvas');
    if (!canvas) return;
    
    const isMobile = window.innerWidth < 768;
    let ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationFrame;
    let mouseX = -1000, mouseY = -1000;

    function initParticles() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        
        const particleCount = isMobile ? 25 : 40;
        
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 2 + 1,
                color: i % 3 === 0 ? '#9fb9f0' : (i % 3 === 1 ? '#c3b1e8' : '#a8e6cf')
            });
        }
    }

    if (!isMobile) {
        canvas.addEventListener('mousemove', function(e) {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', function() {
            mouseX = -1000;
            mouseY = -1000;
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (!isMobile && mouseX > 0 && mouseY > 0) {
                const dx = mouseX - p.x;
                const dy = mouseY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 80) {
                    const angle = Math.atan2(dy, dx);
                    const force = (80 - distance) / 2000;
                    p.x -= Math.cos(angle) * force;
                    p.y -= Math.sin(angle) * force;
                }
            }
            
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fill();
            
            const maxDistance = isMobile ? 60 : 80;
            particles.forEach(p2 => {
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (distance2 < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(159, 185, 240, ${0.05 * (1 - distance2/maxDistance)})`;
                    ctx.lineWidth = 0.8;
                    ctx.shadowBlur = 3;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        animationFrame = requestAnimationFrame(drawParticles);
    }

    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            initParticles();
            drawParticles();
        }, 250);
    });

    initParticles();
    drawParticles();

    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        } else {
            if (!animationFrame) {
                drawParticles();
            }
        }
    });
}

// ========== CLOUD TAGS ==========
function initCloudTags() {
    const cloudTags = document.querySelectorAll('.cloud-tag.pastel-tag');
    cloudTags.forEach(tag => {
        const weight = tag.getAttribute('data-weight') || '50';
        const size = 0.85 + (parseInt(weight) / 500);
        tag.style.fontSize = size + 'rem';
    });
}

// ========== TOUCH DEVICE ==========
function initTouchDevices() {
    if ('ontouchstart' in window) {
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('touchstart', function(e) {
                e.preventDefault();
                const inner = this.querySelector('.flip-card-inner');
                if (inner) {
                    if (inner.style.transform === 'rotateY(180deg)') {
                        inner.style.transform = '';
                    } else {
                        inner.style.transform = 'rotateY(180deg)';
                    }
                }
            });
        });
    }
}