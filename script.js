// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burger-btn');
    const nav = document.getElementById('main-nav');
    
    burgerBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('show');
        document.body.classList.toggle('no-scroll');
    });
    
    // Закрытие меню при клике на ссылку
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('active');
            nav.classList.remove('show');
            document.body.classList.remove('no-scroll');
        });
    });
    // Проверяем и инициализируем хранилище отзывов
    initReviewsStorage();
    
    // Загружаем отзывы
    loadReviews();
    
    // Инициализация рейтинга звездами
    initStarRating();
    
    // Инициализация карусели отзывов
    initReviewsCarousel();
    
    // Обработчик формы добавления отзыва
    document.getElementById('review-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addReview();
    });
    
    // Обработчик формы поиска
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        searchReviews();
    });
    
    // Обработчик темы
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

// Инициализация хранилища отзывов
function initReviewsStorage() {
    let reviews = localStorage.getItem('carReviews');

    if (!reviews) {
        console.log('Создаем начальные данные...');
        const initialReviews = [
            {
                id: 1,
                brand: 'Toyota',
                model: 'Camry',
                year: 2020,
                author: 'Иван Петров',
                rating: 5,
                text: 'Отличный автомобиль! Очень надежный и комфортный. Расход топлива примерно 8л/100км в смешанном цикле. Рекомендую!',
                tags: ['надежность', 'комфорт', 'экономичность'],
                date: '2023-05-15'
            },
            {
                id: 2,
                brand: 'BMW',
                model: 'X5',
                year: 2018,
                author: 'Алексей Смирнов',
                rating: 4,
                text: 'Мощный и динамичный внедорожник. Расход топлива высокий, но за удовольствие от вождения можно простить. Качество сборки на высоте.',
                tags: ['мощность', 'динамика', 'премиум'],
                date: '2023-04-22'
            },
            {
                id: 3,
                brand: 'Honda',
                model: 'Accord',
                year: 2019,
                author: 'Мария Иванова',
                rating: 5,
                text: 'Пользуюсь уже 3 года, никаких нареканий. Двигатель работает как часы, салон просторный и удобный. Отличный выбор для семьи.',
                tags: ['надежность', 'семейный', 'комфорт'],
                date: '2023-03-10'
            }
        ];
        
        localStorage.setItem('carReviews', JSON.stringify(initialReviews));
        console.log('Начальные данные сохранены');
    } else {
        const parsedReviews = JSON.parse(reviews);
        const updatedReviews = parsedReviews.map(review => ({
            ...review,
            make: review.make || review.brand,
            userName: review.userName || review.author,
            tags: review.tags || []
        }));
        localStorage.setItem('carReviews', JSON.stringify(updatedReviews));
    }
}

// Загрузка отзывов
function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('carReviews')) || [];
    const reviewList = document.getElementById('review-list');
    
    reviewList.innerHTML = '';
    
    if (reviews.length === 0) {
        reviewList.innerHTML = '<p class="no-reviews">Пока нет отзывов. Будьте первым!</p>';
        return;
    }
    
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    reviews.forEach(review => {
        reviewList.appendChild(createReviewElement(review));
    });
    
    updateTopCars();
}

// Создание элемента отзыва
function createReviewElement(review) {
    const reviewElement = document.createElement('div');
    reviewElement.className = 'review-card';
    
    const tags = review.tags || [];
    const tagsHtml = tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    
    reviewElement.innerHTML = `
        <div class="review-header">
            <div>
                <div class="car-model">${review.make || review.brand} ${review.model}</div>
                <div class="car-year">${review.year} год</div>
            </div>
            <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
        </div>
        <div class="review-author">${review.userName || review.author}, ${review.date}</div>
        <div class="review-text">${review.text}</div>
        ${tags.length > 0 ? `<div class="review-tags">${tagsHtml}</div>` : ''}
    `;
    
    return reviewElement;
}

// Инициализация звездного рейтинга
function initStarRating() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            document.getElementById('rating').value = value;
            
            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

// Добавление нового отзыва
function addReview() {
    const brand = document.getElementById('car-brand').value;
    const model = document.getElementById('car-model').value;
    const year = document.getElementById('car-year').value;
    const author = document.getElementById('author').value;
    const rating = document.getElementById('rating').value;
    const text = document.getElementById('review-text').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    if (!brand || !model || !year || !author || !rating || !text) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    const reviews = JSON.parse(localStorage.getItem('carReviews')) || [];
    const newId = reviews.length > 0 ? Math.max(...reviews.map(r => r.id || 0)) + 1 : 1;
    
    const newReview = {
        id: newId,
        make: brand,
        model,
        year,
        userName: author,
        rating: parseInt(rating),
        text,
        tags,
        date: new Date().toISOString().split('T')[0]
    };
    
    reviews.unshift(newReview);
    localStorage.setItem('carReviews', JSON.stringify(reviews));
    
    // Обновляем список отзывов и карусель
    initReviewsCarousel();
    loadReviews();
    
    document.getElementById('review-form').reset();
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    document.getElementById('rating').value = '0';
    
    document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' });
    alert('Спасибо за ваш отзыв!');
}

// Поиск отзывов
function searchReviews() {
    const searchInput = document.querySelector('#search-form input').value.toLowerCase();
    const brandSelect = document.getElementById('brand-filter').value;
    
    const reviews = JSON.parse(localStorage.getItem('carReviews')) || [];
    
    const filteredReviews = reviews.filter(review => {
        const brand = review.make || review.brand || '';
        const model = review.model || '';
        const text = review.text || '';
        
        const matchesSearch = 
            brand.toString().toLowerCase().includes(searchInput) || 
            model.toString().toLowerCase().includes(searchInput) ||
            text.toString().toLowerCase().includes(searchInput);
        
        const currentBrand = review.make || review.brand;
        const matchesBrand = brandSelect === '' || currentBrand === brandSelect;
        
        return matchesSearch && matchesBrand;
    });
    
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';
    
    if (filteredReviews.length === 0) {
        reviewList.innerHTML = '<p class="no-reviews">По вашему запросу ничего не найдено.</p>';
        return;
    }
    
    filteredReviews.forEach(review => {
        reviewList.appendChild(createReviewElement(review));
    });
}

// Обновление топа автомобилей
function updateTopCars() {
    const reviews = JSON.parse(localStorage.getItem('carReviews')) || [];
    const topList = document.getElementById('top-list');
    
    if (reviews.length === 0) {
        topList.innerHTML = '<p class="no-reviews">Недостаточно данных для формирования топа</p>';
        return;
    }
    
    const carStats = {};
    
    reviews.forEach(review => {
        const key = `${review.make || review.brand} ${review.model}`;
        
        if (!carStats[key]) {
            carStats[key] = {
                brand: review.make || review.brand,
                model: review.model,
                totalRating: 0,
                count: 0
            };
        }
        
        carStats[key].totalRating += review.rating;
        carStats[key].count++;
    });
    
    const carsArray = Object.values(carStats)
        .map(car => ({
            ...car,
            avgRating: car.totalRating / car.count
        }))
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 5);
    
    topList.innerHTML = '';
    
    if (carsArray.length === 0) {
        topList.innerHTML = '<p class="no-reviews">Недостаточно данных для формирования топа</p>';
        return;
    }
    
    const topHtml = carsArray.map((car, index) => `
        <div class="review-card" style="margin-bottom: 1rem;">
            <h3>${index + 1}. ${car.brand} ${car.model}</h3>
            <div class="rating">Рейтинг: ${car.avgRating.toFixed(1)} из 5</div>
            <div>На основе ${car.count} ${getReviewsWord(car.count)}</div>
        </div>
    `).join('');
    
    topList.innerHTML = topHtml;
}

// Функция для правильного склонения слова "отзыв"
function getReviewsWord(count) {
    if (count % 10 === 1 && count % 100 !== 11) {
        return 'отзыва';
    } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
        return 'отзыва';
    }
    return 'отзывов';
}


function initReviewsCarousel() {
    const track = document.getElementById('reviews-track');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const reviews = JSON.parse(localStorage.getItem('carReviews')) || [];
    const topReviews = [...reviews]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
    
    let currentIndex = 0;
    let interval;

    function createCarouselReviews() {
        track.innerHTML = '';
        dotsContainer.innerHTML = '';
        
        if (topReviews.length === 0) {
            track.innerHTML = '<div class="carousel-review"><p>Пока нет отзывов</p></div>';
            return;
        }
        
        const fragment = document.createDocumentFragment();
        
        topReviews.forEach((review, index) => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'carousel-review';
            
            const shortText = review.text.length > 150 ? 
                review.text.substring(0, 150) + '...' : 
                review.text;
            
            reviewElement.innerHTML = `
                <div class="review-header">
                    <div class="car-model">${review.make || review.brand} ${review.model}</div>
                    <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                <div class="review-text">"${shortText}"</div>
                <div class="review-author">— ${review.userName || review.author}</div>
            `;
            fragment.appendChild(reviewElement);
            
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToReview(index));
            dotsContainer.appendChild(dot);
        });
        
        track.appendChild(fragment);
    }
    
    function updateCarousel() {
        const item = document.querySelector('.carousel-review');
        if (!item) return;
        
        const itemWidth = item.offsetWidth + 40;
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    function goToReview(index) {
        if (index < 0 || index >= topReviews.length) return;
        currentIndex = index;
        updateCarousel();
    }
    
    function nextReview() {
        currentIndex = (currentIndex + 1) % topReviews.length;
        updateCarousel();
    }
    
    function prevReview() {
        currentIndex = (currentIndex - 1 + topReviews.length) % topReviews.length;
        updateCarousel();
    }
    
    function startAutoSlide() {
        if (topReviews.length <= 1) return; // Не нужно авто-перелистывание для 1 элемента
        interval = setInterval(nextReview, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(interval);
        startAutoSlide();
    }
    
    // Инициализация
    createCarouselReviews();
    updateCarousel();
    
    // Назначение обработчиков событий
    nextBtn.addEventListener('click', () => {
        nextReview();
        resetAutoSlide();
    });
    
    prevBtn.addEventListener('click', () => {
        prevReview();
        resetAutoSlide();
    });
    
    // Запускаем автоматическое перелистывание
    startAutoSlide();
    
    // Пауза при наведении
    track.addEventListener('mouseenter', () => clearInterval(interval));
    track.addEventListener('mouseleave', startAutoSlide);
    
    // Ресайз окна
    window.addEventListener('resize', updateCarousel);
}