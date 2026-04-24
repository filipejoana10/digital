(function () {
  'use strict';

  var sections = {
    home: document.getElementById('section-home'),
    planos: document.getElementById('section-planos'),
    servicos: document.getElementById('section-servicos'),
    contato: document.getElementById('section-contato'),
  };

  var desktopTabs = document.querySelectorAll('.nav-desktop .nav-tab');
  var mobileTabs = document.querySelectorAll('.nav-mobile .nav-tab-sm');
  var allNavButtons = document.querySelectorAll('[data-nav]');

  function navigateTo(tab) {
    if (!sections[tab]) return;

    Object.keys(sections).forEach(function (key) {
      sections[key].classList.remove('active');
    });

    sections[tab].classList.add('active');

    desktopTabs.forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-nav') === tab);
    });

    mobileTabs.forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-nav') === tab);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  allNavButtons.forEach(function (el) {
    el.addEventListener('click', function (e) {
      var target = el.getAttribute('data-nav');
      if (target) {
        e.preventDefault();
        navigateTo(target);
      }
    });
  });

  navigateTo('home');
})();
