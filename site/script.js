/* K-Service — поведение лендинга */

document.getElementById('year').textContent = new Date().getFullYear();

// Появление блоков при прокрутке
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  var els = document.querySelectorAll('.why__card, .symptoms li, .way, .visit__card, .warranty, .works');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
}

// Просмотр фото мастерской
(function () {
  var box = document.querySelector('.lightbox');
  if (!box || !box.showModal) return;
  var links = [].slice.call(document.querySelectorAll('.gallery__link'));
  var img = box.querySelector('.lightbox__img'), cap = box.querySelector('.lightbox__cap');
  var i = 0, startX = null;
  function show(n) {
    i = (n + links.length) % links.length;
    var a = links[i], t = a.parentNode.querySelector('figcaption b');
    img.src = a.href; img.alt = a.querySelector('img').alt;
    cap.textContent = t ? t.textContent : '';
  }
  links.forEach(function (a, n) {
    a.addEventListener('click', function (e) { e.preventDefault(); show(n); box.showModal(); document.body.style.overflow = 'hidden'; });
  });
  box.addEventListener('close', function () { document.body.style.overflow = ''; });
  box.querySelector('.lightbox__close').onclick = function () { box.close(); };
  box.querySelector('.lightbox__prev').onclick = function () { show(i - 1); };
  box.querySelector('.lightbox__next').onclick = function () { show(i + 1); };
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
  box.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX; startX = null;
    if (Math.abs(dx) > 50) show(dx < 0 ? i + 1 : i - 1);
  });
})();

// «Гарантия»: ставим жёлтую карточку по центру экрана под шапкой
document.querySelectorAll('a[href="#warranty"]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    var card = document.getElementById('warranty');
    var headerH = document.querySelector('.header').offsetHeight;
    var free = innerHeight - headerH - card.offsetHeight;
    var top = card.getBoundingClientRect().top + scrollY - headerH - Math.max(free / 2, 24);
    e.preventDefault();
    scrollTo({ top: top, behavior: 'smooth' });
    history.replaceState(null, '', '#warranty');
  });
});

// Тень у шапки после прокрутки
var header = document.querySelector('.header');
addEventListener('scroll', function () { header.classList.toggle('is-scrolled', scrollY > 8); }, { passive: true });
