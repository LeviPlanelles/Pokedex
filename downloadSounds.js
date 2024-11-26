import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Directorio para guardar los sonidos
const saveFolder = path.resolve('pokemon_sounds');
if (!fs.existsSync(saveFolder)) {
    fs.mkdirSync(saveFolder);
}

// IDs de Pokémon (1-151 para la primera generación)
const pokemonIds = Array.from({ length: 151 }, (_, i) => i + 1);

// Función para descargar un sonido
async function downloadSound(pokemonId) {
    try {
        const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
        
        // Ajusta esta URL según sea necesario
        const response = await fetch(soundUrl);

        if (!response.ok) {
            console.log(`❌ Sonido no encontrado para Pokémon #${pokemonId}`);
            return;
        }

        // Descargar y guardar el archivo
        const buffer = await response.buffer();
        const filePath = path.join(saveFolder, `${pokemonId}.ogg`);
        fs.writeFileSync(filePath, buffer);
        console.log(`✅ Sonido de Pokémon #${pokemonId} descargado.`);
    } catch (error) {
        console.error(`❌ Error descargando Pokémon #${pokemonId}:`, error.message);
    }
}

// Descargar todos los sonidos
async function downloadAllSounds() {
    console.log("🔄 Iniciando descarga de sonidos...");
    for (const id of pokemonIds) {
        await downloadSound(id);
    }
    console.log("🎉 ¡Descarga completa!");
}

// Ejecutar el script
downloadAllSounds();
