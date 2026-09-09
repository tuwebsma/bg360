/* ==========================================================================
   BG 360° INTERACTIVE APP SCRIPT — REFACTORED
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVIGATION DRAWER TOGGLE & SCROLL LOCK
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');
    const navCloseBtn = document.getElementById('navCloseBtn');

    function closeNav() {
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
        navBackdrop?.classList.remove('active');
        document.body.style.overflow = '';
    }

    function openNav() {
        navMenu?.classList.add('active');
        navToggle?.classList.add('active');
        navBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                closeNav();
            } else {
                openNav();
            }
        });

        if (navCloseBtn) {
            navCloseBtn.addEventListener('click', closeNav);
        }

        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeNav);
        }

        // Close menu on clicking nav links
        const navLinks = navMenu.querySelectorAll('.nav-link, .btn');
        navLinks.forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Close on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeNav();
            }
        });
    }


    // 2. SCROLL HEADER STYLING & ACTIVE LINK SPY
    const header = document.querySelector('.main-header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }

        // Active Link Scroll Spy
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    // 3. SCROLL ENTRY ANIMATIONS (INTERSECTION OBSERVER)
    const animatables = document.querySelectorAll('.fade-in-up');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatables.forEach(element => {
            scrollObserver.observe(element);
        });
    } else {
        animatables.forEach(element => {
            element.classList.add('animated');
        });
    }


    // 4. SEGMENTED CONTROL DE ABONOS (PLANES MENSUALES vs FLEXI PASS)
    const btnModeMensual = document.getElementById("btnModeMensual");
    const btnModeFlexi = document.getElementById("btnModeFlexi");
    const btnModeOnline = document.getElementById("btnModeOnline");

    const pricingGroups = {
        mensual: document.getElementById("groupMensual"),
        flexi: document.getElementById("groupFlexi"),
        online: document.getElementById("groupOnline")
    };

    const pricingButtons = {
        mensual: btnModeMensual,
        flexi: btnModeFlexi,
        online: btnModeOnline
    };

    function switchPricingMode(mode) {

        Object.keys(pricingButtons).forEach(key => {
            pricingButtons[key]?.classList.toggle("active", key === mode);
        });

        Object.keys(pricingGroups).forEach(key => {

            const group = pricingGroups[key];

            if (!group) return;

            if (key === mode) {

                group.style.display = "block";
                requestAnimationFrame(() => group.classList.add("active"));

            } else {

                group.classList.remove("active");

                setTimeout(() => {
                    group.style.display = "none";
                }, 180);

            }
        });
    }

    btnModeMensual?.addEventListener("click", () => switchPricingMode("mensual"));
    btnModeFlexi?.addEventListener("click", () => switchPricingMode("flexi"));
    btnModeOnline?.addEventListener("click", () => switchPricingMode("online"));


    // 5. SMOOTH SCROLL PARA ENLACES INTERNOS (e.g. #inscripcion)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 90;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });


    // 6. FAQ ACCORDION LOGIC
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const accordionItem = header.parentElement;
            const content = accordionItem.querySelector('.accordion-content');
            const chevron = header.querySelector('i');

            // Close other items
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem) {
                    const otherHeader = item.querySelector('.accordion-header');
                    const otherContent = item.querySelector('.accordion-content');
                    const otherChevron = item.querySelector('i');

                    otherHeader?.setAttribute('aria-expanded', 'false');
                    if (otherContent) otherContent.style.maxHeight = null;
                    if (otherChevron) otherChevron.style.transform = 'rotate(0deg)';
                }
            });

            // Toggle active item
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                if (chevron) chevron.style.transform = 'rotate(0deg)';
            } else {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            }
        });
    });


    // 7. SIGUE FIT APP DOWNLOAD MODAL
    const btnSigueFit = document.getElementById('btnSigueFit');
    const downloadModal = document.getElementById('downloadModal');
    const modalClose = document.getElementById('modalClose');

    if (btnSigueFit && downloadModal) {
        btnSigueFit.addEventListener('click', () => {
            downloadModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                downloadModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) {
                downloadModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && downloadModal.classList.contains('active')) {
                downloadModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }


    // 8. TRAINER CAROUSEL MODAL
    const trainerImages = {
        gonza: [
            "assets/trainers/gonza1.webp",
            "assets/trainers/gonza2.webp",
            "assets/trainers/gonza3.webp",
            "assets/space/compressed/IMG_5245.webp",
            "assets/space/compressed/IMG_5465.webp"
        ],
        fran: [
            "assets/trainers/fran1.webp",
            "assets/trainers/fran3.webp",
            "assets/trainers/fran4.webp",
            "assets/trainers/fran5.webp"
        ],
        mora: [
            "assets/trainers/mora1.webp",
            "assets/trainers/mora2.webp",
            "assets/trainers/mora3.webp",
            "assets/trainers/IMG_2221.webp",
            "assets/trainers/IMG_3757.webp",
            "assets/trainers/IMG_3760.webp",
            "assets/trainers/IMG_3771.webp"

        ],
        mauro: [
            "assets/trainers/mauro1.webp",
            "assets/trainers/mauro2.webp",
            "assets/trainers/mauro3.webp"
        ],
        milo: [
            "assets/trainers/milo1.webp",
            "assets/trainers/milo2.webp",
            "assets/trainers/milo3.webp"
        ]
    };

    const carouselModal = document.getElementById('trainerCarouselModal');
    const carouselTrack = document.getElementById('trainerCarouselTrack');
    const carouselDots = document.getElementById('trainerCarouselDots');
    const carouselClose = document.getElementById('trainerCarouselClose');
    const carouselPrev = document.getElementById('trainerCarouselPrev');
    const carouselNext = document.getElementById('trainerCarouselNext');
    const carouselViewport = document.getElementById('trainerCarouselViewport');

    let currentSlide = 0;
    let totalSlides = 0;
    let isTransitioning = false;

    // Swipe support variables
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let isDragging = false;

    function openCarousel(trainerKey) {
        const images = trainerImages[trainerKey];
        if (!images || images.length === 0) return;

        totalSlides = images.length;
        currentSlide = 0;

        // Build slides: [lastClone, ...originals, firstClone] for infinite loop
        carouselTrack.innerHTML = '';
        // Clone of last slide (prepended)
        const lastClone = createSlide(images[images.length - 1]);
        lastClone.setAttribute('aria-hidden', 'true');
        carouselTrack.appendChild(lastClone);
        // Original slides
        images.forEach(src => {
            carouselTrack.appendChild(createSlide(src));
        });
        // Clone of first slide (appended)
        const firstClone = createSlide(images[0]);
        firstClone.setAttribute('aria-hidden', 'true');
        carouselTrack.appendChild(firstClone);

        // Build dots
        carouselDots.innerHTML = '';
        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'trainer-carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Imagen ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            carouselDots.appendChild(dot);
        });

        // Position track (offset by 1 because of prepended clone)
        carouselTrack.classList.add('no-transition');
        setTrackPosition(1);
        // Force reflow then enable transition
        void carouselTrack.offsetHeight;
        carouselTrack.classList.remove('no-transition');

        // Open modal
        carouselModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function createSlide(src) {
        const slide = document.createElement('div');
        slide.className = 'trainer-carousel-slide';
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Foto del entrenador';
        img.draggable = false;
        slide.appendChild(img);
        return slide;
    }

    function setTrackPosition(index) {
        carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    }

    function updateDots() {
        const dots = carouselDots.querySelectorAll('.trainer-carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        if (isTransitioning) return;
        currentSlide = index;
        isTransitioning = true;
        setTrackPosition(currentSlide + 1); // +1 for prepended clone
        updateDots();
    }

    function nextSlide() {
        if (isTransitioning) return;
        currentSlide++;
        isTransitioning = true;
        setTrackPosition(currentSlide + 1);
        updateDots();
    }

    function prevSlide() {
        if (isTransitioning) return;
        currentSlide--;
        isTransitioning = true;
        setTrackPosition(currentSlide + 1);
        updateDots();
    }

    // Handle infinite loop snap-back after transition ends
    if (carouselTrack) {
        carouselTrack.addEventListener('transitionend', () => {
            isTransitioning = false;
            // If we scrolled past the last real slide → snap to first
            if (currentSlide >= totalSlides) {
                currentSlide = 0;
                carouselTrack.classList.add('no-transition');
                setTrackPosition(1);
                void carouselTrack.offsetHeight;
                carouselTrack.classList.remove('no-transition');
                updateDots();
            }
            // If we scrolled before the first real slide → snap to last
            if (currentSlide < 0) {
                currentSlide = totalSlides - 1;
                carouselTrack.classList.add('no-transition');
                setTrackPosition(totalSlides);
                void carouselTrack.offsetHeight;
                carouselTrack.classList.remove('no-transition');
                updateDots();
            }
        });
    }

    function closeCarousel() {
        carouselModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners — arrows
    carouselPrev?.addEventListener('click', prevSlide);
    carouselNext?.addEventListener('click', nextSlide);

    // Event listener — close button
    carouselClose?.addEventListener('click', closeCarousel);

    // Event listener — click outside (on overlay)
    carouselModal?.addEventListener('click', (e) => {
        if (e.target === carouselModal) {
            closeCarousel();
        }
    });

    // Event listener — Escape key
    window.addEventListener('keydown', (e) => {
        if (!carouselModal || !carouselModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeCarousel();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch / Swipe support
    carouselViewport?.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        isDragging = true;
    }, { passive: true });

    carouselViewport?.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - e.changedTouches[0].screenY);

        // Only swipe if horizontal movement > 50px and more horizontal than vertical
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > diffY) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }, { passive: true });

    // Attach click to trainer cards (except Flor who has no data-trainer)
    const trainerCards = document.querySelectorAll('.team-card[data-trainer]');
    trainerCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't trigger carousel when clicking social links
            if (e.target.closest('.member-socials')) return;
            const trainerKey = card.getAttribute('data-trainer');
            openCarousel(trainerKey);
        });
    });

});
// === MÚSICA ===
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");

let isPlaying = false;

bgMusic.volume = 0.5;
bgMusic.loop = true;

// Cambia SOLO el ícono
function updateMusicButton() {
    if (isPlaying) {
        musicIcon.classList.remove("fa-circle-play");
        musicIcon.classList.add("fa-circle-pause");
        musicBtn.setAttribute("aria-label", "Pausar música");
    } else {
        musicIcon.classList.remove("fa-circle-pause");
        musicIcon.classList.add("fa-circle-play");
        musicBtn.setAttribute("aria-label", "Reproducir música");
    }
}

// Intenta reproducir automáticamente
function startMusic() {
    bgMusic.play()
        .then(() => {
            isPlaying = true;
            updateMusicButton();
        })
        .catch(() => {
            // Si el navegador bloquea el autoplay,
            // se reproduce en el primer clic.
            document.addEventListener("click", () => {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    updateMusicButton();
                });
            }, { once: true });
        });
}

// Botón Play / Pause
musicBtn.addEventListener("click", () => {
    if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
    } else {
        bgMusic.play();
        isPlaying = true;
    }

    updateMusicButton();
});

// Iniciar al cargar la página
window.addEventListener("load", startMusic);