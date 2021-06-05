import PlayerAnimation from "./PlayerAnimation"
import Config from "./Config";

const KEYS = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
};

export default class Keyboard {
    constructor(domElement, animation, modelMesh) {

        this.domElement = domElement;
        this.animation = animation
        this.modelMesh = modelMesh

        // events
        this.domElement.addEventListener('keydown', event => this.onKeyDown(event), false);
        this.domElement.addEventListener('keyup', event => this.onKeyUp(event), false);
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = false;
                this.animation.playAnim("stand");
                break;
            case KEYS.left:
                Config.rotateLeft = false;
                break;
            case KEYS.right:
                Config.rotateRight = false;
                break;
            case KEYS.down:
                Config.moveBackward = false;
                this.animation.playAnim("stand");
                break;
        }
        console.log('onKeyChange', event.keyCode)
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = true;
                this.animation.playAnim("crwalk");
                break;
            case KEYS.left:
                Config.rotateLeft = true;
                break;
            case KEYS.right:
                Config.rotateRight = true;
                break;
            case KEYS.down:
                Config.moveBackward = true;
                this.animation.playAnim("crwalk");
                break;
        }
    }
}