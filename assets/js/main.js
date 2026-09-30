/* Muhammet Begenjov portfolio: site behaviour */

/* Page flips to dark once Services has scrolled past; nav hides on scroll down; services hover pill */
(function(){
  var lightSection = document.querySelector('.services');
  if(!lightSection || !('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var passed = entry.boundingClientRect.bottom <= 0 && !document.body.classList.contains('on-project');
      document.body.classList.toggle('is-dark', passed);
    });
  }, { threshold:0 });
  observer.observe(lightSection);
})();

(function(){
  var nav = document.querySelector('nav');
  if(!nav) return;
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll(){
    var y = window.scrollY;
    if(y > lastY && y > nav.offsetHeight){
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive:true });
})();

(function(){
  var rows = document.querySelector('.rows');
  var pill = rows && rows.querySelector('.row-pill');
  if(!pill) return;
  var active = false;
  rows.querySelectorAll('.row').forEach(function(row){
    row.addEventListener('mouseenter', function(){
      // First row entered: place the pill there instantly; after that it slides between rows
      if(!active) pill.classList.add('no-move');
      pill.style.top = (row.offsetTop - 1) + 'px';
      pill.style.height = (row.offsetHeight + 2) + 'px';
      if(!active){ void pill.offsetWidth; pill.classList.remove('no-move'); active = true; }
      rows.classList.add('is-hovering');
    });
  });
  rows.addEventListener('mouseleave', function(){
    rows.classList.remove('is-hovering');
    active = false;
  });
})();


/* ---------------------------------------------------------------------------
   PROJECTS
   Every project lives in its own folder: projects/<slug>/project.json + images.
   projects/index.json lists the slugs in the order they appear in Works.
   Cards are built from that data; #/work/<slug> shows the project's page.
--------------------------------------------------------------------------- */
(function(){
  var home = document.querySelector('.view-home');
  var view = document.querySelector('.project');
  var cardsBox = document.querySelector('.cards');
  if(!home || !view || !cardsBox) return;

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h16M13 5l7 7-7 7"/></svg>';
  var homeTitle = document.title;
  var projects = [];   // [{slug, title, category, ...}] in Works order

  function esc(s){
    return String(s || '').replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function toTop(){ window.scrollTo({top:0, left:0, behavior:'instant'}); }
  // Image paths in project.json are relative to the project's folder. They are made absolute because
  // a url() inside a CSS variable is otherwise resolved against the stylesheet (assets/css/), not the page.
  function img(p, file){
    return file ? "url('" + new URL('projects/' + p.slug + '/' + encodeURI(file), document.baseURI).href + "')" : '';
  }
  function getJSON(url){
    return fetch(url, {cache:'no-cache'}).then(function(r){
      if(!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  /* ---------- Works cards ---------- */
  function renderCards(){
    cardsBox.innerHTML = projects.map(function(p){
      return '<a class="card" href="#/work/' + p.slug + '"' + (p.card ? ' style="--img:' + img(p, p.card) + '"' : '') + '>' +
        '<div class="card-img"></div><div class="card-info"><h3>' + esc(p.title) + '</h3><p>' + esc(p.category) + '</p>' +
        '<span class="card-arrow" aria-hidden="true">' + ARROW + '</span></div></a>';
    }).join('');
    [].forEach.call(document.querySelectorAll('[data-project-count]'), function(el){ el.textContent = projects.length; });
  }

  /* ---------- Project page ---------- */
  function render(p, next){
    // Right column: labelled tags (Industry = category, Discipline = tags)
    var groups = [['Industry', p.category ? [p.category] : []], ['Discipline', p.tags || []]]
      .filter(function(g){ return g[1].length; })
      .map(function(g){
        return '<div class="pj-group"><p class="pj-side-label">' + g[0] + '</p><div class="pj-pills">' +
          g[1].map(function(t){ return '<span class="pj-pill">' + esc(t) + '</span>'; }).join('') + '</div></div>';
      }).join('');
    // The title is the headline; the first 3 paragraphs show, any more open with "Read more"
    var VISIBLE = 3;
    var paras = String(p.description || '').split(/\n\s*\n/).map(function(s){ return s.trim(); }).filter(Boolean);
    var text = paras.map(function(t, k){ return '<p' + (k >= VISIBLE ? ' class="pj-extra"' : '') + '>' + esc(t) + '</p>'; }).join('');
    var more = paras.length > VISIBLE ? '<button class="pj-more" type="button"><span>Read more</span></button>' : '';
    var rows = (p.gallery || []).map(function(r){
      var split = r.type === 'split';
      return '<div class="pj-row pj-row--' + (split ? 'split' : 'single') + '">' + (r.images || []).map(function(f){
        return '<div class="pj-img" role="img" aria-label="' + esc(p.title) + '"' + (f ? ' style="--pic:' + img(p, f) + '"' : '') + '></div>';
      }).join('') + '</div>';
    }).join('');
    var heroStyle = [p.card ? '--img:' + img(p, p.card) : '', p.cover ? '--hero:' + img(p, p.cover) : ''].filter(Boolean).join(';');

    view.innerHTML =
      '<header class="pj-hero" role="img" aria-label="' + esc(p.title) + '"' + (heroStyle ? ' style="' + heroStyle + '"' : '') + '></header>' +
      '<div class="pj-panel">' +
        '<div class="pj-intro">' +
          '<h1 class="pj-headline">' + esc(p.title) + '</h1>' +
          '<div class="pj-main">' +
            '<div class="pj-text">' + text + '</div>' + more +
          '</div>' +
          '<aside class="pj-side">' +
            groups +
          '</aside>' +
        '</div>' +
        (rows ? '<div class="pj-gallery">' + rows + '</div>' : '') +
        '<a class="pj-next" href="#/work/' + next.slug + '">' +
          '<div class="pj-next-inner"><p class="eyebrow">Next project</p>' +
          '<span class="pj-next-title">' + esc(next.title) + ARROW + '</span></div>' +
        '</a>' +
      '</div>';
    var btn = view.querySelector('.pj-more');
    if(btn) btn.addEventListener('click', function(){
      var open = view.querySelector('.pj-text').classList.toggle('is-open');
      btn.querySelector('span').textContent = open ? 'Read less' : 'Read more';
    });
    document.title = p.title + ' — Muhammet Begenjov';
  }

  // Transparent nav while it sits over the project photo
  var nav = document.querySelector('nav');
  function navOverHero(){
    var hero = view.querySelector('.pj-hero');
    var panel = view.querySelector('.pj-panel');
    var over = !view.hidden && hero && panel && nav && panel.getBoundingClientRect().top > nav.offsetHeight;
    document.body.classList.toggle('pj-over-hero', !!over);
    // Hide the photo once the panel covers it, so the panel's rounded bottom corners show the yellow layer
    if(hero && panel) hero.style.visibility = panel.getBoundingClientRect().top < 0 ? 'hidden' : '';
  }
  window.addEventListener('scroll', navOverHero, { passive:true });
  window.addEventListener('resize', navOverHero);

  function route(hash){
    if(typeof hash !== 'string') hash = location.hash;
    var m = hash.match(/^#\/work\/([\w-]+)/);
    var i = -1;
    if(m) projects.forEach(function(p, k){ if(p.slug === m[1]) i = k; });

    if(i < 0){
      if(view.hidden) return;
      view.hidden = true; home.hidden = false;
      document.body.classList.remove('on-project', 'pj-over-hero');
      document.title = homeTitle;
      var target = hash.length > 1 && document.getElementById(hash.slice(1));
      if(target) target.scrollIntoView({behavior:'instant'}); else toTop();
      var services = document.querySelector('.services');
      if(services) document.body.classList.toggle('is-dark', services.getBoundingClientRect().bottom <= 0);
      return;
    }
    render(projects[i], projects[(i + 1) % projects.length]);
    home.hidden = true; view.hidden = false;
    document.body.classList.add('on-project');
    document.body.classList.remove('is-dark');
    toTop();
    if(nav) document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    navOverHero();
  }

  window.addEventListener('hashchange', route);
  // Route on click as well, so pages also switch where the hash cannot change (some embedded previews)
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if(!a) return;
    var href = a.getAttribute('href');
    if(href.indexOf('#/work/') !== 0 && !document.body.classList.contains('on-project')) return;
    e.preventDefault();
    try{ if(location.hash !== href) history.pushState(null, '', href); }catch(err){}
    route(href);
  });
  window.addEventListener('popstate', function(){ route(); });

  /* ---------- Load ---------- */
  getJSON('projects/index.json').then(function(index){
    return Promise.all((index.projects || []).map(function(slug){
      return getJSON('projects/' + slug + '/project.json')
        .then(function(p){ p.slug = slug; return p; })
        .catch(function(err){ console.warn('Skipping project', slug, err); return null; });
    }));
  }).then(function(list){
    projects = list.filter(Boolean);
    renderCards();
    route();
  }).catch(function(err){
    console.error('Could not load projects', err);
    cardsBox.innerHTML = '<p class="cards-error">Projects could not be loaded. Open the site through a web server (see README).</p>';
  });
})();
