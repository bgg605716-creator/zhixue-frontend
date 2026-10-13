document.addEventListener('DOMContentLoaded', function() {
    const navbarNav = document.getElementById('navbarNav');
    const navbarToggle = document.getElementById('navbarToggle');
    const backToTop = document.getElementById('backToTop');

    // ===== 板块切换公共函数 =====
    const pageSections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.navbar-nav a[data-page]');

    function showPage(pageId) {
        // 隐藏全部 .page-section
        pageSections.forEach(sec => {
            sec.style.display = 'none';
        });

        // 显示选中板块
        const targetSection = document.getElementById(pageId);
        if (targetSection) {
            targetSection.style.display = pageId === 'home' ? '' : 'block';
        }

        // active 高亮
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector('.navbar-nav a[data-page="' + pageId + '"]');
        if (activeLink) activeLink.classList.add('active');

        // 回到顶部
        window.scrollTo(0, 0);
    }

    // ===== 导航点击：JS 拦截原生跳转，切换板块 =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            showPage(targetPage);

            // 移动端关闭菜单
            if (navbarNav) navbarNav.classList.remove('active');
        });
    });

    // ===== 移动端菜单切换 =====
    if (navbarToggle && navbarNav) {
        navbarToggle.addEventListener('click', function() {
            navbarNav.classList.toggle('active');
        });
    }

    // ===== 返回顶部按钮 =====
    if (backToTop) {
        backToTop.classList.add('show');
        backToTop.addEventListener('click', function() {
            window.scrollTo(0, 0);
        });
    }

    // ===== 数字滚动计数动画 =====
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        function animateValue(element, target, duration) {
            const startTime = performance.now();

            function update() {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(target * easeOutQuart);

                element.textContent = target >= 1000 ? current.toLocaleString() : current;

                if (progress < 1) {
                    setTimeout(update, 16);
                }
            }

            setTimeout(update, 16);
        }

        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            if (!isNaN(target)) {
                animateValue(num, target, 2000);
            }
        });
    }

    // ===== 课程分类 Tab 切换（首页 + 课程页通用） =====
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // 只对同一容器内的 tab 操作
                const container = this.closest('.container');
                if (!container) return;

                const localTabBtns = container.querySelectorAll('.tab-btn');
                const localCards = container.querySelectorAll('.course-card');

                localTabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                localCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (category === 'all' || cardCategory === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });

        // 课程卡片"立即学习"按钮切换到报名板块
        document.querySelectorAll('.course-card .btn-primary').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showPage('contact');
            });
        });
    }

    // ===== 学员评价轮播（首页 + 评价页通用） =====
    function initCarousel(trackId, prevId, nextId, dotsId, carouselSelector) {
        const reviewTrack = document.getElementById(trackId);
        const reviewCards = reviewTrack ? reviewTrack.querySelectorAll('.review-card') : [];
        const prevBtn = document.getElementById(prevId);
        const nextBtn = document.getElementById(nextId);
        const reviewDots = document.getElementById(dotsId);
        const reviewCarousel = document.querySelector(carouselSelector);

        if (!reviewTrack || reviewCards.length === 0) return;

        let currentReview = 0;
        let reviewInterval;
        let isAnimating = false;

        function createDots() {
            reviewCards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToReview(index));
                reviewDots.appendChild(dot);
            });
        }

        function goToReview(index) {
            if (isAnimating || index === currentReview) return;
            isAnimating = true;
            currentReview = index;

            const cardWidth = reviewCards[0].offsetWidth;
            reviewTrack.style.transform = 'translateX(-' + (currentReview * cardWidth) + 'px)';

            reviewDots.querySelectorAll('.dot').forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentReview);
            });

            setTimeout(function() { isAnimating = false; }, 300);
        }

        function nextSlide() {
            goToReview((currentReview + 1) % reviewCards.length);
        }

        function prevSlide() {
            goToReview((currentReview - 1 + reviewCards.length) % reviewCards.length);
        }

        function startAutoPlay() {
            reviewInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            clearInterval(reviewInterval);
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        if (reviewCarousel) {
            reviewCarousel.addEventListener('mouseenter', stopAutoPlay);
            reviewCarousel.addEventListener('mouseleave', startAutoPlay);
        }

        createDots();
        startAutoPlay();
    }

    // 首页轮播
    initCarousel('reviewTrack', 'prevReview', 'nextReview', 'reviewDots', '#reviewCarousel');
    // 评价页轮播
    initCarousel('reviewTrackPage', 'prevReviewPage', 'nextReviewPage', 'reviewDotsPage', '#reviewCarouselPage');

    // ===== 报名表单验证（首页 + 联系页通用） =====
    function initForm(formId, nameId, phoneId, courseId, nameErrorId, phoneErrorId, courseErrorId) {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById(nameId).value.trim();
            const phone = document.getElementById(phoneId).value.trim();
            const course = document.getElementById(courseId).value;

            let isValid = true;
            document.getElementById(nameErrorId).textContent = '';
            document.getElementById(phoneErrorId).textContent = '';
            document.getElementById(courseErrorId).textContent = '';

            if (!name) {
                document.getElementById(nameErrorId).textContent = '请输入姓名';
                isValid = false;
            }

            if (!phone) {
                document.getElementById(phoneErrorId).textContent = '请输入手机号';
                isValid = false;
            } else if (!/^1[3-9]\d{9}$/.test(phone)) {
                document.getElementById(phoneErrorId).textContent = '请输入有效的手机号';
                isValid = false;
            }

            if (!course) {
                document.getElementById(courseErrorId).textContent = '请选择意向课程';
                isValid = false;
            }

            if (!isValid) return;

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            setTimeout(function() {
                submitBtn.textContent = '提交成功';
                submitBtn.style.backgroundColor = '#10b981';
                form.reset();

                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 2000);
            }, 1500);
        });
    }

    // 首页表单
    initForm('contactForm', 'name', 'phone', 'course', 'nameError', 'phoneError', 'courseError');
    // 联系页表单
    initForm('contactFormPage', 'namePage', 'phonePage', 'coursePage', 'nameErrorPage', 'phoneErrorPage', 'courseErrorPage');

    // ===== 首页 Hero 按钮切换板块 =====
    const heroRegisterBtn = document.querySelector('.hero-buttons .btn-primary.btn-lg');
    if (heroRegisterBtn) {
        heroRegisterBtn.addEventListener('click', function() {
            showPage('contact');
        });
    }

    const heroLearnBtn = document.querySelector('.hero-buttons .btn-outline.btn-lg');
    if (heroLearnBtn) {
        heroLearnBtn.addEventListener('click', function() {
            showPage('courses');
        });
    }

    // ===== 导航品牌点击回首页 =====
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.style.cursor = 'pointer';
        navbarBrand.addEventListener('click', function() {
            showPage('home');
        });
    }

    // ===== 淡入动画 =====
    const fadeElements = document.querySelectorAll('.section > .container > *:not(.section-header)');
    if (fadeElements.length > 0) {
        const fadeInStyle = document.createElement('style');
        fadeInStyle.textContent = '.fade-in-up { opacity: 1 !important; transform: translateY(0) !important; }';
        document.head.appendChild(fadeInStyle);

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
});
