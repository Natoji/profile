// script.js

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        navLinks.classList.remove('active'); // Đóng menu mobile sau khi click
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Tùy chọn: nếu muốn hiệu ứng lặp lại khi cuộn lên/xuống
            // entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Logic Dark Mode
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;
// Lấy icon mặt trăng từ HTML hoặc tạo mới nếu nó chưa có (đảm bảo lúc nào cũng có một icon)
let moonIcon = darkModeToggle.querySelector('.fas.fa-moon');
if (!moonIcon) { // Trường hợp nếu icon đã được thay thế trước đó và trang được tải lại
    moonIcon = document.createElement('i');
    moonIcon.classList.add('fas', 'fa-moon');
}
const sunIcon = document.createElement('i'); // Tạo icon mặt trời
sunIcon.classList.add('fas', 'fa-sun'); // Thêm class Font Awesome

// Hàm để áp dụng hoặc gỡ bỏ dark mode
function applyDarkMode(isDarkMode) {
    if (isDarkMode) {
        body.classList.add('dark-mode');
        // Thay đổi icon: nếu đang là mặt trăng thì đổi thành mặt trời
        if (darkModeToggle.contains(moonIcon)) { // Chỉ thay thế nếu icon mặt trăng đang hiển thị
            moonIcon.replaceWith(sunIcon);
        } else if (!darkModeToggle.contains(sunIcon)) { // Nếu không có icon nào, thêm mặt trời
            darkModeToggle.appendChild(sunIcon);
        }
        localStorage.setItem('dark-mode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        // Thay đổi icon: nếu đang là mặt trời thì đổi thành mặt trăng
        if (darkModeToggle.contains(sunIcon)) { // Chỉ thay thế nếu icon mặt trời đang hiển thị
            sunIcon.replaceWith(moonIcon);
        } else if (!darkModeToggle.contains(moonIcon)) { // Nếu không có icon nào, thêm mặt trăng
            darkModeToggle.appendChild(moonIcon);
        }
        localStorage.setItem('dark-mode', 'disabled');
    }
}

// Kiểm tra trạng thái Dark Mode từ localStorage khi tải trang
const savedDarkModeState = localStorage.getItem('dark-mode');
if (savedDarkModeState === 'enabled') {
    applyDarkMode(true);
} else {
    // Đảm bảo icon ban đầu là mặt trăng nếu không có dark mode hoặc disabled
    // Chỉ thêm vào nếu chưa có icon nào (trường hợp load trang lần đầu)
    if (!darkModeToggle.contains(moonIcon) && !darkModeToggle.contains(sunIcon)) {
         darkModeToggle.appendChild(moonIcon);
    } else if (darkModeToggle.contains(sunIcon) && savedDarkModeState === 'disabled') {
        // Nếu đã lưu disabled nhưng lại hiển thị sunIcon (do lỗi nào đó), sửa lại
        sunIcon.replaceWith(moonIcon);
    }
}


// Lắng nghe sự kiện click trên nút chuyển đổi
darkModeToggle.addEventListener('click', () => {
    // Chuyển đổi trạng thái hiện tại
    const isCurrentlyDarkMode = body.classList.contains('dark-mode');
    applyDarkMode(!isCurrentlyDarkMode); // Đảo ngược trạng thái
});


// Form submission (đã tích hợp Formspree)
// Đảm bảo nút gửi có id="submit-button" trong HTML
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Ngăn chặn hành vi gửi form mặc định (tải lại trang)

    const form = e.target; // Lấy ra phần tử form
    const formData = new FormData(form); // Lấy dữ liệu từ form

    // Thêm các dòng này để xử lý trạng thái nút "Gửi tin nhắn" khi đang gửi
    const submitButton = document.getElementById('submit-button');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true; // Vô hiệu hóa nút khi đang gửi
    submitButton.textContent = 'Đang gửi...'; // Thay đổi text nút

    try {
        // Gửi yêu cầu POST đến Formspree endpoint
        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: {
                'Accept': 'application/json' // Yêu cầu Formspree phản hồi dưới dạng JSON
            }
        });

        if (response.ok) { // Nếu yêu cầu thành công (status 2xx)
            alert('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.');
            form.reset(); // Đặt lại form sau khi gửi thành công
        } else {
            // Nếu có lỗi từ Formspree, đọc thông báo lỗi
            const data = await response.json();
            if (Object.hasOwnProperty.call(data, 'errors')) {
                alert('Lỗi gửi tin nhắn: ' + data["errors"].map(error => error["message"]).join(", "));
            } else {
                alert('Đã có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.');
            }
        }
    } catch (error) {
        console.error('Lỗi khi gửi form:', error);
        alert('Không thể kết nối để gửi tin nhắn. Vui lòng kiểm tra kết nối internet của bạn.');
    } finally {
        // Luôn khôi phục trạng thái nút dù thành công hay thất bại
        // Gọi lại hàm kiểm tra trạng thái form để đảm bảo nút có đúng trạng thái
        // sau khi reset form hoặc nếu có lỗi và các trường vẫn rỗng.
        submitButton.textContent = originalButtonText; // Khôi phục text gốc
        checkFormValidity(); // Gọi hàm này để đặt đúng trạng thái disabled/enabled
    }
});


// Logic kiểm tra và bật/tắt nút "Gửi tin nhắn"
// Lấy các phần tử form
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitButtonConditional = document.getElementById('submit-button'); // Nút gửi tin nhắn (đã có id)

// Hàm kiểm tra xem tất cả các trường có được điền đầy đủ và hợp lệ không
function checkFormValidity() {
    const isNameFilled = nameInput.value.trim() !== '';
    const isEmailFilled = emailInput.value.trim() !== '';
    const isMessageFilled = messageInput.value.trim() !== '';

    // Sử dụng checkValidity() của input type="email" để kiểm tra định dạng email
    const isEmailFormatValid = emailInput.checkValidity();

    // Nút sẽ được bật nếu TẤT CẢ các điều kiện sau đều đúng:
    // 1. Tên đã được điền
    // 2. Email đã được điền
    // 3. Tin nhắn đã được điền
    // 4. Định dạng email hợp lệ (do trình duyệt kiểm tra)
    if (isNameFilled && isEmailFilled && isMessageFilled && isEmailFormatValid) {
        submitButtonConditional.disabled = false; // Bật nút
    } else {
        submitButtonConditional.disabled = true; // Vô hiệu hóa nút
    }
}

// Gán sự kiện 'input' cho mỗi trường nhập liệu để kiểm tra ngay lập tức khi người dùng gõ
nameInput.addEventListener('input', checkFormValidity);
emailInput.addEventListener('input', checkFormValidity);
messageInput.addEventListener('input', checkFormValidity);

// Gọi hàm kiểm tra lần đầu khi trang tải để đặt trạng thái ban đầu của nút
// Điều này quan trọng vì nút ban đầu đã được đặt disabled trong HTML
checkFormValidity();