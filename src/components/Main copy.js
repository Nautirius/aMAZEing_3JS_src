import { PerspectiveCamera, Vector3, Scene, AxesHelper, GridHelper, HemisphereLight, LoadingManager, Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import Renderer from './Renderer';
import Camera from './Camera';
import Ico from './Ico';
import Wall from './Wall';
import Floor from './Floor';
import Player from "./Player";
import Keyboard from "./KeyboardPlayer";
import PlayerAnimation from "./PlayerAnimation";
import Config from './Config';


export default class Main {
    constructor(container) {

        this.scene = new Scene();

        this.camera = new Camera(3, window.innerWidth / 2, window.innerHeight / 2);
        this.camera.position.set(1000, 1000, 1000);
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.renderer = new Renderer(container);

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        document.body.appendChild(this.stats.dom);

        this.clock = new Clock()

        this.manager = new LoadingManager();

        // const controls = new OrbitControls(this.camera, this.renderer.domElement);
        var axes = new AxesHelper(1000);
        this.scene.add(axes);
        const gridHelper = new GridHelper(100, 10);
        this.scene.add(gridHelper);

        // światło ogólne
        let light = new HemisphereLight(0xffffff, 0x444444, 1);
        light.position.set(0, 0, 0);
        this.scene.add(light);

        // this.ico = new Ico();
        // this.scene.add(this.ico);
        new Floor(this.scene, 1000, -50)

        this.player = null

        this.gameData = fetch('http://localhost:3000/loadLevel', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ levelId: "xYrAb2WZfCLPD9Wc" })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)
                result.levelData.walls.forEach(wall => {
                    new Wall(this.scene, 100, 100, wall.x, 0, wall.z);
                });

                if (result.playerRole === "spectator") {
                    const controls = new OrbitControls(this.camera, this.renderer.domElement);
                }

                this.player = new Player(this.scene, this.manager, result.levelData.start.x, result.levelData.start.z);
                this.player.load('./assets/models/mario/mario.md2');
                return result;
            })
            .catch(error => { console.log(error); })



        this.manager.onProgress = (item, loaded, total) => {
            console.log(`progress ${item}: ${loaded} ${total}`);
        };

        this.manager.onLoad = () => {

            // let loadingScreen = document.getElementById("loading-screen");
            // setTimeout(function () { loadingScreen.style.opacity = 0; loadingScreen.style.zIndex = 0; }, 500);

            this.isLoaded = true;
            console.log("MODELS LOADED!!!")

            this.playerAnimation = new PlayerAnimation(this.player.mesh)

            this.playerAnimation.playAnim("stand")

            this.keyboard = new Keyboard(window, this.playerAnimation, this.player.mesh);

            // this.helper = new BoxHelper(this.model.mesh);
            // this.scene.add(this.helper)
        };




        this.render();
    }

    render() {
        this.stats.begin()
        // this.ico.update()

        var delta = this.clock.getDelta();
        if (this.playerAnimation) this.playerAnimation.update(delta)

        this.renderer.render(this.scene, this.camera);

        if (this.player != null) {

            if (Config.rotateLeft) {
                this.player.mesh.rotation.y += 0.05
            }
            if (Config.rotateRight) {
                this.player.mesh.rotation.y -= 0.05
            }
            if (Config.moveForward) {
                this.player.mesh.translateX(3);

                // let modelBoundingBox = new Box3;
                // modelBoundingBox.setFromCenterAndSize(this.model.mesh.position, new Vector3(20, 100, 20))
                // let canMove = true;
                // this.walls.forEach(wall => {
                //     let wallBoundingBox = new Box3;
                //     wallBoundingBox.setFromObject(wall.mesh)
                //     if (modelBoundingBox.intersectsBox(wallBoundingBox)) {
                //         canMove = false;
                //     }
                // })

                // if (!canMove) {
                //     this.model.mesh.translateX(-3)
                // } else {
                //     this.checkForEnemies();
                // }
            }
            if (Config.moveBackward) {
                this.player.mesh.translateX(-3);
                // let modelBoundingBox = new Box3;
                // modelBoundingBox.setFromCenterAndSize(this.model.mesh.position, new Vector3(20, 100, 20));
                // let canMove = true;
                // this.walls.forEach(wall => {
                //     let wallBoundingBox = new Box3;
                //     wallBoundingBox.setFromObject(wall.mesh);
                //     if (modelBoundingBox.intersectsBox(wallBoundingBox)) {
                //         canMove = false;
                //     }
                // })

                // if (!canMove) {
                //     this.model.mesh.translateX(3);
                // } else {
                //     this.checkForEnemies();
                // }
            }


            // this.lightTarget.position.set(this.model.mesh.position)
            // // this.lightTarget.translateZ(100);

            // this.light.target = this.lightTarget



            // const camVect = new Vector3(-200, 50, 0)
            // const camPos = camVect.applyMatrix4(this.player.mesh.matrixWorld);

            // this.camera.position.x = camPos.x
            // this.camera.position.y = camPos.y
            // this.camera.position.z = camPos.z
            // this.camera.lookAt(this.player.mesh.position)


            // this.lightTarget.position.set(this.model.mesh.getWorldDirection)
        }


        this.stats.end()
        requestAnimationFrame(this.render.bind(this));
    }
}