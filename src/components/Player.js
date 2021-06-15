// import { Mesh, TextureLoader, MeshPhongMaterial, SpotLight, Box3, Object3D, Vector3 } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import model from './assets/models/rifle/scene.gltf'
import model2 from './assets/models/steve/scene.gltf'

export default class Player {
    constructor(scene, manager, x, z) {
        this.scene = scene;
        this.mesh;
        this.manager = manager;
        this.loader = new GLTFLoader(this.manager)
        this.geometry = null;
        this.x = x;
        this.z = z;
    }

    load(role) {
        this.model = role === "player" ? model : model2;

        this.loader.load(
            this.model,
            (gltf) => {
                console.log('success')
                if (role === "player") {
                    gltf.scene.scale.set(0.2, 0.2, 0.2)
                    gltf.scene.position.x = this.x * 100
                    gltf.scene.position.y = 0.75
                    gltf.scene.position.z = this.z * 100
                } else {
                    gltf.scene.scale.set(6, 6, 6)
                    gltf.scene.position.x = this.x * 100
                    gltf.scene.position.y = 45
                    gltf.scene.position.z = this.z * 100
                }

                // gltf.scene.rotateY(Math.PI / 2)
                this.mesh = gltf.scene
                this.model = gltf


                this.scene.add(this.mesh)
                // console.log(gltf.animations)
            },
            (progress) => {
                console.log('progress')
                // console.log(progress)
            },
            (error) => {
                console.log(error)
            }
        )
    }
    unload() {
        this.scene.remove(this.mesh); // ew funkcja do usunięcia modelu ze sceny
    }
}