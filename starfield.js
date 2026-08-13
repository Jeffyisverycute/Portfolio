(function () {
  var canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W, H, stars = [], shootingStars = [];
  var STAR_COUNT = 160;

  function resize() {
    W = canvas.width = window.innerWidth * devicePixelRatio;
    H = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }

  function makeStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 * devicePixelRatio + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.04
      });
    }
  }

  function maybeSpawnShootingStar() {
    if (reduceMotion) return;
    if (Math.random() < 0.0028 && shootingStars.length < 2) {
      var startX = Math.random() * W * 0.6 + W * 0.2;
      shootingStars.push({
        x: startX,
        y: -20,
        vx: -3.2 * devicePixelRatio,
        vy: 4.4 * devicePixelRatio,
        life: 0,
        maxLife: 60
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.phase += s.twinkleSpeed;
      s.y += s.drift;
      if (s.y > H) s.y = 0;
      if (s.y < 0) s.y = H;

      var alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(238,240,251,' + alpha.toFixed(3) + ')';
      ctx.fill();
    }

    maybeSpawnShootingStar();
    for (var j = shootingStars.length - 1; j >= 0; j--) {
      var sh = shootingStars[j];
      sh.x += sh.vx;
      sh.y += sh.vy;
      sh.life++;

      var progress = sh.life / sh.maxLife;
      var fade = 1 - progress;

      ctx.save();
      ctx.strokeStyle = 'rgba(70,230,213,' + (fade * 0.9).toFixed(3) + ')';
      ctx.lineWidth = 2 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(sh.x, sh.y);
      ctx.lineTo(sh.x - sh.vx * 5, sh.y - sh.vy * 5);
      ctx.stroke();
      ctx.restore();

      if (sh.life > sh.maxLife || sh.y > H) shootingStars.splice(j, 1);
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () {
    resize();
    makeStars();
  });

  resize();
  makeStars();
  draw();
})();
