/* ==========================================
   DEVELOPER PORTFOLIO - JAVASCRIPT CONTROLLERS
   Author: Kamalesh S
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Theme Switcher Logic
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check localStorage or system preferences for theme safely
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) {
        console.warn('localStorage is not available:', e);
    }
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    const initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');
    htmlElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            console.warn('localStorage set failed:', e);
        }
        updateThemeIcon(newTheme);
        
        // Re-initialize particles to update color palette
        initParticles();
    });

    function updateThemeIcon(theme) {
        // Icon transforms are handled by CSS based on the data-theme attribute
    }

    // ==========================================
    // 2. Navigation & Mobile Menu
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollProgress = document.getElementById('scroll-progress-bar');

    // Scroll handlers
    window.addEventListener('scroll', () => {
        // Add transparent/blur backdrop
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update progress bar width
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = (winScroll / height) * 100;
        scrollProgress.style.width = scrolledPercentage + '%';
    });

    // Mobile Hamburger Toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });

    // Close mobile menu when items are clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
        });
    });

    // ==========================================
    // 3. Typewriter Animation
    // ==========================================
    const roleText = document.getElementById('role-text');
    const roles = ["Freelance Web Designer", "Video Editor", "Poster Designer"];
    let currentRoleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            // Delete characters
            roleText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            // Type characters
            roleText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        // Switch states
        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at the end of word
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typewriter
    setTimeout(typeEffect, 1000);

    // ==========================================
    // 4. Interactive Canvas Particle Background
    // ==========================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    const maxParticles = 65;
    const connectionDistance = 115;
    
    // Track mouse & update cursor glow
    const cursorGlow = document.getElementById('cursor-glow');
    let mouse = {
        x: null,
        y: null,
        radius: 130
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        
        // Move spotlight to cursor position
        cursorGlow.style.opacity = 'var(--cursor-glow-opacity)';
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    // Resize canvas
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    // Setup canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check canvas borders
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Mouse interact (push away slightly)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 2;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 2;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 2;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 2;
                    }
                }
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const isDarkTheme = htmlElement.getAttribute('data-theme') === 'dark';
        
        // Define colors based on theme
        const colors = isDarkTheme 
            ? ['rgba(0, 242, 254, 0.45)', 'rgba(139, 92, 246, 0.45)', 'rgba(236, 72, 153, 0.35)']
            : ['rgba(2, 132, 199, 0.35)', 'rgba(124, 58, 237, 0.35)', 'rgba(219, 39, 119, 0.25)'];

        for (let i = 0; i < maxParticles; i++) {
            let size = (Math.random() * 2.5) + 1.2;
            let x = (Math.random() * ((innerWidth - size * 2) - size * 2)) + size * 2;
            let y = (Math.random() * ((innerHeight - size * 2) - size * 2)) + size * 2;
            let directionX = (Math.random() * 0.8) - 0.4;
            let directionY = (Math.random() * 0.8) - 0.4;
            let color = colors[Math.floor(Math.random() * colors.length)];

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connectParticles() {
        const isDarkTheme = htmlElement.getAttribute('data-theme') === 'dark';
        const strokeColor = isDarkTheme ? 'rgba(0, 242, 254, ' : 'rgba(2, 132, 199, ';

        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    let opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = strokeColor + (opacity * 0.12) + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    // Initialize & Start Particles
    initParticles();
    animateParticles();

    // ==========================================
    // 5. Projects Filter Logic
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-wrapper');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from buttons
            filterButtons.forEach(button => button.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide-project');
                } else {
                    card.classList.add('hide-project');
                }
            });
        });
    });

    // ==========================================
    // 6. Contact Form Submission & Validation
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const submitStatus = document.getElementById('submit-status');
    const statusIcon = document.getElementById('submit-status-icon');
    const statusMsg = document.getElementById('submit-status-msg');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Retrieve field values
        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;
        const subject = document.getElementById('form-subject').value;
        const message = document.getElementById('form-message').value;

        // Perform basic validations
        if (!name || !email || !subject || !message) {
            showPopup('Please fill in all fields.', 'error');
            return;
        }

        // Setup WhatsApp link trigger
        const whatsappText = `Hello Kamalesh,%0A%0AI saw your portfolio and wanted to get in touch!%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Subject:* ${encodeURIComponent(subject)}%0A*Message:* ${encodeURIComponent(message)}`;
        const whatsappLink = `https://wa.me/917397616139?text=${whatsappText}`;
        
        // Open WhatsApp web or app
        window.open(whatsappLink, '_blank');
        
        // Show success popup
        showPopup('WhatsApp opened! Thank you.', 'success');
        
        // Reset the form
        contactForm.reset();
    });

    function showPopup(message, type) {
        statusMsg.textContent = message;
        submitStatus.className = 'submit-status-popup'; // Reset class list
        
        if (type === 'success') {
            submitStatus.classList.add('success');
            statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        } else {
            submitStatus.classList.add('error');
            statusIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        }

        // Animation duration
        setTimeout(() => {
            submitStatus.classList.remove('success', 'error');
        }, 5000);
    }

    // ==========================================
    // 7. Scroll Reveal Animations (Intersection Observer)
    // ==========================================
    const scrollElements = document.querySelectorAll('.scroll-animate');

    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop observing once animated in
                observer.unobserve(entry.target);
            }
        });
    }, scrollObserverOptions);

    scrollElements.forEach(el => {
        scrollObserver.observe(el);
    });
});
