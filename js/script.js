import {
    datos
} from './datos.js';

const artistas = datos.artistas;

const nav = document.body.children[1];

const main = nav.nextElementSibling;

if (getCookie('currentAlbum') != null) {
    mostrarAlbum(getCookie('currentAlbum'));
}

artistas.forEach(artista => {
    let imagen = createNode("img", "", ["albumPreview"], [{
        name: "src",
        value: `./img/${artista.imagen}`
    }]);
    imagen.addEventListener('click', () => mostrarAlbum(artista.id));
    nav.appendChild(imagen);
});

function createNode(nodeType, nodeText, nodeClasess, nodeAttributtes) {
    let node = document.createElement(nodeType);
    if (nodeText != "" && nodeText != null) {
        node.appendChild(document.createTextNode(nodeText));
    }
    if (nodeClasess.length > 0) {
        nodeClasess.forEach(clss => node.classList.add(clss));
    }
    if (nodeAttributtes.length > 0) {
        nodeAttributtes.forEach(attributte => node.setAttribute(attributte.name, attributte.value));
    }
    return node;
}

function borrarNodosHijos(padre) {
    while (padre.firstChild) {
        padre.removeChild(padre.firstChild);
    }
}

function mostrarAlbum(artistaId) {
    borrarNodosHijos(main);
    let artista = artistas.find(artista => artista.id === artistaId);
    setCookie('currentAlbum', artista.id, 24);
    let cardArtista = createNode('div', '', ['albumCard'], [{
        name: "id",
        value: artista.id
    }]);
    cardArtista.appendChild(createNode('img', '', [], [{
        name: 'src',
        value: `./img/${artista.imagen}`
    }]));
    cardArtista.appendChild(createNode('h2', artista.album, [], []));
    cardArtista.appendChild(createNode('div', '', [], []));

    // -----BOTONES FAVS-----
    let btnContainer = createNode('div', '', ['albumCardButtons'], []);
    let btnInfo = createNode('button', 'Show Info', [], []);
    btnInfo.addEventListener('click', showInfo);
    let btnFav;
    if (localStorage.getItem('albumFavs') == null) {
        localStorage.setItem('albumFavs', JSON.stringify({
            favoritos: []
        }));
        btnFav = createNode('button', 'Añadir a favoritos', [], []);
        btnFav.addEventListener('click', addFavoritos);
    } else {
        let favoritosObjt = JSON.parse(localStorage.getItem('albumFavs'));
        let existe = favoritosObjt.favoritos.find(favorito => favorito == artistaId);
        if (typeof existe == 'undefined') {
            btnFav = createNode('button', 'Añadir a favoritos', [], []);
            btnFav.addEventListener('click', addFavoritos);
        } else {
            btnFav = createNode('button', 'Eliminar de favoritos', [], []);
            btnFav.addEventListener('click', delFavoritos);
        }
    }
    btnContainer.appendChild(btnInfo);
    btnContainer.appendChild(btnFav);
    cardArtista.appendChild(btnContainer);
    main.appendChild(cardArtista);
}

function showInfo(e) {
    e.target.textContent = 'Hide Info';
    e.target.removeEventListener('click', showInfo);
    e.target.addEventListener('click', hideInfo);
    let artista = artistas.find(artista => artista.id === e.target.parentNode.parentNode.id);
    let agrupador = e.target.parentNode.parentNode.children[2];
    agrupador.appendChild(createNode('h4', artista.name, [], []));
    agrupador.appendChild(createNode('p', artista.year, [], []));
    agrupador.appendChild(createNode('p', artista.bio, [], []));
}

function hideInfo(e) {
    let agrupador = e.target.parentNode.parentNode.children[2];
    e.target.textContent = 'Show Info';
    e.target.removeEventListener('click', hideInfo);
    e.target.addEventListener('click', showInfo);
    borrarNodosHijos(agrupador);
}

function addFavoritos(e) {
    let favoritosObjt = JSON.parse(localStorage.getItem('albumFavs'));
    favoritosObjt.favoritos.push(e.target.parentNode.parentNode.id);
    localStorage.setItem('albumFavs', JSON.stringify(favoritosObjt));
    e.target.textContent = "Eliminar de Favoritos";
    e.target.removeEventListener('click', addFavoritos);
    e.target.addEventListener('click', delFavoritos);
}

function delFavoritos(e) {
    let favoritosObjt = JSON.parse(localStorage.getItem('albumFavs'));
    favoritosObjt.favoritos = borrarElemArray(favoritosObjt.favoritos, e.target.parentNode.parentNode.id);
    localStorage.setItem('albumFavs', JSON.stringify(favoritosObjt));
    e.target.textContent = "Añadir de Favoritos";
    e.target.removeEventListener('click', delFavoritos);
    e.target.addEventListener('click', addFavoritos);
}

function borrarElemArray(array, elem) {
    let index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }
    return array;
}

function setCookie(name, value, hours) {
    let expdate = new Date();
    expdate.setTime(expdate.getTime() + hours * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires = ${expdate.toUTCString()}`;
}

function getCookie(name) {
    let index = document.cookie.indexOf(name + '=');
    if (index == -1) return null;
    index = document.cookie.indexOf('=', index) + 1;
    let endstr = document.cookie.indexOf(';', index);
    if (endstr == -1) {
        endstr = document.cookie.length;
    }
    return decodeURIComponent(document.cookie.substring(index, endstr));
}