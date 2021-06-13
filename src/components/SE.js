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

export default class SE{

    constructor(scene, size, height, x, y, z) {
        this.scene = scene;
        
        this.geometry = new BoxGeometry(size, height, size);
        this.material = new MeshPhongMaterial({
            color: 0xff0000,
            specular: 0xff0000,
            shininess: 0,
            // side: DoubleSide,
        });
        this.mesh = new Mesh(this.geometry, this.material)
        // this.mesh.scale.set(size, height, size)
        this.mesh.translateX(x * size)
        this.mesh.translateY(y)
        this.mesh.translateZ(z * size)
        this.scene.add(this.mesh);
        this.sent = false
    }

    meta(player, websocket, id){
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