// ====================== HAMBURGER MENU + RESET + ТЕМА ======================

const hamburgerBtn = document.getElementById('hamburgerBtn');
const menuDropdown = document.getElementById('menuDropdown');
const resetAllBtn = document.getElementById('resetAllBtn');

// Открытие / закрытие меню
hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hamburgerBtn.classList.toggle('active');
    menuDropdown.classList.toggle('active');
});

// Закрытие меню при клике вне области
document.addEventListener('click', (e) => {
    if (!e.target.closest('.hamburger-menu')) {
        hamburgerBtn.classList.remove('active');
        menuDropdown.classList.remove('active');
    }
});

// ====================== ОБНУЛЕНИЕ ПРОГРЕССА ======================
resetAllBtn.addEventListener('click', () => {
    if (!confirm('⚠️ Вы уверены, что хотите обнулить ВЕСЬ прогресс чтения?\n\nВсе отметки "Прочитано" будут сняты.')) {
        return;
    }

    if (!confirm('Это последнее подтверждение.\n\nОбнулить абсолютно всё?')) {
        return;
    }

    resetAllProgress();
});

function resetAllProgress() {
    // Очищаем хранилище
    localStorage.removeItem('readBooks');

    // Снимаем все визуальные отметки
    document.querySelectorAll('.read-btn').forEach(button => {
        markAsRead(button, false);
    });

    document.querySelectorAll('li.read').forEach(item => {
        item.classList.remove('read');
    });

    // Обновляем счётчик в шапке
    updateReadingStats();

    // Закрываем меню
    hamburgerBtn.classList.remove('active');
    menuDropdown.classList.remove('active');

    // Уведомление
    setTimeout(() => {
        alert('✅ Все данные успешно обнулены!');
    }, 150);
}

// ====================== ПЕРЕКЛЮЧЕНИЕ ТЕМЫ ======================
// Используем уже существующую функцию initThemeToggle(), 
// но добавляем поддержку для кнопки в меню (если она отличается)

const themeToggleInMenu = document.getElementById('themeToggle');

if (themeToggleInMenu) {
    // Если в меню используется отдельная кнопка с id="themeToggle"
    themeToggleInMenu.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Обновляем иконку кнопки
        themeToggleInMenu.innerHTML = newTheme === 'dark' 
            ? '☀️ Светлая тема' 
            : '🌙 Тёмная тема';
    });

    // Устанавливаем начальное состояние кнопки
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    themeToggleInMenu.innerHTML = savedTheme === 'dark' 
        ? '☀️ Светлая тема' 
        : '🌙 Тёмная тема';
}

// Инициализация темы через уже существующую функцию
initThemeToggle();

console.log('📚 Детская библиотека загружена успешно с исправленным меню!');
