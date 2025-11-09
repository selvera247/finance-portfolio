// ... keep your existing code above

function renderProjectCard(p) {
  const tags = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  const metrics = (p.metrics && p.metrics.length)
    ? `<ul class="metrics">${p.metrics.map(m => `<li>${m}</li>`).join('')}</ul>`
    : '';
  const stack = (p.stack && p.stack.length)
    ? `<div class="stack">${p.stack.map(s => `<span>${s}</span>`).join(' · ')}</div>`
    : '';
  const date = p.date ? `<span class="date-badge">${p.date}</span>` : '';
  const img = p.image ? `<img class="thumb" src="${p.image}" alt="${p.title}">` : '';

  const links = (p.links || []).map(l => 
    `<a class="btn" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`
  ).join('');

  return `
    <article class="project">
      ${img}
      <div class="project-body">
        <div class="project-head">
          <h3>${p.title}</h3>
          ${date}
        </div>
        <p>${p.blurb}</p>
        ${metrics}
        ${stack}
        <div class="tags">${tags}</div>
        <div class="cta-row">${links}</div>
      </div>
    </article>
  `;
}

function draw(){
  grid.innerHTML = '';
  const items = data.projects.filter(p => filter==='all' || (p.tags||[]).includes(filter));
  for (const p of items){
    grid.insertAdjacentHTML('beforeend', renderProjectCard(p));
  }
}
