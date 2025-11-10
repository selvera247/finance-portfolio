// ===== Portfolio Projects Renderer (safe version) =====

function renderProjectCard(p) {
  const tags = Array.isArray(p.tags) ? p.tags : [];
  const tagBadges = tags.map(t => `<span class="tag">${t}</span>`).join('');

  const metrics = Array.isArray(p.metrics) && p.metrics.length
    ? `<ul class="metrics">${p.metrics.map(m => `<li>${m}</li>`).join('')}</ul>`
    : '';

  const stack = Array.isArray(p.stack) && p.stack.length
    ? `<div class="stack">${p.stack.map(s => `<span>${s}</span>`).join(' · ')}</div>`
    : '';

  const date = p.date ? `<span class="date-badge">${p.date}</span>` : '';
  const img = p.image ? `<img class="thumb" src="${p.image}" alt="${p.title}">` : '';

  const links = Array.isArray(p.links) ? p.links.map(l => {
    const href = (l && l.href) ? l.href : '#';
    const label = (l && l.label) ? l.label : 'Open';
    return `<a class="btn" href="${href}" target="_blank" rel="noopener">${label}</a>`;
  }).join('') : '';

  return `
    <article class="project">
      ${img}
      <div class="project-body">
        <div class="project-head">
          <h3>${p.title || 'Untitled project'}</h3>
          ${date}
        </div>
        <p>${p.blurb || ''}</p>
        ${metrics}
        ${stack}
        <div class="tags">${tagBadges}</div>
        <div class="cta-row">${links}</div>
      </div>
    </article>
  `;
}

async function loadProjects(){
  const grid = document.getElementById('projectGrid');
  if(!grid){
    console.error('Missing #projectGrid in HTML.');
    return;
  }

  try{
    // Bust CDN/browser cache while debugging
    const res = await fetch('./projects.json?v=' + Date.now(), { cache: 'no-cache' });
    if(!res.ok) throw new Error('projects.json HTTP ' + res.status);
    const data = await res.json();

    if(!data || !Array.isArray(data.projects)){
      throw new Error('projects.json missing "projects" array');
    }

    const pills = document.querySelectorAll('.pill');
    let filter = 'all';

    function draw(){
      grid.innerHTML = '';
      const items = data.projects.filter(p => {
        if (filter === 'all') return true;
        return Array.isArray(p.tags) && p.tags.includes(filter);
      });
      items.forEach(p => grid.insertAdjacentHTML('beforeend', renderProjectCard(p)));
    }

    pills.forEach(btn => btn.addEventListener('click', ()=>{
      pills.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      filter = (btn.dataset.filter || 'all').toLowerCase();
      draw();
    }));

    draw();
  }catch(err){
    console.error('Failed to load projects:', err);
    grid.innerHTML = `
      <div class="card">
        <strong>Couldn’t load projects.</strong><br>
        Check that <code>projects.json</code> is valid JSON at the site root and try a hard refresh (Shift+Reload).
      </div>`;
  }
}

document.addEventListener('DOMContentLoaded', loadProjects);
