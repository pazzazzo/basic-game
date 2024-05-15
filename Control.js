import { Game } from "./Game.js";

export class Control {
    constructor (game = new Game()) {
        this.game = game
        this.controls = {}
    }
    init() {
        window.addEventListener("keydown", (e) => {
            this.controls[e.key] = true
            this.game.myPlayer().setState("keys", this.controls)
        })
        window.addEventListener("keyup", (e) => {
            delete this.controls[e.key]
            this.game.myPlayer().setState("keys", this.controls)
        })
    }
}