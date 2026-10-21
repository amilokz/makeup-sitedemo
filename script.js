/* ═══ LUMÉRA v2 — preserved business logic + new motion ═══ */
const PRODUCTS = [
  {name:"Radiance Gold Serum", desc:"Gold-pearl illuminating serum. Hydrates, blurs and lights skin from within.", price:58, old:72, badge:"Bestseller", stars:"★★★★★ 4.9 (3.2k)", img:"https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&q=80"},
  {name:"Satin Lip Colour — Rosewood", desc:"Our signature rose-nude. Vitamin-E rich, satin finish, 8-hour wear.", price:32, old:null, badge:"Iconic", stars:"★★★★★ 4.9 (4.1k)", img:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=700&q=80"},
  {name:"Silk Veil Foundation", desc:"Buildable silk foundation in 24 shades. Looks like skin, glows like light.", price:46, old:54, badge:"New Shades", stars:"★★★★☆ 4.8 (2.6k)", img:"https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80"},
  {name:"Golden Hour Palette", desc:"12 warm-neutral shadows — matte, satin and foil golds for day-to-gala eyes.", price:64, old:null, badge:"Limited", stars:"★★★★★ 5.0 (1.8k)", img:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=700&q=80"},
];

const SHADES = [
  {name:"Rosewood Satin", color:"#b5655f", desc:"A warm rose-nude — our #1 bestseller, suits every skin tone.", price:32},
  {name:"Berry Velvet", color:"#8e2f45", desc:"A deep romantic berry — instant evening glamour.", price:32},
  {name:"Coral Glow", color:"#e07a5f", desc:"A sun-kissed coral — fresh, youthful, summer in a tube.", price:30},
  {name:"Nude Silk", color:"#c79a7b", desc:"A barely-there nude silk — the perfect 'your lips but better'.", price:30},
  {name:"Ruby Noir", color:"#7a1220", desc:"A classic statement ruby — bold, timeless, unforgettable.", price:34},
  {name:"Peony Blush", color:"#e59aac", desc:"A soft peony pink — romantic, delicate, everyday pretty.", price:30},
];

const REVIEWS = [
  {text:"I stopped wearing foundation. The serum alone gives me that filtered-skin look in real life.", name:"Amelia R.", meta:"Verified buyer — London"},
  {text:"Rosewood is the first nude that doesn't wash me out. I've bought four — one for every bag.", name:"Priya S.", meta:"Verified buyer — Dubai"},
  {text:"My makeup artist asked what highlighter I was wearing. It was just the serum under foundation.", name:"Sofia M.", meta:"Verified buyer — New York"},
];

/* ── Products: editorial index rows ── */
function renderProducts(){
  document.getElementById("productGrid").innerHTML = PRODUCTS.map((p,i)=>`
    <article class="p-row reveal in">
      <span class="p-no" aria-hidden="true">0${i+1}</span>
      <img class="p-thumb" src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="p-main"><h3>${p.name} <span class="p-badge">${p.badge}</span></h3>
      <p class="p-desc">${p.desc}</p><div class="p-stars">${p.stars}</div></div>
      <div class="p-side"><span class="p-price">${p.old?`<s>$${p.old}</s>`:""}$${p.price}</span><br>
      <button class="add-btn" data-add="${p.name}" data-price="${p.price}">Add to Bag</button></div>
    </article>`).join("");
}

/* ── Shade finder (preserved) ── */
function renderShades(){
  document.getElementById("swatches").innerHTML = SHADES.map((s,i)=>`
    <button class="swatch ${i===0?'active':''}" data-i="${i}" aria-label="Shade ${s.name}"><span class="dot" style="background:${s.color}"></span><strong>${s.name.split(' ')[0]}</strong><small>${s.name.split(' ').slice(1).join(' ')}</small></button>`).join("");
  document.querySelectorAll(".swatch").forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll(".swatch").forEach(x=>x.classList.remove("active")); b.classList.add("active");
    const s = SHADES[+b.dataset.i];
    document.getElementById("shadeName").textContent = s.name;
    document.getElementById("shadeDesc").textContent = s.desc;
    document.getElementById("shadePrice").textContent = "$"+s.price;
    const v = document.getElementById("lipVisual");
    v.style.transform = "scale(1.22) rotate(-8deg)"; v.style.filter = `drop-shadow(0 18px 26px ${s.color}99)`;
    setTimeout(()=>v.style.transform="",260);
    const btn = document.querySelector(".shade-preview [data-add]");
    btn.dataset.price = s.price; btn.dataset.add = "Satin Lip Colour — " + s.name; btn.textContent = `Add to Bag — $${s.price}`;
  }));
}

/* ── Cart (preserved logic) ── */
let cart = JSON.parse(localStorage.getItem("lumera_cart") || "[]");
function saveCart(){ localStorage.setItem("lumera_cart", JSON.stringify(cart)); }
function renderCart(){
  const box = document.getElementById("cartItems");
  document.getElementById("bagCount").textContent = cart.reduce((a,c)=>a+c.qty,0);
  if(!cart.length){ box.innerHTML = '<p class="empty">Your bag is empty — your glow awaits ✨</p>'; }
  else box.innerHTML = cart.map((c,i)=>`<div class="cart-item"><div><strong>${c.name}</strong><span>$${c.price} each</span></div>
    <div class="qty"><button data-dec="${i}" aria-label="Decrease quantity">−</button><b>${c.qty}</b><button data-inc="${i}" aria-label="Increase quantity">+</button></div></div>`).join("");
  document.getElementById("cartTotal").textContent = "$" + cart.reduce((a,c)=>a+c.price*c.qty,0);
  box.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{cart[+b.dataset.inc].qty++; saveCart(); renderCart();});
  box.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const i=+b.dataset.dec; cart[i].qty--; if(cart[i].qty<1) cart.splice(i,1); saveCart(); renderCart();});
}
function addToBag(name, price){
  const found = cart.find(c=>c.name===name);
  if(found) found.qty++; else cart.push({name, price:+price, qty:1});
  saveCart(); renderCart(); openDrawer();
}
function openDrawer(){ document.getElementById("drawer").classList.add("open"); document.getElementById("overlay").classList.add("open"); }
function closeDrawer(){ document.getElementById("drawer").classList.remove("open"); document.getElementById("overlay").classList.remove("open"); }
document.addEventListener("click", e=>{
  const b = e.target.closest("[data-add]");
  if(b) addToBag(b.dataset.add, b.dataset.price);
});
document.getElementById("bagBtn").onclick = openDrawer;
document.getElementById("closeDrawer").onclick = closeDrawer;
document.getElementById("overlay").onclick = closeDrawer;
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeDrawer(); });
document.getElementById("checkoutBtn").onclick = ()=>{
  document.getElementById("checkoutOk").textContent = cart.length ? "✨ Demo checkout — thank you! This is a demo store by AKCLNT." : "Add something beautiful first ✨";
  if(cart.length){ cart = []; saveCart(); renderCart(); }
};
document.getElementById("burger").onclick = ()=>document.getElementById("mobileMenu").classList.toggle("open");
document.querySelectorAll(".mobile-menu a").forEach(a=>a.onclick=()=>document.getElementById("mobileMenu").classList.remove("open"));
document.getElementById("newsForm").addEventListener("submit", e=>{
  e.preventDefault();
  document.getElementById("newsOk").textContent = "✨ Welcome to The Glow List — your 10% code: GLOW10";
  e.target.reset();
});

/* ── Testimonial rotator ── */
let qi = 0, qTimer;
const dotsBox = document.getElementById("quoteDots");
dotsBox.innerHTML = REVIEWS.map((_,i)=>`<button class="q-dot ${i===0?'active':''}" data-q="${i}" role="tab" aria-label="Review ${i+1}"></button>`).join("");
function showQuote(i){
  qi = i;
  const q = document.getElementById("quoteText");
  q.classList.add("q-out");
  setTimeout(()=>{
    q.textContent = "\u201C" + REVIEWS[i].text + "\u201D";
    document.getElementById("quoteName").textContent = REVIEWS[i].name;
    document.getElementById("quoteMeta").textContent = REVIEWS[i].meta;
    q.classList.remove("q-out");
  }, 380);
  dotsBox.querySelectorAll(".q-dot").forEach((d,j)=>d.classList.toggle("active", j===i));
}
function cycleQuotes(){ clearInterval(qTimer); qTimer = setInterval(()=>showQuote((qi+1)%REVIEWS.length), 6000); }
dotsBox.querySelectorAll(".q-dot").forEach(d=>d.onclick=()=>{ showQuote(+d.dataset.q); cycleQuotes(); });
document.getElementById("quoteText").textContent = "\u201C" + REVIEWS[0].text + "\u201D";
cycleQuotes();

/* ── Header state ── */
const header = document.getElementById("header");
addEventListener("scroll", ()=>header.classList.toggle("scrolled", scrollY > 40), {passive:true});
header.classList.toggle("scrolled", scrollY > 40);

/* ── Reveal on scroll ── */
const io = new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } }),{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* ── Subtle parallax ── */
const pxEls = document.querySelectorAll("[data-parallax]");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
if(pxEls.length && !reduceMotion){
  let ticking = false;
  addEventListener("scroll", ()=>{
    if(ticking) return; ticking = true;
    requestAnimationFrame(()=>{
      pxEls.forEach(el=>{
        const r = el.parentElement.getBoundingClientRect();
        if(r.bottom < 0 || r.top > innerHeight) return;
        const prog = (r.top + r.height/2 - innerHeight/2) / innerHeight;
        el.style.translate = `0 ${(-prog*26).toFixed(1)}px`;
      });
      ticking = false;
    });
  }, {passive:true});
}

/* ── Video: reduced-motion + save-data respect ── */
const hv = document.getElementById("heroVideo");
if(hv && (reduceMotion || (navigator.connection && navigator.connection.saveData))){
  hv.removeAttribute("autoplay"); hv.pause(); hv.load();
}

/* ── Preloader ── */
addEventListener("load", ()=>setTimeout(()=>document.getElementById("preloader").classList.add("done"), 500));
setTimeout(()=>document.getElementById("preloader").classList.add("done"), 2600); /* safety */

renderProducts(); renderShades(); renderCart();
