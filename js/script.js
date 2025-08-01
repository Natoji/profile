// script.js

// ===== DARK MODE =====
const darkToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
const moonIcon = document.createElement('i');
moonIcon.classList.add('fas', 'fa-moon');
const sunIcon = document.createElement('i');
sunIcon.classList.add('fas', 'fa-sun');

// Đảm bảo nút có icon đúng khi load trang
function setDarkIcon(isDark) {
    darkToggle.innerHTML = '';
    darkToggle.appendChild(isDark ? sunIcon : moonIcon);
}
function applyDarkMode(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        setDarkIcon(true);
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        setDarkIcon(false);
        localStorage.setItem('dark-mode', 'disabled');
    }
}
const savedDark = localStorage.getItem('dark-mode') === 'enabled';
applyDarkMode(savedDark);

darkToggle.onclick = () => applyDarkMode(!body.classList.contains('dark-mode'));

// ===== RESPONSIVE MENU =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.onclick = () => navLinks.classList.toggle('active');

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navLinks.classList.remove('active');
        }
    });
});

// ===== SCROLL ANIMATION =====
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    document.getElementById('main-header').classList.toggle('sticky', window.scrollY > 50);
    if (backToTop) backToTop.style.display = window.scrollY > 200 ? 'block' : 'none';
});
if (backToTop) backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// ===== CONTACT FORM VALIDATION & SUBMIT =====
const form = document.querySelector('.contact-form');
if (form) {
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');
    const submitBtn = form.querySelector('#submit-button');

    function checkFormValidity() {
        const isValid = nameInput.value.trim() && emailInput.value.trim() && messageInput.value.trim() && /\S+@\S+\.\S+/.test(emailInput.value);
        submitBtn.disabled = !isValid;
    }
    [nameInput, emailInput, messageInput].forEach(input => input.addEventListener('input', checkFormValidity));
    checkFormValidity();

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        submitBtn.textContent = "Đang gửi...";
        submitBtn.disabled = true;
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
                form.reset();
            } else {
                const data = await response.json();
                alert('Lỗi gửi tin nhắn: ' + (data.errors ? data.errors.map(e => e.message).join(', ') : 'Vui lòng thử lại.'));
            }
        } catch {
            alert('Không thể gửi tin nhắn. Vui lòng kiểm tra kết nối internet.');
        }
        submitBtn.textContent = "Gửi tin nhắn";
        checkFormValidity();
    });
}