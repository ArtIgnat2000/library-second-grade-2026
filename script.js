// Детская библиотека — Гамбургер-меню + Сброс статистики
document.addEventListener('DOMContentLoaded', function() {
    // --- Элементы меню и оверлея ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuOverlay = document.getElementById('menuOverlay');

    // --- Функции управления меню ---
    function openMenu() {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('visible');
        hamburgerBtn.classList.add('open');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('visible');
        hamburgerBtn.classList.remove('open');
        document.body.style.overflow = '';
    }

    function toggleMenu() {
        if (sideMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Вешаем обработчики для кнопок меню
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', toggleMenu);
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // Закрывать меню по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('open')) {
            closeMenu();
        }
    });

    // --- Переключение темы (светлая/тёмная) ---
    // Функция для установки темы
    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            // Обновляем текст на кнопке в меню (если есть)
            const themeTextSpan = document.querySelector('.theme-text');
            if (themeTextSpan) themeTextSpan.textContent = 'Тёмная тема';
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            const themeTextSpan = document.querySelector('.theme-text');
            if (themeTextSpan) themeTextSpan.textContent = 'Светлая тема';
        }
    }

    // Загрузка сохранённой темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setTheme('dark');
    } else {
        setTheme('light'); // по умолчанию светлая
    }

    // Обработчик для кнопки переключения темы в меню
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                setTheme('light');
            } else {
                setTheme('dark');
            }
            closeMenu(); // после переключения темы можно закрыть меню
        });
    }

    // --- Логика счетчика прочитанных книг ---
    let readBooks = JSON.parse(localStorage.getItem('readBooks') || '[]');
    const readButtons = document.querySelectorAll('.read-btn');
    const totalBooksCount = readButtons.length;
    const totalCountSpan = document.getElementById('totalCount');
    if (totalCountSpan) totalCountSpan.textContent = `/ ${totalBooksCount}`;

    function markAsRead(button, isRead) {
        const listItem = button.closest('.book-item');
        if (isRead) {
            button.classList.add('read');
            button.textContent = '✓';
            button.title = 'Снять отметку "Прочитано"';
        } else {
            button.classList.remove('read');
            button.textContent = '📚';
            button.title = 'Отметить как прочитанное';
        }
    }

    function updateReadingStats() {
        const readCount = readBooks.length;
        const readCountSpan = document.getElementById('readCount');
        if (readCountSpan) readCountSpan.textContent = readCount;
    }

    // Инициализация кнопок
    readButtons.forEach(button => {
        const bookTitle = button.getAttribute('data-book');
        if (readBooks.includes(bookTitle)) {
            markAsRead(button, true);
        } else {
            markAsRead(button, false);
        }

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const title = this.getAttribute('data-book');
            const index = readBooks.indexOf(title);
            if (index !== -1) {
                readBooks.splice(index, 1);
                markAsRead(this, false);
            } else {
                readBooks.push(title);
                markAsRead(this, true);
            }
            localStorage.setItem('readBooks', JSON.stringify(readBooks));
            updateReadingStats();
        });
    });

    // --- Функция сброса прочитанных книг ---
    const resetStatsBtn = document.getElementById('resetStatsBtn');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Вы уверены, что хотите сбросить весь прогресс чтения? Это действие необратимо.')) {
                // Очищаем массив с данными
                readBooks = [];
                localStorage.setItem('readBooks', JSON.stringify(readBooks));
                // Обновляем вид всех кнопок
                readButtons.forEach(button => {
                    markAsRead(button, false);
                });
                // Обновляем счётчик на экране
                updateReadingStats();
                // Закрываем меню после сброса
                closeMenu();
            }
        });
    }

    // --- Вспомогательные функции (плавная прокрутка и т.д.) ---
    // Навигация с учётом высоты шапки
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const navElement = document.querySelector('nav');
    function setNavHeight() {
        const h = navElement ? navElement.offsetHeight : 64;
        document.documentElement.style.setProperty('--nav-height', h + 'px');
    }
    setNavHeight();
    window.addEventListener('resize', setNavHeight);
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = navElement ? navElement.offsetHeight : 64;
                const elementPosition = targetSection.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - navHeight - 10,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимация появления секций
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Тактильная обратная связь для мобильных устройств
    const touchElements = document.querySelectorAll('.book-item, nav a');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });

    // Обработка кликов по названиям книг (переход по ссылке)
    const bookLinks = document.querySelectorAll('.book-link');
    bookLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Инициализация статистики при загрузке
    updateReadingStats();
});
