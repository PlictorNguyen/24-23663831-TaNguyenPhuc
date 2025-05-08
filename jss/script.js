$(document).ready(function() {
    // Khởi tạo dữ liệu LocalStorage
    if (!localStorage.getItem('products')) {
        const products = [
            { id: 1, name: 'Đàn Guitar Yamaha', category: 'Guitar', price: 3000000, image: '../img/guitar-yamaha.jpg', description: 'Đàn guitar chất lượng cao cho người mới bắt đầu.' },
            { id: 2, name: 'Đàn Piano Casio', category: 'Piano', price: 8500000, image: '../img/piano-casio.jpg', description: 'Đàn piano điện tử với âm thanh chân thực.' },
            { id: 3, name: 'Bộ Trống Pearl', category: 'Drum', price: 20000000, image: '../img/trong-pearl.jpg', description: 'Bộ trống chuyên nghiệp cho biểu diễn.' },
            { id: 4, name: 'Đàn Guitar Taylor', category: 'Guitar', price: 5000000, image: '../img/guitar-taylor.jpg', description: 'Đàn guitar acoustic cao cấp.' },
            { id: 5, name: 'Đàn Organ Yamaha', category: 'Piano', price: 8000000, image: '../img/organ-yamaha.jpg', description: 'Đàn organ đa năng cho học tập.' },
            { id: 6, name: 'Phụ Kiện Dây Đàn', category: 'Accessories', price: 100000, image: '../img/day.jpg', description: 'Dây đàn chất lượng cao.' },
        ];
        localStorage.setItem('products', JSON.stringify(products));
    } else {
        // Sửa dữ liệu hiện có nếu thiếu description hoặc image sai
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.map(product => ({
            ...product,
            description: product.description || 'Sản phẩm chất lượng cao từ Nhạc Cụ Nguyên Phúc.',
            image: product.image ? product.image.replace('assets/', 'img/') : 'img/piano.jpg' // Chuyển assets/ thành img/
        }));
        localStorage.setItem('products', JSON.stringify(products));
    }

    if (!localStorage.getItem('news')) {
        const news = [
            { id: 1, title: 'Khuyến Mãi Mùa Hè', summary: 'Giảm giá 20% cho tất cả sản phẩm.', date: '2025-04-20', content: 'Nhạc Cụ Minh Phụng tổ chức chương trình khuyến mãi mùa hè với ưu đãi lên đến 20%.' },
            { id: 2, title: 'Sản Phẩm Mới', summary: 'Ra mắt đàn guitar mới.', date: '2025-04-15', content: 'Bộ sưu tập đàn guitar mới từ Yamaha đã có mặt tại cửa hàng.' },
        ];
        localStorage.setItem('news', JSON.stringify(news));
    }

    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    if (!localStorage.getItem('coupon')) {
        localStorage.setItem('coupon', JSON.stringify({ code: '', discount: 0 }));
    }

    // Hàm định dạng giá tiền VNĐ
    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }

    // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('#cartCount').text(totalItems);
    }

    // Hàm tải banner carousel
    function loadCarousel() {
        const products = JSON.parse(localStorage.getItem('products')).slice(0, 3);
        const carouselItems = $('#carouselItems');
        carouselItems.empty();
        products.forEach((product, index) => {
            const activeClass = index === 0 ? 'active' : '';
            const description = product.description || 'Sản phẩm chất lượng cao từ Nhạc Cụ Nguyên Phúc.';
            carouselItems.append(`
        <div class="carousel-item ${activeClass} hero-slider" style="background-image: url('${product.image}');">
          <div class="hero-content">
            <h1 class="mb-3">${product.name}</h1>
            <p class="mb-4">${description}</p>
            <a href="product-detail.html?id=${product.id}" class="btn btn-primary px-4">Xem ngay</a>
          </div>
        </div>
      `);
        });
    }

    // Hàm tải giỏ hàng
    function loadCartPage() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const coupon = JSON.parse(localStorage.getItem('coupon')) || { code: '', discount: 0 };
        const cartItemsContainer = $('#cartItems');
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsContainer.html(`
        <tr>
          <td colspan="5" class="text-center py-5">
            <h5 class="text-muted">Giỏ hàng của bạn đang trống</h5>
            <a href="products.html" class="btn btn-primary mt-3">Tiếp tục mua sắm</a>
          </td>
        </tr>
      `);
            $('#cartTotals').hide();
            return;
        }

        cartItemsContainer.html(cart.map(item => {
            const product = products.find(p => p.id == item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;
                return `
          <tr>
            <td>
              <div class="d-flex align-items-center">
                <img src="${product.image}" alt="${product.name}" class="me-3" width="80">
                <div>
                  <h6 class="mb-1">${product.name}</h6>
                  <small class="text-muted">Mã: ${item.id}</small>
                </div>
              </div>
            </td>
            <td>${formatPrice(product.price)}</td>
            <td>
              <div class="quantity-control">
                <button class="btn btn-outline-secondary decrease-quantity" data-id="${item.id}">-</button>
                <input type="number" class="form-control quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="btn btn-outline-secondary increase-quantity" data-id="${item.id}">+</button>
              </div>
            </td>
            <td>${formatPrice(itemTotal)}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
            </td>
          </tr>
        `;
            }
            return '';
        }).join(''));

        const discount = coupon.discount ? Math.round(subtotal * coupon.discount) : 0;
        const total = subtotal - discount;

        $('#cartTotals').show().html(`
      <div class="d-flex justify-content-between mb-2">
        <span>Tạm tính:</span>
        <span id="subtotal">${formatPrice(subtotal)}</span>
      </div>
      <div class="d-flex justify-content-between mb-2">
        <span>Giảm giá${coupon.code ? ' (' + coupon.code + ')' : ''}:</span>
        <span id="discount" class="text-success">-${formatPrice(discount)}</span>
      </div>
      <div class="d-flex justify-content-between mb-2">
        <span>Phí vận chuyển:</span>
        <span>Miễn phí</span>
      </div>
      <hr>
      <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
        <span>Tổng cộng:</span>
        <span id="total">${formatPrice(total)}</span>
      </div>
    `);

        updateCartCount();
    }

    // Gọi hàm updateCartCount và loadCartPage khi tải trang
    updateCartCount();
    loadCartPage();
    if ($('#carouselItems').length) {
        loadCarousel();
    }

    // Xử lý tăng/giảm số lượng
    $(document).on('click', '.increase-quantity', function() {
        const id = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart'));
        const item = cart.find(item => item.id == id);
        if (item) {
            item.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartPage();
        }
    });

    $(document).on('click', '.decrease-quantity', function() {
        const id = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart'));
        const item = cart.find(item => item.id == id);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartPage();
        }
    });

    $(document).on('change', '.quantity-input', function() {
        const id = $(this).data('id');
        const newQuantity = parseInt($(this).val());
        let cart = JSON.parse(localStorage.getItem('cart'));
        const item = cart.find(item => item.id == id);
        if (item && newQuantity > 0) {
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartPage();
        } else if (item && newQuantity <= 0) {
            cart = cart.filter(item => item.id != id);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartPage();
        }
    });

    // Xử lý áp mã giảm giá
    $(document).on('click', '#applyCoupon', function() {
        const code = $('#couponCode').val().trim().toUpperCase();
        let coupon = { code: '', discount: 0 };

        if (code === 'DISCOUNT10') {
            coupon = { code: code, discount: 0.1 }; // Giảm 10%
            $('#couponMessage').html('<div class="alert alert-success">Áp dụng mã giảm giá thành công!</div>');
        } else {
            $('#couponMessage').html('<div class="alert alert-danger">Mã giảm giá không hợp lệ!</div>');
        }

        localStorage.setItem('coupon', JSON.stringify(coupon));
        loadCartPage();
        setTimeout(() => $('#couponMessage').html(''), 3000); // Xóa thông báo sau 3 giây
    });

    // Xử lý xóa sản phẩm
    $(document).on('click', '.remove-item', function() {
        const id = $(this).data('id');
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart = cart.filter(item => item.id != id);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartPage();
    });

    // Xử lý form đăng ký
    $('#registerForm').submit(function(e) {
        e.preventDefault();
        const form = $(this);
        form.addClass('was-validated');

        $('#fullnameError, #birthdateError, #usernameError, #emailError, #passwordError, #confirmPasswordError').text('');

        const fullname = $('#fullname').val().trim();
        const birthdate = $('#birthdate').val();
        const username = $('#username').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();

        let isValid = true;
        let firstErrorField = null;
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('users')) || [];
        } catch (e) {
            console.error('Error parsing users:', e);
            $('#registerMessage').html('<div class="alert alert-danger">Lỗi hệ thống: Không thể truy cập dữ liệu người dùng. Vui lòng thử lại sau!</div>');
            return;
        }

        // Kiểm tra Họ và tên
        const fullnameRegex = /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*( [A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)+$/;
        if (!fullname) {
            $('#fullnameError').text('Vui lòng nhập họ và tên!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#fullname';
        } else if (!fullnameRegex.test(fullname)) {
            $('#fullnameError').text('Họ và tên phải có ít nhất 2 từ, mỗi từ bắt đầu bằng chữ hoa!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#fullname';
        }

        // Kiểm tra Ngày sinh
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        if (age < 13 || age > 100) {
            $('#birthdateError').text('Tuổi phải từ 13 đến 100 để đăng ký!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#birthdate';
        }


        // Kiểm tra Tên đăng nhập
        const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
        if (!username) {
            $('#usernameError').text('Vui lòng nhập tên đăng nhập!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#username';
        } else if (!usernameRegex.test(username)) {
            $('#usernameError').text('Tên đăng nhập phải chứa cả chữ cái và số!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#username';
        } else if (users.find(user => user.username === username)) {
            $('#usernameError').text('Tên đăng nhập đã tồn tại!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#username';
        }

        // Kiểm tra Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            $('#emailError').text('Vui lòng nhập email!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#email';
        } else if (!emailRegex.test(email)) {
            $('#emailError').text('Email không hợp lệ!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#email';
        }

        // Kiểm tra Mật khẩu
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password) {
            $('#passwordError').text('Vui lòng nhập mật khẩu!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#password';
        } else if (!passwordRegex.test(password)) {
            $('#passwordError').text('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#password';
        }

        // Kiểm tra Xác nhận mật khẩu
        if (!confirmPassword) {
            $('#confirmPasswordError').text('Vui lòng xác nhận mật khẩu!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#confirmPassword';
        } else if (password !== confirmPassword) {
            $('#confirmPasswordError').text('Mật khẩu không khớp!');
            isValid = false;
            if (!firstErrorField) firstErrorField = '#confirmPassword';
        }

        // Focus vào trường lỗi đầu tiên
        if (firstErrorField) {
            $(firstErrorField).focus();
        }

        // Nếu tất cả hợp lệ, lưu tài khoản
        if (isValid) {
            users.push({ fullname, birthdate, username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            $('#registerMessage').html(`<div class="alert alert-success">Đăng ký thành công! Thông tin: ${fullname}, ${username}, ${email}</div>`);
            form.removeClass('was-validated');
            form[0].reset();
        } else {
            form.removeClass('was-validated'); // Xóa was-validated nếu sai
        }
    });

    // Xử lý form đăng nhập
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('users'));
        } catch (e) {
            console.error('Error parsing users:', e);
        }

        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            $('#loginMessage').html('<div class="alert alert-success">Đăng nhập thành công!</div>');
            window.location.href = 'index.html';
        } else {
            $('#loginMessage').html('<div class="alert alert-danger">Tên đăng nhập hoặc mật khẩu sai!</div>');
        }
    });

    // Tải sản phẩm nổi bật trên trang chủ
    if ($('#featuredProducts').length) {
        const products = JSON.parse(localStorage.getItem('products')).slice(0, 3);
        products.forEach(product => {
            const description = product.description || 'Sản phẩm chất lượng cao từ Nhạc Cụ Minh Phụng.';
            $('#featuredProducts').append(`
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${formatPrice(product.price)}</p>
              <p class="card-text text-muted">${description}</p>
              <a href="product-detail.html?id=${product.id}" class="btn btn-primary">Xem chi tiết</a>
            </div>
          </div>
        </div>
      `);
        });
    }

    // Tải danh sách sản phẩm trên trang sản phẩm
    if ($('#productList').length) {
        const products = JSON.parse(localStorage.getItem('products'));
        products.forEach(product => {
            const description = product.description || 'Sản phẩm chất lượng cao từ Nhạc Cụ Minh Phụng.';
            $('#productList').append(`
        <div class="col-md-4 mb-4">
          <div class="card">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${formatPrice(product.price)}</p>
              <p class="card-text text-muted">${description}</p>
              <a href="product-detail.html?id=${product.id}" class="btn btn-primary">Xem chi tiết</a>
            </div>
          </div>
        </div>
      `);
        });

        // Lọc sản phẩm theo loại
        $('.dropdown-item').click(function() {
            const filter = $(this).data('filter');
            $('#productList').empty();
            const products = JSON.parse(localStorage.getItem('products'));
            const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
            filteredProducts.forEach(product => {
                const description = product.description || 'Sản phẩm chất lượng cao từ Nhạc Cụ Minh Phụng.';
                $('#productList').append(`
          <div class="col-md-4 mb-4">
            <div class="card">
              <img src="${product.image}" class="card-img-top" alt="${product.name}">
              <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${formatPrice(product.price)}</p>
                <p class="card-text text-muted">${description}</p>
                <a href="product-detail.html?id=${product.id}" class="btn btn-primary">Xem chi tiết</a>
              </div>
            </div>
          </div>
        `);
            });
        });
    }

    // Tải chi tiết sản phẩm
    if (window.location.pathname.includes('product-detail.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        const products = JSON.parse(localStorage.getItem('products'));
        const product = products.find(p => p.id == productId);

        if (product) {
            $('#productImage').attr('src', product.image);
            $('#productName').text(product.name);
            $('#productPrice').text(formatPrice(product.price));
            $('#productDescription').text(product.description || 'Sản phẩm chất lượng cao từ Nhạc Cụ Minh Phụng.');
            $('#addToCart').data('id', product.id);
        }

        $('#addToCart').click(function() {
            const cart = JSON.parse(localStorage.getItem('cart'));
            const productId = $(this).data('id');
            const existingItem = cart.find(item => item.id == productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                const product = products.find(p => p.id == productId);
                cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            // Thêm toast thông báo
            const toast = $('<div class="add-to-cart-toast"><div class="toast-content"><i class="fas fa-check-circle text-success me-2"></i> Đã thêm <strong>' + product.name + '</strong> vào giỏ hàng <a href="cart.html" class="ms-3">Xem giỏ hàng</a></div></div>');
            $('body').append(toast);
            setTimeout(() => toast.addClass('show'), 100);
            setTimeout(() => {
                toast.removeClass('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        });
    }

    // Tải danh sách tin tức
    if ($('#newsList').length) {
        const news = JSON.parse(localStorage.getItem('news'));
        news.forEach(item => {
            $('#newsList').append(`
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
            <p class="card-text">${item.summary}</p>
            <p class="card-text"><small class="text-muted">${item.date}</small></p>
            <a href="news-detail.html?id=${item.id}" class="btn btn-primary">Đọc thêm</a>
          </div>
        </div>
      `);
        });
    }

    // Tải chi tiết tin tức
    if (window.location.pathname.includes('news-detail.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const newsId = urlParams.get('id');
        const news = JSON.parse(localStorage.getItem('news'));
        const item = news.find(n => n.id == newsId);

        if (item) {
            $('#newsTitle').text(item.title);
            $('#newsDate').text(item.date);
            $('#newsContent').text(item.content);
        }
    }

    // Xử lý form thanh toán
    $('#checkoutForm').submit(function(e) {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('cart'));
        if (cart.length === 0) {
            $('#checkoutMessage').html('<div class="alert alert-danger">Giỏ hàng trống!</div>');
            return;
        }
        localStorage.setItem('cart', JSON.stringify([]));
        localStorage.setItem('coupon', JSON.stringify({ code: '', discount: 0 }));
        updateCartCount();
        $('#checkoutMessage').html('<div class="alert alert-success">Đơn hàng đã được xác nhận!</div>');
        $('#checkoutForm')[0].reset();
    });

    // Xử lý form liên hệ
    $('#contactForm').submit(function(e) {
        e.preventDefault();
        $('#contactMessage').html('<div class="alert alert-success">Tin nhắn đã được gửi!</div>');
        $('#contactForm')[0].reset();
    });
});
