import {
    PerspectiveCamera,
    Vector3,
    Scene,
    AxesHelper,
    GridHelper,
    HemisphereLight,
    PointLight,
    LoadingManager,
    TextureLoader,
    WebGLCubeRenderTarget,
    Clock
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import Renderer from './Renderer';
import Camera from './Camera';
import Ico from './Ico';
import Wall from './Wall';
import Floor from './Floor';
import Player from "./Player";
import Keyboard from "./Keyboard";
import PlayerAnimation from "./PlayerAnimation";
import Config from './Config';
import Collision from './Collision';
import skyboxTex from './assets/textures/warszawa.jpg';


export default class Main {
    constructor(container) {

        this.scene = new Scene();

        this.renderer = new Renderer(this.scene, container);

        this.camera = new Camera(this.renderer.threeRenderer);
        this.camera.threeCamera.position.set(1000, 1000, 1000);
        this.camera.threeCamera.lookAt(new Vector3(0, 0, 0));

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        document.body.appendChild(this.stats.dom);

        this.clock = new Clock();

        this.manager = new LoadingManager();

        // const controls = new OrbitControls(this.camera, this.renderer.domElement);
        var axes = new AxesHelper(1000);
        this.scene.add(axes);
        const gridHelper = new GridHelper(100, 10);
        this.scene.add(gridHelper);

        const loader = new TextureLoader();
        const texture = loader.load(
            // 'https://threejsfundamentals.org/threejs/resources/images/equirectangularmaps/tears_of_steel_bridge_2k.jpg',
            skyboxTex,
            () => {
                const rt = new WebGLCubeRenderTarget(texture.image.height);
                rt.fromEquirectangularTexture(this.renderer.threeRenderer, texture);
                this.scene.background = rt.texture;
            });

        // światło ogólne
        // let light = new PointLight(0xffffff, 0.2, 10000, 1000);
        // light.castShadow = true;
        // light.position.set(0, 1000, 0);
        // this.scene.add(light);
        let mainLight = new HemisphereLight(0xffffff, 0x444444, 1);
        mainLight.position.set(0, 0, 0);
        this.scene.add(mainLight);

        // this.ico = new Ico();
        // this.scene.add(this.ico);
        new Floor(this.scene, 1000, -50)

        this.player = null

        const socket = new WebSocket('ws://localhost:3000');
        socket.addEventListener('open', function (event) {
            console.log('Connected to WS Server');
        });
        let playerId;

        this.walls = [];

        this.gameData = fetch('http://localhost:3000/loadLevel', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ levelId: "Np0iZPe06SpzO7m5" })
        })
            .then(res => res.json())
            .then(result => {
                console.log(result)

                playerId = result.playerId;
                socket.send(JSON.stringify({ action: "set id", playerId: playerId }))

                result.levelData.walls.forEach(wall => {
                    let newWall = new Wall(this.scene, 100, 100, wall.x, 0, wall.z);
                    this.walls.push(newWall);
                });

                if (result.playerRole === "spectator") {
                    const controls = new OrbitControls(this.camera.threeCamera, this.renderer.threeRenderer.domElement);
                    this.role = "spectator";
                } else {
                    this.role = "player";
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

            this.playerCollision = new Collision(this.player, this.walls)

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

        this.renderer.render(this.scene, this.camera.threeCamera);

        if (this.isLoaded) {

            if (Config.rotateLeft) {
                this.player.mesh.rotation.y += 0.05
            }
            if (Config.rotateRight) {
                this.player.mesh.rotation.y -= 0.05
            }
            if (Config.moveForward) {
                // this.player.mesh.translateX(3);
                this.playerCollision.checkCollision(3);
            }
            if (Config.moveBackward) {
                // this.player.mesh.translateX(-3);
                this.playerCollision.checkCollision(-3);
            }


            // this.lightTarget.position.set(this.model.mesh.position)
            // // this.lightTarget.translateZ(100);

            // this.light.target = this.lightTarget


            if (this.role === "player") {

                const camVect = new Vector3(-200, 50, 0)
                const camPos = camVect.applyMatrix4(this.player.mesh.matrixWorld);

                this.camera.threeCamera.position.x = camPos.x
                this.camera.threeCamera.position.y = camPos.y
                this.camera.threeCamera.position.z = camPos.z
                this.camera.threeCamera.lookAt(this.player.mesh.position)
            }


            // this.lightTarget.position.set(this.model.mesh.getWorldDirection)
        }


        this.stats.end()
        requestAnimationFrame(this.render.bind(this));
    }
}