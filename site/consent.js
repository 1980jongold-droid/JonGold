/* K-Service — уведомление о cookies и Яндекс.Метрика.
   Метрика загружается только после того, как посетитель нажал «Принять». */

(function () {
  // Номер счётчика Яндекс.Метрики (0 — Метрика не загружается)
  var METRIKA_ID = 109590643;

  var KEY = 'cookie-consent'; // 'yes' | 'no'
  var banner = document.querySelector('.cookie');

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function clearChoice() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function loadMetrika() {
    if (!METRIKA_ID || window.ym) return;
    window.ym = function () { (window.ym.a = window.ym.a || []).push(arguments); };
    window.ym.l = +new Date();
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID;
    document.head.appendChild(s);
    window.ym(METRIKA_ID, 'init', { ssr: true, clickmap: true, trackLinks: true, accurateTrackBounce: true });
  }

  // Удаляем cookies Метрики, если согласие отозвано
  function removeMetrikaCookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ym') === 0) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + location.hostname;
      }
    });
  }

  function show() { if (banner) banner.hidden = false; }
  function hide() { if (banner) banner.hidden = true; }

  if (banner) {
    banner.querySelector('[data-cookie="accept"]').addEventListener('click', function () {
      setChoice('yes'); hide(); loadMetrika();
    });
    banner.querySelector('[data-cookie="decline"]').addEventListener('click', function () {
      var wasLoaded = !!window.ym;
      setChoice('no'); hide(); removeMetrikaCookies();
      if (wasLoaded) location.reload(); // выгружаем уже запущенную Метрику
    });
  }

  // Ссылка «Настройки cookies» в подвале — показать выбор заново
  document.querySelectorAll('[data-cookie="settings"]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); clearChoice(); show(); });
  });

  var choice = getChoice();
  if (choice === 'yes') loadMetrika();
  else if (choice !== 'no') show();

  // Цели Метрики: звонок, мессенджер, карты. В Метрике создайте JavaScript-цели
  // с идентификаторами call, messenger и map.
  document.addEventListener('click', function (e) {
    if (!METRIKA_ID || !window.ym) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href'), goal = null;
    if (href.indexOf('tel:') === 0) goal = 'call';
    else if (/whatsapp\.com|t\.me\/|max\.ru\//.test(href)) goal = 'messenger';
    else if (/2gis\.ru|yandex\.ru\/maps/.test(href)) goal = 'map';
    if (goal) window.ym(METRIKA_ID, 'reachGoal', goal);
  });
})();
