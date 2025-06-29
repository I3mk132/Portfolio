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
        { 
            title: "Library System",
            description: "This project is a full-stack desktop application for library management, built with the .NET Framework, Windows Forms, ADO.NET, and SQL Server. It features user authentication, role-based access control, CRUD operations for various entities (students, employees, books, borrows, departments), barcode scanning for book information via an ISBN API, and employee task management. The system follows a 3-tier architecture for modularity and maintainability.",
            image: "files/iconBig.png", 
            codeUrl: "https://github.com/I3mk132/Library_System", 
            videoUrl: "https://youtu.be/0r-tLO0CeWI?si=qyQ5HAvtT58--rpT", 
            liveUrl: "https://drive.google.com/drive/folders/1I3ow0r2UVJgDYdAChMgbD66SKLENjTXJ?usp=sharing" 
        },
        { 
            title: "Password Manager", 
            description: "A simple yet functional desktop Password Manager built using WinForms, ADO.NET, and SQL Server. This application helps users store, retrieve, and manage their passwords securely. It includes a built-in password generator and supports user Sign Up / Login with password hashing for security.", 
            image: "files/PasswordManagerIcon.png", 
            codeUrl: "https://github.com/I3mk132/PasswordManagerApp", 
            videoUrl: "https://youtu.be/axG-8PUiGKM", 
            liveUrl: "https://drive.google.com/drive/folders/1DOtKUJ034d809GMWZiePg4cNt8f6_gWN?usp=sharing" 
        },
        { 
            title: "Tic Tac Toe Game", 
            description: "The \"XOproject\" is a Tic-Tac-Toe game with a graphical user interface. It allows two players to place \"X\" or \"O\" marks on a 3x3 board, checks for win conditions and draws, and displays the current player and game status. Users can restart the game or exit the application.", 
            image: "files/TicTacToe.png", 
            codeUrl: "https://github.com/I3mk132/TicTacToe", 
            videoUrl: "https://youtu.be/R_axNNOZ6uA", 
            liveUrl: "https://drive.google.com/drive/folders/1v643iPWOr-0JWvtSYZjgshSTOP9yZnsY?usp=sharing" 
        },
        { 
            title: "Pizza cashier project", 
            description: "This Windows Forms application simulates a pizza ordering system. Users can select pizza size (Small, Medium, Large), crust type (Thin, Thick), and various toppings (Extra Cheese, Mushrooms, Tomatoes, Onions, Olives, Green Papers). It also allows choosing between \"Eat In\" or \"Take Out\". The app dynamically calculates the total price based on selections. Orders can be confirmed, and the form can be reset for new orders.", 
            image: "files/pizza.png", 
            codeUrl: "https://github.com/I3mk132/PizzaCashierProject", 
            videoUrl: "https://youtu.be/0O_cFqAH22o", 
            liveUrl: "https://drive.google.com/drive/folders/1hDtiRR47J6tRsO1mgcfgfHpwil59ewal?usp=sharing" 
        },
        { 
            title: "Simple calculator project", 
            description: "This project is a Windows Forms application written in C# that functions as a calculator with basic arithmetic operations (addition, subtraction, multiplication, and division). It also has a unit converter feature implied by its name \"CalculatorWithUnitConverter\" and the design of its form, though the provided code snippets mainly show the calculator functionality.", 
            image: "files/Calculator.png", 
            codeUrl: "https://github.com/I3mk132/Calculator", 
            videoUrl: "https://youtu.be/tssI8oMQ3EE", 
            liveUrl: "https://drive.google.com/drive/folders/1psAGM_JKzEeSuGMf1oH_ur10noQD1o-t?usp=sharing"
        },
        { 
            title: "Rock Paper Scissors Project", 
            description: "This is a command-line Rock-Paper-Scissors game in C++. You play against the computer, and the winner is decided after a set number of rounds.", 
            image: "files/rock-paper-scissors.png", 
            codeUrl: "https://github.com/I3mk132/RockPaperScissersV1.0", 
            videoUrl: "https://youtu.be/6nWdn3yAmvc", 
            liveUrl: "https://drive.google.com/drive/folders/1Lan0Lcmffb7XATYnnTE6zAEH-LMBa_KG?usp=sharing" 
        },
        { 
            title: "Timed Math Game Project", 
            description: "This is a command-line math quiz game written in C++. You can customize the number of questions, difficulty, and type of math problems. After you answer the questions, it tells you your score and if you passed.", 
            image: "files/math.png", 
            codeUrl: "https://github.com/I3mk132/MathConsoleGame", 
            videoUrl: "https://youtu.be/Qh2gcT2nstY", 
            liveUrl: "https://drive.google.com/drive/folders/1ADe13ul-fIHpMu_mz_rnoXjD5DI15vmP?usp=sharing" 
        },
        { 
            title: "Bank System Project", 
            description: "Console Bank Project DescriptionThis C++ project is a console-based banking application that simulates a real-world banking environment through a command-line interface. It's built around several key functionalities:Client and Account ManagementThe system provides full CRUD (Create, Read, Update, Delete) operations for bank clients. Users can add new clients, view a list of all clients, update their information, find specific clients, and delete them from the system. All client data, including personal details and account balances, is stored in a Clients.txt file.Transaction HandlingIt supports essential banking transactions such as depositing and withdrawing money from accounts. It also features a funds transfer mechanism between two accounts and maintains a detailed log of all transfer activities for auditing in a TransferLog.txt file.User and Permissions SystemThe application includes a multi-user system where administrators can manage users. Each user has specific permissions that restrict their access to certain functionalities, such as managing clients or performing transactions. This is defined in the clsUser class. Login attempts are also recorded in Log.txt.Currency ExchangeA dedicated module handles currency-related operations. It can list various currencies, find currencies by code or country, update exchange rates, and includes a calculator to convert amounts between different currencies. The currency data is stored in Currencies.txt.", 
            image: "files/bank.png", 
            codeUrl: "https://github.com/I3mk132/ConsoleBankProject", 
            videoUrl: "https://youtu.be/j9SWfiAekO8", 
            liveUrl: "https://drive.google.com/drive/folders/1iEavGdN-cgsEaYxb2ZyNYtDn2oPpin4o?usp=sharing" 
        },
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