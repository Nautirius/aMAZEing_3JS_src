import { MD2Loader } from 'three/examples/jsm/loaders/MD2Loader.js';
import { Mesh, TextureLoader, MeshPhongMaterial, SpotLight, Box3, Object3D, Vector3 } from "three";
import marioTex from './assets/models/mario/mario2.jpg';
import Wall from './Wall'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import model from './assets/models/rifle/scene.gltf'
import model2 from './assets/models/steve/scene.gltf'
import a1 from './assets/textures/arms_baseColor.png'
import a2 from './assets/textures/arms_metallicRoughness.png'
import a3 from './assets/textures/arms_normal.png'
import a4 from './assets/textures/material_baseColor.png'
import a5 from './assets/textures/material_metallicRoughness.png'
import a6 from './assets/textures/material_normal.png'
// import model2 from './assets/models/auto/scene.gltf'


console.log(a1, a2, a3, a4, a5, a6)

export default class Player {
    constructor(scene, manager, x, z) {
        this.scene = scene;
        this.mesh;


        // this.mesh.position.x = x*100
        // this.mesh.position.z = z*100
        this.manager = manager;
        this.loader = new GLTFLoader(this.manager)
        this.geometry = null;
        this.light = null;
        this.lightDirection = null;
        this.x = x;
        this.z = z;
    }

    load(role) {
        this.model = role === "player" ? model : model2;

        // Manager is passed in to loader to determine when loading done in main
        // Load model with FBXLoader
        this.loader.load(
            this.model,
            (gltf) => {
                console.log('success')
                console.log(gltf)
                if (role === "player") {
                    gltf.scene.scale.set(0.2, 0.2, 0.2)
                    gltf.scene.position.x = this.x * 100
                    gltf.scene.position.y = 0.75
                    gltf.scene.position.z = this.z * 100
                } else {
                    gltf.scene.scale.set(8, 8, 8)
                    gltf.scene.position.x = this.x * 100
                    gltf.scene.position.y = 70
                    gltf.scene.position.z = this.z * 100
                }

                gltf.scene.rotateY(Math.PI / 2)
                this.mesh = gltf.scene
                this.model = gltf

                // this.cameraTarget = new Object3D()
                // this.mesh.add(this.cameraTarget)
                // this.cameraTarget.translateX(20)

                this.scene.add(this.mesh)
                // this.model.me?
                // console.log(gltf.animations)
            },
            (progress) => {
                console.log('progress')
                // console.log(progress)
            },
            (error) => {
                // console.log('error')
                console.log(error)
            }
        )


        // new MD2Loader(this.manager).load(
        //     path,
        //     geometry => {

        //         this.geometry = geometry;

        //         this.mesh = new Mesh(geometry, new MeshPhongMaterial({
        //             color: 0xffffff,
        //             specular: 0xffffff,
        //             shininess: 0,
        //             map: new TextureLoader().load(marioTex),
        //             morphTargets: true // animowanie materiału modelu
        //         }))




        // this.mesh.translateY(0);
        //         this.mesh.translateX(this.x * 100);
        //         this.mesh.translateZ(this.z * 100);
        //         this.mesh.translateY(-25);
        //         // this.mesh.translateY(this.z);
        //         this.mesh.castShadow = true;
        //         // this.mesh.receiveShadow = true;
        //         console.log(this.geometry.animations) // tu powinny być widoczne animacje
        //         // this.light = new SpotLight("white", 1, 300, Math.PI / 8);
        //         // this.light.translateY(1);
        //         // this.light.castShadow = true;
        //         // this.mesh.add(this.light);
        //         // this.light.translateX(20);
        //         // this.lightDirection = new Object3D;
        //         // this.mesh.add(this.lightDirection);
        //         // this.lightDirection.translateX(200);
        //         // this.lightDirection.translateY(-20);
        //         // this.light.target = this.lightDirection;

        //         this.scene.add(this.mesh);
        //     },
        // );
    }
    unload() {
        this.scene.remove(this.mesh); // ew funkcja do usunięcia modelu ze sceny
    }
}