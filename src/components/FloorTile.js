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
import libraryTex from './assets/textures/block/stone_bricks.png';
import stoneTex from './assets/textures/block/stone.png';
import redstoneTex from './assets/textures/block/piston_top.png';
import aetherTex from './assets/textures/block/cyan_concrete_powder.png';
import netherTex from './assets/textures/block/netherrack.png';
import endTex from './assets/textures/block/end_stone.png';

export default class Floor {

    constructor(scene, size, x, y, z, theme) {
        console.log("floor")
        this.scene = scene;
        switch (theme) {
            case "library":
                this.floorTex = libraryTex;
                break;
            case "cave":
                this.floorTex = stoneTex;
                break;
            case "redstone":
                this.floorTex = redstoneTex;
                break;
            case "aether":
                this.floorTex = aetherTex;
                break;
            case "nether":
                this.floorTex = netherTex;
                break;
            case "end":
                this.floorTex = endTex;
                break;
            default:
                this.floorTex = libraryTex;
                break;
        }
        this.geometry = new PlaneGeometry(size, size, 1, 1);
        this.material = new MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0,
            // side: DoubleSide,
            map: new TextureLoader().load(this.floorTex),
        });
        this.material.map.wrapS = RepeatWrapping;
        this.material.map.wrapT = RepeatWrapping;
        this.material.map.repeat.set(1, 1);
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.rotation.x = - Math.PI / 2;
        this.mesh.position.x = x * size;
        this.mesh.position.y = y;
        this.mesh.position.z = z * size;
        // this.mesh.receiveShadow = true;
        this.scene.add(this.mesh)
    }
}