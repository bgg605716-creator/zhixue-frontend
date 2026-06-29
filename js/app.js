document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navbarNav = document.getElementById('navbarNav');
    const navbarToggle = document.getElementById('navbarToggle');
    const backToTop = document.getElementById('backToTop');
    const reviewTrack = document.getElementById('reviewTrack');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevReview = document.getElementById('prevReview');
    const nextReview = document.getElementById('nextReview');
    const reviewDots = document.getElementById('reviewDots');
    const courseGrid = document.getElementById('courseGrid');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const contactForm = document.getElementById('contactForm');
    const statNumbers = document.querySelectorAll('.stat-number');

    let currentReview = 0;
    let reviewInterval;
    let isAnimating = false;

    navbarToggle.addEventListener('click', function() {
        navbarNav.classList.toggle('active');
    });

    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', function() {
            navbarNav.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    function animateValue(element, target, duration) {
        const start = parseInt(element.textContent.replace(/,/g, ''));
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            if (target >= 1000) {
                element.textContent = current.toLocaleString();
            } else {
                element.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    const observerOptions = {
        threshold: 0.3
    };

    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    animateValue(num, target, 2000);
                });
                statObserver.disconnect();
            }
        });
    }, observerOptions);

    statObserver.observe(document.querySelector('.hero-stats'));

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            const courseCards = document.querySelectorAll('.course-card');
            
            courseCards.forEach(card => {
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

    function createDots() {
        reviewCards.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => goToReview(index));
            reviewDots.appendChild(dot);
        });
    }

    function goToReview(index) {
        if (isAnimating || index === currentReview) return;
        
        isAnimating = true;
        currentReview = index;
        
        const cardWidth = reviewCards[0].offsetWidth;
        reviewTrack.style.transform = `translateX(-${currentReview * cardWidth}px)`;
        
        document.querySelectorAll('.dot').forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentReview);
        });
        
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    function nextSlide() {
        const newIndex = (currentReview + 1) % reviewCards.length;
        goToReview(newIndex);
    }

    function prevSlide() {
        const newIndex = (currentReview - 1 + reviewCards.length) % reviewCards.length;
        goToReview(newIndex);
    }

    function startAutoPlay() {
        reviewInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
        clearInterval(reviewInterval);
    }

    prevReview.addEventListener('click', prevSlide);
    nextReview.addEventListener('click', nextSlide);

    document.querySelector('.review-carousel').addEventListener('mouseenter', stopAutoPlay);
    document.querySelector('.review-carousel').addEventListener('mouseleave', startAutoPlay);

    createDots();
    startAutoPlay();

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const course = document.getElementById('course').value;
        
        let isValid = true;
        
        document.getElementById('nameError').textContent = '';
        document.getElementById('phoneError').textContent = '';
        document.getElementById('courseError').textContent = '';
        
        if (!name) {
            document.getElementById('nameError').textContent = '请输入姓名';
            isValid = false;
        }
        
        if (!phone) {
            document.getElementById('phoneError').textContent = '请输入手机号';
            isValid = false;
        } else if (!/^1[3-9]\d{9}$/.test(phone)) {
            document.getElementById('phoneError').textContent = '请输入有效的手机号';
            isValid = false;
        }
        
        if (!course) {
            document.getElementById('courseError').textContent = '请选择意向课程';
            isValid = false;
        }
        
        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.textContent = '提交成功';
                submitBtn.style.backgroundColor = '#10b981';
                
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 2000);
            }, 1500);
        }
    });

    document.querySelectorAll('.course-card .btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const offsetTop = contactSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelectorAll('.navbar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.navbar-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.section > .container > *:not(.section-header)').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(fadeInStyle);

    const loginBtn = document.querySelector('.navbar-actions .btn-secondary');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const phone = prompt('请输入手机号');
            if (!phone) return;
            const code = prompt('请输入验证码');
            if (code === '123456') {
                alert('登录成功！');
            } else {
                alert('验证码错误');
            }
        });
    }

    const freeLearnBtn = document.querySelector('.navbar-actions .btn-primary');
    if (freeLearnBtn) {
        freeLearnBtn.addEventListener('click', async function() {
            const phone = prompt('请输入手机号');
            if (!phone) return;
            const nickname = prompt('请输入昵称');
            if (!nickname) return;

            try {
                const response = await fetch('https://zhixue-backend.onrender.com/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone, nickname })
                });

                if (response.ok) {
                    alert('注册成功！');
                } else {
                    const error = await response.text();
                    alert('注册失败：' + error);
                }
            } catch (error) {
                alert('注册失败：' + error.message);
            }
        });
    }

    const heroRegisterBtn = document.querySelector('.hero-buttons .btn-primary.btn-lg');
    if (heroRegisterBtn) {
        heroRegisterBtn.addEventListener('click', function() {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const heroLearnBtn = document.querySelector('.hero-buttons .btn-outline.btn-lg');
    if (heroLearnBtn) {
        heroLearnBtn.addEventListener('click', function() {
            const coursesSection = document.getElementById('courses');
            if (coursesSection) {
                coursesSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    const courseGridEl = document.querySelector('.course-grid');
    if (courseGridEl) {
        courseGridEl.addEventListener('click', function(e) {
            const target = e.target;
            if (target.classList.contains('btn-outline') || target.closest('.btn-outline')) {
                e.preventDefault();
                alert('该课程即将上线，敬请期待！');
            }
        });
    }

    const viewAllCoursesBtn = document.querySelector('#courses .view-more .btn-outline');
    if (viewAllCoursesBtn) {
        viewAllCoursesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('全部课程列表即将开放');
        });
    }

    const viewAllNewsBtn = document.querySelector('#news .view-more .btn-outline');
    if (viewAllNewsBtn) {
        viewAllNewsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('更多资讯即将更新');
        });
    }

    const contactFormEl = document.getElementById('contactForm');
    if (contactFormEl) {
        contactFormEl.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const course = document.getElementById('course').value;
            const message = document.getElementById('message').value.trim();

            let isValid = true;
            document.getElementById('nameError').textContent = '';
            document.getElementById('phoneError').textContent = '';
            document.getElementById('courseError').textContent = '';

            if (!name) {
                document.getElementById('nameError').textContent = '请输入姓名';
                isValid = false;
            }

            if (!phone) {
                document.getElementById('phoneError').textContent = '请输入手机号';
                isValid = false;
            } else if (!/^1[3-9]\d{9}$/.test(phone)) {
                document.getElementById('phoneError').textContent = '请输入有效的手机号';
                isValid = false;
            }

            if (!course) {
                document.getElementById('courseError').textContent = '请选择意向课程';
                isValid = false;
            }

            if (!isValid) return;

            const submitBtn = contactFormEl.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '提交中...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://zhixue-backend.onrender.com/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ phone, nickname: name, course, message })
                });

                if (response.ok) {
                    alert('报名成功！');
                    contactFormEl.reset();
                } else {
                    const error = await response.text();
                    alert('报名失败：' + error);
                }
            } catch (error) {
                alert('报名失败：' + error.message);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
            }
        });
    }
});