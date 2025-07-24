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

// Form submission (đã tích hợp Formspree)
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Ngăn chặn hành vi gửi form mặc định (tải lại trang)

    const form = e.target; // Lấy ra phần tử form
    const formData = new FormData(form); // Lấy dữ liệu từ form

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
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        // Gọi lại hàm kiểm tra trạng thái form để đảm bảo nút có đúng trạng thái
        // sau khi reset form hoặc nếu có lỗi và các trường vẫn rỗng.
        checkFormValidity();
    }
});


// Logic kiểm tra và bật/tắt nút "Gửi tin nhắn"
// Lấy các phần tử form
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitButtonConditional = document.getElementById('submit-button'); // Đổi tên biến để tránh trùng lặp

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