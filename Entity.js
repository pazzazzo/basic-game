import { Game } from "./Game.js"
import { v4 } from 'https://jspm.dev/uuid';

export class Entity {
    constructor(config = { game: new Game() }) {
        this.uuid = config.uuid || v4()
        this.game = config.game
        this.gravitysubject = config.gravitysubject || false
        this.collidable = (config.collidable === undefined ? true : config.collidable)
        this.angle = config.angle || 0
        this.vx = 0
        this.vy = 0
        this.x = config.x || 0
        this.y = config.y || 0
        this.color = config.color || "white"
        if (config.image) {
            this.image_src = config.image
            this.image = new Image()
            this.image.src = this.image_src
        }
        this.height = config.height || 50
        this.width = config.width || 50
    }
    get realY() {
        if (this.game.player.y < this.game.middle.y) {
            return this.game.y(this.y + this.height) 
        } else {
            return this.game.y(this.y - this.game.player.y + this.height + this.game.middle.y)
        }
    }
    get realX() {
        return this.x + this.game.middle.x - this.game.player.x
    }
    draw() {
        if (this.game.isHost()) {
            let collision = this.game.collision(this, true)
            if (this.vy < 0 && this.collidable) {
                if (collision.bottom) {
                    this.vy = 0
                    this.y = collision["bottom-object"].y + collision["bottom-object"].height
                }
            }
            if (this.vy > 0 && this.collidable) {
                if (collision.top) {
                    this.vy = 0
                    this.y = collision["top-object"].y - this.height
                }
            }
            this.x += this.vx
            this.y += this.vy
            collision = this.game.collision(this, true)
            if (collision.right && this.collidable) {
                this.vx = 0
                this.x = collision["right-object"].x - this.width
            }
            if (collision.left && this.collidable) {
                this.vx = 0
                this.x = collision["left-object"].x + collision["left-object"].width
            }
        }
        this.game.ctx.translate(this.realX, this.realY)
        this.game.ctx.rotate(this.angle * Math.PI / 180)
        this.game.ctx.translate(-(this.realX), -(this.realY))
        if (this.image) {
            this.game.ctx.drawImage(this.image, this.realX, this.realY, this.width, this.height)
        } else {
            this.game.ctx.fillStyle = this.color
            this.game.ctx.fillRect(this.realX, this.realY, this.width, this.height)
        }
        this.game.ctx.translate(this.realX, (this.realY))
        this.game.ctx.rotate(-this.angle * Math.PI / 180)
        this.game.ctx.translate(-(this.realX), -(this.realY))
    }
}