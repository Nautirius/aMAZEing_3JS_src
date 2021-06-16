import Config from "./Config";

const KEYS = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "w": 87,
    "a": 65,
    "s": 83,
    "d": 68,
};

export default class KeyboardSpectator {
    constructor(domElement, animation, modelMesh, socket) {

        this.domElement = domElement;
        this.animation = animation
        this.modelMesh = modelMesh
        this.socket = socket;

        // events
        this.socket.addEventListener('message', event => {
            let data = JSON.parse(event.data);
            if (data.action === "del move") {
                this.onKeyUp(data)
            } else if (data.action === "set move") {
                this.onKeyDown(data)
            }
        }, false);

        this.socket.addEventListener('message', (event) => {
            let dataJson = JSON.parse(event.data);
            if (dataJson.action === "update position") {
                let newPos = dataJson.data.pos;
                let newRot = dataJson.data.rot;
                this.modelMesh.position.set(newPos.x, 45, newPos.z);
                this.modelMesh.rotation.set(newRot._x, newRot._y, newRot._z);
            }
        })
    }


    onKeyUp(event) {
        switch (event.data) {
            case KEYS.up:
            case KEYS.w:
                Config.moveForward = false;
                break;
            case KEYS.left:
            case KEYS.a:
                Config.rotateLeft = false;
                break;
            case KEYS.right:
            case KEYS.d:
                Config.rotateRight = false;
                break;
            case KEYS.down:
            case KEYS.s:
                Config.moveBackward = false;
                break;
        }
    }

    onKeyDown(event) {
        switch (event.data) {
            case KEYS.up:
            case KEYS.w:
                Config.moveForward = true;
                break;
            case KEYS.left:
            case KEYS.a:
                Config.rotateLeft = true;
                break;
            case KEYS.right:
            case KEYS.d:
                Config.rotateRight = true;
                break;
            case KEYS.down:
            case KEYS.s:
                Config.moveBackward = true;
                break;
        }
    }
}