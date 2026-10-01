(() => {
"use strict";
const board=document.getElementById("atlasBoard");
const details=document.getElementById("atlasDetails");
if(!board||!details||typeof hypernuclides==="undefined") return;

function csvRows(text){
  const lines=text.trim().split(/\r?\n/); lines.shift();
  return lines.map(line=>line.split(","));
}
function statusOf(h){ return String(h).trim().toLowerCase()==="infinity"?"stable":"radioactive"; }
function elementMap(rows){
  const map=new Map();
  for(const r of rows){ const z=Number(r[0]); if(Number.isFinite(z)) map.set(z,{symbol:r[1],name:r[2]}); }
  return map;
}
function atomLink(item){
  if(item.Z<=0) return "";
  return `<br><br><a href="./atomic-cloud.html?isotope=${encodeURIComponent(item.name)}&Z=${item.Z}">View neutral atom →</a>`;
}
function hyperLink(item){
  if(item.Z<=0||item.type!=="hyper") return "";
  return `<br><br><a href="./atomic-cloud.html?isotope=${encodeURIComponent(item.name)}&Z=${item.Z}&nucleus=hyper">View hyperatom electron cloud →</a><br><small>Electronic cloud is an atomic-scale model set by nuclear charge Z; hypernuclear spatial structure is not depicted.</small>`;
}
function selectNode(node,item){
  board.querySelectorAll(".selected").forEach(x=>x.classList.remove("selected"));
  node.classList.add("selected");
  details.innerHTML=`<h2>${item.name}</h2><div class="coords">N=${item.N} · Z=${item.Z}${item.S!==undefined?` · S=${item.S}`:""}</div>Mass number A=${item.A}<br>Status: ${item.status}${item.halflife?`<br>Half-life source value: ${item.halflife}`:""}${item.note?`<br><br>${item.note}`:""}${item.type==="matter"?atomLink(item):hyperLink(item)}`;
}
function makeNode(item,category){
  const node=document.createElement("button");
  node.className=`nuclide ${item.type}`;
  node.dataset.category=category;
  node.setAttribute("aria-label",`${item.name}, N ${item.N}, Z ${item.Z}`);
  node.innerHTML=`<span class="status-dot ${item.status==="radioactive"?"radioactive":""}"></span><span class="symbol">${item.symbol}</span><span class="mass">A=${item.A}${item.S!==undefined?` · S=${item.S}`:""}</span>`;
  node.addEventListener("click",()=>selectNode(node,item));
  return node;
}
async function upgrade(){
  try{
    const [nr,er]=await Promise.all([fetch("./galaxy-nuclides.csv"),fetch("./galaxy-elements.csv")]);
    if(!nr.ok||!er.ok) throw new Error("dataset unavailable");
    const [nt,et]=await Promise.all([nr.text(),er.text()]);
    const elements=elementMap(csvRows(et));
    const ordinary=csvRows(nt).map(r=>{
      const Z=Number(r[0]),N=Number(r[1]),el=elements.get(Z)||{symbol:Z===0?"n":"?",name:Z===0?"Neutron":`Z=${Z}`};
      const A=N+Z;
      return {name:Z===0&&N===1?"Neutron":`${el.name}-${A}`,symbol:el.symbol,A,N,Z,status:statusOf(r[2]),halflife:r[2],type:"matter"};
    }).filter(x=>Number.isFinite(x.N)&&Number.isFinite(x.Z));
    const items=[...ordinary,...antinuclides,...hypernuclides];
    const minN=Math.min(-2,...items.map(x=>x.N)), maxN=Math.max(...items.map(x=>x.N));
    const minZ=Math.min(-2,...items.map(x=>x.Z)), maxZ=Math.max(...items.map(x=>x.Z));
    board.innerHTML="";
    board.style.position="relative";
    board.style.display="block";
    const step=50, pad=8;
    board.style.width=`${(maxN-minN+1)*step+pad*2}px`;
    board.style.height=`${(maxZ-minZ+1)*step+pad*2}px`;
    const buckets=new Map();
    for(const item of items){
      const key=`${item.N},${item.Z}`; if(!buckets.has(key)) buckets.set(key,[]); buckets.get(key).push(item);
    }
    for(const [key,cellItems] of buckets){
      const [N,Z]=key.split(",").map(Number);
      const cell=document.createElement("div");
      cell.className="cell cluster";
      cell.style.position="absolute"; cell.style.width="46px"; cell.style.minHeight="46px";
      cell.style.left=`${pad+(N-minN)*step}px`; cell.style.top=`${pad+(maxZ-Z)*step}px`;
      for(const item of cellItems) cell.appendChild(makeNode(item,item.type==="matter"||item.type==="antimatter"?"ordinary":"hyper"));
      board.appendChild(cell);
    }
    const origin=document.createElement("button");
    origin.className="cell origin"; origin.dataset.category="origin"; origin.innerHTML="0<br><small>zoom</small>";
    origin.style.position="absolute"; origin.style.width="46px"; origin.style.left=`${pad+(0-minN)*step}px`; origin.style.top=`${pad+(maxZ-0)*step}px`;
    origin.addEventListener("click",()=>openOrigin()); board.appendChild(origin);
    details.innerHTML=`Full educational chart loaded: ${ordinary.length.toLocaleString()} nuclides. Tap a nuclide to inspect it.`;
    const active=document.querySelector("[data-filter].active")?.dataset.filter||"all"; setFilter(active);
  }catch(err){
    console.warn("Full nuclide upgrade unavailable; keeping verified fallback.",err);
  }
}
upgrade();
})();