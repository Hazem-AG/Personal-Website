document.addEventListener('DOMContentLoaded', () => {

    // Loading Screen
    const loading = document.querySelector('.loading');
    if (loading) {
        setTimeout(() => loading.classList.add('hidden'), 500);
    }

    // Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('nav ul.navlinks');

if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // زرار الايكون
        mobileMenuBtn.innerHTML = navMenu.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';


    });
}




    // Portfolio Filtering + Load More
    const allPortfolioItems = document.querySelectorAll('.portfolio-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    const initialItemsLimit = 3;
    let isExpanded = false;

    function updatePortfolioView() {
        if (!allPortfolioItems.length || !filterBtns.length) return;

        const activeBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeBtn ? activeBtn.dataset.filter : 'all';

        const matchingItems = Array.from(allPortfolioItems).filter(item =>
            activeFilter === 'all' || item.dataset.category === activeFilter
        );

        allPortfolioItems.forEach(item => item.style.display = 'none');

        const itemsToShow = isExpanded ? matchingItems : matchingItems.slice(0, initialItemsLimit);
        itemsToShow.forEach(item => item.style.display = 'block');

        if (loadMoreBtn) {
            loadMoreBtn.style.display =
                (matchingItems.length > initialItemsLimit && !isExpanded) ? 'inline-flex' : 'none';
        }
    }

    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                isExpanded = false;
                updatePortfolioView();
            });
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', e => {
            e.preventDefault();
            isExpanded = true;
            updatePortfolioView();
        });
    }

    updatePortfolioView(); // initial view

    // Scroll Animation
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    const animateOnScroll = () => {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 150) {
                element.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Smooth Scrolling & Active Nav Link
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    if (navLinks.length && navMenu && mobileMenuBtn) {
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', e => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });

        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                if (window.scrollY >= section.offsetTop - 80) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.toggle(
                    'nav-active',
                    link.getAttribute('href').includes(current)
                );
            });
        });
    }

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('active', window.scrollY > 300);
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animate skill bars
     const skillBars = document.querySelectorAll('.skill-progress');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width') || 0;
                    bar.style.width = width + '%';
                    obs.unobserve(bar); // ✅ يمنع إعادة التنفيذ
                }
            });
        }, { threshold: 0.3 }); // يبدأ لما 30% من العنصر يظهر

        skillBars.forEach((bar, index) => {
            // Delay بسيط لكل بار عشان يبدأوا بالتدريج
            bar.style.transitionDelay = `${index * 0.2}s`;
            observer.observe(bar);
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Portfolio Modal
    const portfolioModalItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('portfolioModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalImage = document.querySelector('.modal-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalCategory = document.querySelector('.modal-category');
    const modalDescription = document.querySelector('.modal-description');
    const modalTechContainer = document.querySelector('.modal-tech');
    const modalLink = document.querySelector('.modal-link');

    if (portfolioModalItems.length && modal && closeModalBtn) {
        const openModal = item => {
            const imgSrc = item.querySelector('.portfolio-img')?.getAttribute('src') || '';
            const title = item.querySelector('.portfolio-title')?.textContent || '';
            const category = item.querySelector('.portfolio-category')?.textContent || '';
            const description = item.dataset.description || 'No description available.';
            const tech = item.dataset.tech || '';
            const link = item.dataset.link || '#';

            if (modalImage) modalImage.setAttribute('src', imgSrc);
            if (modalTitle) modalTitle.textContent = title;
            if (modalCategory) modalCategory.textContent = category;
            if (modalDescription) modalDescription.textContent = description;
            if (modalLink) modalLink.setAttribute('href', link);

            if (modalTechContainer) {
                modalTechContainer.innerHTML = '';
                tech.split(',').forEach(t => {
                    const techTag = document.createElement('span');
                    techTag.textContent = t.trim();
                    modalTechContainer.appendChild(techTag);
                });
            }

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        portfolioModalItems.forEach(item => {
            item.addEventListener('click', () => openModal(item));
        });

        const closePortfolioModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'hidden';
        };

        closeModalBtn.addEventListener('click', closePortfolioModal);
        window.addEventListener('click', e => {
            if (e.target === modal) closePortfolioModal();
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape' && modal.style.display === 'block') closePortfolioModal();
        });
    }

});