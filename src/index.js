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
    loadedString.innerText = "loaded 0/0"
    loadingScreen.appendChild(loadedString)
    //div
    const container = document.getElementById('root');
    //main class object
    new Main(container);
    // new MainCollisions(container);
}

init();
