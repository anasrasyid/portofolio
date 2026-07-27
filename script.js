(() => {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const storageKey = 'theme-preference';
  let currentProjects = [];
  let projectModal = null;
  let projectModalContent = null;

  const iconMoon = document.getElementById('icon-moon');
  const iconSun  = document.getElementById('icon-sun');

  function applyTheme(isDark){
    if(isDark){
      root.classList.add('dark');
      if(btn) btn.setAttribute('aria-label','Switch to light mode');
      if(iconMoon) iconMoon.style.display = 'none';
      if(iconSun)  iconSun.style.display  = '';
    } else {
      root.classList.remove('dark');
      if(btn) btn.setAttribute('aria-label','Switch to dark mode');
      if(iconMoon) iconMoon.style.display = '';
      if(iconSun)  iconSun.style.display  = 'none';
    }
  }

  // initial
  try{
    const saved = localStorage.getItem(storageKey);
    if(saved !== null) applyTheme(saved === 'dark');
    else applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  } catch(e){ applyTheme(false); }

  if(btn){
    btn.addEventListener('click', ()=>{
      const isDark = root.classList.toggle('dark');
      try{ localStorage.setItem(storageKey, isDark ? 'dark' : 'light'); }catch(e){}
      applyTheme(isDark);
    });
  }

  // --- Data-driven content loader ---
  const base = '.'; // relative base

  async function fetchJSON(path){
    try{
      const res = await fetch(path);
      if(!res.ok) throw new Error('Fetch failed');
      return await res.json();
    }catch(e){ console.warn('Failed to load', path, e); return null; }
  }

  function escapeHtml(value){
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function textToHtmlWithNewlines(value){
    return escapeHtml(value).replace(/\r\n|\r|\n/g, '<br>');
  }

  function richTextToHtmlWithNewlines(value){
    return String(value ?? '').replace(/\r\n|\r|\n/g, '<br>');
  }

  function getPlatformIcon(platform){
    const key = String(platform || '').toLowerCase();
    // Steam
    if(key.includes('steam')) return `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true"><path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.607 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.662 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z"/></svg>`;
    // Epic Games
    if(key.includes('epic')) return `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true"><path d="M3 0v18l3 3h15V3l-3-3H3zm13.5 3.75h1.875v1.875h1.875V7.5H18.75v1.875h-1.875V11.25h1.875v1.875h1.875V15H18.75v-1.875h-1.875V11.25H15v1.875h-1.125V7.5H15V5.625h1.5V3.75zm-9 0H9.75v10.5H8.25V9H6.375V7.5H8.25V3.75zm3.375 0h1.5V5.25h1.5v1.5h-1.5v5.625h1.5V13.5h-1.5v.75h-1.5V3.75z"/></svg>`;
    // Nintendo Switch
    if(key.includes('nintendo') || key.includes('switch')) return `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true"><path d="M10.04 20.4H7.12A5.11 5.11 0 0 1 2 15.28V8.72A5.11 5.11 0 0 1 7.12 3.6h2.92zm1.4-16.8h5.44A5.11 5.11 0 0 1 22 8.72v6.56a5.11 5.11 0 0 1-5.12 5.12H11.44zm5.43 4.59a1.56 1.56 0 1 0 1.56 1.56 1.56 1.56 0 0 0-1.56-1.56zM7.81 10.31H6.55v-1.6H5.09v1.6H3.83v1.37h1.26v1.61h1.46v-1.61h1.26z"/></svg>`;
    // PlayStation
    if(key.includes('playstation') || key === 'ps4' || key === 'ps5') return `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true"><path d="M8.984 2.596v15.321l3.915 1.083V6.688c0-.423.181-.63.504-.53.317.1.476.487.476.91v6.94c1.357.613 3.472.096 3.472-2.59 0-2.73-1.181-4.026-4.16-5.047a66.716 66.716 0 0 0-4.207-1.775zM.008 17.396l5.957 1.641c2.696.742 3.706-.397 3.706-1.668v-.407l-6.441-1.76c-.97-.265-1.129-.794-.371-1.173.424-.213 1.15-.248 1.892-.034l4.92 1.352v-2.54L3.61 11.94C.45 11.04-.73 12.932.008 17.396zm19.95-6.375c-1.982-.547-4.617-.598-6.399-.17v2.11c1.467-.34 3.03-.302 4.049.022.975.311 1.149.829.376 1.147-.783.317-2.136.25-3.37-.123v2.073c2.367.578 5.24.382 6.858-.682 1.766-1.15 1.567-2.875-.514-3.377z"/></svg>`;
    // Xbox
    if(key.includes('xbox')) return `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true"><path d="M4.102 5.481C2.781 6.842 2 8.783 2 11c0 4.563 3.133 8.337 6.879 8.337 1.688 0 3.299-.875 4.618-2.354 1.319 1.479 2.93 2.354 4.618 2.354C21.867 19.337 25 15.563 25 11c0-2.217-.781-4.158-2.102-5.519C20.626 3.219 17.67 2 12.497 2S4.368 3.219 4.102 5.481zm4.9 11.244c-2.59 0-4.694-2.588-4.694-5.725s2.104-5.725 4.694-5.725c.823 0 1.601.257 2.282.716-1.261 1.074-2.282 2.898-2.282 5.009s1.021 3.935 2.282 5.009c-.681.459-1.459.716-2.282.716zm6.796 0c-.823 0-1.601-.257-2.282-.716 1.261-1.074 2.282-2.898 2.282-5.009s-1.021-3.935-2.282-5.009c.681-.459 1.459-.716 2.282-.716 2.59 0 4.694 2.588 4.694 5.725s-2.104 5.725-4.694 5.725z"/></svg>`;
    // Mobile / Android / iOS
    if(key.includes('mobile') || key.includes('android') || key.includes('ios')) return `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true"><path d="M17 19H7V5h10m0-2H7c-1.11 0-2 .89-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>`;
    // Fallback link icon
    return `<svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" aria-hidden="true"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>`;
  }

  function normalizeStoreLinks(project){
    if(Array.isArray(project.stores) && project.stores.length > 0){
      return project.stores.filter(s => s && s.url).map(s => ({
        platform: s.platform || 'Store',
        url: s.url,
        icon: s.icon || ''
      }));
    }

    if(project.storeLink){
      return [{ platform: 'Store', url: project.storeLink }];
    }

    if(project.link){
      return [{ platform: 'Store', url: project.link }];
    }

    return [];
  }

  function ensureProjectModal(){
    if(projectModal) return;

    projectModal = document.createElement('div');
    projectModal.id = 'project-modal';
    projectModal.className = 'project-modal hidden';
    projectModal.innerHTML = `
      <div class="project-modal-backdrop" data-close-modal="true"></div>
      <div class="project-modal-panel" role="dialog" aria-modal="true" aria-label="Project details">
        <button class="project-modal-close" type="button" aria-label="Close project details" data-close-modal="true">×</button>
        <div class="project-modal-content"></div>
      </div>
    `;

    projectModalContent = projectModal.querySelector('.project-modal-content');

    projectModal.addEventListener('click', (event) => {
      const target = event.target;
      if(target && target.getAttribute('data-close-modal') === 'true'){
        closeProjectModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if(event.key === 'Escape' && projectModal && !projectModal.classList.contains('hidden')){
        closeProjectModal();
      }
    });

    document.body.appendChild(projectModal);
  }

  function openProjectModal(project){
    ensureProjectModal();
    if(!projectModalContent) return;

    const safeTitle = textToHtmlWithNewlines(project.title || 'Untitled Project');
    const safeRole = textToHtmlWithNewlines(project.role || '');
    const safeDescription = textToHtmlWithNewlines(project.description || '');
    const safeDetails = richTextToHtmlWithNewlines(project.details || project.description || '');
    const safeStudio = textToHtmlWithNewlines(project.studio || 'N/A');
    const safeImage = escapeHtml(project.image || '');
    const stores = normalizeStoreLinks(project);

    const storeHtml = stores.length > 0
      ? stores.map(store => {
          const icon = store.icon
            ? `<img class="project-platform-icon-img" src="${escapeHtml(store.icon)}" alt="${escapeHtml(store.platform)}" loading="lazy">`
            : getPlatformIcon(store.platform);
          return `<a class="project-store-link icon-only" href="${escapeHtml(store.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(store.platform)}">${icon}</a>`;
        }).join('')
      : '<p class="project-no-store">Store page unavailable</p>';

    const imageHtml = safeImage
      ? `<img class="project-modal-image" src="${safeImage}" alt="${safeTitle}" loading="lazy">`
      : '<div class="project-modal-image project-image-placeholder" aria-hidden="true"></div>';

    const roleHtml = safeRole ? `<p class="project-modal-role">Role: ${safeRole}</p>` : '';

    projectModalContent.innerHTML = `
      <h4 class="project-modal-title">${safeTitle}</h4>
      ${roleHtml}
      <p class="project-modal-desc">${safeDescription}</p>
      <div class="project-modal-image-wrap">${imageHtml}</div>
      <p class="project-modal-meta">Developed by: ${safeStudio}</p>
      <div class="project-modal-details">${safeDetails}</div>
      <div class="project-store-links">${storeHtml}</div>
    `;

    projectModal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  function closeProjectModal(){
    if(!projectModal) return;
    projectModal.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }

  async function renderSite(){
    const site = await fetchJSON(base + '/data/site.json');
    if(!site) return;

    // Hero
    const heroRoot = document.getElementById('hero-container');
    if(heroRoot){
      heroRoot.innerHTML = `<h2>${richTextToHtmlWithNewlines(site.headline)}</h2><p class="lead">${textToHtmlWithNewlines(site.subhead)}</p>`;

      if(site.skills && Array.isArray(site.skills) && site.skills.length > 0){
        const chips = document.createElement('div');
        chips.className = 'chips';
        site.skills.forEach(s=>{
          const sp = document.createElement('span');
          sp.innerHTML = textToHtmlWithNewlines(s);
          chips.appendChild(sp);
        });
        heroRoot.appendChild(chips);
      }

      const resumeLink = document.querySelector('.resume-btn');
      if(resumeLink) resumeLink.href = site.resume || resumeLink.href;
    }

    return site;
  }

  async function renderProjects(){
    const list = await fetchJSON(base + '/data/projects.json');
    const root = document.getElementById('projects-container');
    if(!list || !root) return;

    const site = await fetchJSON(base + '/data/site.json');
    const cardConfig = (site && site.projectCard) ? site.projectCard : {};
    if(cardConfig.height){
      root.style.setProperty('--project-card-height', cardConfig.height);
    }
    if(cardConfig.width){
      root.style.setProperty('--project-card-width', cardConfig.width);
    }
    if(cardConfig.descriptionToStudioGap){
      root.style.setProperty('--project-desc-to-studio-gap', cardConfig.descriptionToStudioGap);
    }

    currentProjects = list;
    root.innerHTML = '<h3>Projects</h3>';
    const grid = document.createElement('div'); grid.className='grid projects-grid';
    list.forEach((p, index)=>{
      const card = document.createElement('article'); card.className='card project-card';
      const safeTitle = textToHtmlWithNewlines(p.title);
      const safeRole = textToHtmlWithNewlines(p.role || '');
      const safeDescription = textToHtmlWithNewlines(p.description);
      const safeStudio = textToHtmlWithNewlines(p.studio || 'N/A');
      const safeImage = escapeHtml(p.image || '');
      const stores = normalizeStoreLinks(p);
      const platformIcons = stores.length > 0
        ? stores.map(store => {
            const icon = store.icon
              ? `<img class="project-platform-icon-img" src="${escapeHtml(store.icon)}" alt="${escapeHtml(store.platform)}" loading="lazy">`
              : getPlatformIcon(store.platform);
            return `<a class="project-platform-link icon-only" href="${escapeHtml(store.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(store.platform)}">${icon}</a>`;
          }).join('')
        : '';
      const imageNode = safeImage
        ? `<img class="project-image" src="${safeImage}" alt="${safeTitle}" loading="lazy">`
        : `<div class="project-image project-image-placeholder" aria-hidden="true"></div>`;
      card.innerHTML = `
        <div class="project-top">
          <h4 class="project-title">${safeTitle}</h4>
          ${safeRole ? `<p class="project-role">Role: ${safeRole}</p>` : ''}
          <p class="project-desc">${safeDescription}</p>
          <div class="project-bottom">
            <p class="project-meta">Developed by: ${safeStudio}</p>
            <div class="project-platforms">${platformIcons}</div>
          </div>
        </div>
        <div class="project-image-wrap">
          ${imageNode}
          <button type="button" class="project-store-btn" data-project-index="${index}">Read More</button>
        </div>
      `;
      grid.appendChild(card);
    });
    root.appendChild(grid);

    root.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-project-index]');
      if(!trigger) return;

      const index = Number(trigger.getAttribute('data-project-index'));
      if(Number.isNaN(index) || !currentProjects[index]) return;
      openProjectModal(currentProjects[index]);
    });
  }

  async function renderAbout(){
    const site = await fetchJSON(base + '/data/site.json');
    const root = document.getElementById('about-container');
    if(!site || !root) return;

    const safeBio = richTextToHtmlWithNewlines(site.bio || '');
    const safePhoto = escapeHtml(site.photo || '');
    const safeEmail = escapeHtml(site.email || '');
    const safeLinkedin = escapeHtml(site.linkedin || '');
    const safeGithub = escapeHtml(site.github || '');
    const safeWebsite = escapeHtml(site.website || '');

    const photoHtml = safePhoto
      ? `<img class="about-photo" src="${safePhoto}" alt="${escapeHtml(site.name || 'Profile photo')}" loading="lazy">`
      : `<div class="about-photo about-photo-placeholder" aria-hidden="true"></div>`;

    const safeResume = escapeHtml(site.resume || '');

    const contactButtons = [
      safeResume ? `<a class="contact-btn" href="${safeResume}" target="_blank" rel="noopener">📄 RESUME</a>` : '',
      safeEmail  ? `<a class="contact-btn" href="mailto:${safeEmail}">✉ CONTACT ME</a>` : ''
    ].filter(Boolean).join('');

    const socialIcons = [
      safeLinkedin ? `<a class="social-icon" href="${safeLinkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57A1.32 1.32 0 0 1 14.24 12.25A1.32 1.32 0 0 1 15.56 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg></a>` : '',
      safeGithub   ? `<a class="social-icon" href="${safeGithub}" target="_blank" rel="noopener" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg></a>` : '',
      safeWebsite  ? `<a class="social-icon" href="${safeWebsite}" target="_blank" rel="noopener" aria-label="Website"><svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></a>` : ''
    ].filter(Boolean).join('');

    root.innerHTML = `
      <div class="about-bio-row">
        <div class="about-photo-wrap">${photoHtml}</div>
        <div class="about-bio-text">
          <p>${safeBio}</p>
          <div class="contact-buttons contact-buttons-inline">${contactButtons}</div>
        </div>
      </div>
      <div class="social-row">
        <p class="social-label">YOU CAN ALSO FIND ME HERE...</p>
        <div class="social-icons">${socialIcons}</div>
      </div>
      <div class="back-to-top-wrap"><a href="#" class="back-to-top-btn">BACK TO TOP</a></div>
    `;
  }

  // run appropriate renderers depending on page
  document.addEventListener('DOMContentLoaded', ()=>{
    renderSite();
    renderProjects();
    renderAbout();
  });
})();
