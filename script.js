// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    currentSection: 'home',
    theme: localStorage.getItem('theme') || 'light',
    isMobileMenuOpen: false
};

// ============================================
// THEME MANAGEMENT
// ============================================
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    updateThemeIcon();

    // Add smooth transition animation
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');

    const logo = document.querySelector('.logo-icon');

    if (state.theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        if (logo) logo.src = 'public/icon_white.png';
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        if (logo) logo.src = 'public/icon.png';
    }
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-section');
            navigateToSection(sectionId);

            // Close mobile menu if open
            if (state.isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Handle hash changes (for direct navigation)
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigateToSection(hash);
        }
    });

    // Initialize with current hash or home
    const initialHash = window.location.hash.substring(1) || 'home';
    navigateToSection(initialHash);
}

function navigateToSection(sectionId) {
    // Update active section (Tab behavior)
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        state.currentSection = sectionId;

        // Update active nav link
        updateActiveNavLink(sectionId);

        // Update URL hash without scrolling
        window.history.pushState(null, null, `#${sectionId}`);

        // Reset scroll to top (important for tab feel)
        window.scrollTo(0, 0);
    }
}

function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');

    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (state.isMobileMenuOpen &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const spans = menuToggle.querySelectorAll('span');

    state.isMobileMenuOpen = !state.isMobileMenuOpen;
    sidebar.classList.toggle('active');

    // Animate hamburger menu
    if (state.isMobileMenuOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
    }
}

// ============================================
// RESUME MODAL
// ============================================
function initResumeModal() {
    const viewResumeBtn = document.getElementById('viewResumeBtn');
    const modal = document.getElementById('resumeModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    viewResumeBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards and elements
    const animateElements = document.querySelectorAll(
        '.project-card, .course-card, .skill-category, .stat-card, .contact-method'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// SKILL BARS ANIMATION
// ============================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.style.getPropertyValue('--progress');
                entry.target.style.width = progress;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        bar.style.width = '0';
        observer.observe(bar);
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = 'var(--shadow-md)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                navigateToSection(targetId);
            }
        });
    });
}

// ============================================
// FLOATING CARDS PARALLAX
// ============================================
function initParallax() {
    const floatingCards = document.querySelectorAll('.floating-card');

    window.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 0.02;
            const x = (clientX - centerX) * speed;
            const y = (clientY - centerY) * speed;

            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ============================================
// TYPING EFFECT FOR HERO
// ============================================
function initTypingEffect() {
    const heroDescription = document.querySelector('.hero-description');

    // If description has HTML (bold, icons), use fade-in to preserve formatting
    if (heroDescription.children.length > 0) {
        heroDescription.style.opacity = '0';
        heroDescription.style.animation = 'fadeIn 0.8s ease forwards 0.3s';
        return;
    }

    const text = heroDescription.textContent;
    heroDescription.textContent = '';

    let index = 0;
    const speed = 20; // Increased speed

    function typeWriter() {
        if (index < text.length) {
            heroDescription.textContent += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// ============================================
// INTERSECTION OBSERVER FOR SECTION DETECTION
// ============================================
function initSectionObserver() {
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('active')) {
                const sectionId = entry.target.id;
                updateActiveNavLink(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ============================================
// PERFORMANCE: LAZY LOAD IMAGES
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ============================================
// ACCESSIBILITY: KEYBOARD NAVIGATION
// ============================================
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Alt + number keys to navigate sections
        if (e.altKey) {
            const keyMap = {
                '1': 'home',
                '2': 'about',
                '3': 'projects',
                '4': 'skills',
                '5': 'education',
                '6': 'courses',
                '7': 'contact'
            };

            const section = keyMap[e.key];
            if (section) {
                e.preventDefault();
                navigateToSection(section);
            }
        }

        // T key to toggle theme
        if (e.key === 't' && !e.ctrlKey && !e.altKey) {
            const activeElement = document.activeElement;
            if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
                toggleTheme();
            }
        }
    });
}

// ============================================
// EASTER EGGS & FUN INTERACTIONS
// ============================================
function initEasterEggs() {
    // Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activatePartyMode();
        }
    });
}

function activatePartyMode() {
    // Add rainbow gradient animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        body { animation: rainbow 3s linear infinite !important; }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        style.remove();
    }, 10000);
}

// ============================================
// INITIALIZE APP
// ============================================
function init() {
    // Core functionality
    initTheme();
    initNavigation();
    initMobileMenu();
    initResumeModal();
    initSmoothScroll();
    initHeaderScroll();

    // Animations and effects
    initScrollAnimations();
    animateSkillBars();
    initParallax();
    initTypingEffect();
    initSectionObserver();

    // Performance & Accessibility
    initLazyLoading();
    initKeyboardNavigation();

    // Fun stuff
    initEasterEggs();

    // Event listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    console.log('%c👋 Welcome to my portfolio!', 'font-size: 20px; color: #3b82f6; font-weight: bold;');
    console.log('%cKeyboard shortcuts:', 'font-size: 14px; font-weight: bold;');
    console.log('%c- Alt + 1-7: Navigate sections', 'font-size: 12px;');
    console.log('%c- T: Toggle theme', 'font-size: 12px;');
    console.log('%c- Esc: Close modal', 'font-size: 12px;');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        navigateToSection,
        toggleTheme,
        state
    };
}
