// ============================================================
// SCRIPT.JS — behavior only (all content now lives in index.html)
// ------------------------------------------------------------
// This file does NOT build or inject any page content. It only
// powers small interactive effects: smooth scrolling, the mobile
// menu, the typing effect, scroll-reveal animations, the skill
// bar fill-in, the scroll progress bar, and the active nav link.
// Edit index.html directly to change any text, links, or images.
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Footer year ----------
  var yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Smooth scroll for any [data-scroll] element ----------
  function scrollToId(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-scroll]');
    if (trigger) {
      e.preventDefault();
      scrollToId(trigger.dataset.scroll);
      // close mobile menu if open
      closeMobileNav();
    }
  });

  // ---------- Mobile nav toggle ----------
  var toggle = document.getElementById('nav-toggle');
  var mobile = document.getElementById('nav-mobile');
  var icon = document.getElementById('nav-icon');

  function closeMobileNav() {
    var focusWasInMenu = mobile && mobile.contains(document.activeElement);
    if (mobile) {
      mobile.classList.remove('open');
      mobile.setAttribute('aria-hidden', 'true');
      mobile.inert = true;
    }
    if (icon) icon.className = 'fa-solid fa-bars';
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      if (focusWasInMenu) toggle.focus();
    }
  }

  if (toggle && mobile && icon) {
    toggle.addEventListener('click', function () {
      var open = mobile.classList.toggle('open');
      icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      mobile.setAttribute('aria-hidden', open ? 'false' : 'true');
      mobile.inert = !open;
    });

    // Close on outside click / Escape (nicer touch UX, avoids a stuck-open menu)
    document.addEventListener('click', function (e) {
      if (!mobile.classList.contains('open')) return;
      if (mobile.contains(e.target) || toggle.contains(e.target)) return;
      closeMobileNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });

    // Close the mobile menu automatically if the viewport is resized/
    // rotated past the desktop breakpoint while it's open.
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && mobile.classList.contains('open')) {
        closeMobileNav();
      }
    });
  }

  // ---------- Typing effect (rotates through personal.roles) ----------
  (function () {
    var el = document.getElementById('typed-text');
    if (!el) return;

    var phrases = ['Cloud & DevOps Engineer', 'Cloud Enthusiast', 'DevOps Learner', 'CSE Student'];
    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }
    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600); // pause at full word
          return;
        }
        setTimeout(tick, 90);
      } else {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 45);
      }
    }
    tick();
  })();

  // ---------- Animated number counters (for elements with data-count) ----------
  (function () {
    var counters = document.querySelectorAll('.stat-num[data-count]');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        if (prefersReducedMotion) {
          el.textContent = target + suffix;
          observer.unobserve(el);
          return;
        }
        var duration = 1600;
        var start = performance.now();

        function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(function (el) { observer.observe(el); });
  })();

  // ---------- Scroll reveal ----------
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

  // ---------- Skill progress bars ----------
  var barObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var bar = entry.target;
        bar.style.width = bar.dataset.level + '%';
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-bar-fill').forEach(function (bar) { barObserver.observe(bar); });

  // ---------- GitHub repository showcase ----------
  (function () {
    var repoGrid = document.getElementById('github-repos');
    if (!repoGrid) return;

    var username = 'HariKrishnan-code';
    var preferredNames = (repoGrid.dataset.githubRepos || '')
      .split(',')
      .map(function (name) { return name.trim().toLowerCase(); })
      .filter(Boolean);
    var endpoint = 'https://api.github.com/users/' + username + '/repos?sort=updated&direction=desc&per_page=100';

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>'"]/g, function (character) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character];
      });
    }

    function formatDate(date) {
      return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(new Date(date));
    }

    fetch(endpoint, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (response) {
        if (!response.ok) throw new Error('GitHub repositories could not be loaded');
        return response.json();
      })
      .then(function (repositories) {
        if (!repositories.length) throw new Error('No public repositories found');
        var selectedRepositories = preferredNames.length
          ? preferredNames.map(function (preferredName) {
            return repositories.find(function (repo) { return repo.name.toLowerCase() === preferredName; });
          }).filter(Boolean)
          : repositories.slice(0, 4);
        if (!selectedRepositories.length) selectedRepositories = repositories.slice(0, 4);

        repoGrid.innerHTML = selectedRepositories.map(function (repo) {
          var language = repo.language || 'Code';
          var description = repo.description || 'A public project and learning experiment from my GitHub workspace.';
          return '<article class="glass glass-hover lift github-repo-card reveal is-visible">' +
            '<div class="github-repo-head"><span class="github-repo-icon"><i class="fa-solid fa-code"></i></span><span class="github-repo-status">' + escapeHtml(language) + '</span></div>' +
            '<h3 class="github-repo-title">' + escapeHtml(repo.name) + '</h3>' +
            '<p class="github-repo-text">' + escapeHtml(description) + '</p>' +
            '<div class="github-repo-meta"><span><i class="fa-solid fa-star"></i> ' + repo.stargazers_count + '</span><span><i class="fa-solid fa-code-branch"></i> ' + repo.forks_count + '</span><span>Updated ' + escapeHtml(formatDate(repo.updated_at)) + '</span></div>' +
            '<a class="github-repo-link" href="' + escapeHtml(repo.html_url) + '" target="_blank" rel="noreferrer">View repository <i class="fa-solid fa-arrow-up-right-from-square"></i></a>' +
            '</article>';
        }).join('');
      })
      .catch(function () {
        repoGrid.innerHTML = '<article class="glass github-repo-card github-repo-error"><i class="fa-solid fa-circle-info"></i><p>Repository activity is temporarily unavailable.</p><a class="github-repo-link" href="https://github.com/' + username + '?tab=repositories" target="_blank" rel="noreferrer">Browse repositories on GitHub <i class="fa-solid fa-arrow-up-right-from-square"></i></a></article>';
      });
  })();

  // ---------- Scroll progress bar + navbar shrink ----------
  var progressBar = document.getElementById('scroll-progress');
  var navbar = document.getElementById('navbar-el');
  function onScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 20);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Active nav link ----------
  var navLinkIds = ['hero', 'about', 'skills', 'why', 'journey', 'project', 'github', 'internship', 'certificates', 'contact'];
  var navButtons = document.querySelectorAll('[data-nav]');

  function setActiveNav(activeId) {
    navButtons.forEach(function (btn) {
      var isActive = btn.dataset.nav === activeId;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  function updateActiveNav() {
    var marker = (navbar ? navbar.getBoundingClientRect().height : 0) + window.innerHeight * 0.2;
    var activeId = navLinkIds[0];

    navLinkIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= marker) activeId = id;
    });
    setActiveNav(activeId);
  }

  updateActiveNav();
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav);

});
