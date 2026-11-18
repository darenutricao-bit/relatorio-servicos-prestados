(function () {
  var W = 1920, H = 1080;
  var stages = Array.prototype.slice.call(document.querySelectorAll('.stage'));
  var counter = document.getElementById('counter');

  function fit() {
    var k = Math.min(window.innerWidth / W, window.innerHeight / H);
    stages.forEach(function (st) {
      var f = st.firstElementChild;
      f.style.width = W * k + 'px';
      f.style.height = H * k + 'px';
      f.firstElementChild.style.transform = 'scale(' + k + ')';
    });
  }
  fit();
  window.addEventListener('resize', fit);

  var current = 0;
  function setCounter() { counter.textContent = (current + 1) + ' / ' + stages.length; }
  setCounter();

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.6) {
        e.target.classList.add('in');
        current = stages.indexOf(e.target);
        setCounter();
      } else if (!e.isIntersecting) {
        e.target.classList.remove('in');
      }
    });
  }, { threshold: [0, 0.6, 1] });
  stages.forEach(function (s) { io.observe(s); });

  function go(i) {
    i = Math.max(0, Math.min(stages.length - 1, i));
    stages[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  window.addEventListener('keydown', function (e) {
    if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].indexOf(e.key) > -1) { e.preventDefault(); go(current + 1); }
    if (['ArrowUp', 'ArrowLeft', 'PageUp'].indexOf(e.key) > -1) { e.preventDefault(); go(current - 1); }
    if (e.key === 'Home') { e.preventDefault(); go(0); }
    if (e.key === 'End') { e.preventDefault(); go(stages.length - 1); }
  });
})();
