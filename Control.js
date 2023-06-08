import { Game } from "./Game.js";

export class Control {
    constructor (game = new Game()) {
        this.game = game
    }
    init() {
        window.addEventListener("keydown", (e) => {
            this.game.player.controls[e.key] = true
        })
        window.addEventListener("keyup", (e) => {
            delete this.game.player.controls[e.key]
        })
    }
}