document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Switcher ---
    const themeToggle = document.querySelector('.theme-toggle');
    const setInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-mode' : 'light-mode');
        document.body.classList.add(savedTheme);
        // Ensure the opposite class is not present
        if (savedTheme === 'dark-mode') {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode', !isDarkMode);
        localStorage.setItem('theme', isDarkMode ? 'dark-mode' : 'light-mode');
    });

    // --- Language Switcher ---
    const langButtons = document.querySelectorAll('.language-options button');
    let translations = {};

    async function loadTranslations() {
        try {
            const response = await fetch('translations.json');
            translations = await response.json();
            const savedLang = localStorage.getItem('language') || 'en';
            await translatePage(savedLang); // Ensure translation completes before other actions
        } catch (error) {
            console.error("Could not load translations:", error);
        }
    }

    function translatePage(lang) {
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                // For the typing element, just set the text. The animation logic will handle it.
                el.textContent = translations[lang][key];
            }
        });
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        localStorage.setItem('language', lang);
    }

    langButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = button.dataset.lang;
            translatePage(lang).then(() => {
                 // Re-initialize typing animation with new text if it's visible
                const typingElement = document.querySelector('.typing');
                if (typingElement && typingObserver) {
                    typingObserver.disconnect(); // Stop the old observer
                    initializeTypingAnimation(); // Start a new one
                }
            });
        });
    });

    // --- Projects Data & Generation ---
    const projects = [
        { title: "E-Commerce Platform", description: "A full-featured e-commerce platform built with .NET Core and Angular, including payment gateway integration.", image: "https://via.placeholder.com/400x250/e53935/ffffff?text=E-Commerce", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Inventory Management System", description: "A desktop application using Windows Forms and SQL Server for managing stock, sales, and reporting.", image: "https://via.placeholder.com/400x250/3949ab/ffffff?text=Inventory+System", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Task Management App", description: "A responsive web app developed with Flask and React for organizing team tasks and projects.", image: "https://via.placeholder.com/400x250/43a047/ffffff?text=Task+Manager", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Data Visualization Dashboard", description: "A dashboard for visualizing sales data using Python (Django) on the backend and D3.js on the frontend.", image: "https://via.placeholder.com/400x250/fb8c00/ffffff?text=Data+Dashboard", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Blogging Platform API", description: "A RESTful API built with ASP.NET Web API for a modern blogging platform, featuring JWT authentication.", image: "https://via.placeholder.com/400x250/6d4c41/ffffff?text=Blog+API", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Recipe Finder App", description: "A mobile-friendly recipe application using an external API, built with Vanilla JavaScript and a clean UI.", image: "https://via.placeholder.com/400x250/8e24aa/ffffff?text=Recipe+App", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "University Portal", description: "A database-driven portal for a university, designed with complex relational schemas and managed with SQL Server.", image: "https://via.placeholder.com/400x250/00897b/ffffff?text=University+Portal", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Weather Forecast App", description: "A clean and simple weather application that fetches data from a third-party API based on user's location.", image: "https://via.placeholder.com/400x250/546e7a/ffffff?text=Weather+App", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Portfolio Website Template", description: "The very portfolio you are looking at, built with HTML, CSS, and vanilla JavaScript.", image: "https://via.placeholder.com/400x250/d81b60/ffffff?text=Portfolio", codeUrl: "#", videoUrl: "#", liveUrl: "#" },
        { title: "Chat Application", description: "A real-time chat application using SignalR on the .NET backend for instant messaging.", image: "https://via.placeholder.com/400x250/039be5/ffffff?text=Chat+App", codeUrl: "#", videoUrl: "#", liveUrl: "#" }
    ];

    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="project-card-info">
                    <h3>${project.title}</h3>
                </div>
            `;
            card.addEventListener('click', () => openModal(project));
            projectsGrid.appendChild(card);
        });
    }

    // --- Modal Logic ---
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-button');

    function openModal(project) {
        document.getElementById('modal-img').src = project.image;
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;
        document.getElementById('modal-code-btn').href = project.codeUrl;
        document.getElementById('modal-video-btn').href = project.videoUrl;
        document.getElementById('modal-live-btn').href = project.liveUrl;
        modal.style.display = 'block';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- Particles.js Config (IMPROVED)---
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#e53935" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": false },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#e53935", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 4, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "grab" }, // Changed from "repulse"
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, // Settings for the new "grab" mode
                    "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 },
                    "repulse": { "distance": 200, "duration": 0.4 },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }
    
    // --- Typing Effect (FIXED) ---
    let typingObserver;
    function initializeTypingAnimation() {
        const typingElement = document.querySelector('.typing');
        if (!typingElement) return;

        typingObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Get the text directly from our reliable translations object
                const lang = document.documentElement.lang || 'en';
                const key = typingElement.getAttribute('data-translate');
                const textToType = translations[lang] ? translations[lang][key] : typingElement.textContent;

                if (textToType) {
                    typingElement.textContent = ''; // Clear the element before typing
                    let i = 0;
                    function typeWriter() {
                        if (i < textToType.length) {
                            typingElement.textContent += textToType.charAt(i);
                            i++;
                            setTimeout(typeWriter, 80);
                        }
                    }
                    typeWriter();
                }
                typingObserver.disconnect(); // Animate only once
            }
        }, { threshold: 0.8 }); // Start animation when 80% of the element is visible

        typingObserver.observe(typingElement);
    }

    // --- Initial Load ---
    async function init() {
        setInitialTheme();
        await loadTranslations();
        initializeTypingAnimation();
    }

    init();
});