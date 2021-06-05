import {
    Mesh,
    DoubleSide,
    TextureLoader,
    // BoxGeometry,
    MeshPhongMaterial,
    // MeshStandardMaterial,
    PlaneGeometry,
    RepeatWrapping
} from "three";
import floorTex from './assets/textures/floor1.jpg';

export default class Floor {

    constructor(scene, size, y) {
        console.log("floor")
        this.scene = scene;
        this.geometry = new PlaneGeometry(size, size, 10, 10);
        this.material = new MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0,
            // side: DoubleSide,
            map: new TextureLoader().load(floorTex),
        });
        this.material.map.wrapS = RepeatWrapping;
        this.material.map.wrapT = RepeatWrapping;
        this.material.map.repeat.set(10, 10);
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.rotation.x = - Math.PI / 2;
        this.mesh.position.y = y;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh)
    }
    update() {
        // this.mesh.rotation.x += 0.01
        // this.mesh.rotation.y += 0.01
    }

}