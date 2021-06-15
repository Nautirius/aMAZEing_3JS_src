import {
    IcosahedronGeometry,
    MeshNormalMaterial,
    Mesh,
    DoubleSide,
} from "three";

export default class Ico extends Mesh {

    constructor() {
        super(new IcosahedronGeometry(20), new MeshNormalMaterial({ side: DoubleSide }))
    }
    // obrót
    update() {
        this.rotation.y += 0.1
    }
}