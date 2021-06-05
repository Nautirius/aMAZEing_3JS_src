import { WebGLRenderer, PCFSoftShadowMap } from 'three';


export default class Renderer extends WebGLRenderer {
    constructor(container) {
        super({ antialias: true })

        this.container = container

        this.container.appendChild(this.domElement);

        this.setClearColor(0xffffff)
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;

        // resize
        this.updateSize();
        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        this.setSize(window.innerWidth, window.innerHeight);
    }
}