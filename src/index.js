import './style.css';
import Main from './components/Main';
import loadingGif from './components/assets/textures/loading-buffering.gif'

function init() {
    const loadingScreen = document.getElementById('loadingscreen')
    let img = document.createElement("img")
    img.src= loadingGif
    loadingScreen.appendChild(img)
    let loadedString = document.createElement("span")
    loadedString.setAttribute('id', 'loaded')
    loadedString.innerText = "loading... 0/0"
    loadingScreen.appendChild(loadedString)
    const container = document.getElementById('root');
    new Main(container);
}

init();
