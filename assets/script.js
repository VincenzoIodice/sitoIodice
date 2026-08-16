(function(){
  "use strict";

  // Footer year (if present)
  var yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // ---------- Navbar scroll state ----------
  var navbar = document.getElementById('navbar');
  if(navbar){
    var onScroll = function(){
      if(window.scrollY > 30){ navbar.classList.add('scrolled'); }
      else{ navbar.classList.remove('scrolled'); }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---------- Mobile menu ----------
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  if(burger && mobileMenu){
    burger.addEventListener('click', function(){
      var isOpen = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- Scroll reveal (Intersection Observer) ----------
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');
  if(reduceMotion){
    revealEls.forEach(function(el){ el.classList.add('in'); });
  } else if(revealEls.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  // ---------- Animated counters ----------
  var counters = document.querySelectorAll('[data-count]');
  var animateCounter = function(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var duration = 1600;
    var start = null;
    var easeOutQuad = function(t){ return t * (2 - t); };
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var value = Math.floor(easeOutQuad(progress) * target);
      el.textContent = value;
      if(progress < 1){ requestAnimationFrame(step); }
      else { el.textContent = target; }
    }
    requestAnimationFrame(step);
  };
  if(counters.length){
    if(reduceMotion){
      counters.forEach(function(el){ el.textContent = el.getAttribute('data-count'); });
    } else {
      var counterIO = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(function(el){ counterIO.observe(el); });
    }
  }

  // ---------- 3D tilt + glow on tech cards ----------
  var cards = document.querySelectorAll('.tech-card');
  cards.forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = x / rect.width * 100;
      var cy = y / rect.height * 100;
      card.style.setProperty('--mx', cx + '%');
      card.style.setProperty('--my', cy + '%');
      var rotX = ((y / rect.height) - 0.5) * -8;
      var rotY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = 'perspective(700px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // ============================================================
  // COOKIE CONSENT BANNER
  // Salva la scelta in localStorage: "accepted" | "rejected"
  // Nessuno script di terze parti/analytics è attivo di default:
  // se in futuro aggiungi Google Analytics/Meta Pixel ecc.,
  // caricali SOLO quando getConsent() === "accepted".
  // ============================================================
  var CONSENT_KEY = 'doctorlaser_cookie_consent';

  function getConsent(){
    try{ return window.localStorage.getItem(CONSENT_KEY); }
    catch(e){ return null; }
  }
  function setConsent(value){
    try{ window.localStorage.setItem(CONSENT_KEY, value); }
    catch(e){ /* storage non disponibile: il banner ricomparirà, non blocca il sito */ }
  }

  var banner = document.getElementById('cookieBanner');
  if(banner){
    var consent = getConsent();
    if(!consent){
      window.setTimeout(function(){ banner.classList.add('show'); }, 600);
    }
    var acceptBtn = document.getElementById('cookieAccept');
    var rejectBtn = document.getElementById('cookieReject');
    if(acceptBtn){
      acceptBtn.addEventListener('click', function(){
        setConsent('accepted');
        banner.classList.remove('show');
      });
    }
    if(rejectBtn){
      rejectBtn.addEventListener('click', function(){
        setConsent('rejected');
        banner.classList.remove('show');
      });
    }
  }

})();
