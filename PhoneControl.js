import { Button } from "./Button.js";
import { Game } from "./Game.js";

export class PhoneControl {
    constructor (game = new Game()) {
        this.game = game
        this.left = new Button({game, x: 25, y: 75, show: game.isMobileUser, name: "left"})
        this.jump = new Button({game, x: 85, y: 75, show: game.isMobileUser, name: "jump"})
        this.right = new Button({game, x: 145, y: 75, show: game.isMobileUser, name: "right"})
    }
    init() {
        this.left.init()
        this.right.init()
        this.jump.init()

        this.left.addEventListener("down", () => {
            this.game.player.controls.ArrowLeft = true
        })
        this.left.addEventListener("up", () => {
            this.game.player.controls.ArrowLeft = false
        })
        this.right.addEventListener("down", () => {
            this.game.player.controls.ArrowRight = true
        })
        this.right.addEventListener("up", () => {
            this.game.player.controls.ArrowRight = false
        })

        this.jump.addEventListener("down", () => {
            this.game.player.controls[" "] = true
        })
        this.jump.addEventListener("up", () => {
            this.game.player.controls[" "] = false
        })
    }
}