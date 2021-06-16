import Config from "./Config";

const KEYS = {
    "left": 37,
    "up": 38,
    "right": 39,
    "down": 40,
    "esc": 27,
    "delete": 8,
    "w": 87,
    "a": 65,
    "s": 83,
    "d": 68,
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
            case KEYS.w:
                Config.moveForward = false;
                // this.animation.playAnim("stand");
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
                // this.animation.playAnim("stand");
                break;
        }
        if(!Config.end){this.socket.send(JSON.stringify({ action: "del move", data: event.keyCode, playerId: this.playerId }));}
        console.log('onKeyChange', event.keyCode)
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case KEYS.up:
            case KEYS.w:
                if (!Config.moveForward) {
                    if(!Config.end){this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));}
                    Config.moveForward = true;
                    // this.animation.playAnim("crwalk");
                }
                break;
            case KEYS.left:
            case KEYS.a:
                if (!Config.rotateLeft) {
                    if(!Config.end){this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));}
                }
                Config.rotateLeft = true;
                break;
            case KEYS.right:
            case KEYS.d:
                if (!Config.rotateRight) {
                    if(!Config.end){this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));}
                }
                Config.rotateRight = true;
                break;
            case KEYS.down:
            case KEYS.s:
                if (!Config.moveBackward) {
                    if(!Config.end){this.socket.send(JSON.stringify({ action: "set move", data: event.keyCode, playerId: this.playerId }));}
                    Config.moveBackward = true;
                    // this.animation.playAnim("crwalk");
                }
                break;
            case KEYS.esc:
            case KEYS.delete:
                if (!Config.surrender) {
                    if(!Config.end){this.socket.send(JSON.stringify({ "action": "end", "playerId": this.playerId, "win":false }))}
                    Config.surrender = true;
                    // this.animation.playAnim("crwalk");
                }
                break;
        }
    }
}