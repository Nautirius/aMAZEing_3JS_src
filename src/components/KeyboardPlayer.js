// import PlayerAnimation from "./PlayerAnimation"
import Config from "./Config";

const KEYS = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
};

export default class KeyboardPlayer {
    constructor(domElement, animation, modelMesh, socket, playerId) {

        this.domElement = domElement;
        this.animation = animation
        this.modelMesh = modelMesh
        this.socket = socket;
        this.playerId = playerId;

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
        this.socket.send(JSON.stringify({ action: "del move", data: event.keyCode, playerId: this.playerId }));
        console.log('onKeyChange', event.keyCode)
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case KEYS.up:
                if (!Config.moveForward) {
                    this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));
                    Config.moveForward = true;
                    this.animation.playAnim("crwalk");
                }
                break;
            case KEYS.left:
                if (!Config.rotateLeft) {
                    this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));
                }
                Config.rotateLeft = true;
                break;
            case KEYS.right:
                if (!Config.rotateRight) {
                    this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));
                }
                Config.rotateRight = true;
                break;
            case KEYS.down:
                if (!Config.moveBackward) {
                    this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));
                    Config.moveBackward = true;
                    this.animation.playAnim("crwalk");
                }
                break;
        }
    }
}