import {
    Mesh,
    DoubleSide,
    TextureLoader,
    BoxGeometry,
    MeshPhongMaterial,
    // MeshStandardMaterial,
    RepeatWrapping
} from "three";
import bookshelfTex from './assets/textures/block/bookshelf.png';
import stoneTex from './assets/textures/block/coal_ore.png';
import redstoneTex from './assets/textures/block/observer_front.png';
import aetherTex from './assets/textures/block/glowstone.png';
import netherTex from './assets/textures/block/nether_quartz_ore.png';
// import endTex from './assets/textures/block/purpur_block.png';
import endTex from './assets/textures/block/obsidian.png';

export default class Wall {

    constructor(scene, size, height, x, y, z, theme) {
        console.log("wall")
        this.scene = scene;
        switch (theme) {
            case "library":
                this.wallTex = bookshelfTex;
                break;
            case "cave":
                this.wallTex = stoneTex;
                break;
            case "redstone":
                this.wallTex = redstoneTex;
                break;
            case "aether":
                this.wallTex = aetherTex;
                break;
            case "nether":
                this.wallTex = netherTex;
                break;
            case "end":
                this.wallTex = endTex;
                break;
            default:
                this.wallTex = bookshelfTex;
                break;
        }
        this.geometry = new BoxGeometry(size, height, size);
        this.material = new MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0,
            // side: DoubleSide,
            map: new TextureLoader().load(this.wallTex),
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