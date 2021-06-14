import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import Renderer from './Renderer'
import Camera from './Camera'
import Light from "./Light"
import Map from "./Map"
import BackgroundCube from "./BackgroundCube"
import Keyboard from "./Keyboard"
import Config from './Config'
import Ducky from "./Ducky"
import Animation from "./Animation"
import Wall from "./Wall"
import Monke from "./Monke"
import Block from "./Block"
import winImg from "./textures/win.jpg"
import defImg from "./textures/defeat.jpg"
import loading from "./textures/loading.gif"
import tie from "./textures/tie.jpg"

const quiz = document.getElementById("game")
const pointsDiv = document.getElementById("points")
const questionDiv = document.getElementById("question")
const answersDiv = document.getElementById("answers-div")

let lvl = 0
let points = 0
let questionsArray = []
let monkeOneDown = false
let monkeTwoDown = false
let monkeThreeDown = false
let monkeFourDown = false
let monkeFiveDown = false
let monkeSixDown = false
let monkeSevenDown = false
let monkeEightDown = false
let monkeNineDown = false
let monkeTenDown = false
let level = 9
let margin = 0
let enemy = 0
let renderedOnce = true
let move = false

function decodeHtml(html) {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function levelFetch() {
    let res = await fetch('/sessions', { method: 'GET' })
    let data = await res.json()
    let idSesjiKlienta = getCookie("session")
    let i = 0
    let dataSession = 0
    data.forEach(element => {
        if (element._id == idSesjiKlienta) {
            dataSession = i
        }
        i++
    });
    level = data[dataSession].category
}
levelFetch()

async function getQuestions() {
    await fetch(`https://opentdb.com/api.php?amount=10&category=${level}`, {
        method: "GET"
    })
        .then(res => res.json())
        .then(data => {
            // read data and create Q&A
            questionsArray = data.results
            const question = prepareData(questionsArray, lvl)

            // display Q&A
            quiz.style.visibility = "visible"
            generateAnswers(question, answersDiv, questionDiv)
        })
}
async function scoreFetch() {
    let playerScore = {
        score: points,
        nick: getCookie("nick"),
        sid: getCookie("session")
    }
    fetch("/points", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(playerScore)
    }).catch(err => console.log(err))
}

async function zpos() {
    let playerPos = {
        pos: margin,
        nick: getCookie("nick"),
        sid: getCookie("session")
    }
    fetch("/zPosition", {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(playerPos)
    }).catch(err => console.log(err))
}
window.setInterval(zpos, 1000)

async function enemyProgress() {
    let res = await fetch('/sessions', { method: 'GET' })
    let data = await res.json()
    let idSesjiKlienta = getCookie("session")
    let pnick = getCookie("nick")
    let i = 0
    let dataSession = 0
    data.forEach(element => {
        if (element._id == idSesjiKlienta) {
            dataSession = i
        }
        i++
    });
    if (data[dataSession].player_one.nick == pnick) {
        enemy = data[dataSession].player_two.zValue
        document.getElementById("player-icon-two").style.marginLeft = `${enemy * 38}vw`
    }
    else if (data[dataSession].player_two.nick == pnick) {
        enemy = data[dataSession].player_one.zValue
        document.getElementById("player-icon-two").style.marginLeft = `${enemy * 38}vw`
    }
}
window.setInterval(enemyProgress, 1000)

function prepareData(array, lvl) {
    if (lvl != array.length) {
        const question = array[lvl].question
        const answers = []
        array[lvl].incorrect_answers.forEach(answer => {
            let answerString = decodeHtml(answer)
            answers.push(answerString)
        })
        const correct = decodeHtml(array[lvl].correct_answer)
        answers.push(correct)
        answers.sort()
        const fullQuestion = { question: question, answers: answers, correct: correct }
        return fullQuestion
    } else {
        return false
    }
}
function endQuestion(questionData) {
    if (lvl == 0) {
        monkeOneDown = true
    }
    else if (lvl == 1) {
        monkeTwoDown = true
    }
    else if (lvl == 2) {
        monkeThreeDown = true
    }
    else if (lvl == 3) {
        monkeFourDown = true
    }
    else if (lvl == 4) {
        monkeFiveDown = true
    }
    else if (lvl == 5) {
        monkeSixDown = true
    }
    else if (lvl == 6) {
        monkeSevenDown = true
    }
    else if (lvl == 7) {
        monkeEightDown = true
    }
    else if (lvl == 8) {
        monkeNineDown = true
    }
    else if (lvl == 9) {
        move = true
        monkeTenDown = true
    }
    lvl += 1
    document.querySelectorAll(".answer").forEach(answerDiv => {
        document.getElementById("loading-screen").style.visibility = "visible"
        if (answerDiv.innerText == questionData.correct) {
            answerDiv.style.color = "green"
        }
        else {
            answerDiv.style.color = "red"
        }
    })
    window.setTimeout(() => {
        document.querySelectorAll(".answer").forEach(answerDiv => {
            answerDiv.remove()
        })
        quiz.style.visibility = "hidden"
    }, 1000)
}
function generateAnswers(questionData, aDiv, qDiv) {
    qDiv.innerHTML = JSON.stringify(questionData.question)
    let answers = questionData.answers
    answers.forEach(answer => {
        let div = document.createElement("div")
        div.classList.add("answer")
        div.innerText = answer
        div.addEventListener("click", () => {
            if (div.innerText == questionData.correct) {
                // correct answer
                points += 1
                scoreFetch()
                endQuestion(questionData)
            } else {
                // wrong answer
                endQuestion(questionData)
            }
        })
        aDiv.append(div)
    })
}

export default class Main {
    constructor(container) {
        const gui = new dat.GUI({ width: 300 })
        gui.hide()
        this.container = container
        this.scene = new THREE.Scene()
        this.renderer = new Renderer(this.scene, container)
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.autoClear = false

        this.clock = new THREE.Clock()

        this.raycaster = new THREE.Raycaster()

        this.manager = new THREE.LoadingManager();

        this.wallRight = new Wall()
        this.wallRight.setWall(-1.8)
        this.scene.add(this.wallRight)

        this.wallLeft = new Wall()
        this.wallLeft.setWall(1.8)
        this.scene.add(this.wallLeft)

        this.wallBack = new Wall()
        this.wallBack.backWall(-1.5)
        this.scene.add(this.wallBack)

        this.walls = [this.wallLeft, this.wallRight, this.wallBack]

        this.map = new Map(this.scene, this.manager)
        this.map.load()

        this.bg = new BackgroundCube(this.scene, this.manager)
        this.scene.add(this.bg)

        this.ducky = new Ducky(this.scene, this.manager, 0, 0, 0)
        this.ducky.load()

        this.blocks = []
        this.monkes = []
        for (let i = 1; i < 11; i++) {
            this.block = new Block()
            this.block.setBlock(0, i * 15)
            this.scene.add(this.block)
            this.blocks.push(this.block)

            this.monkeOne = new Monke(this.scene, this.manager, 0, 0, i * 15)

            this.monkeOne.load()
            this.monkes.push(this.monkeOne)
        }

        this.heroAnimation = null
        this.mapAnimation = null
        this.heroModel = null
        this.monkeAnimations = []
        this.monkeModels = []

        this.manager.onLoad = () => {
            this.heroModel = this.ducky.animationData()
            this.heroAnimation = new Animation(this.heroModel)
            this.keyboard = new Keyboard(window, this.heroAnimation, this.heroModel)

            this.monkes.forEach(monke => {
                this.monkeModel = monke.animationData()
                this.monkeModels.push(this.monkeModel)
            })
            window.setTimeout(() => {
                document.getElementById("loading-screen").style.opacity = 0
            }, 2000)
        }

        this.light = new Light(this.scene)

        this.cameraParameters = {
            playerCam: true
        }

        this.vec = new THREE.Vector3(0, 0, 0)
        this.camera = new Camera(30, window.innerWidth / 2, window.innerHeight / 2)
        this.camera.position.set(10, 10, 10)
        this.camera.lookAt(this.vec)

        this.playerCamera = new Camera(30, window.innerWidth / 2, window.innerHeight / 2)

        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)

        const controls = new OrbitControls(this.camera, this.renderer.domElement)

        const cameraFolder = gui.addFolder('camera');
        cameraFolder.add(this.cameraParameters, "playerCam")
            .name('playerCam')

        this.canMove = true
        this.displayQuestion = true
        this.render();
    }

    render() {
        this.stats.begin()
        pointsDiv.innerText = points
        const camVect = new THREE.Vector3(0, 5, -25)
        this.renderer.setViewport(0, 0, innerWidth, innerHeight);
        if (!this.cameraParameters.playerCam) {
            this.renderer.render(this.scene, this.camera)
        } else {
            this.renderer.render(this.scene, this.playerCamera)
        }

        const elapsedTime = this.clock.getElapsedTime()

        if (this.heroModel) {
            const camPos = camVect.applyMatrix4(this.heroModel.scene.matrixWorld)
            this.playerCamera.position.x = camPos.x
            this.playerCamera.position.y = 1.5
            this.playerCamera.position.z = camPos.z
            this.camLook = this.heroModel.scene.position
            this.playerCamera.lookAt(this.camLook.x, 1, this.camLook.z)

            this.heroModel.scene.position.y = Math.sin(elapsedTime * 2) / 8 + 0.75

            let ray = new THREE.Ray(this.heroModel.scene.position, this.heroModel.scene.getWorldDirection(this.vec))
            this.raycaster.ray = ray

            this.monkeModels.forEach(model => {
                // Update objects
                model.scene.position.x = Math.sin(elapsedTime * 2) / 4
            })

            this.intersects = this.raycaster.intersectObjects(this.walls)
            if (this.intersects[0]) {
                let blocked = true
                this.intersects.forEach(intersect => {
                    if (intersect.distance < 0.5) {
                        blocked = false
                    }
                })
                if (blocked) {
                    this.canMove = true
                } else {
                    this.canMove = false
                }
            }

            this.monkeIntersects = this.raycaster.intersectObjects(this.blocks)
            if (this.monkeIntersects[0]) {
                let blocked = true
                this.monkeIntersects.forEach(intersect => {
                    if (intersect.distance < 1) {
                        if (this.displayQuestion) {
                            this.displayQuestion = false
                            quiz.style.visibility = "visible"
                            document.getElementById("loading-screen").style.visibility = "hidden"
                            getQuestions()
                        }
                        blocked = false
                    }
                    if (blocked) {
                        this.canMove = true
                    } else {
                        this.canMove = false
                    }
                })
            }
            function returnMonke(int, monkeDown, monkeModels, blocks) {
                if (monkeModels[int].scene.scale.y > 0 && monkeDown == true) {
                    monkeModels[int].scene.position.y += 0.005
                    monkeModels[int].scene.scale.x -= 0.001
                    monkeModels[int].scene.scale.y -= 0.001
                    monkeModels[int].scene.scale.z -= 0.001
                    monkeModels[int].scene.rotation.y += 0.07
                    blocks[int].position.x -= 0.5
                    if (monkeModels[int].scene.scale.y <= 0) {
                        return true
                    }
                }
            }
            if (lvl == 1) {
                if (returnMonke(0, monkeOneDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 2) {
                if (returnMonke(1, monkeTwoDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 3) {
                if (returnMonke(2, monkeThreeDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 4) {
                if (returnMonke(3, monkeFourDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 5) {
                if (returnMonke(4, monkeFiveDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 6) {
                if (returnMonke(5, monkeSixDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 7) {
                if (returnMonke(6, monkeSevenDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 8) {
                if (returnMonke(7, monkeEightDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 9) {
                if (returnMonke(8, monkeNineDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }
            else if (lvl == 10) {
                if (returnMonke(9, monkeTenDown, this.monkeModels, this.blocks)) {
                    this.displayQuestion = true
                }
            }

            if (move) this.canMove = true
            if (Config.rotateLeft) {
                this.heroModel.scene.rotation.y += 0.01
            }
            if (Config.rotateRight) {
                this.heroModel.scene.rotation.y -= 0.01
            }
            if (Config.moveForward && this.canMove == true) {
                this.heroModel.scene.translateZ(0.075)
            }
            if (Config.moveBackward) {
                this.heroModel.scene.translateZ(-0.05)

            }

            margin = this.heroModel.scene.position.z / 160
            document.getElementById("player-icon").style.marginLeft = `${margin * 38}vw`

            if (this.heroModel.scene.position.z < -1.5) {
                this.heroModel.scene.position.z = 0
            }
            else if (this.heroModel.scene.position.x < -1.5 || this.heroModel.scene.position.x > 1.5) {
                this.heroModel.scene.position.x = 0
            }
            else if (this.heroModel.scene.position.z > 165 && renderedOnce == true) {
                move = false
                this.canMove = false
                fetch("/finished", {
                    method: "POST",
                    headers: { "Content-type": "application/json; charset=UTF-8" }
                }).catch(err => console.log(err));
                async function enemyScore() {
                    let res = await fetch('/sessions', { method: 'GET' })
                    let data = await res.json()
                    let idSesjiKlienta = getCookie("session")
                    let pnick = getCookie("nick")
                    let i = 0
                    let dataSession = 0
                    data.forEach(element => {
                        if (element._id == idSesjiKlienta) {
                            dataSession = i
                        }
                        i++
                    });
                    if (data[dataSession].player_one.nick == pnick) {
                        document.getElementById("loading-text").innerText = "Waiting for Enemy..."
                        if (data[dataSession].player_two.status == 4) {
                            document.getElementById("loading-screen").style.opacity = 0
                            document.getElementById("end-first").style.visibility = "visible"
                            document.getElementById("player-score").style.visibility = "visible"
                            document.getElementById("enemy-score").style.visibility = "visible"
                            document.getElementById("backLobby").style.visibility = "visible"
                            document.getElementById("backLobby").addEventListener("click", function () {
                                location.href = '/'
                            })
                            document.getElementById("player-score").innerHTML = `Your Score: ${points}`
                            let enemyPoints = data[dataSession].player_two.points
                            document.getElementById("enemy-score").innerHTML = `Enemy Score: ${enemyPoints}`
                            if (points > enemyPoints) {
                                document.getElementById("end-first").style.backgroundImage = `url(${winImg})`
                                clearInterval(fin)
                            }
                            else if (points < enemyPoints) {
                                document.getElementById("end-first").style.backgroundImage = `url(${defImg})`
                                clearInterval(fin)
                            }
                            else if (points == enemyPoints) {
                                document.getElementById("end-first").style.backgroundImage = `url(${tie})`
                                clearInterval(fin)
                            }
                            document.getElementById("loading-screen").style.visibility = "hidden"
                        }
                        else {
                            document.getElementById("loading-screen").style.visibility = "visible"
                            document.getElementById("loading-screen").style.opacity = 1
                        }
                    }
                    else if (data[dataSession].player_two.nick == pnick) {
                        document.getElementById("loading-text").innerText = "Waiting for Enemy..."
                        if (data[dataSession].player_one.status == 4) {
                            document.getElementById("loading-screen").style.opacity = 0
                            document.getElementById("end-first").style.visibility = "visible"
                            document.getElementById("player-score").style.visibility = "visible"
                            document.getElementById("enemy-score").style.visibility = "visible"
                            document.getElementById("backLobby").style.visibility = "visible"
                            document.getElementById("backLobby").addEventListener("click", function () {
                                location.href = '/'
                            })
                            document.getElementById("player-score").innerHTML = `Your Score: ${points}`
                            let enemyPoints = data[dataSession].player_one.points
                            document.getElementById("enemy-score").innerHTML = `Enemy Score: ${enemyPoints}`
                            if (points > enemyPoints) {
                                document.getElementById("end-first").style.backgroundImage = `url(${winImg})`
                                clearInterval(fin)
                            }
                            else if (points < enemyPoints) {
                                document.getElementById("end-first").style.backgroundImage = `url(${defImg})`
                                clearInterval(fin)
                            }
                            else if (points == enemyPoints) {
                                document.getElementById("end-first").style.backgroundImage = `url(${tie})`
                                clearInterval(fin)
                            }
                            document.getElementById("loading-screen").style.visibility = "hidden"
                        }
                        else {
                            document.getElementById("loading-screen").style.visibility = "visible"
                            document.getElementById("loading-screen").style.opacity = 1
                        }
                    }
                }
                const fin = setInterval(enemyScore, 1000)
                renderedOnce = false
            }
        }
        this.stats.end()
        requestAnimationFrame(this.render.bind(this));
    }
}