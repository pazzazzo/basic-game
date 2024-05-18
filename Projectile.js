import { Entity } from "./Entity.js";
import { Game } from "./Game.js";

export class Projectile extends Entity {
    constructor(config = { game: new Game() }) {
        super(config)
        this.from = config.from
        this.collidable = false
        this.color = "red"
        this.height = 1
        this.width = 50
        this.speed = 10
        const cursx = this.game.cursor.x
        const cursy = this.game.cursor.y
        this.angle = (typeof config.angle !== "undefined") ? config.angle : (Math.atan((cursy - this.realY) / (cursx - this.realX)) * 180 / Math.PI)
        if (typeof config.angle === "undefined" && cursx < this.realX) {
            this.angle += 180
        }
        
        this.vx = this.speed * Math.cos(Math.PI * this.angle / 180);
        this.vy = -this.speed * Math.sin(Math.PI * this.angle / 180);
    }
    refresh() {
        if ((this.vy < 0 && this.y <= 1) || (this.vy > 0 && this.y >= this.game.canvas.height)) {
            this.deleted = true
            console.log("delete " + this.uuid);
        }
    }
}