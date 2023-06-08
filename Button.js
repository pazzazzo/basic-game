import { Game } from "./Game.js";

export class Button extends EventTarget {
    constructor(config = { game: new Game() }) {
        super()
        this.game = config.game
        this.name = config.name || "none"
        this.x = config.x || 0
        this.y = config.y || 0
        this.height = config.height || 50
        this.width = config.width || 50
        this.color = config.color || "#ffffffb0"
        this.pressedColor = config.pressedColor || "#ffffff"
        this.show = config.show === undefined ? true : config.show
        this.game.buttons.add(this)
        this.pressed = false
    }
    init() {
        this.game.canvas.addEventListener(this.game.isMobileUser ? "touchstart" : "mousedown", (ME) => {
            this.down(ME)
        })
        this.game.canvas.addEventListener(this.game.isMobileUser ? "touchend" : "mouseup", (ME) => {
            this.up(ME)
        })
    }
    down(ME) {
        if (ME instanceof TouchEvent) {
            for (let i = 0; i < ME.changedTouches.length; i++) {
                let x = Math.ceil((ME.changedTouches[i].clientX - this.game.canvas.getBoundingClientRect().left) / this.game.canvas.getBoundingClientRect().width * this.game.canvas.width)
                let y = Math.ceil((ME.changedTouches[i].clientY - this.game.canvas.getBoundingClientRect().top) / this.game.canvas.getBoundingClientRect().height * this.game.canvas.height)
                if (x > this.x && x < this.x + this.width && this.game.y(y) > this.y - this.height && this.game.y(y) < this.y && this.show) {
                    this.pressed = true
                    this.dispatchEvent(new Event("down"))
                }
            }
        } else {
            if (this.game.cursor.x > this.x && this.game.cursor.x < this.x + this.width && this.game.y(this.game.cursor.y) > this.y - this.height && this.game.y(this.game.cursor.y) < this.y && this.show) {
                this.pressed = true
                this.dispatchEvent(new Event("down"))
            }
        }
    }
    up(ME) {
        if (ME instanceof TouchEvent) {
            for (let i = 0; i < ME.changedTouches.length; i++) {
                let x = Math.ceil((ME.changedTouches[i].clientX - this.game.canvas.getBoundingClientRect().left) / this.game.canvas.getBoundingClientRect().width * this.game.canvas.width)
                let y = Math.ceil((ME.changedTouches[i].clientY - this.game.canvas.getBoundingClientRect().top) / this.game.canvas.getBoundingClientRect().height * this.game.canvas.height)
                if (x > this.x && x < this.x + this.width && this.game.y(y) > this.y - this.height && this.game.y(y) < this.y && this.show) {
                    this.pressed = false
                    this.dispatchEvent(new Event("up"))
                }
            }
        } else {
            if (this.game.cursor.x > this.x && this.game.cursor.x < this.x + this.width && this.game.y(this.game.cursor.y) > this.y - this.height && this.game.y(this.game.cursor.y) < this.y && this.show) {
                this.pressed = false
                this.dispatchEvent(new Event("up"))
            }
        }
    }
    draw() {
        if (!this.show) return
        this.game.ctx.fillStyle = this.pressed ? this.pressedColor : this.color
        this.game.ctx.fillRect(this.x, this.game.y(this.y), this.width, this.height)
    }
}