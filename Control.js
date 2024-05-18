import { Game } from "./Game.js";

export class Control {
    constructor (game = new Game()) {
        this.game = game
        this.controls = {}
    }
    init() {
        window.addEventListener("keydown", (e) => {
            e.preventDefault()
            this.controls[e.key] = true
            this.game.myPlayer().setState("keys", this.controls)
        })
        window.addEventListener("keyup", (e) => {
            e.preventDefault()
            delete this.controls[e.key]
            this.game.myPlayer().setState("keys", this.controls)
        })
        window.addEventListener("keypress", (e) => {
            e.preventDefault()
        })
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.controls = {}
                this.game.myPlayer().setState("keys", this.controls)
            }
        })
    }
}