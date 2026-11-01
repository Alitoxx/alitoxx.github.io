/* Sitio de Alexis San Martín. Sin dependencias.
   - idioma: se elige con el toggle, se guarda en localStorage y se respeta en
     todas las páginas; el español es el idioma por defecto.
   - revelados: una sola vez por elemento, vía IntersectionObserver.
   - reloj: la "cosa viva" del bloque Ahora, con texto de reserva sin JS. */

(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var STORAGE_KEY = 'alexis-lang';

  function setLang(lang) {
    root.setAttribute('data-lang', lang);
    root.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });
    paintClock();
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-set-lang]'), function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-set-lang')); });
  });

  var stored = null;
  try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  setLang(stored === 'en' ? 'en' : 'es');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('[data-reveal], [data-words]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.2 });
    Array.prototype.forEach.call(targets, function (t) { io.observe(t); });
  } else {
    Array.prototype.forEach.call(targets, function (t) { t.classList.add('in'); });
  }

  var clock = document.getElementById('clock');
  function paintClock() {
    if (!clock) return;
    var now = new Date();
    var local = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var santiago = now.toLocaleTimeString('es-CL', { timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit' });
    clock.textContent = (root.getAttribute('data-lang') === 'en' ? 'your time ' : 'tu hora ')
      + local + ' · santiago ' + santiago;
  }
  try { paintClock(); } catch (e) {}
  if (clock && !reduce) { setInterval(paintClock, 1000); }
})();
