document.addEventListener('DOMContentLoaded', function () {
  var links = document.querySelectorAll('.orbit-body a');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!links.length || reduceMotion) return;

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      document.body.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
      document.body.style.opacity = '0';
      document.body.style.transform = 'scale(1.02)';
      setTimeout(function () { window.location.href = href; }, 240);
    });
  });
});
