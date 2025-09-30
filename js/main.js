window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  loader.style.display = 'none';
});

// Menu hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('header nav');

if(menuToggle){
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

const path = window.location.pathname;

if (path.includes("catalogo.html")) {
  cargarCatalogo();
} else if (path.includes("detalle.html")) {
  cargarDetalle();
}

// Catalogo
async function cargarCatalogo() {
  const contenedor = document.getElementById("pokemon-list");
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=5000");
  const data = await res.json();

  data.results.forEach(async (pokemon) => {
    const pokeRes = await fetch(pokemon.url);
    const pokeData = await pokeRes.json();

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${pokeData.sprites.front_default}" alt="${pokeData.name}">
      <h3>${pokeData.name}</h3>
      <a href="detalle.html?name=${pokeData.name}" class="btn">Ver más</a>
    `;
    contenedor.appendChild(card);
  });
}

// Detalle
async function cargarDetalle() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const poke = await res.json();

  const contenedor = document.getElementById("pokemon-detail");
  
  const tipos = poke.types.map(t => `<span class="type ${t.type.name}">${t.type.name}</span>`).join(" ");
  const habilidades = poke.abilities.map(a => a.ability.name).join(", ");
  const stats = poke.stats.map(s => `<p><strong>${s.stat.name}:</strong> ${s.base_stat}</p>`).join("");

  contenedor.innerHTML = `
    <h2>${poke.name}</h2>
    <div class="img-detail">
      <img src="${poke.sprites.front_default}" alt="${poke.name}">
      <img src="${poke.sprites.back_default}" alt="${poke.name}">
    </div>
    <div class="types">${tipos}</div>
    <p><strong>Altura:</strong> ${poke.height}</p>
    <p><strong>Peso:</strong> ${poke.weight}</p>
    <p><strong>Habilidades:</strong> ${habilidades}</p>
    <div class="stats">${stats}</div>
    <a href="catalogo.html" class="back-btn">← Volver al Catálogo</a>
  `;
}
