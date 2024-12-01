const closeModalBtn = document.querySelector(".close-modal");
const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/";

for (let i = 1; i <= 151; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
}

// Mostrar información del Pokémon en el modal
function showModal(poke) {
    console.log("Abriendo modal para:", poke.name);

    const modalContent = document.getElementById("pokemon-info");
    const modal = document.getElementById("pokemon-modal");

    modalContent.innerHTML = `
        <h2>${poke.name.toUpperCase()}</h2>
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        <p><strong>Altura:</strong> ${poke.height / 10} m</p>
        <p><strong>Peso:</strong> ${poke.weight / 10} kg</p>
        <p><strong>Tipos:</strong> ${poke.types.map(t => t.type.name).join(", ")}</p>
    `;

    modal.classList.add("active");
    document.body.classList.add("modal-active");

    console.log("Modal abierto");
}




closeModalBtn.addEventListener("click", () => {
    const modal = document.getElementById("pokemon-modal");
    modal.classList.remove("active");
    document.body.classList.remove("modal-active");
});
function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.setAttribute("data-id", poke.id);
    const staticImage = poke.sprites.other["official-artwork"].front_default;
    const animatedGif = poke.sprites.other.showdown.front_default;

    //console.log(`Pokémon: ${poke.name}, Animated GIF: ${animatedGif}, StaticImage: ${staticImage}`);
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${staticImage}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height/10}m</p>
                <p class="stat">${poke.weight/10}kg</p>
            </div>
        </div>
    `;
    const imgElement = div.querySelector(".pokemon-imagen img");
    imgElement.addEventListener("mouseover", () => {
        if (animatedGif) {
            imgElement.src = animatedGif; // Cambia a la animación
        } else {
            console.log(`GIF no disponible para ${poke.name}`);
        }
    });

    imgElement.addEventListener("mouseout", () => {
        imgElement.src = staticImage; // Vuelve a la imagen estática
    });

    // Reproducir sonido solo si se hace clic en la imagen
    imgElement.addEventListener("click", () => {
        const audio = new Audio(`./pokemon_sounds/${poke.id}.ogg`);
        audio.play().catch(() => {
            console.log(`Sonido no disponible para Pokémon ${poke.name}`);
        });
    });

    div.addEventListener("click", (event) => {
        if (event.target !== imgElement) {
            showModal(poke);
        }
    });
    
    listaPokemon.append(div);
}
botonesHeader.forEach(boton => boton.addEventListener("click", (envent) => {
    const botonId = envent.currentTarget.id;
    listaPokemon.innerHTML = "";
    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                if (botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    }
                }
                
            })
    }
}))