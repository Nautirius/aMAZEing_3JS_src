import { PerspectiveCamera, Vector3 } from 'three';

export default class Camera {
    constructor(renderer) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        // this.threeCamera = new PerspectiveCamera(20, width / height, 0.1, 100000);
        this.threeCamera = new PerspectiveCamera(75, 2, 0.1, 100000);
        // const fov = 75;
        // const aspect = 2;
        // const near = 0.1;
        // const far = 100;
        // this.threeCamera = new PerspectiveCamera(fov, aspect, near, far);
        this.threeCamera.position.set(2, 2, 2);

        this.threeCamera.lookAt(new Vector3(-200, 50, 0))
        this.updateSize(renderer);

        window.addEventListener('resize', () => this.updateSize(renderer), false);
    }

    updateSize(renderer) {

        this.threeCamera.aspect = renderer.domElement.width / renderer.domElement.height;
        this.threeCamera.updateProjectionMatrix();
    }
}