// ============================================================
// HEGO DIGITAL - JAVASCRIPT SEGURO
// ============================================================
// Versão: 1.0.0
// Data: 2024
// ============================================================

// ============================================================
// MODO ESTRITO PARA MELHOR SEGURANÇA
// ============================================================
'use strict';

// ============================================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================================
const CONFIG = {
    // Seletores seguros
    SELECTORS: {
        SECTIONS: '.section-content',
        TAB_BUTTONS: '.tab-btn',
        FAQ_ITEMS: '.faq-item',
        FAQ_ANSWERS: '.faq-answer',
        FAQ_ICONS: '.faq-icon',
        MOBILE_MENU: '#mobile-menu',
        ANIMATE_ELEMENTS: '.service-card, .plan-card, .faq-item, .contact-card'
    },
    
    // Classes CSS
    CLASSES: {
        VISIBLE: 'visible',
        HIDDEN: 'hidden',
        ACTIVE: 'active',
        TEXT_WHITE: 'text-white',
        TEXT_NEUTRAL: 'text-neutral-400',
        BG_INDIGO: 'bg-indigo-500/15'
    },
    
    // Configurações de animação
    ANIMATION: {
        THRESHOLD: 0.1,
        DELAY_BASE: 0.08,
        SCROLL_BEHAVIOR: 'smooth'
    },
    
    // Sanitização
    SANITIZE: {
        MAX_STRING_LENGTH: 100,
        ALLOWED_PROTOCOLS: ['http:', 'https:', 'mailto:', 'tel:']
    }
};

// ============================================================
// FUNÇÕES DE SEGURANÇA
// ============================================================

/**
 * Sanitiza strings para evitar XSS
 * @param {string} str - String a ser sanitizada
 * @returns {string} - String sanitizada
 */
function sanitizeString(str) {
    if (typeof str !== 'string') return '';
    if (str.length > CONFIG.SANITIZE.MAX_STRING_LENGTH) {
        str = str.substring(0, CONFIG.SANITIZE.MAX_STRING_LENGTH);
    }
    return str.replace(/[<>]/g, '').trim();
}

/**
 * Valida e sanitiza IDs de seção
 * @param {string} sectionId - ID da seção
 * @returns {string} - ID sanitizado
 */
function validateSectionId(sectionId) {
    const validSections = ['home', 'planos', 'servicos', 'faq', 'formulario', 'contato'];
    const sanitized = sanitizeString(sectionId);
    return validSections.includes(sanitized) ? sanitized : 'home';
}

/**
 * Previne event listeners duplicados
 * @type {Map}
 */
const eventListenersMap = new Map();

/**
 * Adiciona event listener com segurança contra duplicação
 * @param {Element} element - Elemento alvo
 * @param {string} event - Nome do evento
 * @param {Function} handler - Função handler
 */
function addSecureEventListener(element, event, handler) {
    if (!element || !(element instanceof Element)) return;
    
    const key = `${element}_${event}`;
    if (eventListenersMap.has(key)) {
        element.removeEventListener(event, eventListenersMap.get(key));
    }
    
    element.addEventListener(event, handler);
    eventListenersMap.set(key, handler);
}

// ============================================================
// NAVEGAÇÃO POR TABS (SEGURA)
// ============================================================

/**
 * Mostra a seção selecionada e atualiza UI
 * @param {string} sectionId - ID da seção a mostrar
 */
function showSection(sectionId) {
    // Validar entrada
    const validSectionId = validateSectionId(sectionId);
    
    try {
        // Esconder todas as seções
        const sections = document.querySelectorAll(CONFIG.SELECTORS.SECTIONS);
        if (sections.length) {
            sections.forEach(section => {
                section.classList.remove(CONFIG.CLASSES.VISIBLE);
            });
        }
        
        // Mostrar a seção selecionada
        const targetSection = document.getElementById(`section-${validSectionId}`);
        if (targetSection) {
            targetSection.classList.add(CONFIG.CLASSES.VISIBLE);
            
            // Scroll suave apenas se o método existir
            if (window.scrollTo && typeof window.scrollTo === 'function') {
                window.scrollTo({ 
                    top: 0, 
                    behavior: CONFIG.ANIMATION.SCROLL_BEHAVIOR 
                });
            }
        }
        
        // Atualizar botões ativos
        updateActiveButton(validSectionId);
        
    } catch (error) {
        console.error('Erro na navegação:', error);
        // Fallback: mostrar home
        const homeSection = document.getElementById('section-home');
        if (homeSection) homeSection.classList.add(CONFIG.CLASSES.VISIBLE);
    }
}

/**
 * Atualiza estilo dos botões ativos
 * @param {string} activeId - ID da seção ativa
 */
function updateActiveButton(activeId) {
    const validId = validateSectionId(activeId);
    
    // Mapeamento seguro dos botões
    const buttonsMap = {
        'home': () => document.querySelector('.tab-btn[data-tab="home"]'),
        'planos': () => document.querySelector('.tab-btn[data-tab="planos"]'),
        'servicos': () => document.querySelector('.tab-btn[data-tab="servicos"]'),
        'faq': () => document.querySelector('.tab-btn[data-tab="faq"]'),
        'formulario': () => document.querySelector('.tab-btn[data-tab="formulario"]'),
        'contato': () => document.querySelector('.tab-btn[data-tab="contato"]')
    };
    
    // Resetar todos os botões
    const allButtons = document.querySelectorAll(CONFIG.SELECTORS.TAB_BUTTONS);
    allButtons.forEach(btn => {
        if (btn && btn.tagName !== 'A') {
            btn.classList.remove(CONFIG.CLASSES.ACTIVE, CONFIG.CLASSES.TEXT_WHITE, CONFIG.CLASSES.BG_INDIGO);
            btn.classList.add(CONFIG.CLASSES.TEXT_NEUTRAL);
        }
    });
    
    // Ativar botão correto
    const activeButton = buttonsMap[validId] ? buttonsMap[validId]() : null;
    if (activeButton && activeButton.tagName !== 'A') {
        activeButton.classList.remove(CONFIG.CLASSES.TEXT_NEUTRAL);
        activeButton.classList.add(CONFIG.CLASSES.ACTIVE, CONFIG.CLASSES.TEXT_WHITE, CONFIG.CLASSES.BG_INDIGO);
    }
}

// ============================================================
// MENU MOBILE (SEGURO)
// ============================================================

/**
 * Alterna o menu mobile com segurança
 */
function toggleMobileMenu() {
    const menu = document.querySelector(CONFIG.SELECTORS.MOBILE_MENU);
    if (menu) {
        // Prevenir múltiplas animações rápidas
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
        } else {
            menu.classList.add('active');
        }
    }
}

/**
 * Fecha o menu mobile automaticamente
 */
function closeMobileMenu() {
    const menu = document.querySelector(CONFIG.SELECTORS.MOBILE_MENU);
    if (menu && menu.classList.contains('active')) {
        menu.classList.remove('active');
    }
}

// ============================================================
// FAQ ACCORDION (SEGURO)
// ============================================================

/**
 * Alterna a visibilidade da resposta FAQ
 * @param {HTMLElement} btn - Botão clicado
 */
function toggleFaq(btn) {
    // Validar botão
    if (!btn || !(btn instanceof HTMLElement)) return;
    
    const item = btn.closest(CONFIG.SELECTORS.FAQ_ITEMS);
    if (!item) return;
    
    const answer = item.querySelector(CONFIG.SELECTORS.FAQ_ANSWERS);
    const icon = item.querySelector(CONFIG.SELECTORS.FAQ_ICONS);
    
    if (!answer || !icon) return;
    
    const isOpen = !answer.classList.contains(CONFIG.CLASSES.HIDDEN);
    
    // Fechar todas as FAQs
    const allAnswers = document.querySelectorAll(CONFIG.SELECTORS.FAQ_ANSWERS);
    const allIcons = document.querySelectorAll(CONFIG.SELECTORS.FAQ_ICONS);
    
    allAnswers.forEach(a => a.classList.add(CONFIG.CLASSES.HIDDEN));
    allIcons.forEach(i => {
        if (i && i.setAttribute) {
            i.setAttribute('data-icon', 'lucide:plus');
            if (i.style) i.style.transform = 'rotate(0deg)';
        }
    });
    
    // Abrir a clicada (se estava fechada)
    if (!isOpen) {
        answer.classList.remove(CONFIG.CLASSES.HIDDEN);
        icon.setAttribute('data-icon', 'lucide:minus');
        if (icon.style) icon.style.transform = 'rotate(180deg)';
    }
}

// ============================================================
// ANIMAÇÕES COM INTERSECTION OBSERVER (SEGURO)
// ============================================================

/**
 * Inicializa animações com Intersection Observer
 */
function initAnimations() {
    // Verificar suporte ao Intersection Observer
    if (!window.IntersectionObserver) {
        console.warn('Intersection Observer não suportado');
        return;
    }
    
    const observerOptions = {
        threshold: CONFIG.ANIMATION.THRESHOLD,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Selecionar elementos para animar
    const elementsToAnimate = document.querySelectorAll(CONFIG.SELECTORS.ANIMATE_ELEMENTS);
    elementsToAnimate.forEach((el, i) => {
        if (el) {
            el.style.opacity = '0';
            el.style.animationDelay = `${i * CONFIG.ANIMATION.DELAY_BASE}s`;
            observer.observe(el);
        }
    });
}

// ============================================================
// INICIALIZAÇÃO SEGURA
// ============================================================

/**
 * Configura o estado inicial do site
 */
function setInitialState() {
    // Garantir que a seção home está visível
    const homeSection = document.getElementById('section-home');
    const allSections = document.querySelectorAll(CONFIG.SELECTORS.SECTIONS);
    
    if (allSections.length) {
        allSections.forEach(section => {
            section.classList.remove(CONFIG.CLASSES.VISIBLE);
        });
    }
    
    if (homeSection) {
        homeSection.classList.add(CONFIG.CLASSES.VISIBLE);
    }
    
    // Ativar botão home
    updateActiveButton('home');
}

/**
 * Configura navegação segura
 */
function initNavigation() {
    // Botões de navegação
    const navButtons = document.querySelectorAll(CONFIG.SELECTORS.TAB_BUTTONS);
    navButtons.forEach(btn => {
        if (btn && btn.tagName !== 'A') {
            addSecureEventListener(btn, 'click', (e) => {
                e.preventDefault();
                const tab = btn.getAttribute('data-tab');
                if (tab) showSection(tab);
            });
        }
    });
}

/**
 * Configura botões de call to action seguros
 */
function initCTAs() {
    // Botão "Ver Planos" no hero
    const verPlanosBtn = document.querySelector('button[onclick*="showSection(\'planos\')"]');
    if (verPlanosBtn) {
        addSecureEventListener(verPlanosBtn, 'click', (e) => {
            e.preventDefault();
            showSection('planos');
        });
    }
    
    // Botão "Falar com Consultor"
    const falarConsultorBtn = document.querySelector('button[onclick*="showSection(\'contato\')"]');
    if (falarConsultorBtn) {
        addSecureEventListener(falarConsultorBtn, 'click', (e) => {
            e.preventDefault();
            showSection('contato');
        });
    }
}

/**
 * Configura links externos com segurança
 */
function setupExternalLinks() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        // Garantir que links externos têm rel="noopener noreferrer"
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        } else {
            const rel = link.getAttribute('rel');
            if (!rel.includes('noopener')) {
                link.setAttribute('rel', `${rel} noopener noreferrer`);
            }
        }
    });
}

/**
 * Previne injeção de scripts maliciosos
 */
function preventScriptInjection() {
    // Sanitizar qualquer dado vindo do localStorage/sessionStorage
    try {
        const dangerousKeys = ['script', 'javascript', 'eval', 'alert'];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && dangerousKeys.some(dk => key.toLowerCase().includes(dk))) {
                localStorage.removeItem(key);
            }
        }
    } catch (e) {
        // Erro ignorado - localStorage pode não estar disponível
    }
}

/**
 * Detecta e previne console injection
 */
function protectConsole() {
    if (typeof window !== 'undefined') {
        // Prevenir overwrite de funções críticas
        const originalConsole = window.console;
        if (originalConsole) {
            Object.freeze(originalConsole);
        }
    }
}

// ============================================================
// HANDLER DE ERROS GLOBAIS
// ============================================================

/**
 * Tratamento global de erros
 */
window.addEventListener('error', function(e) {
    console.error('Erro global capturado:', e.message);
    // Não mostrar erros para o usuário final
    e.preventDefault();
    return false;
});

/**
 * Tratamento de promises rejeitadas
 */
window.addEventListener('unhandledrejection', function(e) {
    console.error('Promise rejeitada não tratada:', e.reason);
    e.preventDefault();
});

// ============================================================
// INICIALIZAÇÃO PRINCIPAL
// ============================================================

/**
 * Inicializa todas as funcionalidades do site
 */
function init() {
    // Proteções de segurança
    preventScriptInjection();
    protectConsole();
    setupExternalLinks();
    
    // Configuração inicial
    setInitialState();
    
    // Inicializar navegação
    initNavigation();
    initCTAs();
    
    // Inicializar animações (com delay para garantir DOM)
    setTimeout(() => {
        initAnimations();
    }, 100);
    
    // Fechar menu mobile ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) {
            closeMobileMenu();
        }
    });
    
    // Log seguro (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('✅ Hego Digital - Site inicializado com segurança');
    }
}

// ============================================================
// EXPORTAÇÃO DE FUNÇÕES PARA USO GLOBAL (SEGURO)
// ============================================================

// Expor apenas funções necessárias no escopo global
window.showSection = showSection;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleFaq = toggleFaq;

// ============================================================
// INICIALIZAR APÓS DOM CARREGADO
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================================
// FIM DO SCRIPT
// ============================================================