// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navMenu = document.getElementById('navMenu');

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = mobileMenuBtn.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Active nav link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        
        if (sectionTop <= headerHeight + 100 && sectionTop + sectionHeight > headerHeight + 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 4px 20px -2px rgba(51, 65, 85, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 4px 20px -2px rgba(51, 65, 85, 0.1)';
    }
});

// Card hover animations
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.card, .section-header, .content-card, .content-text');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
});

// Counter animation for numbers
function animateCounters() {
    const counters = document.querySelectorAll('.card-value, .highlight-value, .stat-number');
    
    counters.forEach(counter => {
        const originalText = counter.textContent;
        let valueToParse = originalText.replace(/[^\d,.]/g, ''); // Keep only digits, commas, dots

        let numericValue;
        // Determine if the number uses comma as decimal separator (pt-BR format)
        if (valueToParse.includes(',')) {
            // If it contains a comma, assume it's the decimal separator and dots are thousands separators
            valueToParse = valueToParse.replace(/\./g, ''); // Remove thousands separators (dots)
            valueToParse = valueToParse.replace(/,/g, '.'); // Replace decimal comma with dot
            numericValue = parseFloat(valueToParse);
        } else if (valueToParse.includes('.')) {
            // If it contains a dot but no comma, assume dot is a thousands separator (e.g., "39.053" meaning 39053)
            valueToParse = valueToParse.replace(/\./g, ''); // Remove thousands separators (dots)
            numericValue = parseFloat(valueToParse);
        } else {
            // No dots or commas, just digits (e.g., "35079")
            numericValue = parseFloat(valueToParse);
        }
        const target = numericValue;
        if (target > 0) {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                let formattedValue;
                if (originalText.includes(',')) {
                    // If the original text had a comma, it likely had decimal places.
                    // Try to infer the number of decimal places from the original text.
                    const decimalPart = originalText.split(',')[1];
                    const numDecimals = decimalPart ? decimalPart.replace(/[^0-9]/g, '').length : 0;
                    formattedValue = current.toLocaleString('pt-BR', {
                        minimumFractionDigits: numDecimals,
                        maximumFractionDigits: numDecimals
                    });
                } else if (originalText.includes('km²') || originalText.includes('pessoas') || originalText.includes('habitantes') || originalText.includes('estudantes')) {
                    // For values that are typically integers (like population, area in km²), ensure no decimal places.
                    formattedValue = Math.round(current).toLocaleString('pt-BR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    });
                } else {
                    // Default formatting for other numbers, allowing up to 3 decimal places if needed.
                    formattedValue = current.toLocaleString('pt-BR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 3
                    });
                }
                
                if (originalText.includes('R$')) {
                    counter.textContent = `R$ ${formattedValue}`;
                } else if (originalText.includes('%')) {
                    counter.textContent = `${formattedValue}%`;
                } else if (originalText.includes('km²')) {
                    counter.textContent = `${formattedValue} km²`;
                } else {
                    counter.textContent = formattedValue;
                }
            }, 20);
        }
    });
}

// Trigger counter animation when sections come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        counterObserver.observe(section);
    });
});

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background img');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
});

// Button ripple effect
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Interactive Map Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if the map container exists on the page
    if (document.getElementById('map')) {
        // Coordinates for Pimenta Bueno, RO
        const pimentaBuenoCoords = [-11.673, -61.702];

        // Initialize the map and set its view
        const map = L.map('map').setView(pimentaBuenoCoords, 13);

        // Add a tile layer to the map (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a marker for Pimenta Bueno
        L.marker(pimentaBuenoCoords).addTo(map)
            .bindPopup('<b>Pimenta Bueno, RO</b><br>O coração da Amazônia Rondoniense.')
            .openPopup();
    }
});

// Gallery Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("galleryModal");
    if (!modal) return;

    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption");
    const galleryImages = document.querySelectorAll(".photo-grid img");
    let currentIndex;

    galleryImages.forEach(img => {
        // Add click listener to the parent container (.photo-item)
        img.parentElement.onclick = function(){
            modal.style.display = "block";
            modalImg.src = img.src;
            captionText.innerHTML = img.alt;
            currentIndex = parseInt(img.dataset.index);
        }
    });

    const closeModal = () => {
        modal.style.display = "none";
    }

    const span = document.getElementsByClassName("close-modal")[0];
    if (span) {
        span.onclick = closeModal;
    }

    const showImage = (index) => {
        if (index >= galleryImages.length) { 
            currentIndex = 0; 
        } else if (index < 0) { 
            currentIndex = galleryImages.length - 1; 
        } else {
            currentIndex = index;
        }
        const newImg = galleryImages[currentIndex];
        modalImg.src = newImg.src;
        captionText.innerHTML = newImg.alt;
    }

    const prev = document.querySelector(".prev-modal");
    if (prev) {
        prev.onclick = () => showImage(currentIndex - 1);
    }

    const next = document.querySelector(".next-modal");
    if (next) {
        next.onclick = () => showImage(currentIndex + 1);
    }
    
    // Close with Escape key and navigate with arrows
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "block") {
            if (e.key === "Escape") {
                closeModal();
            } else if (e.key === "ArrowLeft") {
                showImage(currentIndex - 1);
            } else if (e.key === "ArrowRight") {
                showImage(currentIndex + 1);
            }
        }
    });
});