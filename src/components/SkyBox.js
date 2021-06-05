import {
    TextureLoader,
    WebGLCubeRenderTarget
} from "three";
import skyboxTex from './assets/textures/warszawa.jpg';

export default class SkyBox {

    constructor(scene, renderer) {
        console.log("floor")
        this.scene = scene;
        this.renderer = renderer;

        const loader = new TextureLoader();
        const texture = loader.load(
            // 'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
            skyboxTex,
            () => {
                const rt = new WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(this.renderer.threeRenderer, texture);
                this.scene.background = rt.texture;
            });
    }
}