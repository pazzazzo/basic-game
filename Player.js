import { Entity } from "./Entity.js";
import { Game } from "./Game.js";

export class Player extends Entity {
    constructor(config = { game: new Game() }) {
        super(config)
        this.speed = 10
        this.gravitysubject = true
        this.jump = false
        this.controls = {
            "ArrowLeft": false,
            "ArrowRight": false,
            " ": false,
        }
    }
    refresh() {
        if (this.controls['ArrowLeft']) {
            if (this.game.collision(this).left) return
            this.vx = -this.speed
            // this.x = 10
        } else if (this.vx < 0) {
            // this.vx = 0
            this.vx = Math.ceil((this.vx / 1.1) * 10) / 10
        }

        if (this.controls['ArrowRight']) {
            if (this.game.collision(this).right) return
            this.vx = this.speed
        } else if (this.vx > 0) {
            // this.vx = 0
            this.vx = Math.floor((this.vx / 1.1) * 10) / 10
        }
        if (this.controls[" "] && !this.jump) {
            // debugger
            this.jump = true
            this.vy = 20
        }
        // console.log(this.vy);

        if (this.game.collision(this).bottom) {
            this.jump = false
        }

        // console.log(this.game.collision(this).bottom);
    }
}