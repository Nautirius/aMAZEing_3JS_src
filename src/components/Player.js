import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader.js';
import { Mesh, TextureLoader, MeshPhongMaterial, SpotLight, Box3, Object3D } from "three";
import marioTex from './assets/models/mario/mario2.jpg';

export default class Player {
    constructor(scene, manager, x, z) {
        this.scene = scene;
        this.mesh = null;
        this.manager = manager;
        this.geometry = null;
        this.light = null;
        this.lightDirection = null;
        this.x = x;
        this.z = z;
    }

    load(path) {

        // Manager is passed in to loader to determine when loading done in main
        // Load model with FBXLoader

        new MD2Loader(this.manager).load(
            path,
            geometry => {

                this.geometry = geometry;

                this.mesh = new Mesh(geometry, new MeshPhongMaterial({
                    color: 0xffffff,
                    specular: 0xffffff,
                    shininess: 0,
                    map: new TextureLoader().load(marioTex),
                    morphTargets: true // animowanie materiału modelu
                }))
                // this.mesh.translateY(0);
                this.mesh.translateX(this.x * 100);
                this.mesh.translateZ(this.z * 100);
                this.mesh.translateY(-25);
                // this.mesh.translateY(this.z);
                this.mesh.castShadow = true;
                // this.mesh.receiveShadow = true;
                console.log(this.geometry.animations) // tu powinny być widoczne animacje
                // this.light = new SpotLight("white", 1, 300, Math.PI / 8);
                // this.light.translateY(1);
                // this.light.castShadow = true;
                // this.mesh.add(this.light);
                // this.light.translateX(20);
                // this.lightDirection = new Object3D;
                // this.mesh.add(this.lightDirection);
                // this.lightDirection.translateX(200);
                // this.lightDirection.translateY(-20);
                // this.light.target = this.lightDirection;

                this.scene.add(this.mesh);
            },
        );
    }
    unload() {
        this.scene.remove(this.mesh); // ew funkcja do usunięcia modelu ze sceny
    }
}