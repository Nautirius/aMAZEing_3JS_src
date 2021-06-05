import {
    Mesh,
    DoubleSide,
    TextureLoader,
    BoxGeometry,
    MeshPhongMaterial,
    // MeshStandardMaterial,
    RepeatWrapping
} from "three";
import wallTex from './assets/textures/wall1.jpg';

export default class Wall {

    constructor(scene, size, height, x, y, z) {
        console.log("wall")
        this.scene = scene;
        this.geometry = new BoxGeometry(size, height, size);
        this.material = new MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0,
            // side: DoubleSide,
            map: new TextureLoader().load(wallTex),
        });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.translateX(x * size)
        this.mesh.translateY(y)
        this.mesh.translateZ(z * size)
        this.mesh.castShadow = true;
        this.material.map.wrapS = RepeatWrapping;
        this.material.map.wrapT = RepeatWrapping;
        this.material.map.repeat.set(1, 1);
        // this.mesh.material.flatShading = true;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }
}