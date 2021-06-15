import {
    Mesh,
    DoubleSide,
    TextureLoader,
    BoxHelper,
    MeshPhongMaterial,
    // MeshStandardMaterial,
    RepeatWrapping,
    Object3D,
    Box3,
    Vector3,
    BoxGeometry
} from "three";
import endTex from './assets/textures/block/diamond_ore.png';

export default class SE {

    constructor(scene, size, height, x, y, z) {
        this.scene = scene;

        this.geometry = new BoxGeometry(size, height, size);
        this.material = new MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 0,
            // side: DoubleSide,
            map: new TextureLoader().load(endTex),
        });
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.translateX(x * size)
        this.mesh.translateY(y)
        this.mesh.translateZ(z * size)
        this.mesh.castShadow = true;
        this.material.map.wrapS = RepeatWrapping;
        this.material.map.wrapT = RepeatWrapping;
        this.material.map.repeat.set(1, 1);
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
        this.sent = false
    }

    meta(player, websocket, id) {
        let modelBoundingBox = new Box3();
        modelBoundingBox.setFromCenterAndSize(player.mesh.position, new Vector3(20, 100, 20));

        let objectBoundingBox = new Box3();
        objectBoundingBox.setFromObject(this.mesh)

        if (modelBoundingBox.intersectsBox(objectBoundingBox) && !this.sent) {
            this.sent = true
            websocket.send(JSON.stringify({ "action": "end", "playerId": id }))
        }
    }
}