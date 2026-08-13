(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  if (reduceMotion || isTouch) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'comet-canvas';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var W, H, points = [];
  var mouseX = null, mouseY = null;

  function resize() {
    W = canvas.width = window.innerWidth * devicePixelRatio;
    H = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', function (e) {
    mouseX = e.clientX * devicePixelRatio;
    mouseY = e.clientY * devicePixelRatio;
    points.push({ x: mouseX, y: mouseY, life: 1 });
    if (points.length > 22) points.shift();
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      p.life -= 0.045;
    }
    points = points.filter(function (p) { return p.life > 0; });

    for (var j = 0; j < points.length; j++) {
      var pt = points[j];
      var r = 3 * devicePixelRatio * pt.life;
      var grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, r * 3);
      grad.addColorStop(0, 'rgba(139,107,255,' + (pt.life * 0.55).toFixed(3) + ')');
      grad.addColorStop(1, 'rgba(70,230,213,0)');
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(pt.x, pt.y, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }
  draw();
})();
