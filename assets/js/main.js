const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
                <div class="info">
                    <span>Altura: ${pokemon.height ? pokemon.height : 'N/A'}</span><br>
                    <span>Peso: ${pokemon.weight ? pokemon.weight : 'N/A'}</span>
                </div>
            </div>
        </li>
    `
}

function showPokemonModal(pokemon) {
    const modal = document.getElementById('pokemonModal');
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <span style="font-size:1.2rem;color:#888;">#${pokemon.number}</span>
            <h2 style="margin:0;text-transform:capitalize;">${pokemon.name}</h2>
            <div style="display:flex;gap:0.5rem;">
                ${pokemon.types.map(type => `<span class="type ${type}" style="padding:0.3rem 0.8rem;border-radius:1rem;color:#fff;text-transform:capitalize;">${type}</span>`).join('')}
            </div>
            <img src="${pokemon.photo}" alt="${pokemon.name}" style="height:120px;filter:drop-shadow(0 2px 8px #0002);">
            <div style="width:100%;text-align:left;">
                <p><strong>Altura:</strong> ${pokemon.height ? pokemon.height : 'N/A'}</p>
                <p><strong>Peso:</strong> ${pokemon.weight ? pokemon.weight : 'N/A'}</p>
                <p><strong>Experiência Base:</strong> ${pokemon.baseExperience ? pokemon.baseExperience : 'N/A'}</p>
                <p><strong>Habilidades:</strong> ${pokemon.abilities && pokemon.abilities.length > 0 ? pokemon.abilities.map(h => `<span style='background:#eee;border-radius:0.5rem;padding:0.2rem 0.6rem;margin-right:0.3rem;color:#333;'>${h}</span>`).join('') : 'N/A'}</p>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

document.getElementById('closeModal').onclick = function() {
    document.getElementById('pokemonModal').style.display = 'none';
};

window.onclick = function(event) {
    const modal = document.getElementById('pokemonModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        // Adiciona evento de clique para cada card
        document.querySelectorAll('.pokemon').forEach((el, idx) => {
            el.onclick = () => showPokemonModal(pokemons[idx]);
        });
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})