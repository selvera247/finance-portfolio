const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
const menuBtn = document.getElementById('menuBtn');
const navList = document.getElementById('navList');
if(menuBtn){ menuBtn.addEventListener('click', ()=> navList.classList.toggle('show')); }

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth'});
      navList?.classList.remove('show');
    }
  });
});

// Render projects
async function loadProjects(){
  try{
    const res = await fetch('projects.json');
    const data = await res.json();
    const grid = document.getElementById('projectGrid');
    const pills = document.querySelectorAll('.pill');
    let filter = 'all';

    function draw(){
      grid.innerHTML = '';
      const items = data.projects.filter(p => filter==='all' || p.tags.includes(filter));
      for(const p of items){
        const card = document.createElement('article');
        card.className = 'project';
        card.innerHTML = `
          <h3>${p.title}</h3>
          <p>${p.blurb}</p>
          <div class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
          <div style="margin-top:8px;display:flex;gap:10px;flex-wrap:wrap">
            ${p.links.map(l => `<a class="btn" href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`).join('')}
          </div>
        `;
        grid.appendChild(card);
      }
    }

    pills.forEach(btn => btn.addEventListener('click', ()=>{
      pills.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      filter = btn.dataset.filter;
      draw();
    }));

    draw();
  }catch(e){
    console.error('Failed to load projects', e);
  }
}
loadProjects();
