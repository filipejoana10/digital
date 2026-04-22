// Strict tabbed navigation - single section view only
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section');
    const tabs = document.querySelectorAll('.nav-tab[data-target]');
    
    // Set initial state
    const inicioTab = document.querySelector('.nav-tab[data-target="inicio"]');
    if (inicioTab) inicioTab.classList.add('active');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Tab switching - show ONLY target section
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active from all tabs and sections
                tabs.forEach(t => t.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Activate clicked tab and section
                this.classList.add('active');
                targetSection.classList.add('active');
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
    
    // Reveal animations only for visible sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.closest('.section.active')) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
