(function () {
  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('nav-panel');
  if (toggle && panel) {
    var setOpen = function (open) {
      panel.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    try {
      var mq = window.matchMedia('(min-width: 861px)');
      var onMq = function (m) { if (m.matches) setOpen(false); };
      if (mq.addEventListener) mq.addEventListener('change', onMq); else if (mq.addListener) mq.addListener(onMq);
    } catch (e) {}
  }

  // Mobile booking bar: appears once the hero's own buttons scroll away
  var bar = document.getElementById('book-bar');
  var heroActions = document.querySelector('.hero .actions, .page-hero .actions, .article-head');
  if (bar && 'IntersectionObserver' in window) {
    var contact = document.getElementById('contact');
    var state = { pastHero: false, atContact: false };
    var update = function () {
      var show = state.pastHero && !state.atContact;
      bar.classList.toggle('show', show);
      bar.setAttribute('aria-hidden', String(!show));
      bar.querySelector('a').tabIndex = show ? 0 : -1;
    };
    if (heroActions) new IntersectionObserver(function (e) { state.pastHero = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; update(); }).observe(heroActions);
    if (contact) new IntersectionObserver(function (e) { state.atContact = e[0].isIntersecting; update(); }).observe(contact);
  }

})();

(function () {
  // Contact form (Formspree)
  var form = document.getElementById('contact-form');
  if (form) {
    form.noValidate = true;
    var status = document.getElementById('form-status');
    var btn = form.querySelector('button[type="submit"]');
    var btnLabel = btn.innerHTML;
    var email = form.querySelector('#email');
    var emailErr = document.getElementById('email-error');
    var link = form.querySelector('#link');
    var linkErr = document.getElementById('link-error');
    var icon = function (id) { return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>'; };

    var validate = function () {
      var ok = true;
      var v = email.value.trim();
      if (!v) { emailErr.textContent = 'Enter your email so we can reply.'; ok = false; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { emailErr.textContent = 'That email looks incomplete. Check it and try again.'; ok = false; }
      else emailErr.textContent = '';
      email.setAttribute('aria-invalid', emailErr.textContent ? 'true' : 'false');

      var l = link.value.trim();
      if (l && !/^https?:\/\/\S+\.\S+/.test(l)) { linkErr.textContent = 'Paste the full link, starting with https://'; ok = false; }
      else linkErr.textContent = '';
      link.setAttribute('aria-invalid', linkErr.textContent ? 'true' : 'false');
      return ok;
    };
    // Validate on submit only, so the Send button never moves mid-click.
    // While typing, clear an error once the field becomes valid.
    var clearIfValid = function () {
      if (emailErr.textContent && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { emailErr.textContent = ''; email.setAttribute('aria-invalid', 'false'); }
      if (linkErr.textContent && (!link.value.trim() || /^https?:\/\/\S+\.\S+/.test(link.value.trim()))) { linkErr.textContent = ''; link.setAttribute('aria-invalid', 'false'); }
    };
    email.addEventListener('input', clearIfValid);
    link.addEventListener('input', clearIfValid);

    // Pre-select the service when arriving from a services page button (/?service=diagnostic#contact)
    var svcSel = form.querySelector('#service');
    var svcMap = { review: 'Bid/No-Bid & Pricing Review', assessment: 'Bid/No-Bid & Pricing Review', diagnostic: 'Win/Loss Review', portfolio: 'Win/Loss Review', capture: 'Capture Planning', pursuit: 'Proposal Writing & Management', proposal: 'Proposal Writing & Management', fractional: 'Fractional Bid Manager', check: 'Bid Health Check (free)', call: 'Bid Health Check (free)' };
    try {
      var want = new URLSearchParams(location.search).get('service');
      if (svcSel && want && svcMap[want]) svcSel.value = svcMap[want];
    } catch (e) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.innerHTML = '';
      if (!validate()) {
        (email.getAttribute('aria-invalid') === 'true' ? email : link).focus();
        return;
      }
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('bad status');
          form.reset();
          status.className = 'form-status ok';
          status.innerHTML = icon('i-check-circle') + '<span>Sent. You’ll hear back within one business day.</span>';
          btn.innerHTML = btnLabel;
          btn.disabled = false;
        })
        .catch(function () {
          status.className = 'form-status err';
          status.innerHTML = icon('i-alert') + '<span>That didn’t send. Your details are still here, so try again, or email <a href="mailto:akili@thebiddesk.ca">akili@thebiddesk.ca</a>.</span>';
          btn.innerHTML = btnLabel;
          btn.disabled = false;
        });
    });
  }
})();
