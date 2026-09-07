// =========================================================
// Sandeep Gautam — Portfolio interactions
// =========================================================
(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav scroll state ---------- */
  var nav = document.querySelector('header.nav');
  function onScroll(){
    if(!nav) return;
    if(window.scrollY > 24){ nav.classList.add('scrolled'); }
    else{ nav.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- Role cycling typewriter ---------- */
  var roles = ['Data Analyst', 'Java Developer', 'Python Programmer', 'BI & Dashboard Builder'];
  var roleEl = document.getElementById('roleText');
  if(roleEl){
    if(reduceMotion){
      roleEl.textContent = roles[0];
    } else {
      var ri = 0, ci = 0, deleting = false;
      function tick(){
        var word = roles[ri];
        if(!deleting){
          ci++;
          roleEl.textContent = word.slice(0, ci);
          if(ci === word.length){
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
        } else {
          ci--;
          roleEl.textContent = word.slice(0, ci);
          if(ci === 0){
            deleting = false;
            ri = (ri + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 35 : 65);
      }
      tick();
    }
  }

  /* ---------- Terminal typed output ---------- */
  var termEl = document.getElementById('typedOutput');
  if(termEl){
    var termScript = [
      { t: 'line', text: '$ whoami', cls: 'prompt' },
      { t: 'out',  text: 'sandeep_gautam · B.E. Information Technology' },
      { t: 'line', text: '$ cat focus.txt', cls: 'prompt' },
      { t: 'out',  text: 'Data Analysis \u2022 Java \u2022 Python \u2022 SQL \u2022 Power BI' },
      { t: 'line', text: '$ python3 career.py --status', cls: 'prompt' },
      { t: 'out',  text: '> Interning as Data Analyst @ CodeAlpha (Aug\u2013Sep 2026)' },
      { t: 'out',  text: '> 5 shipped projects \u2014 data, web \u0026 IoT' },
      { t: 'out',  text: '> Open to full-time \u0026 internship roles' }
    ];

    if(reduceMotion){
      termEl.innerHTML = termScript.map(function(l){
        return '<div class="term-line ' + (l.cls==='prompt' ? '' : '') + '">' +
          (l.t === 'line' ? '<span class="prompt">' + l.text + '</span>' : '<span class="term-out">' + l.text + '</span>') +
          '</div>';
      }).join('');
    } else {
      var lineIdx = 0, charIdx = 0;
      termEl.innerHTML = '';
      var currentLineDiv = null;

      function typeNext(){
        if(lineIdx >= termScript.length){
          var caret = document.createElement('span');
          caret.className = 'term-caret';
          termEl.appendChild(caret);
          return;
        }
        var item = termScript[lineIdx];
        if(charIdx === 0){
          currentLineDiv = document.createElement('div');
          currentLineDiv.className = 'term-line';
          var span = document.createElement('span');
          span.className = item.t === 'line' ? 'prompt' : 'term-out';
          currentLineDiv.appendChild(span);
          termEl.appendChild(currentLineDiv);
        }
        var span = currentLineDiv.querySelector('span');
        charIdx++;
        span.textContent = item.text.slice(0, charIdx);

        if(charIdx >= item.text.length){
          lineIdx++;
          charIdx = 0;
          setTimeout(typeNext, item.t === 'line' ? 260 : 420);
        } else {
          setTimeout(typeNext, item.t === 'line' ? 34 : 16);
        }
      }
      setTimeout(typeNext, 500);
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Skill bar fill (trigger when in view) ---------- */
  var barSection = document.getElementById('skills');
  var bars = document.querySelectorAll('.bar-fill');
  function fillBars(){
    bars.forEach(function(bar){
      var target = bar.getAttribute('data-value');
      bar.style.width = target + '%';
    });
  }
  if(barSection && 'IntersectionObserver' in window){
    var barIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          fillBars();
          barIO.disconnect();
        }
      });
    }, { threshold: 0.3 });
    barIO.observe(barSection);
  } else {
    fillBars();
  }

  /* ---------- Animated stat counters ---------- */
  var counters = document.querySelectorAll('.num[data-count]');
  function animateCounter(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals'),10) : 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400;
    var startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / dur, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if(progress < 1){ requestAnimationFrame(step); }
      else{ el.textContent = target.toFixed(decimals) + suffix; }
    }
    requestAnimationFrame(step);
  }
  if(counters.length && 'IntersectionObserver' in window){
    var cIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCounter(entry.target);
          cIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function(el){ cIO.observe(el); });
  }

  /* ---------- Project card tilt on hover ---------- */
  if(!reduceMotion && window.matchMedia('(hover: hover)').matches){
    document.querySelectorAll('.project-card, .bento-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(700px) rotateX(' + (-y*4) + 'deg) rotateY(' + (x*4) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  /* ---------- Smooth in-page nav active state (optional polish) ---------- */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');
  if(sections.length && navLinks.length && 'IntersectionObserver' in window){
    var navIO = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.getAttribute('id');
        var link = document.querySelector('.nav-links a[href="#' + id + '"]');
        if(!link) return;
        if(entry.isIntersecting){
          navLinks.forEach(function(l){ l.style.color = ''; l.style.background=''; });
          link.style.color = 'var(--text)';
          link.style.background = 'var(--glass)';
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function(s){ navIO.observe(s); });
  }

})();