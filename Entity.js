import { Game } from "./Game.js"
import { v4 } from 'https://jspm.dev/uuid';

export class Entity {
    constructor(game = new Game(), settings = {}) {
        this.uuid = v4()
        this.game = game
        this.gravitysubject = settings.gravitysubject || false
        this.angle = settings.angle || 0
        this.vx = 0
        this.vy = 0
        this.x = settings.x || 0
        this.y = settings.y || 0
        this.color = settings.color || "white"
        this.height = settings.height || 50
        this.width = settings.width || 50
    }
    get realY () {
        return this.game.y(this.y + this.height)
    }
    get realX() {
        return this.x + this.game.middle - this.game.player.x
    }
    draw() {
        if (this.vy < 0) {
            let collision = this.game.collision(this, true)
            if (collision.bottom) {
                this.vy = 0
                this.y = collision["bottom-object"].y + collision["bottom-object"].height
            }
        }
        if (this.vy > 0) {
            let collision = this.game.collision(this, true)
            if (collision.top) {
                this.vy = 0
                this.y = collision["bottom-object"].y
            }
        }
        this.x += this.vx
        this.y += this.vy
        let collision = this.game.collision(this, true)
        if (collision.right) {
            this.vx = 0
            this.x = collision["right-object"].x - this.width
        }
        if (collision.left) {
            this.vx = 0
            this.x = collision["left-object"].x + collision["left-object"].width
        }
        this.game.ctx.translate(this.realX, this.realY)
        this.game.ctx.rotate(this.angle * Math.PI / 180)
        this.game.ctx.translate(-(this.realX), -(this.realY))
        this.game.ctx.fillStyle = this.color
        this.game.ctx.fillRect(this.realX, this.realY, this.width, this.height)
        this.game.ctx.translate(this.realX, (this.realY))
        this.game.ctx.rotate(-this.angle * Math.PI / 180)
        this.game.ctx.translate(-(this.realX), -(this.realY))
    }
}