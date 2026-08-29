import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const IMAGES_DIR = path.join(ROOT, "public", "images", "products");
const CATEGORIES_IMAGES_DIR = path.join(ROOT, "public", "images", "categories");
const ARTICLE_IMAGES_DIR = path.join(ROOT, "public", "images", "articles");
const HERO_IMAGES_DIR = path.join(ROOT, "public", "images");
const HOMEPAGE_PATH = path.join(ROOT, "content", "homepage.json");
const CATEGORIES_PATH = path.join(ROOT, "content", "categories.json");
const TEAM_PATH = path.join(ROOT, "content", "team.json");
const TEAM_IMAGES_DIR = path.join(ROOT, "public", "images", "team");
const AMBIANCES_PATH = path.join(ROOT, "content", "ambiances.json");
const AMBIANCES_IMAGES_DIR = path.join(ROOT, "public", "images", "ambiances");
const PORT = 3334;
const INDEXNOW_KEY = "72eb51b91671f906539d828ee779b0cd";
const SITE_HOST = "marius-home.com";

fs.mkdirSync(IMAGES_DIR, { recursive: true });
fs.mkdirSync(CATEGORIES_IMAGES_DIR, { recursive: true });
fs.mkdirSync(ARTICLE_IMAGES_DIR, { recursive: true });
fs.mkdirSync(TEAM_IMAGES_DIR, { recursive: true });
fs.mkdirSync(AMBIANCES_IMAGES_DIR, { recursive: true });

function getArticles() {
  return fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"));
      return { file: f, ...data };
    });
}

function saveArticle(filename, data) {
  const { file, ...article } = data;
  fs.writeFileSync(path.join(ARTICLES_DIR, filename), JSON.stringify(article, null, 2), "utf-8");
}

function getHomepage() {
  return JSON.parse(fs.readFileSync(HOMEPAGE_PATH, "utf-8"));
}

function saveHomepage(data) {
  fs.writeFileSync(HOMEPAGE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function getCategories() {
  return JSON.parse(fs.readFileSync(CATEGORIES_PATH, "utf-8"));
}

function saveCategories(data) {
  fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function getTeam() {
  return JSON.parse(fs.readFileSync(TEAM_PATH, "utf-8"));
}

function saveTeam(data) {
  fs.writeFileSync(TEAM_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function getAmbiances() {
  return JSON.parse(fs.readFileSync(AMBIANCES_PATH, "utf-8"));
}

function saveAmbiances(data) {
  fs.writeFileSync(AMBIANCES_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function pingIndexNow(urls) {
  const payload = JSON.stringify({
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: "https://" + SITE_HOST + "/" + INDEXNOW_KEY + ".txt",
    urlList: urls
  });
  const engines = [
    { hostname: "api.indexnow.org", path: "/indexnow" },
    { hostname: "www.bing.com", path: "/indexnow" },
    { hostname: "yandex.com", path: "/indexnow" }
  ];
  engines.forEach(function(engine) {
    const options = {
      hostname: engine.hostname,
      port: 443,
      path: engine.path,
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(payload) }
    };
    const req = https.request(options, function(res) {
      console.log("  IndexNow " + engine.hostname + " -> " + res.statusCode);
    });
    req.on("error", function(e) {
      console.log("  IndexNow " + engine.hostname + " erreur: " + e.message);
    });
    req.write(payload);
    req.end();
  });
  console.log("  IndexNow: ping envoye pour " + urls.length + " URL(s)");
}

function getUrlsForCategory(catSlug) {
  return ["https://" + SITE_HOST + "/" + catSlug];
}

function getAllSiteUrls() {
  const urls = ["https://" + SITE_HOST];
  const cats = getCategories();
  cats.forEach(function(cat) { urls.push("https://" + SITE_HOST + "/" + cat.slug); });
  const arts = getArticles();
  arts.forEach(function(a) { urls.push("https://" + SITE_HOST + "/" + a.category + "/" + a.slug); });
  const ambiances = getAmbiances();
  urls.push("https://" + SITE_HOST + "/ambiances");
  ambiances.forEach(function(amb) {
    urls.push("https://" + SITE_HOST + "/ambiances/" + amb.slug);
    amb.rooms.forEach(function(room) {
      urls.push("https://" + SITE_HOST + "/ambiances/" + amb.slug + "/" + room.slug);
    });
  });
  return urls;
}

function parseBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

function parseMultipart(buf, boundary) {
  const parts = [];
  const boundaryBuf = Buffer.from("--" + boundary);
  let start = buf.indexOf(boundaryBuf) + boundaryBuf.length + 2;
  while (true) {
    const end = buf.indexOf(boundaryBuf, start);
    if (end === -1) break;
    const part = buf.slice(start, end - 2);
    const headerEnd = part.indexOf("\r\n\r\n");
    const headers = part.slice(0, headerEnd).toString();
    const body = part.slice(headerEnd + 4);
    const nameMatch = headers.match(/name="([^"]+)"/);
    const fileMatch = headers.match(/filename="([^"]+)"/);
    parts.push({ name: nameMatch?.[1], filename: fileMatch?.[1], data: body, headers });
    start = end + boundaryBuf.length + 2;
  }
  return parts;
}

const HTML_PAGE = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Marius Dumas Admin</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#faf9f7;color:#2d2926}
.header{background:#4a5a4d;color:#fff;padding:16px 24px;display:flex;align-items:center;justify-content:space-between}
.header h1{font-size:20px}
.badge{background:#c8956c;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:700;color:#fff}
.container{max-width:1200px;margin:0 auto;padding:24px}
.nav{display:flex;gap:4px;margin-bottom:20px;border-bottom:2px solid #e8e4df;padding-bottom:0}
.nav-btn{padding:10px 20px;border:none;background:none;cursor:pointer;font-weight:700;font-size:14px;color:#8c8580;border-bottom:3px solid transparent;margin-bottom:-2px;transition:.15s}
.nav-btn.active{color:#4a5a4d;border-bottom-color:#6b7c6e}
.nav-btn:hover{color:#2d2926}
.tabs{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap}
.tab{padding:8px 20px;border-radius:8px;background:#fff;border:1px solid #e8e4df;cursor:pointer;font-weight:600;font-size:13px}
.tab.active{background:#6b7c6e;color:#fff;border-color:#6b7c6e}
.card{background:#fff;border-radius:12px;border:1px solid #e8e4df;margin-bottom:16px;overflow:hidden}
.card-header{padding:16px 20px;border-bottom:1px solid #e8e4df;display:flex;align-items:center;justify-content:space-between;gap:12px}
.card-header h2{font-size:15px}
.card-body{padding:16px 20px}
.product{display:flex;gap:16px;padding:14px;border-bottom:1px solid #f0f4f1;align-items:flex-start}
.product:last-child{border-bottom:none}
.pimg{width:90px;height:90px;border-radius:8px;background:#f0f4f1;border:1px solid #e8e4df;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;font-size:11px;color:#8c8580;text-align:center}
.pimg img{width:100%;height:100%;object-fit:contain}
.pinfo{flex:1;min-width:0}
.pbadge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;color:#fff;background:#6b7c6e;margin-bottom:6px}
.pname{font-weight:700;font-size:14px;margin-bottom:2px}
.pprice{color:#c8956c;font-weight:700;font-size:13px}
.plink{margin-top:6px;font-size:11px;color:#8c8580}
.plink a{color:#6b7c6e}
.dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:4px}
.dot-ok{background:#16a34a}
.dot-no{background:#dc2626}
.pactions{display:flex;flex-direction:column;gap:6px;flex-shrink:0}
.btn{padding:7px 14px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:.15s}
.btn-primary{background:#6b7c6e;color:#fff}
.btn-primary:hover{background:#4a5a4d}
.btn-orange{background:#c8956c;color:#fff}
.btn-orange:hover{background:#a87650}
.btn-outline{background:#fff;color:#2d2926;border:1px solid #e8e4df}
.btn-outline:hover{background:#f0f4f1}
.toast{position:fixed;top:20px;right:20px;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;z-index:200;animation:fadeIn .2s}
.toast-ok{background:#dcfce7;color:#166534}
.toast-err{background:#fee2e2;color:#991b1b}
@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:100}
.modal{background:#fff;border-radius:12px;padding:24px;width:520px;max-width:92vw;max-height:90vh;overflow-y:auto}
.modal h3{font-size:17px;margin-bottom:16px}
.field{margin-bottom:10px}
.field label{display:block;font-size:11px;font-weight:600;color:#8c8580;margin-bottom:3px;text-transform:uppercase;letter-spacing:.5px}
.field input,.field textarea{width:100%;padding:8px 10px;border:1px solid #e8e4df;border-radius:6px;font-size:13px;font-family:inherit}
.field input:focus,.field textarea:focus{outline:none;border-color:#6b7c6e;box-shadow:0 0 0 3px rgba(107,124,110,.1)}
.upload-zone{border:2px dashed #e8e4df;border-radius:8px;padding:20px;text-align:center;cursor:pointer;transition:.15s}
.upload-zone:hover{border-color:#6b7c6e;background:#f0f4f1}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
.cat-card{background:#fff;border-radius:12px;border:1px solid #e8e4df;overflow:hidden}
.cat-img{width:100%;height:140px;object-fit:cover;background:#f0f4f1;display:block}
.cat-img-placeholder{width:100%;height:140px;background:#f0f4f1;display:flex;align-items:center;justify-content:center;color:#8c8580;font-size:13px}
.cat-info{padding:14px}
.cat-name{font-weight:700;font-size:14px;margin-bottom:4px}
.cat-slug{font-size:11px;color:#8c8580;margin-bottom:8px}
.cat-color{display:inline-block;width:14px;height:14px;border-radius:4px;margin-right:6px;vertical-align:middle;border:1px solid #e8e4df}
.section-title{font-size:18px;font-weight:700;margin-bottom:16px;color:#2d2926}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:640px){.grid-2{grid-template-columns:1fr}}
.hero-preview{background:linear-gradient(135deg,#4a5a4d,#6b7c6e);border-radius:12px;padding:32px;color:#fff;text-align:center;margin-bottom:20px;position:relative;overflow:hidden;background-size:cover;background-position:center}
.hero-preview h2{font-size:24px;font-weight:800}
.hero-preview .accent{color:#c8956c}
.hero-preview p{margin-top:8px;opacity:.8;font-size:14px}
.indexnow-card{background:#fff;border-radius:12px;border:1px solid #e8e4df;padding:24px;margin-bottom:16px}
.indexnow-status{display:flex;align-items:center;gap:8px;margin-bottom:16px;font-size:14px;font-weight:600}
.indexnow-urls{background:#f0f4f1;border-radius:8px;padding:12px;font-size:12px;max-height:300px;overflow-y:auto;font-family:monospace;line-height:1.8;white-space:pre-wrap}
.indexnow-info{background:#f0f4f1;border-radius:8px;padding:16px;margin-bottom:16px;font-size:13px;line-height:1.6}
.indexnow-info strong{color:#4a5a4d}
</style>
</head>
<body>
<div class="header"><h1>Marius Dumas Admin</h1><span class="badge">Local</span></div>
<div class="container">
  <div class="nav" id="nav"></div>
  <div id="content"></div>
</div>
<script>
var articles=[], categories=[], homepage={}, team=[], ambiances=[], curSection="home", curTab=0, indexnowLog=[];

function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}

function toast(msg, ok){
  var d=document.createElement("div");
  d.className="toast "+(ok?"toast-ok":"toast-err");
  d.textContent=msg;
  document.body.appendChild(d);
  setTimeout(function(){d.remove()},3000);
}

function loadData(){
  Promise.all([
    fetch("/api/articles").then(function(r){return r.json()}),
    fetch("/api/homepage").then(function(r){return r.json()}),
    fetch("/api/categories").then(function(r){return r.json()}),
    fetch("/api/team").then(function(r){return r.json()}),
    fetch("/api/ambiances").then(function(r){return r.json()})
  ]).then(function(results){
    articles=results[0];
    homepage=results[1];
    categories=results[2];
    team=results[3];
    ambiances=results[4];
    renderNav();
    renderSection();
  });
}

function renderNav(){
  var el=document.getElementById("nav");
  el.innerHTML="";
  var sections=[
    {id:"home",label:"Accueil"},
    {id:"categories",label:"Categories"},
    {id:"articles",label:"Articles"},
    {id:"ambiances",label:"Ambiances"},
    {id:"team",label:"Equipe"},
    {id:"indexnow",label:"IndexNow"}
  ];
  sections.forEach(function(s){
    var b=document.createElement("button");
    b.className="nav-btn"+(curSection===s.id?" active":"");
    b.textContent=s.label;
    b.onclick=function(){curSection=s.id;curTab=0;renderNav();renderSection()};
    el.appendChild(b);
  });
}

function renderSection(){
  if(curSection==="home") renderHomepage();
  else if(curSection==="categories") renderCategories();
  else if(curSection==="ambiances") renderAmbiances();
  else if(curSection==="team") renderTeam();
  else if(curSection==="indexnow") renderIndexNow();
  else renderArticles();
}

/* ==================== HOMEPAGE ==================== */
function renderHomepage(){
  var el=document.getElementById("content");
  el.innerHTML="";

  // Hero preview
  var preview=document.createElement("div");
  preview.className="hero-preview";
  if(homepage.hero.backgroundImage){
    preview.style.backgroundImage="linear-gradient(135deg,rgba(74,90,77,"+homepage.hero.backgroundOverlayOpacity+"),rgba(107,124,110,"+homepage.hero.backgroundOverlayOpacity+")),url("+homepage.hero.backgroundImage+")";
  }
  var ph2=document.createElement("h2");
  ph2.innerHTML=esc(homepage.hero.title)+" <span class='accent'>"+esc(homepage.hero.titleAccent)+"</span>";
  preview.appendChild(ph2);
  var pp=document.createElement("p");
  pp.textContent=homepage.hero.subtitle;
  preview.appendChild(pp);
  el.appendChild(preview);

  // Hero form
  var card=document.createElement("div");
  card.className="card";
  var hdr=document.createElement("div");
  hdr.className="card-header";
  var h2=document.createElement("h2");
  h2.textContent="Section Hero";
  hdr.appendChild(h2);
  card.appendChild(hdr);

  var body=document.createElement("div");
  body.className="card-body";

  var form=document.createElement("form");
  var heroFields=[
    {label:"Titre principal",name:"title",value:homepage.hero.title},
    {label:"Titre accent (colore)",name:"titleAccent",value:homepage.hero.titleAccent},
    {label:"Sous-titre",name:"subtitle",value:homepage.hero.subtitle,textarea:true},
    {label:"Bouton principal - texte",name:"ctaPrimaryLabel",value:homepage.hero.ctaPrimary.label},
    {label:"Bouton principal - lien",name:"ctaPrimaryHref",value:homepage.hero.ctaPrimary.href},
    {label:"Bouton secondaire - texte",name:"ctaSecondaryLabel",value:homepage.hero.ctaSecondary.label},
    {label:"Bouton secondaire - lien",name:"ctaSecondaryHref",value:homepage.hero.ctaSecondary.href}
  ];
  heroFields.forEach(function(f){
    var div=document.createElement("div");
    div.className="field";
    var lbl=document.createElement("label");
    lbl.textContent=f.label;
    div.appendChild(lbl);
    if(f.textarea){
      var ta=document.createElement("textarea");
      ta.name=f.name;ta.rows=3;ta.value=f.value;
      div.appendChild(ta);
    } else {
      var inp=document.createElement("input");
      inp.name=f.name;inp.type="text";inp.value=f.value;
      div.appendChild(inp);
    }
    form.appendChild(div);
  });

  // Hero background image upload
  var imgDiv=document.createElement("div");
  imgDiv.className="field";
  var imgLbl=document.createElement("label");
  imgLbl.textContent="Image de fond du hero";
  imgDiv.appendChild(imgLbl);

  if(homepage.hero.backgroundImage){
    var curImg=document.createElement("img");
    curImg.src=homepage.hero.backgroundImage;
    curImg.style.cssText="max-width:100%;max-height:120px;border-radius:8px;border:1px solid #e8e4df;margin-bottom:8px;display:block";
    curImg.onerror=function(){curImg.style.display="none"};
    imgDiv.appendChild(curImg);
  }

  var zone=document.createElement("div");
  zone.className="upload-zone";
  var fileInput=document.createElement("input");
  fileInput.type="file";fileInput.name="heroImage";fileInput.accept="image/*";fileInput.style.display="none";
  zone.appendChild(fileInput);
  var zoneText=document.createElement("p");
  zoneText.style.fontWeight="600";
  zoneText.textContent="Clique pour choisir une image de fond";
  zone.appendChild(zoneText);
  var zoneHint=document.createElement("p");
  zoneHint.style.cssText="font-size:12px;color:#8c8580;margin-top:4px";
  zoneHint.textContent="JPG, PNG, WebP - Recommande : 1920x800px";
  zone.appendChild(zoneHint);
  zone.onclick=function(){fileInput.click()};
  fileInput.onchange=function(){
    if(!fileInput.files[0]) return;
    zoneText.textContent=fileInput.files[0].name;
    var fd=new FormData();
    fd.append("image",fileInput.files[0]);
    fd.append("type","hero");
    fetch("/api/upload-hero-image",{method:"POST",body:fd}).then(function(r){return r.json()}).then(function(data){
      if(data.ok){toast("Image hero uploadee !",true);loadData()}
      else toast("Erreur upload",false);
    });
  };
  imgDiv.appendChild(zone);
  form.appendChild(imgDiv);

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:10px";
  submit.textContent="Enregistrer le hero";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    var fd=new FormData(form);
    var updates={
      title:fd.get("title"),
      titleAccent:fd.get("titleAccent"),
      subtitle:fd.get("subtitle"),
      ctaPrimary:{label:fd.get("ctaPrimaryLabel"),href:fd.get("ctaPrimaryHref")},
      ctaSecondary:{label:fd.get("ctaSecondaryLabel"),href:fd.get("ctaSecondaryHref")}
    };
    fetch("/api/update-homepage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({section:"hero",updates:updates})
    }).then(function(r){
      if(r.ok){toast("Hero mis a jour !",true);loadData()}
      else toast("Erreur sauvegarde",false);
    });
  };
  body.appendChild(form);
  card.appendChild(body);
  el.appendChild(card);

  // Features section
  var fcard=document.createElement("div");
  fcard.className="card";
  var fhdr=document.createElement("div");
  fhdr.className="card-header";
  var fh2=document.createElement("h2");
  fh2.textContent="Section Features";
  fhdr.appendChild(fh2);
  fcard.appendChild(fhdr);
  var fbody=document.createElement("div");
  fbody.className="card-body";

  homepage.features.items.forEach(function(feat,fi){
    var fform=document.createElement("div");
    fform.style.cssText="padding:12px;border:1px solid #e8e4df;border-radius:8px;margin-bottom:12px";
    var ftitle=document.createElement("div");
    ftitle.className="field";
    var ftl=document.createElement("label");
    ftl.textContent="Feature "+(fi+1)+" - Titre";
    ftitle.appendChild(ftl);
    var fti=document.createElement("input");
    fti.type="text";fti.value=feat.title;fti.dataset.fi=fi;fti.dataset.key="title";fti.className="feat-input";
    ftitle.appendChild(fti);
    fform.appendChild(ftitle);

    var fdesc=document.createElement("div");
    fdesc.className="field";
    var fdl=document.createElement("label");
    fdl.textContent="Feature "+(fi+1)+" - Description";
    fdesc.appendChild(fdl);
    var fdi=document.createElement("textarea");
    fdi.rows=2;fdi.value=feat.description;fdi.dataset.fi=fi;fdi.dataset.key="description";fdi.className="feat-input";
    fdesc.appendChild(fdi);
    fform.appendChild(fdesc);

    fbody.appendChild(fform);
  });

  var fsave=document.createElement("button");
  fsave.className="btn btn-primary";
  fsave.style.cssText="width:100%;margin-top:6px";
  fsave.textContent="Enregistrer les features";
  fsave.onclick=function(){
    var items=homepage.features.items.map(function(f){return{title:f.title,description:f.description}});
    document.querySelectorAll(".feat-input").forEach(function(inp){
      var fi=parseInt(inp.dataset.fi);
      items[fi][inp.dataset.key]=inp.value;
    });
    fetch("/api/update-homepage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({section:"features",updates:{items:items}})
    }).then(function(r){
      if(r.ok){toast("Features mises a jour !",true);loadData()}
      else toast("Erreur sauvegarde",false);
    });
  };
  fbody.appendChild(fsave);
  fcard.appendChild(fbody);
  el.appendChild(fcard);

  // Sections titles
  var scard=document.createElement("div");
  scard.className="card";
  var shdr=document.createElement("div");
  shdr.className="card-header";
  var sh2=document.createElement("h2");
  sh2.textContent="Titres des sections";
  shdr.appendChild(sh2);
  scard.appendChild(shdr);
  var sbody=document.createElement("div");
  sbody.className="card-body";

  var sform=document.createElement("form");
  var sfields=[
    {label:"Titre section categories",name:"catTitle",value:homepage.categoriesSection.title},
    {label:"Sous-titre section categories",name:"catSubtitle",value:homepage.categoriesSection.subtitle},
    {label:"Titre section articles",name:"artTitle",value:homepage.articlesSection.title},
    {label:"Sous-titre section articles",name:"artSubtitle",value:homepage.articlesSection.subtitle},
    {label:"Nombre d'articles affiches",name:"artCount",value:String(homepage.articlesSection.count),type:"number"},
    {label:"Titre CTA",name:"ctaTitle",value:homepage.cta.title},
    {label:"Sous-titre CTA",name:"ctaSubtitle",value:homepage.cta.subtitle},
    {label:"Texte bouton CTA",name:"ctaBtn",value:homepage.cta.buttonLabel}
  ];
  sfields.forEach(function(f){
    var div=document.createElement("div");
    div.className="field";
    var lbl=document.createElement("label");
    lbl.textContent=f.label;
    div.appendChild(lbl);
    var inp=document.createElement("input");
    inp.name=f.name;inp.type=f.type||"text";inp.value=f.value;
    if(f.type==="number"){inp.min="1";inp.max="20"}
    div.appendChild(inp);
    sform.appendChild(div);
  });
  var ssave=document.createElement("button");
  ssave.type="submit";ssave.className="btn btn-primary";
  ssave.style.cssText="width:100%;margin-top:10px";
  ssave.textContent="Enregistrer les sections";
  sform.appendChild(ssave);
  sform.onsubmit=function(e){
    e.preventDefault();
    var fd=new FormData(sform);
    fetch("/api/update-homepage",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({section:"sections",updates:{
        categoriesSection:{title:fd.get("catTitle"),subtitle:fd.get("catSubtitle")},
        articlesSection:{title:fd.get("artTitle"),subtitle:fd.get("artSubtitle"),count:parseInt(fd.get("artCount"))},
        cta:{title:fd.get("ctaTitle"),subtitle:fd.get("ctaSubtitle"),buttonLabel:fd.get("ctaBtn")}
      }})
    }).then(function(r){
      if(r.ok){toast("Sections mises a jour !",true);loadData()}
      else toast("Erreur sauvegarde",false);
    });
  };
  sbody.appendChild(sform);
  scard.appendChild(sbody);
  el.appendChild(scard);
}

/* ==================== CATEGORIES ==================== */
function renderCategories(){
  var el=document.getElementById("content");
  el.innerHTML="";
  var title=document.createElement("h2");
  title.className="section-title";
  title.textContent="Images des categories";
  el.appendChild(title);

  var grid=document.createElement("div");
  grid.className="cat-grid";

  categories.forEach(function(cat,ci){
    var card=document.createElement("div");
    card.className="cat-card";

    if(cat.image){
      var img=document.createElement("img");
      img.className="cat-img";
      img.src=cat.image;
      img.alt=cat.name;
      img.onerror=function(){
        var ph=document.createElement("div");
        ph.className="cat-img-placeholder";
        ph.textContent="Pas d'image";
        card.replaceChild(ph,img);
      };
      card.appendChild(img);
    } else {
      var ph=document.createElement("div");
      ph.className="cat-img-placeholder";
      ph.textContent="Pas d'image";
      card.appendChild(ph);
    }

    var info=document.createElement("div");
    info.className="cat-info";

    var name=document.createElement("div");
    name.className="cat-name";
    var colorDot=document.createElement("span");
    colorDot.className="cat-color";
    colorDot.style.backgroundColor=cat.color;
    name.appendChild(colorDot);
    name.appendChild(document.createTextNode(cat.name));
    info.appendChild(name);

    var slug=document.createElement("div");
    slug.className="cat-slug";
    slug.textContent=cat.slug;
    info.appendChild(slug);

    var btnRow=document.createElement("div");
    btnRow.style.cssText="display:flex;gap:6px";

    var btnImg=document.createElement("button");
    btnImg.className="btn btn-orange";
    btnImg.textContent="Changer l'image";
    btnImg.onclick=function(){openCategoryUpload(ci)};
    btnRow.appendChild(btnImg);

    var btnEdit=document.createElement("button");
    btnEdit.className="btn btn-outline";
    btnEdit.textContent="Modifier";
    btnEdit.onclick=function(){openCategoryEdit(ci)};
    btnRow.appendChild(btnEdit);

    info.appendChild(btnRow);
    card.appendChild(info);
    grid.appendChild(card);
  });
  el.appendChild(grid);
}

function openCategoryUpload(ci){
  var cat=categories[ci];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Image: "+cat.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  if(cat.image){
    var preview=document.createElement("img");
    preview.src=cat.image;
    preview.style.cssText="max-width:100%;max-height:180px;border-radius:8px;border:1px solid #e8e4df;margin-bottom:16px;display:block";
    preview.onerror=function(){preview.style.display="none"};
    m.appendChild(preview);
  }

  var form=document.createElement("form");
  form.enctype="multipart/form-data";

  var zone=document.createElement("div");
  zone.className="upload-zone";
  var fileInput=document.createElement("input");
  fileInput.type="file";fileInput.name="image";fileInput.accept="image/*";fileInput.style.display="none";
  zone.appendChild(fileInput);
  var zoneText=document.createElement("p");
  zoneText.style.fontWeight="600";
  zoneText.textContent="Clique pour choisir une image";
  zone.appendChild(zoneText);
  var zoneHint=document.createElement("p");
  zoneHint.style.cssText="font-size:12px;color:#8c8580;margin-top:4px";
  zoneHint.textContent="JPG, PNG, WebP - Recommande : 800x400px";
  zone.appendChild(zoneHint);
  zone.onclick=function(){fileInput.click()};
  fileInput.onchange=function(){
    if(fileInput.files[0]) zoneText.textContent=fileInput.files[0].name;
  };
  form.appendChild(zone);

  var hidden=document.createElement("input");
  hidden.type="hidden";hidden.name="categoryIndex";hidden.value=String(ci);
  form.appendChild(hidden);

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:12px";
  submit.textContent="Uploader";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    if(!fileInput.files[0]){toast("Choisis un fichier",false);return}
    var fd=new FormData(form);
    fetch("/api/upload-category-image",{method:"POST",body:fd}).then(function(r){
      if(r.ok){ov.remove();toast("Image categorie uploadee !",true);loadData()}
      else toast("Erreur upload",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

function openCategoryEdit(ci){
  var cat=categories[ci];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Modifier: "+cat.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  var form=document.createElement("form");
  var fields=[
    {label:"Nom",name:"name",value:cat.name},
    {label:"Description",name:"description",value:cat.description,textarea:true},
    {label:"Couleur (hex)",name:"color",value:cat.color}
  ];
  fields.forEach(function(f){
    var div=document.createElement("div");
    div.className="field";
    var lbl=document.createElement("label");
    lbl.textContent=f.label;
    div.appendChild(lbl);
    if(f.textarea){
      var ta=document.createElement("textarea");
      ta.name=f.name;ta.rows=3;ta.value=f.value;
      div.appendChild(ta);
    } else {
      var inp=document.createElement("input");
      inp.name=f.name;inp.type="text";inp.value=f.value;
      div.appendChild(inp);
    }
    form.appendChild(div);
  });

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:10px";
  submit.textContent="Enregistrer";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    var fd=new FormData(form);
    var updates={name:fd.get("name"),description:fd.get("description"),color:fd.get("color")};
    fetch("/api/update-category",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({categoryIndex:ci,updates:updates})
    }).then(function(r){
      if(r.ok){ov.remove();toast("Categorie mise a jour !",true);loadData()}
      else toast("Erreur sauvegarde",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

/* ==================== ARTICLES ==================== */
function renderArticles(){
  var el=document.getElementById("content");
  el.innerHTML="";

  var tabs=document.createElement("div");
  tabs.className="tabs";
  articles.forEach(function(a,i){
    var b=document.createElement("button");
    b.className="tab"+(i===curTab?" active":"");
    b.textContent=a.title.substring(0,35);
    b.onclick=function(){curTab=i;renderArticles()};
    tabs.appendChild(b);
  });
  el.appendChild(tabs);

  if(articles.length===0) return;
  var a=articles[curTab];

  // Article cover image card
  var imgCard=document.createElement("div");
  imgCard.className="card";
  var imgHdr=document.createElement("div");
  imgHdr.className="card-header";
  var imgH2=document.createElement("h2");
  imgH2.textContent="Image de couverture";
  var imgBtnChange=document.createElement("button");
  imgBtnChange.className="btn btn-orange";
  imgBtnChange.textContent="Changer l'image";
  imgBtnChange.onclick=function(){openArticleImageUpload(curTab)};
  imgHdr.appendChild(imgH2);
  imgHdr.appendChild(imgBtnChange);
  imgCard.appendChild(imgHdr);
  var imgBody=document.createElement("div");
  imgBody.className="card-body";
  imgBody.style.cssText="display:flex;align-items:center;gap:16px";
  if(a.image){
    var coverPreview=document.createElement("img");
    coverPreview.src=a.image;
    coverPreview.alt=a.title;
    coverPreview.style.cssText="width:200px;height:120px;object-fit:cover;border-radius:8px;border:1px solid #e8e4df";
    coverPreview.onerror=function(){coverPreview.style.display="none";coverInfo.textContent="Image introuvable"};
    imgBody.appendChild(coverPreview);
  }
  var coverInfo=document.createElement("div");
  coverInfo.style.cssText="font-size:13px;color:#8c8580";
  coverInfo.textContent=a.image?a.image:"Pas d'image de couverture";
  imgBody.appendChild(coverInfo);
  imgCard.appendChild(imgBody);
  el.appendChild(imgCard);

  // Products card
  var card=document.createElement("div");
  card.className="card";
  var hdr=document.createElement("div");
  hdr.className="card-header";
  var h2=document.createElement("h2");
  h2.textContent=a.title;
  var sp=document.createElement("span");
  sp.style.cssText="font-size:12px;color:#8c8580";
  sp.textContent=a.file;
  hdr.appendChild(h2);
  hdr.appendChild(sp);
  card.appendChild(hdr);

  var body=document.createElement("div");
  body.className="card-body";
  a.products.forEach(function(p,pi){
    body.appendChild(buildProduct(curTab,pi,p));
  });
  card.appendChild(body);
  el.appendChild(card);
}

function buildProduct(ai,pi,p){
  var row=document.createElement("div");
  row.className="product";

  var imgBox=document.createElement("div");
  imgBox.className="pimg";
  if(p.image){
    var img=document.createElement("img");
    img.src=p.image;
    img.alt=p.name;
    img.onerror=function(){imgBox.textContent="Pas d'image"};
    imgBox.appendChild(img);
  } else {
    imgBox.textContent="Pas d'image";
  }
  row.appendChild(imgBox);

  var info=document.createElement("div");
  info.className="pinfo";
  var badge=document.createElement("div");
  badge.className="pbadge";
  badge.textContent=p.badge;
  info.appendChild(badge);
  var name=document.createElement("div");
  name.className="pname";
  name.textContent=p.name;
  info.appendChild(name);
  var price=document.createElement("div");
  price.className="pprice";
  price.textContent=p.price;
  info.appendChild(price);

  var linkDiv=document.createElement("div");
  linkDiv.className="plink";
  var dot=document.createElement("span");
  var hasUrl=p.affiliateUrl&&p.affiliateUrl.length>5;
  dot.className="dot "+(hasUrl?"dot-ok":"dot-no");
  linkDiv.appendChild(dot);
  if(hasUrl){
    var linkA=document.createElement("a");
    linkA.href=p.affiliateUrl;
    linkA.target="_blank";
    linkA.textContent=p.affiliateUrl;
    linkDiv.appendChild(document.createTextNode("Lien: "));
    linkDiv.appendChild(linkA);
  } else {
    linkDiv.appendChild(document.createTextNode("Pas de lien (ASIN: "+p.amazonAsin+")"));
  }
  info.appendChild(linkDiv);
  row.appendChild(info);

  var acts=document.createElement("div");
  acts.className="pactions";
  var btnEdit=document.createElement("button");
  btnEdit.className="btn btn-orange";
  btnEdit.textContent="Modifier";
  btnEdit.onclick=function(){openEdit(ai,pi)};
  acts.appendChild(btnEdit);
  var btnImg=document.createElement("button");
  btnImg.className="btn btn-outline";
  btnImg.textContent="Photo";
  btnImg.onclick=function(){openUpload(ai,pi)};
  acts.appendChild(btnImg);
  row.appendChild(acts);

  return row;
}

function openEdit(ai,pi){
  var p=articles[ai].products[pi];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Modifier: "+p.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  var form=document.createElement("form");

  var fields=[
    {label:"Nom du produit",name:"name",value:p.name,type:"text"},
    {label:"Lien affiliation (ex: https://amzn.to/xxxx)",name:"affiliateUrl",value:p.affiliateUrl||"",type:"text",placeholder:"https://amzn.to/..."},
    {label:"ASIN Amazon (fallback)",name:"amazonAsin",value:p.amazonAsin,type:"text"},
    {label:"Prix",name:"price",value:p.price,type:"text"},
    {label:"Note (/5)",name:"rating",value:String(p.rating),type:"number"},
    {label:"Badge",name:"badge",value:p.badge,type:"text"}
  ];

  fields.forEach(function(f){
    var div=document.createElement("div");
    div.className="field";
    var lbl=document.createElement("label");
    lbl.textContent=f.label;
    div.appendChild(lbl);
    var inp=document.createElement("input");
    inp.name=f.name;
    inp.type=f.type||"text";
    inp.value=f.value;
    if(f.placeholder) inp.placeholder=f.placeholder;
    if(f.type==="number"){inp.step="0.1";inp.min="0";inp.max="5"}
    div.appendChild(inp);
    form.appendChild(div);
  });

  var descDiv=document.createElement("div");
  descDiv.className="field";
  var descLbl=document.createElement("label");
  descLbl.textContent="Description";
  descDiv.appendChild(descLbl);
  var ta=document.createElement("textarea");
  ta.name="description";
  ta.rows=3;
  ta.value=p.description;
  descDiv.appendChild(ta);
  form.appendChild(descDiv);

  var submit=document.createElement("button");
  submit.type="submit";
  submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:10px";
  submit.textContent="Enregistrer";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    var fd=new FormData(form);
    var updates={};
    fd.forEach(function(v,k){updates[k]=v});
    updates.rating=parseFloat(updates.rating);
    fetch("/api/update-product",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({articleIndex:ai,productIndex:pi,updates:updates})
    }).then(function(r){
      if(r.ok){ov.remove();toast("Produit mis a jour !",true);loadData()}
      else toast("Erreur sauvegarde",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

function openUpload(ai,pi){
  var p=articles[ai].products[pi];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Photo: "+p.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  if(p.image){
    var preview=document.createElement("img");
    preview.src=p.image;
    preview.style.cssText="max-width:100%;max-height:180px;border-radius:8px;border:1px solid #e8e4df;margin-bottom:16px;display:block";
    preview.onerror=function(){preview.style.display="none"};
    m.appendChild(preview);
  }

  var form=document.createElement("form");
  form.enctype="multipart/form-data";

  var zone=document.createElement("div");
  zone.className="upload-zone";
  var fileInput=document.createElement("input");
  fileInput.type="file";
  fileInput.name="image";
  fileInput.accept="image/*";
  fileInput.style.display="none";
  zone.appendChild(fileInput);
  var zoneText=document.createElement("p");
  zoneText.style.fontWeight="600";
  zoneText.textContent="Clique pour choisir une image";
  zone.appendChild(zoneText);
  var zoneHint=document.createElement("p");
  zoneHint.style.cssText="font-size:12px;color:#8c8580;margin-top:4px";
  zoneHint.textContent="JPG, PNG, WebP";
  zone.appendChild(zoneHint);
  zone.onclick=function(){fileInput.click()};
  fileInput.onchange=function(){
    if(fileInput.files[0]) zoneText.textContent=fileInput.files[0].name;
  };
  form.appendChild(zone);

  var hiddenAi=document.createElement("input");
  hiddenAi.type="hidden";hiddenAi.name="articleIndex";hiddenAi.value=String(ai);
  form.appendChild(hiddenAi);
  var hiddenPi=document.createElement("input");
  hiddenPi.type="hidden";hiddenPi.name="productIndex";hiddenPi.value=String(pi);
  form.appendChild(hiddenPi);

  var submit=document.createElement("button");
  submit.type="submit";
  submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:12px";
  submit.textContent="Uploader";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    if(!fileInput.files[0]){toast("Choisis un fichier",false);return}
    var fd=new FormData(form);
    fetch("/api/upload-image",{method:"POST",body:fd}).then(function(r){
      if(r.ok){ov.remove();toast("Image uploadee !",true);loadData()}
      else toast("Erreur upload",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

function openArticleImageUpload(ai){
  var a=articles[ai];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Image: "+a.title.substring(0,40);
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  if(a.image){
    var preview=document.createElement("img");
    preview.src=a.image;
    preview.style.cssText="max-width:100%;max-height:180px;border-radius:8px;border:1px solid #e8e4df;margin-bottom:16px;display:block";
    preview.onerror=function(){preview.style.display="none"};
    m.appendChild(preview);
  }

  var form=document.createElement("form");
  form.enctype="multipart/form-data";

  var zone=document.createElement("div");
  zone.className="upload-zone";
  var fileInput=document.createElement("input");
  fileInput.type="file";fileInput.name="image";fileInput.accept="image/*";fileInput.style.display="none";
  zone.appendChild(fileInput);
  var zoneText=document.createElement("p");
  zoneText.style.fontWeight="600";
  zoneText.textContent="Clique pour choisir une image de couverture";
  zone.appendChild(zoneText);
  var zoneHint=document.createElement("p");
  zoneHint.style.cssText="font-size:12px;color:#8c8580;margin-top:4px";
  zoneHint.textContent="JPG, PNG, WebP - Recommande : 1200x630px";
  zone.appendChild(zoneHint);
  zone.onclick=function(){fileInput.click()};
  fileInput.onchange=function(){
    if(fileInput.files[0]) zoneText.textContent=fileInput.files[0].name;
  };
  form.appendChild(zone);

  var hidden=document.createElement("input");
  hidden.type="hidden";hidden.name="articleIndex";hidden.value=String(ai);
  form.appendChild(hidden);

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:12px";
  submit.textContent="Uploader";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    if(!fileInput.files[0]){toast("Choisis un fichier",false);return}
    var fd=new FormData(form);
    fetch("/api/upload-article-image",{method:"POST",body:fd}).then(function(r){
      if(r.ok){ov.remove();toast("Image article uploadee !",true);loadData()}
      else toast("Erreur upload",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

/* ==================== EQUIPE ==================== */
function renderTeam(){
  var el=document.getElementById("content");
  el.innerHTML="";
  var title=document.createElement("h2");
  title.className="section-title";
  title.textContent="Membres de l'equipe";
  el.appendChild(title);

  var grid=document.createElement("div");
  grid.className="cat-grid";

  team.forEach(function(member,mi){
    var card=document.createElement("div");
    card.className="cat-card";

    if(member.image){
      var img=document.createElement("img");
      img.className="cat-img";
      img.src=member.image;
      img.alt=member.name;
      img.style.objectFit="cover";
      img.onerror=function(){
        var ph=document.createElement("div");
        ph.className="cat-img-placeholder";
        ph.style.background="linear-gradient(135deg,"+member.gradient[0]+","+member.gradient[1]+")";
        ph.style.color="#fff";
        ph.style.fontSize="28px";
        ph.style.fontWeight="700";
        ph.textContent=member.name.split(" ").map(function(w){return w[0]}).join("");
        card.replaceChild(ph,img);
      };
      card.appendChild(img);
    } else {
      var ph=document.createElement("div");
      ph.className="cat-img-placeholder";
      ph.style.background="linear-gradient(135deg,"+member.gradient[0]+","+member.gradient[1]+")";
      ph.style.color="#fff";
      ph.style.fontSize="28px";
      ph.style.fontWeight="700";
      ph.textContent=member.name.split(" ").map(function(w){return w[0]}).join("");
      card.appendChild(ph);
    }

    var info=document.createElement("div");
    info.className="cat-info";

    var name=document.createElement("div");
    name.className="cat-name";
    name.textContent=member.name;
    info.appendChild(name);

    var role=document.createElement("div");
    role.className="cat-slug";
    role.textContent=member.role;
    info.appendChild(role);

    var btnRow=document.createElement("div");
    btnRow.style.cssText="display:flex;gap:6px;margin-top:8px";

    var btnImg=document.createElement("button");
    btnImg.className="btn btn-orange";
    btnImg.textContent="Changer la photo";
    btnImg.onclick=function(){openTeamImageUpload(mi)};
    btnRow.appendChild(btnImg);

    var btnEdit=document.createElement("button");
    btnEdit.className="btn btn-outline";
    btnEdit.textContent="Modifier";
    btnEdit.onclick=function(){openTeamEdit(mi)};
    btnRow.appendChild(btnEdit);

    info.appendChild(btnRow);
    card.appendChild(info);
    grid.appendChild(card);
  });
  el.appendChild(grid);
}

function openTeamImageUpload(mi){
  var member=team[mi];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Photo: "+member.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  if(member.image){
    var preview=document.createElement("img");
    preview.src=member.image;
    preview.style.cssText="width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid #C5A572;margin:0 auto 16px;display:block";
    preview.onerror=function(){preview.style.display="none"};
    m.appendChild(preview);
  }

  var form=document.createElement("form");
  form.enctype="multipart/form-data";

  var zone=document.createElement("div");
  zone.className="upload-zone";
  var fileInput=document.createElement("input");
  fileInput.type="file";fileInput.name="image";fileInput.accept="image/*";fileInput.style.display="none";
  zone.appendChild(fileInput);
  var zoneText=document.createElement("p");
  zoneText.style.fontWeight="600";
  zoneText.textContent="Clique pour choisir une photo de profil";
  zone.appendChild(zoneText);
  var zoneHint=document.createElement("p");
  zoneHint.style.cssText="font-size:12px;color:#8c8580;margin-top:4px";
  zoneHint.textContent="JPG, PNG, WebP - Recommande : 400x400px (carre)";
  zone.appendChild(zoneHint);
  zone.onclick=function(){fileInput.click()};
  fileInput.onchange=function(){
    if(fileInput.files[0]) zoneText.textContent=fileInput.files[0].name;
  };
  form.appendChild(zone);

  var hidden=document.createElement("input");
  hidden.type="hidden";hidden.name="memberIndex";hidden.value=String(mi);
  form.appendChild(hidden);

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:12px";
  submit.textContent="Uploader";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    if(!fileInput.files[0]){toast("Choisis un fichier",false);return}
    var fd=new FormData(form);
    fetch("/api/upload-team-image",{method:"POST",body:fd}).then(function(r){
      if(r.ok){ov.remove();toast("Photo de profil uploadee !",true);loadData()}
      else toast("Erreur upload",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

function openTeamEdit(mi){
  var member=team[mi];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Modifier: "+member.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  var form=document.createElement("form");
  var fields=[
    {label:"Nom",name:"name",value:member.name},
    {label:"Role",name:"role",value:member.role},
    {label:"Bio",name:"bio",value:member.bio,textarea:true}
  ];
  fields.forEach(function(f){
    var div=document.createElement("div");
    div.className="field";
    var lbl=document.createElement("label");
    lbl.textContent=f.label;
    div.appendChild(lbl);
    if(f.textarea){
      var ta=document.createElement("textarea");
      ta.name=f.name;ta.rows=3;ta.value=f.value;
      div.appendChild(ta);
    } else {
      var inp=document.createElement("input");
      inp.name=f.name;inp.type="text";inp.value=f.value;
      div.appendChild(inp);
    }
    form.appendChild(div);
  });

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:10px";
  submit.textContent="Enregistrer";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    var fd=new FormData(form);
    var updates={name:fd.get("name"),role:fd.get("role"),bio:fd.get("bio")};
    fetch("/api/update-team-member",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({memberIndex:mi,updates:updates})
    }).then(function(r){
      if(r.ok){ov.remove();toast("Membre mis a jour !",true);loadData()}
      else toast("Erreur sauvegarde",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

/* ==================== AMBIANCES ==================== */
function renderAmbiances(){
  var el=document.getElementById("content");
  el.innerHTML="";
  var title=document.createElement("h2");
  title.className="section-title";
  title.textContent="Ambiances decoratives";
  el.appendChild(title);

  var grid=document.createElement("div");
  grid.className="cat-grid";

  ambiances.forEach(function(amb,ai){
    var card=document.createElement("div");
    card.className="cat-card";

    if(amb.image){
      var img=document.createElement("img");
      img.className="cat-img";
      img.src=amb.image;
      img.alt=amb.name;
      img.onerror=function(){
        var ph=document.createElement("div");
        ph.className="cat-img-placeholder";
        ph.style.background="linear-gradient(135deg,"+amb.color+","+amb.colorAccent+")";
        ph.style.color="#fff";
        ph.style.fontWeight="700";
        ph.textContent=amb.name;
        card.replaceChild(ph,img);
      };
      card.appendChild(img);
    } else {
      var ph=document.createElement("div");
      ph.className="cat-img-placeholder";
      ph.style.background="linear-gradient(135deg,"+amb.color+","+amb.colorAccent+")";
      ph.style.color="#fff";
      ph.style.fontWeight="700";
      ph.textContent=amb.name;
      card.appendChild(ph);
    }

    var info=document.createElement("div");
    info.className="cat-info";

    var name=document.createElement("div");
    name.className="cat-name";
    var colorDot=document.createElement("span");
    colorDot.className="cat-color";
    colorDot.style.backgroundColor=amb.color;
    name.appendChild(colorDot);
    name.appendChild(document.createTextNode(amb.name));
    info.appendChild(name);

    var desc=document.createElement("div");
    desc.className="cat-slug";
    desc.textContent=amb.description.substring(0,60)+"...";
    info.appendChild(desc);

    var rooms=document.createElement("div");
    rooms.style.cssText="font-size:11px;color:#6b7c6e;margin-bottom:8px";
    rooms.textContent="Pieces : "+amb.rooms.map(function(r){return r.name}).join(", ");
    info.appendChild(rooms);

    var btnRow=document.createElement("div");
    btnRow.style.cssText="display:flex;gap:6px";

    var btnImg=document.createElement("button");
    btnImg.className="btn btn-orange";
    btnImg.textContent="Changer l'image";
    btnImg.onclick=function(){openAmbianceImageUpload(ai)};
    btnRow.appendChild(btnImg);

    var btnEdit=document.createElement("button");
    btnEdit.className="btn btn-outline";
    btnEdit.textContent="Modifier";
    btnEdit.onclick=function(){openAmbianceEdit(ai)};
    btnRow.appendChild(btnEdit);

    info.appendChild(btnRow);
    card.appendChild(info);
    grid.appendChild(card);
  });
  el.appendChild(grid);
}

function openAmbianceEdit(ai){
  var amb=ambiances[ai];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Modifier: "+amb.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  var form=document.createElement("form");
  var fields=[
    {label:"Nom",name:"name",value:amb.name},
    {label:"Description",name:"description",value:amb.description,textarea:true},
    {label:"Couleur principale (hex)",name:"color",value:amb.color},
    {label:"Couleur accent (hex)",name:"colorAccent",value:amb.colorAccent}
  ];
  fields.forEach(function(f){
    var div=document.createElement("div");
    div.className="field";
    var lbl=document.createElement("label");
    lbl.textContent=f.label;
    div.appendChild(lbl);
    if(f.textarea){
      var ta=document.createElement("textarea");
      ta.name=f.name;ta.rows=3;ta.value=f.value;
      div.appendChild(ta);
    } else {
      var inp=document.createElement("input");
      inp.name=f.name;inp.type="text";inp.value=f.value;
      div.appendChild(inp);
    }
    form.appendChild(div);
  });

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:10px";
  submit.textContent="Enregistrer";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    var fd=new FormData(form);
    var updates={name:fd.get("name"),description:fd.get("description"),color:fd.get("color"),colorAccent:fd.get("colorAccent")};
    fetch("/api/update-ambiance",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ambianceIndex:ai,updates:updates})
    }).then(function(r){
      if(r.ok){ov.remove();toast("Ambiance mise a jour !",true);loadData()}
      else toast("Erreur sauvegarde",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

function openAmbianceImageUpload(ai){
  var amb=ambiances[ai];
  var ov=document.createElement("div");
  ov.className="overlay";
  ov.onclick=function(e){if(e.target===ov)ov.remove()};

  var m=document.createElement("div");
  m.className="modal";

  var top=document.createElement("div");
  top.className="topbar";
  var h3=document.createElement("h3");
  h3.textContent="Image: "+amb.name;
  var closeBtn=document.createElement("button");
  closeBtn.className="btn btn-outline";
  closeBtn.textContent="Fermer";
  closeBtn.onclick=function(){ov.remove()};
  top.appendChild(h3);
  top.appendChild(closeBtn);
  m.appendChild(top);

  if(amb.image){
    var preview=document.createElement("img");
    preview.src=amb.image;
    preview.style.cssText="max-width:100%;max-height:180px;border-radius:8px;border:1px solid #e8e4df;margin-bottom:16px;display:block";
    preview.onerror=function(){preview.style.display="none"};
    m.appendChild(preview);
  }

  var form=document.createElement("form");
  form.enctype="multipart/form-data";

  var zone=document.createElement("div");
  zone.className="upload-zone";
  var fileInput=document.createElement("input");
  fileInput.type="file";fileInput.name="image";fileInput.accept="image/*";fileInput.style.display="none";
  zone.appendChild(fileInput);
  var zoneText=document.createElement("p");
  zoneText.style.fontWeight="600";
  zoneText.textContent="Clique pour choisir une image";
  zone.appendChild(zoneText);
  var zoneHint=document.createElement("p");
  zoneHint.style.cssText="font-size:12px;color:#8c8580;margin-top:4px";
  zoneHint.textContent="JPG, PNG, WebP - Recommande : 800x400px";
  zone.appendChild(zoneHint);
  zone.onclick=function(){fileInput.click()};
  fileInput.onchange=function(){
    if(fileInput.files[0]) zoneText.textContent=fileInput.files[0].name;
  };
  form.appendChild(zone);

  var hidden=document.createElement("input");
  hidden.type="hidden";hidden.name="ambianceIndex";hidden.value=String(ai);
  form.appendChild(hidden);

  var submit=document.createElement("button");
  submit.type="submit";submit.className="btn btn-primary";
  submit.style.cssText="width:100%;margin-top:12px";
  submit.textContent="Uploader";
  form.appendChild(submit);

  form.onsubmit=function(e){
    e.preventDefault();
    if(!fileInput.files[0]){toast("Choisis un fichier",false);return}
    var fd=new FormData(form);
    fetch("/api/upload-ambiance-image",{method:"POST",body:fd}).then(function(r){
      if(r.ok){ov.remove();toast("Image ambiance uploadee !",true);loadData()}
      else toast("Erreur upload",false);
    });
  };

  m.appendChild(form);
  ov.appendChild(m);
  document.body.appendChild(ov);
}

/* ==================== INDEXNOW ==================== */
function renderIndexNow(){
  var el=document.getElementById("content");
  el.innerHTML="";

  var title=document.createElement("h2");
  title.className="section-title";
  title.textContent="IndexNow - Indexation rapide";
  el.appendChild(title);

  // Info card
  var info=document.createElement("div");
  info.className="indexnow-info";
  info.innerHTML="<strong>IndexNow</strong> notifie Bing, Yandex et DuckDuckGo quand ton contenu change.<br>Les pings sont envoyes <strong>automatiquement</strong> a chaque sauvegarde dans l'admin.<br>Tu peux aussi envoyer un ping manuel pour toutes les pages du site.";
  el.appendChild(info);

  // Status card
  var card=document.createElement("div");
  card.className="indexnow-card";
  var statusDiv=document.createElement("div");
  statusDiv.className="indexnow-status";
  var dot=document.createElement("span");
  dot.className="dot dot-ok";
  statusDiv.appendChild(dot);
  statusDiv.appendChild(document.createTextNode("IndexNow actif - Cle configuree"));
  card.appendChild(statusDiv);

  // Build URL list
  var allUrls=["https://marius-home.com"];
  categories.forEach(function(cat){allUrls.push("https://marius-home.com/"+cat.slug)});
  articles.forEach(function(a){allUrls.push("https://marius-home.com/"+a.category+"/"+a.slug)});

  var countText=document.createElement("p");
  countText.style.cssText="font-size:13px;color:#8c8580;margin-bottom:12px";
  countText.textContent=allUrls.length+" URL(s) seront envoyees aux moteurs de recherche :";
  card.appendChild(countText);

  var urlList=document.createElement("div");
  urlList.className="indexnow-urls";
  urlList.textContent=allUrls.join("\\n");
  card.appendChild(urlList);

  var btnRow=document.createElement("div");
  btnRow.style.cssText="display:flex;gap:8px;margin-top:16px";

  var pingBtn=document.createElement("button");
  pingBtn.className="btn btn-primary";
  pingBtn.style.cssText="padding:10px 24px;font-size:14px";
  pingBtn.textContent="Envoyer le ping IndexNow";
  pingBtn.onclick=function(){
    pingBtn.disabled=true;
    pingBtn.textContent="Envoi en cours...";
    fetch("/api/ping-indexnow",{method:"POST"}).then(function(r){return r.json()}).then(function(data){
      if(data.ok){
        toast("IndexNow: ping envoye pour "+data.urls.length+" URLs !",true);
        indexnowLog.unshift({time:new Date().toLocaleTimeString(),count:data.urls.length});
        renderIndexNow();
      } else {
        toast("Erreur IndexNow",false);
      }
      pingBtn.disabled=false;
      pingBtn.textContent="Envoyer le ping IndexNow";
    }).catch(function(){
      toast("Erreur reseau",false);
      pingBtn.disabled=false;
      pingBtn.textContent="Envoyer le ping IndexNow";
    });
  };
  btnRow.appendChild(pingBtn);
  card.appendChild(btnRow);

  // Log
  if(indexnowLog.length>0){
    var logTitle=document.createElement("p");
    logTitle.style.cssText="font-size:12px;font-weight:600;color:#8c8580;margin-top:16px;margin-bottom:6px";
    logTitle.textContent="Historique des pings (session) :";
    card.appendChild(logTitle);
    indexnowLog.forEach(function(entry){
      var logLine=document.createElement("div");
      logLine.style.cssText="font-size:12px;color:#6b7c6e;padding:2px 0";
      logLine.textContent=entry.time+" - "+entry.count+" URL(s) envoyee(s)";
      card.appendChild(logLine);
    });
  }

  el.appendChild(card);

  // Engines card
  var engCard=document.createElement("div");
  engCard.className="indexnow-card";
  var engTitle=document.createElement("h3");
  engTitle.style.cssText="font-size:15px;font-weight:700;margin-bottom:12px";
  engTitle.textContent="Moteurs supportes";
  engCard.appendChild(engTitle);
  var engines=[
    {name:"Bing",desc:"+ Yahoo, DuckDuckGo, Ecosia"},
    {name:"Yandex",desc:"Moteur russe"},
    {name:"IndexNow API",desc:"Hub central IndexNow"}
  ];
  engines.forEach(function(eng){
    var row=document.createElement("div");
    row.style.cssText="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0f4f1";
    var d=document.createElement("span");
    d.className="dot dot-ok";
    row.appendChild(d);
    var n=document.createElement("span");
    n.style.cssText="font-weight:600;font-size:13px";
    n.textContent=eng.name;
    row.appendChild(n);
    var desc=document.createElement("span");
    desc.style.cssText="font-size:12px;color:#8c8580";
    desc.textContent="- "+eng.desc;
    row.appendChild(desc);
    engCard.appendChild(row);
  });
  el.appendChild(engCard);
}

loadData();
</script>
</body>
</html>`;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:" + PORT);

  // Serve images
  if (url.pathname.startsWith("/images/")) {
    const filePath = path.join(ROOT, "public", url.pathname);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
      res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
  }

  // API: Get articles
  if (url.pathname === "/api/articles" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getArticles()));
    return;
  }

  // API: Get homepage
  if (url.pathname === "/api/homepage" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getHomepage()));
    return;
  }

  // API: Get categories
  if (url.pathname === "/api/categories" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getCategories()));
    return;
  }

  // API: Update homepage
  if (url.pathname === "/api/update-homepage" && req.method === "POST") {
    try {
      const body = JSON.parse((await parseBody(req)).toString());
      const { section, updates } = body;
      const hp = getHomepage();
      if (section === "hero") {
        Object.assign(hp.hero, updates);
      } else if (section === "features") {
        hp.features = updates;
      } else if (section === "sections") {
        Object.assign(hp.categoriesSection, updates.categoriesSection);
        Object.assign(hp.articlesSection, updates.articlesSection);
        Object.assign(hp.cta, updates.cta);
      }
      saveHomepage(hp);
      pingIndexNow(["https://" + SITE_HOST]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Upload hero background image
  if (url.pathname === "/api/upload-hero-image" && req.method === "POST") {
    try {
      const buf = await parseBody(req);
      const contentType = req.headers["content-type"] || "";
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) { res.writeHead(400); res.end("No boundary"); return; }
      const parts = parseMultipart(buf, boundary);
      const filePart = parts.find((p) => p.filename);
      if (!filePart) { res.writeHead(400); res.end("Missing file"); return; }

      const ext = path.extname(filePart.filename).toLowerCase() || ".jpg";
      const filename = "hero-bg" + ext;
      const imagePath = path.join(HERO_IMAGES_DIR, filename);

      fs.writeFileSync(imagePath, filePart.data);

      const hp = getHomepage();
      hp.hero.backgroundImage = "/images/" + filename;
      saveHomepage(hp);
      pingIndexNow(["https://" + SITE_HOST]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, path: hp.hero.backgroundImage }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Upload category image
  if (url.pathname === "/api/upload-category-image" && req.method === "POST") {
    try {
      const buf = await parseBody(req);
      const contentType = req.headers["content-type"] || "";
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) { res.writeHead(400); res.end("No boundary"); return; }
      const parts = parseMultipart(buf, boundary);
      const filePart = parts.find((p) => p.filename);
      const ciPart = parts.find((p) => p.name === "categoryIndex");
      if (!filePart || !ciPart) { res.writeHead(400); res.end("Missing data"); return; }

      const ci = parseInt(ciPart.data.toString());
      const cats = getCategories();
      const cat = cats[ci];

      const ext = path.extname(filePart.filename).toLowerCase() || ".jpg";
      const slug = cat.slug;
      const filename = slug + ext;
      const imagePath = path.join(CATEGORIES_IMAGES_DIR, filename);

      fs.writeFileSync(imagePath, filePart.data);

      cat.image = "/images/categories/" + filename;
      saveCategories(cats);
      pingIndexNow(getUrlsForCategory(cat.slug));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, path: cat.image }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Update category
  if (url.pathname === "/api/update-category" && req.method === "POST") {
    try {
      const body = JSON.parse((await parseBody(req)).toString());
      const { categoryIndex, updates } = body;
      const cats = getCategories();
      Object.assign(cats[categoryIndex], updates);
      saveCategories(cats);
      pingIndexNow(getUrlsForCategory(cats[categoryIndex].slug));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Update product
  if (url.pathname === "/api/update-product" && req.method === "POST") {
    try {
      const body = JSON.parse((await parseBody(req)).toString());
      const { articleIndex, productIndex, updates } = body;
      const arts = getArticles();
      const article = arts[articleIndex];
      const product = article.products[productIndex];
      Object.assign(product, updates);
      saveArticle(article.file, article);
      pingIndexNow(["https://" + SITE_HOST + "/" + article.category + "/" + article.slug]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Upload product image
  if (url.pathname === "/api/upload-image" && req.method === "POST") {
    try {
      const buf = await parseBody(req);
      const contentType = req.headers["content-type"] || "";
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) { res.writeHead(400); res.end("No boundary"); return; }
      const parts = parseMultipart(buf, boundary);
      const filePart = parts.find((p) => p.filename);
      const aiPart = parts.find((p) => p.name === "articleIndex");
      const piPart = parts.find((p) => p.name === "productIndex");
      if (!filePart || !aiPart || !piPart) { res.writeHead(400); res.end("Missing data"); return; }

      const ai = parseInt(aiPart.data.toString());
      const pi = parseInt(piPart.data.toString());
      const arts = getArticles();
      const article = arts[ai];
      const product = article.products[pi];

      const ext = path.extname(filePart.filename).toLowerCase() || ".jpg";
      const slug = product.name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50);
      const filename = slug + ext;
      const imagePath = path.join(IMAGES_DIR, filename);

      fs.writeFileSync(imagePath, filePart.data);

      product.image = "/images/products/" + filename;
      saveArticle(article.file, article);
      pingIndexNow(["https://" + SITE_HOST + "/" + article.category + "/" + article.slug]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, path: product.image }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Get team
  if (url.pathname === "/api/team" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getTeam()));
    return;
  }

  // API: Upload team member image
  if (url.pathname === "/api/upload-team-image" && req.method === "POST") {
    try {
      const buf = await parseBody(req);
      const contentType = req.headers["content-type"] || "";
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) { res.writeHead(400); res.end("No boundary"); return; }
      const parts = parseMultipart(buf, boundary);
      const filePart = parts.find((p) => p.filename);
      const miPart = parts.find((p) => p.name === "memberIndex");
      if (!filePart || !miPart) { res.writeHead(400); res.end("Missing data"); return; }

      const mi = parseInt(miPart.data.toString());
      const members = getTeam();
      const member = members[mi];

      const ext = path.extname(filePart.filename).toLowerCase() || ".jpg";
      const slug = member.name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = slug + ext;
      const imagePath = path.join(TEAM_IMAGES_DIR, filename);

      fs.writeFileSync(imagePath, filePart.data);

      member.image = "/images/team/" + filename;
      saveTeam(members);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, path: member.image }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Update team member
  if (url.pathname === "/api/update-team-member" && req.method === "POST") {
    try {
      const body = JSON.parse((await parseBody(req)).toString());
      const { memberIndex, updates } = body;
      const members = getTeam();
      Object.assign(members[memberIndex], updates);
      saveTeam(members);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Upload article cover image
  if (url.pathname === "/api/upload-article-image" && req.method === "POST") {
    try {
      const buf = await parseBody(req);
      const contentType = req.headers["content-type"] || "";
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) { res.writeHead(400); res.end("No boundary"); return; }
      const parts = parseMultipart(buf, boundary);
      const filePart = parts.find((p) => p.filename);
      const aiPart = parts.find((p) => p.name === "articleIndex");
      if (!filePart || !aiPart) { res.writeHead(400); res.end("Missing data"); return; }

      const ai = parseInt(aiPart.data.toString());
      const arts = getArticles();
      const article = arts[ai];

      const ext = path.extname(filePart.filename).toLowerCase() || ".jpg";
      const filename = article.slug + ext;
      const imagePath = path.join(ARTICLE_IMAGES_DIR, filename);

      fs.writeFileSync(imagePath, filePart.data);

      article.image = "/images/articles/" + filename;
      saveArticle(article.file, article);
      pingIndexNow(["https://" + SITE_HOST + "/" + article.category + "/" + article.slug]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, path: article.image }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Get ambiances
  if (url.pathname === "/api/ambiances" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getAmbiances()));
    return;
  }

  // API: Update ambiance
  if (url.pathname === "/api/update-ambiance" && req.method === "POST") {
    try {
      const body = JSON.parse((await parseBody(req)).toString());
      const { ambianceIndex, updates } = body;
      const ambs = getAmbiances();
      Object.assign(ambs[ambianceIndex], updates);
      saveAmbiances(ambs);
      pingIndexNow(["https://" + SITE_HOST + "/ambiances/" + ambs[ambianceIndex].slug]);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Upload ambiance image
  if (url.pathname === "/api/upload-ambiance-image" && req.method === "POST") {
    try {
      const buf = await parseBody(req);
      const contentType = req.headers["content-type"] || "";
      const boundary = contentType.split("boundary=")[1];
      if (!boundary) { res.writeHead(400); res.end("No boundary"); return; }
      const parts = parseMultipart(buf, boundary);
      const filePart = parts.find((p) => p.filename);
      const aiPart = parts.find((p) => p.name === "ambianceIndex");
      if (!filePart || !aiPart) { res.writeHead(400); res.end("Missing data"); return; }

      const ai = parseInt(aiPart.data.toString());
      const ambs = getAmbiances();
      const amb = ambs[ai];

      const ext = path.extname(filePart.filename).toLowerCase() || ".jpg";
      const filename = amb.slug + ext;
      const imagePath = path.join(AMBIANCES_IMAGES_DIR, filename);

      fs.writeFileSync(imagePath, filePart.data);

      amb.image = "/images/ambiances/" + filename;
      saveAmbiances(ambs);
      pingIndexNow(["https://" + SITE_HOST + "/ambiances/" + amb.slug]);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, path: amb.image }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // API: Ping IndexNow (manual - all URLs)
  if (url.pathname === "/api/ping-indexnow" && req.method === "POST") {
    try {
      const urls = getAllSiteUrls();
      pingIndexNow(urls);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, urls: urls }));
    } catch (e) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Serve HTML page
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(HTML_PAGE);
});

server.listen(PORT, () => {
  console.log("");
  console.log("  Admin Marius Dumas disponible sur :");
  console.log("");
  console.log("  -> http://localhost:" + PORT);
  console.log("");
  console.log("  Fonctionnalites :");
  console.log("    - Accueil : Modifier les textes du hero, features, sections");
  console.log("    - Accueil : Uploader une image de fond pour le hero");
  console.log("    - Categories : Modifier nom, description, couleur");
  console.log("    - Categories : Uploader les images des categories");
  console.log("    - Articles : Modifier les produits (nom, prix, lien, ASIN, etc.)");
  console.log("    - Articles : Uploader les photos des produits");
  console.log("    - Ambiances : Modifier nom, description, couleurs");
  console.log("    - Ambiances : Uploader les images des ambiances");
  console.log("    - IndexNow : Ping automatique Bing/Yandex a chaque sauvegarde");
  console.log("    - IndexNow : Ping manuel de toutes les URLs du site");
  console.log("    - Toutes les modifications sont sauvegardees dans les fichiers JSON");
  console.log("");
  console.log("  Appuie sur Ctrl+C pour arreter.");
  console.log("");
});
