import { Entity } from "./Entity.js";
import { Game } from "./Game.js";

export class Projectile extends Entity {
    constructor(config = { game: new Game() }) {
        super(config)
        this.collidable = false
        this.color = "red"
        this.height = 1
        this.width = 50
        this.speed = 10

        this.angle = (Math.atan((this.game.cursor.y - this.realY) / (this.game.cursor.x - this.realX)) * 180 / Math.PI)
        if (this.game.cursor.x < this.realX) {
            this.angle += 180
        }
        
        this.vx = this.speed * Math.cos(Math.PI * this.angle / 180);
        this.vy = -this.speed * Math.sin(Math.PI * this.angle / 180);
    }
    refresh() {
        if ((this.vy < 0 && this.y <= 1) || (this.vy > 0 && this.y >= this.game.canvas.height)) {
            this.game.objects.delete(this)
            console.log("delete " + this.uuid);
        }
    }
}