// import PlayerAnimation from "./PlayerAnimation"
import Config from "./Config";

const KEYS = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
};

export default class KeyboardSpectator {
    constructor(domElement, animation, modelMesh, socket) {

        this.domElement = domElement;
        this.animation = animation
        this.modelMesh = modelMesh
        this.socket = socket;

        // events
        this.socket.addEventListener('message', event => {
            console.log('Message from server ', event.data);
            let data = JSON.parse(event.data);
            if (data.action === "del move") {
                this.onKeyUp(data)
            } else if (data.action === "set move") {
                this.onKeyDown(data)
            }
        }, false);
        // this.domElement.addEventListener('keydown', event => this.onKeyDown(event), false);
        // this.domElement.addEventListener('keyup', event => this.onKeyUp(event), false);

        this.socket.addEventListener('message', (event) => {
            let dataJson = JSON.parse(event.data);
            if (dataJson.action === "update position") {
                let newPos = dataJson.data.pos;
                let newRot = dataJson.data.rot;
                this.modelMesh.position.set(newPos.x, 45, newPos.z);
                this.modelMesh.rotation.set(newRot._x, newRot._y, newRot._z);
                // this.modelMesh.rotateX(newRot.x)
                // this.modelMesh.rotateZ(newRot.z)
            }
        })
    }


    onKeyUp(event) {
        switch (event.data) {
            case KEYS.up:
                Config.moveForward = false;
                // this.animation.playAnim("stand");
                break;
            case KEYS.left:
                Config.rotateLeft = false;
                break;
            case KEYS.right:
                Config.rotateRight = false;
                break;
            case KEYS.down:
                Config.moveBackward = false;
                // this.animation.playAnim("stand");
                break;
        }
        console.log('onKeyUp', event.data)
    }

    onKeyDown(event) {
        switch (event.data) {
            case KEYS.up:
                Config.moveForward = true;
                // this.animation.playAnim("crwalk");
                break;
            case KEYS.left:
                Config.rotateLeft = true;
                break;
            case KEYS.right:
                Config.rotateRight = true;
                break;
            case KEYS.down:
                Config.moveBackward = true;
                // this.animation.playAnim("crwalk");
                break;
        }
        console.log('onKeyDown', event.data)
    }
}