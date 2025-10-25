import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './assets/css/styles.css';
import homeImage from './assets/img/main1.jpg';
import aboutImage from './assets/img/main3.jpg';
import ScrollReveal from 'scrollreveal';
import ChatBot from './chatbot';

function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        // Apply saved theme on load
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('theme-dark');
        }

        // Mobile Navigation Toggle
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle menu
                navMenu.classList.toggle('show-menu');
                
                // Toggle body scroll
                if (navMenu.classList.contains('show-menu')) {
                    document.body.classList.add('menu-open');
                } else {
                    document.body.classList.remove('menu-open');
                }
            });
        }

        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu) {
                    navMenu.classList.remove('show-menu');
                    document.body.classList.remove('menu-open');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navMenu && navToggle && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target) && 
                navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
                document.body.classList.remove('menu-open');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
                document.body.classList.remove('menu-open');
            }
        });

        const sections = document.querySelectorAll('section[id]');
        function scrollActive() {
            const scrollY = window.pageYOffset;
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute('id');
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
                } else {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
                }
            });
        }
        window.addEventListener('scroll', scrollActive);

        function scrollHeader() {
            const nav = document.getElementById('header');
            if (this.scrollY >= 200) nav.classList.add('scroll-header');
            else nav.classList.remove('scroll-header');
        }
        window.addEventListener('scroll', scrollHeader);

        function scrollTop() {
            const scrollTop = document.getElementById('scroll-top');
            if (this.scrollY >= 560) scrollTop.classList.add('show-scroll');
            else scrollTop.classList.remove('show-scroll');
        }
        window.addEventListener('scroll', scrollTop);

        const sr = ScrollReveal({
            origin: 'top',
            distance: '30px',
            duration: 2000,
            reset: true
        });
        sr.reveal(`.home__data, .home__img,
                    .about__data, .about__img,
                    .services__content, .menu__content,
                    .app__data, .app__img,
                    .contact__data, .contact__button,
                    .footer__content`, {
            interval: 200
        });
    }, []);

    return (
        <div>
            {/* Header */}
            <header className="l-header" id="header">
                <nav className="nav">
                    <Link to="/" className="nav__logo">🚴‍♂️ BIKE SERVICE</Link>

                    <div className="nav__menu" id="nav-menu">
                        <ul className="nav__list">
                            <li className="nav__item"><a href="#home" className="nav__link active-link">Home</a></li>
                            <li className="nav__item"><a href="#about" className="nav__link">About</a></li>
                            <li className="nav__item"><a href="#footer" className="nav__link">Contact</a></li>
                            <li className="nav__item"><Link className='nav__link' to={'/login'}>Login</Link></li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            className="theme-toggle"
                            aria-label="Toggle theme"
                            onClick={() => {
                                const root = document.documentElement;
                                const isDark = root.classList.toggle('theme-dark');
                                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                            }}
                        >🌓</button>
                        <div className="nav__toggle" id="nav-toggle">
                            <i className='bx bx-menu'></i>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="l-main">
                {/* Home section */}
                <section className="home" id="home">
                    <div className="home__container bd-container">
                        <div className="home__data animate-fadeInLeft">
                            <div className="home__badge">
                                <span>🚴‍♂️ Professional Service</span>
                            </div>
                            <h1 className="home__title">Welcome to Bike Service!</h1>
                            <h2 className="home__subtitle">Professional bike maintenance and repair services. Book your service today and ride with confidence!</h2>
                            <div className="home__features">
                                <div className="feature-item">
                                    <span className="feature-icon">⚡</span>
                                    <span>Quick Service</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">🛡️</span>
                                    <span>Quality Guarantee</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">👨‍🔧</span>
                                    <span>Expert Technicians</span>
                                </div>
                            </div>
                            <div className="home__buttons">
                                <button
                                    className='button button--primary'
                                    onClick={() => {
                                        const loggedInUserEmail = localStorage.getItem('loggedInUserEmail');
                                        if (loggedInUserEmail) navigate('/service');
                                        else navigate('/login');
                                    }}
                                >
                                    <span>Book Service</span>
                                    <span>→</span>
                                </button>
                                <a className='button button--outline' href="#about">
                                    <span>Learn More</span>
                                </a>
                            </div>
                        </div>
                        <div className="home__image-container animate-fadeInRight">
                            <img src={homeImage} alt="Professional bike service" className="home__img hover-lift" />
                            <div className="home__floating-card">
                                <div className="floating-card__icon">🏆</div>
                                <div className="floating-card__content">
                                    <div className="floating-card__title">5-Star Rated</div>
                                    <div className="floating-card__subtitle">Customer Satisfaction</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About section */}
                <section className="about section" id="about">
                    <div className="bd-container">
                        <div className="about__container">
                            <div className="about__data">
                                <span className="section-subtitle">About Us</span>
                                <h2 className="section-title">Your Trusted Bike Service Provider</h2>
                                <p className="about__description">Welcome to our bike service center, where we specialize in providing top-notch solutions for all your bike servicing needs. With a strong focus on quality and customer satisfaction, we ensure your bike is in the best condition for your rides.</p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                                        <span>Expert Technicians</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>⚡</span>
                                        <span>Quick Service</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                                        <span>Quality Guarantee</span>
                                    </div>
                                </div>
                            </div>
                            <img src={aboutImage} alt="Our Bike Service Center" className="about__img" />
                        </div>
                    </div>
                </section>

                {/* Add more sections if needed */}
            </main>

            {/* Footer */}
            <footer className="footer" id='footer'>
                <div className="bd-container">
                    <div className="footer__container">
                        <div className="footer__content footer__info">
                            <h3 className="footer__title">Quick Links</h3>
                            <ul>
                                <li><a href="#home" className="footer__link">Home</a></li>
                                <li><a href="#about" className="footer__link">About</a></li>
                                <li><Link to="/login" className="footer__link">Login</Link></li>
                                <li><Link to="/service" className="footer__link">Book Service</Link></li>
                            </ul>
                        </div>
                        <div className="footer__content footer__address">
                            <h3 className="footer__title">Our Location</h3>
                            <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                                <p>🚴‍♂️ Bike Service Center</p>
                                <p>📍 Perundurai Road, Thindal</p>
                                <p>🏢 Erode – 638 012</p>
                                <p>📞 +1 737-375-2000</p>
                            </div>
                        </div>
                        <div className="footer__content footer__contact">
                            <h3 className="footer__title">Get In Touch</h3>
                            <p className="contact__description">Have questions or need to schedule a service for your bike? Feel free to reach out to us! We're here to assist you promptly.</p>
                            <p className="contact__description">📧 bikeservice@example.com</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>📱</span>
                                <span style={{ fontSize: '1.5rem' }}>📧</span>
                                <span style={{ fontSize: '1.5rem' }}>🌐</span>
                            </div>
                        </div>
                    </div>
                    <p className="footer__copy">© 2025 Bike Service. All rights reserved.</p>
                </div>
            </footer>

            {/* ChatBot */}
            <ChatBot />
        </div>
    );
}

export default Home;
