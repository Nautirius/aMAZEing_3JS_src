import {
    Box3,
    Vector3
} from "three";

export default class Collision {

    constructor(model, collidables) {
        this.model = model;
        this.collidables = collidables;

    }
    checkCollision(distance) {
        this.model.mesh.translateX(distance);
        let canMove = true;
        let modelBoundingBox = new Box3;
        modelBoundingBox.setFromCenterAndSize(this.model.mesh.position, new Vector3(20, 100, 20));
        this.collidables.forEach(collidable => {
            let objectBoundingBox = new Box3;
            objectBoundingBox.setFromObject(collidable.mesh)
            if (modelBoundingBox.intersectsBox(objectBoundingBox)) {
                canMove = false;
            }
        });
        if (!canMove) {
            this.model.mesh.translateX(distance * -1)
        }
    }
}