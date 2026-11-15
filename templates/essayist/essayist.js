/*
 * Essayist: a typographic theme for Write.as
 * https://github.com/HackrLife/writeas-templates/tree/main/templates/essayist
 * By Dev Das (blog.dev-das.com). MIT licence.
 *
 * Paste into Write.as > your blog > Customize > Custom JavaScript (Pro).
 * Custom JavaScript only runs when the blog has its own address
 * (yourblog.writeas.com or a custom domain), not on write.as/yourblog.
 * Edit the settings in the first block below; nothing else needs changing.
 */
/* What this script adds:
   1. Header links: About, Subscribe and a Dark/Light switch (the reader's choice is remembered).
   2. Essay numbers (#1, #2 ...) in place of dates, counted from your first essay.
   3. A subscribe box at the end of every essay, wired to Write.as's own email newsletter.
   4. A right-hand column: a podcast card on every page; a reading list of other writers on the
      home page; your own other essays on each essay page (automatic).
   5. Your photo beside the "Who am I?" paragraph of your About page.
*/
(function () {
  var BLOG_ALIAS  = 'PASTE_WRITEAS_BLOG_ALIAS';          // the blog's alias: the part after write.as/ in its address
  var FORM_ACTION = 'PASTE_FORM_ACTION_URL';  // leave as is to use Write.as's own email newsletter; or another provider's form URL
  var EMAIL_FIELD = 'email';                   // the email field's name, if you use another provider
  var SKIP_PAGES  = ['about', 'subscribe'];               // pages that get no number and no subscribe box

  /* ---- Your photo: shown on the About page and in the Listen module ---- */
  var ME = {
    photo: '',   // link to a square photo of you (e.g. uploaded to Snap.as); '' shows your initials
    name: 'Your Name'
  };

  /* ---- Podcast card in the right-hand column (every page) ---- */
  var PODCAST = {   // Leave spotify '' to hide the module.
    title: '',     // optional: the name shown next to the picture; '' uses the show's name from Spotify
    spotify: '',   // your show's Spotify link (Share > Copy link to show): the player always offers the latest episodes
    youtube: ''    // not used while a Spotify link is set; kept for later
  };
  /* ---- Reading list in the right-hand column (home page) ---- */
  var READING = [   // ['Name shown', 'https://address']: replace these, add or remove lines. Leave [] to hide.
    ['Blog 1',  'https://example.com'],
    ['Blog 2',  'https://example.com'],
    ['Blog 3',  'https://example.com'],
    ['Blog 4',  'https://example.com'],
    ['Blog 5',  'https://example.com'],
    ['Blog 6',  'https://example.com'],
    ['Blog 7',  'https://example.com'],
    ['Blog 8',  'https://example.com'],
    ['Blog 9',  'https://example.com'],
    ['Blog 10', 'https://example.com']
  ];

  /* ---- Options ---- */
  var OPTIONS = {
    numbers: true,          // show #1, #2 ... on essays
    moreEssays: 8,          // how many of your other essays to list on an essay page (0 hides the list)
    darkSwitch: true,       // show the Dark/Light switch in the header
    aboutSlug: 'about',     // the address of your About page (blog.example.com/about)
    whoHeading: 'who am i'  // your photo sits beside the paragraph after the About heading containing this
  };

  /* ---- Every word the theme shows: edit to your own voice or language ---- */
  var TEXT = {
    about: 'About',
    subscribe: 'Subscribe',
    dark: 'Dark',
    light: 'Light',
    subscribeTitle: 'Get new essays by email.',
    subscribeButton: 'Subscribe',
    emailPlaceholder: 'you@example.com',
    listen: 'Listen',
    podcastFallback: 'The podcast',
    onSpotify: 'on Spotify',
    onYouTube: 'on YouTube',
    reading: 'Reading',
    moreEssays: 'More essays',
    numberPrefix: '#'
  };


  if (SKIP_PAGES.indexOf(OPTIONS.aboutSlug) === -1) SKIP_PAGES.push(OPTIONS.aboutSlug);
  var root = document.documentElement;
  var isPost = document.body.id === 'post';
  var isIndex = document.body.id === 'collection';
  var slugOf = function (href) {
    return (href || '').replace(/[?#].*$/, '').replace(/\/+$/, '').split('/').pop().toLowerCase();
  };
  var currentSlug = slugOf(location.pathname);
  // when the blog is viewed at write.as/<alias>/ (e.g. while signed in), links need that prefix
  var BASE = location.pathname.indexOf('/' + BLOG_ALIAS + '/') === 0 ? '/' + BLOG_ALIAS : '';
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- 1. Dark / Light (light by default, choice remembered) ---------- */
  var savedTheme = store.get('nti-theme');   // the reader's choice; with none, follow the device's light/dark setting
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches)) root.classList.add('nti-dark');
  root.classList.add('nti-ready');   // theme is set: show the page (see the CSS), so it never flashes light first

  /* ---------- 3. Subscribe box ---------- */
  var SUB_TITLE = TEXT.subscribeTitle;
  function subscribeBox(suffix) {
    var action = FORM_ACTION.indexOf('PASTE_') === 0 ? '/api/collections/' + BLOG_ALIAS + '/email/subscribe' : FORM_ACTION;
    var box = document.createElement('section');
    box.className = 'nti-subscribe';
    box.id = 'subscribe';
    box.setAttribute('aria-labelledby', 'nti-sub-title' + suffix);
    box.innerHTML =
      '<h3 id="nti-sub-title' + suffix + '" class="nti-sub-title">' + SUB_TITLE + '</h3>' +
      '<form class="nti-sub-form" method="post" action="' + action + '">' +
        '<input type="hidden" name="web" value="1">' +
        '<label for="nti-sub-email' + suffix + '" class="nti-sub-sr">Email address</label>' +
        '<input id="nti-sub-email' + suffix + '" type="email" name="' + EMAIL_FIELD + '" placeholder="' + esc(TEXT.emailPlaceholder) + '" required autocomplete="email">' +
        '<button type="submit">' + esc(TEXT.subscribeButton) + '</button>' +
      '</form>';
    return box;
  }
  // If Write.as's own email subscribe form is switched on, use it instead of adding a second box.
  var nativeEmail = document.querySelector('form input[type="email"]');
  if (nativeEmail) {
    var nativeBox = nativeEmail.closest('form').parentNode;
    if (!nativeBox.id) nativeBox.id = 'subscribe';
    var nativeText = nativeEmail.closest('form').querySelector('p');
    if (nativeText) nativeText.textContent = SUB_TITLE;
  }
  if (!nativeEmail && isPost && SKIP_PAGES.indexOf(currentSlug) === -1) {
    var article = document.getElementById('post-body');
    if (article && !document.getElementById('subscribe')) article.appendChild(subscribeBox(''));
  }
  if (!nativeEmail && isIndex) {
    var wrapper = document.getElementById('wrapper');
    if (wrapper && !document.getElementById('subscribe')) wrapper.appendChild(subscribeBox('-home'));
  }

  /* ---------- Share links at the end of each essay ---------- */
  var SHARE = ['x', 'linkedin', 'whatsapp', 'email', 'copy'];   // remove any you don't want; order is kept
  if (isPost && SKIP_PAGES.indexOf(currentSlug) === -1 && SHARE.length && !document.querySelector('.nti-share')) {
    var shareBody = document.getElementById('post-body');
    if (shareBody) {
      var canon = document.querySelector('link[rel="canonical"]');
      var pageUrl = (canon && canon.href) || (location.origin + location.pathname);
      var titleEl = document.getElementById('title');
      var pageTitle = ((titleEl && titleEl.textContent) || document.title).trim();
      var u = encodeURIComponent(pageUrl), t = encodeURIComponent(pageTitle);
      var targets = {
        x:        ['X', 'https://x.com/intent/post?text=' + t + '&url=' + u],
        linkedin: ['LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + u],
        whatsapp: ['WhatsApp', 'https://wa.me/?text=' + t + '%20' + u],
        email:    ['Email', 'mailto:?subject=' + t + '&body=' + t + '%0A%0A' + u]
      };
      var bar = document.createElement('div');
      bar.className = 'nti-share';
      bar.innerHTML = '<span class="nti-share-label">Share</span>';
      SHARE.forEach(function (key) {
        if (targets[key]) {
          var a = document.createElement('a');
          a.href = targets[key][1];
          a.textContent = targets[key][0];
          if (key !== 'email') { a.target = '_blank'; a.rel = 'noopener'; }
          bar.appendChild(a);
        } else if (key === 'copy') {
          var cp = document.createElement('button');
          cp.type = 'button';
          cp.textContent = 'Copy link';
          cp.addEventListener('click', function () {
            var done = function () { cp.textContent = 'Copied'; setTimeout(function () { cp.textContent = 'Copy link'; }, 2000); };
            if (navigator.clipboard) navigator.clipboard.writeText(pageUrl).then(done, function () { prompt('Copy this link:', pageUrl); });
            else prompt('Copy this link:', pageUrl);
          });
          bar.appendChild(cp);
        }
      });
      // phones: one more button that opens the phone's own share sheet (Messages, Instagram, Slack ...)
      if (navigator.share && window.matchMedia && matchMedia('(pointer: coarse)').matches) {
        var more = document.createElement('button');
        more.type = 'button';
        more.textContent = 'More';
        more.addEventListener('click', function () { navigator.share({ title: pageTitle, url: pageUrl }).catch(function () {}); });
        bar.appendChild(more);
      }
      var subInside = shareBody.querySelector('#subscribe');
      if (subInside) shareBody.insertBefore(bar, subInside); else shareBody.appendChild(bar);
    }
  }

  /* ---------- Right-hand column (home page and every essay page) ---------- */
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  var spotify = function (u) {
    var m = u.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(show|episode|playlist)\/([A-Za-z0-9]+)/);
    return m ? 'https://open.spotify.com/embed/' + m[1] + '/' + m[2] + '?theme=0' : '';
  };
  var youtube = function (u) {
    var m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? 'https://www.youtube-nocookie.com/embed/' + m[1] : '';
  };
  var ytEmbed = function (v) {
    if (!v) return '';
    if (/^UC[A-Za-z0-9_-]{20,}$/.test(v)) return 'https://www.youtube-nocookie.com/embed/videoseries?list=UU' + v.slice(2);
    var pl = v.match(/[?&]list=([A-Za-z0-9_-]+)/);
    if (pl) return 'https://www.youtube-nocookie.com/embed/videoseries?list=' + pl[1];
    return youtube(v);
  };
  function mediaHtml() {
    var link = PODCAST.spotify || PODCAST.youtube;
    if (!link) return '';
    var initials = ME.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
    var art = ME.photo ? '<img src="' + esc(ME.photo) + '" alt="">' : '<span>' + esc(initials) + '</span>';
    var play = '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10l8.5-5z" fill="currentColor"/></svg>';
    return '<div class="nti-media"><p class="nti-roll-label">' + esc(TEXT.listen) + '</p>' +
      '<a class="nti-pod" href="' + esc(link) + '" target="_blank" rel="noopener">' +
        '<span class="nti-pod-art">' + art + '</span>' +
        '<span class="nti-pod-text"><span class="nti-pod-title">' + esc(PODCAST.title || TEXT.podcastFallback) + '</span>' +
        '<span class="nti-pod-sub">' + esc(PODCAST.spotify ? TEXT.onSpotify : TEXT.onYouTube) + '</span></span>' +
        '<span class="nti-pod-play" aria-hidden="true">' + play + '</span>' +
      '</a></div>';
  }
  function fillPodcast(aside) {   // use the show's own name and artwork when no photo or title is set
    if (!PODCAST.spotify || (ME.photo && PODCAST.title) || !window.fetch) return;
    fetch('https://open.spotify.com/oembed?url=' + encodeURIComponent(PODCAST.spotify))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j) return;
        var t = aside.querySelector('.nti-pod-title');
        if (t && !PODCAST.title && j.title) t.textContent = j.title;
        var a = aside.querySelector('.nti-pod-art');
        if (a && !ME.photo && j.thumbnail_url) a.innerHTML = '<img src="' + esc(j.thumbnail_url) + '" alt="">';
      }, function () {});
  }
  function readingHtml() {
    if (!READING.length) return '';
    return '<p class="nti-roll-label">' + esc(TEXT.reading) + '</p><ul>' + READING.map(function (r) {
      var host = r[1].replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return '<li><a href="' + esc(r[1]) + '" target="_blank" rel="noopener">' + esc(r[0]) + '<span>' + esc(host) + '</span></a></li>';
    }).join('') + '</ul>';
  }
  function addAside(mainEl, rollHtml) {
    var layout = document.createElement('div');
    layout.className = 'nti-layout';
    mainEl.parentNode.insertBefore(layout, mainEl);
    layout.appendChild(mainEl);
    // keep Write.as's own subscribe form inside the main column
    if (nativeEmail) { var nb = nativeEmail.closest('form').parentNode; if (nb && !mainEl.contains(nb)) mainEl.appendChild(nb); }
    var media = mediaHtml();
    var aside = document.createElement('aside');
    aside.className = 'nti-aside';
    aside.setAttribute('aria-label', 'Podcast and reading');
    aside.innerHTML = media + '<div class="nti-roll' + (media ? '' : ' nti-roll-first') + '">' + (rollHtml || '') + '</div>';
    if (!rollHtml) aside.querySelector('.nti-roll').hidden = true;
    layout.appendChild(aside);
    fillPodcast(aside);
    document.body.classList.add('nti-has-aside');
    return aside;
  }
  var postAside = null;
  if (isIndex && !document.querySelector('.nti-aside')) {
    var wrap = document.getElementById('wrapper');
    if (wrap) addAside(wrap, readingHtml());
  }
  if (isPost && !document.querySelector('.nti-aside')) {
    var art = document.getElementById('post-body');
    if (art) {
      var mainCol = document.createElement('div');
      mainCol.className = 'nti-main';
      art.parentNode.insertBefore(mainCol, art);
      mainCol.appendChild(art);
      postAside = addAside(mainCol, '');   // "More essays" is filled in once the list of essays has loaded
    }
  }

  /* ---------- About page photo: a small circle beside the "Who am I?" paragraph ---------- */
  if (isPost && currentSlug === OPTIONS.aboutSlug && !document.querySelector('.nti-who')) {
    var body = document.getElementById('post-body');
    var heads = body ? body.querySelectorAll('h2, h3, h4') : [];
    var who = null;
    Array.prototype.forEach.call(heads, function (h) { if (!who && h.textContent.toLowerCase().indexOf(OPTIONS.whoHeading) !== -1) who = h; });
    var para = who ? who.nextElementSibling : null;
    if (para && para.tagName === 'P') {
      var pic;
      if (ME.photo) { pic = document.createElement('img'); pic.className = 'nti-who-photo'; pic.src = ME.photo; pic.alt = ME.name; }
      else { pic = document.createElement('span'); pic.className = 'nti-who-photo nti-who-initials'; pic.setAttribute('aria-hidden', 'true');
        pic.textContent = ME.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); }
      var row = document.createElement('div');
      row.className = 'nti-who';
      para.parentNode.insertBefore(row, para);
      row.appendChild(pic);
      row.appendChild(para);
    }
  }

  /* ---------- Header links ---------- */
  var header = document.querySelector('body > header, #post header, #collection header');
  if (header) {
    var nav = header.querySelector('nav');
    if (!nav) { nav = document.createElement('nav'); header.appendChild(nav); }
    var hasAbout = Array.prototype.some.call(nav.querySelectorAll('a'), function (x) { return /about/i.test(x.textContent); });
    if (!hasAbout) {
      var ab = document.createElement('a');
      ab.className = 'pinned' + (currentSlug === OPTIONS.aboutSlug ? ' selected' : '');
      ab.textContent = TEXT.about;
      ab.href = BASE + '/' + OPTIONS.aboutSlug;
      nav.insertBefore(ab, nav.firstChild);
    }
    if (!nav.querySelector('.nti-sub-link')) {
      var sub = document.createElement('a');
      sub.className = 'pinned nti-sub-link';
      sub.textContent = TEXT.subscribe;
      var target = document.querySelector('#subscribe, .nti-subscribe') || (nativeEmail && nativeEmail.closest('form').parentNode);
      sub.href = target ? '#' + (target.id || 'subscribe') : BASE + '/#subscribe';
      nav.appendChild(sub);
    }
    if (OPTIONS.darkSwitch && !nav.querySelector('.nti-theme')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'nti-theme';
      var label = function () {
        var dark = root.classList.contains('nti-dark');
        btn.textContent = dark ? TEXT.light : TEXT.dark;
        btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      };
      btn.addEventListener('click', function () {
        root.classList.toggle('nti-dark');
        store.set('nti-theme', root.classList.contains('nti-dark') ? 'dark' : 'light');
        label();
      });
      label();
      nav.appendChild(btn);
    }
  }

  /* ---------- 2. Essay numbers ---------- */
  var postTotal = 0;   // how many posts the blog has, as Write.as reports it
  function fetchAllPosts(page, acc) {
    var url = 'https://write.as/api/collections/' + BLOG_ALIAS + '/posts?page=' + page;
    // give up on a page after 5 seconds so a slow or failed request never holds the numbers back
    var timeout = new Promise(function (_, reject) { setTimeout(function () { reject(new Error('timeout')); }, 5000); });
    return Promise.race([fetch(url, { headers: { 'Accept': 'application/json' } }), timeout])
      .then(function (r) { return r.ok ? r.json() : { data: { posts: [] } }; })
      .then(function (j) {
        var posts = (j && j.data && j.data.posts) || [];
        acc = acc.concat(posts);
        // Write.as returns 10 posts a page; a shorter page is the last one
        // stop once every post is in, so we never ask Write.as for a page that doesn't exist
        var total = (j && j.data && j.data.total_posts) || 0;
        if (page === 1) postTotal = total;
        return posts.length >= 10 && acc.length < total && page < 50 ? fetchAllPosts(page + 1, acc) : acc;
      }, function () { return acc; });   // a failed request ends the list with what we have
  }
  if (BLOG_ALIAS.indexOf('PASTE_') !== 0 && window.fetch) {
    fetchAllPosts(1, []).then(function (posts) {
      var essays = posts
        .filter(function (p) { return p.slug && SKIP_PAGES.indexOf(p.slug.toLowerCase()) === -1; })
        .sort(function (a, b) { return new Date(b.created) - new Date(a.created); });   // newest first
      // Count down from the total, so the numbers stay right even if some older pages fail to load
      var count = Math.max(postTotal - (posts.length - essays.length), essays.length);
      var num = {};
      essays.forEach(function (p, i) { num[p.slug.toLowerCase()] = count - i; });
      // remember the numbers, so a failed request next time still shows them
      if (essays.length) store.set('nti-nums-' + BLOG_ALIAS, JSON.stringify(num));
      else { try { num = JSON.parse(store.get('nti-nums-' + BLOG_ALIAS)) || {}; } catch (e) { num = {}; } }

      if (isIndex && OPTIONS.numbers) {
        Array.prototype.forEach.call(document.querySelectorAll('#wrapper article.h-entry'), function (art) {
          var link = art.querySelector('.post-title a, a.u-url');
          var n = link && num[slugOf(link.getAttribute('href'))];
          if (!n || art.querySelector('.nti-num')) return;
          var tag = document.createElement('span');
          tag.className = 'nti-num';
          tag.setAttribute('aria-label', 'Essay ' + n);
          tag.textContent = TEXT.numberPrefix + n;
          art.insertBefore(tag, art.firstChild);
        });
      }
      if (postAside && essays.length && OPTIONS.moreEssays > 0) {
        var others = essays.filter(function (p) { return p.slug.toLowerCase() !== currentSlug; }).slice(0, OPTIONS.moreEssays);
        if (others.length) {
          var slot = postAside.querySelector('.nti-roll');
          slot.innerHTML = '<p class="nti-roll-label">' + esc(TEXT.moreEssays) + '</p><ul>' + others.map(function (p) {
            return '<li><a href="' + BASE + '/' + esc(p.slug) + '">' + esc(p.title || p.slug.replace(/-/g, ' ')) + '<span>' + esc(TEXT.numberPrefix) + num[p.slug.toLowerCase()] + '</span></a></li>';
          }).join('') + '</ul>';
          slot.hidden = false;
        }
      }
      if (isPost && OPTIONS.numbers && num[currentSlug]) {
        var title = document.getElementById('title');
        if (title && !document.querySelector('#post-body .nti-num')) {
          var lab = document.createElement('p');
          lab.className = 'nti-num';
          lab.textContent = TEXT.numberPrefix + num[currentSlug];
          title.parentNode.insertBefore(lab, title);
        }
      }
    }).catch(function () { /* numbers are optional; the page works without them */ });
  }
})();
