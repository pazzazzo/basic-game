import { Entity } from "./Entity.js"
import { Player } from "./Player.js"
import { Projectile } from "./Projectile.js"

export class Game {
    constructor() {
        this.canvas = document.querySelector("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.middle = Math.round(this.canvas.width / 2)
        this.objects = new Set()
        this.player = new Player({game: this, y:0})
        this.gravity = 1

        this.cursor = {
            x: 0,
            y: 0
        }
    }
    y(y) {
        return this.canvas.height - y
    }
    collision(obj = new Entity(), vector) {
        let res = {
            "left": false,
            "right": false,
            "bottom": false,
            "top": false,
            "not": true
        }
        if (obj.y <= 0) {
            res["bottom"] = true
            res["bottom-object"] = {"y": 0, "x": -Infinity, "width": Infinity, height: 0}
            res["not"] = false
        }
        this.objects.forEach(o => {
            if (o.uuid === this.uuid || !o.collidable) return
            if (obj.x + obj.width > o.x && obj.x < o.x + o.width && obj.y <= o.y + o.height && obj.y > o.y + (o.height / 2)) {
                res["bottom"] = true
                res["bottom-object"] = o
                res.not = false
            }
            if (obj.x + obj.width > o.x && obj.x < o.x + o.width && obj.y + obj.height >= o.y && obj.y + obj.height <= o.y + (o.height / 2)) {
                res["top"] = true
                res["top-object"] = o
                res.not = false
            }
            if (obj.x + obj.width > o.x && obj.x + (obj.width / 2) <= o.x && (vector ? obj.vx > 0 : true) && obj.y < o.y + o.height && obj.y + obj.height > o.y) {
                res.right = true
                res["right-object"] = o
                res.not = false
            }
            if (obj.x < o.x + o.width && obj.x >= o.x + (o.width / 2) && (vector ? obj.vx < 0 : true) && obj.y < o.y + o.height && obj.y + obj.height > o.y) {
                res.left = true
                res["left-object"] = o
                res.not = false
            }
        })
        return res
    }
    resize() {
        this.canvas.width = innerWidth
        this.middle = Math.round(this.canvas.width / 2)
    }
    init() {
        this.resize()
        window.addEventListener("resize", () => {
            this.resize()
        })
        this.canvas.addEventListener("mousemove", ME => {
            let x = Math.ceil((ME.clientX - this.canvas.getBoundingClientRect().left) / this.canvas.getBoundingClientRect().width * this.canvas.width)
            let y = Math.ceil((ME.clientY - this.canvas.getBoundingClientRect().top) / this.canvas.getBoundingClientRect().height * this.canvas.height)
            this.cursor.x = x
            this.cursor.y = y
        })
        this.canvas.addEventListener("mousedown", (ME) => {
            this.objects.add(new Projectile({game: this, x: this.player.x + this.player.width/2, y: this.player.height/2}))
        })

        this.objects.add(this.player)

        this.draw()
    }
    draw() {
        requestAnimationFrame(() => {
            this.draw()
        })
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.objects.forEach(o => {
            if (o.refresh) {
                o.refresh()
            }
            if (o.gravitysubject && !this.collision(o).bottom) {
                o.vy -= Math.min(this.gravity + this.gravity*.1, this.gravity)
            }
            o.draw()
        })
        this.ctx.fillStyle = "#ffffff"
        this.ctx.beginPath();
        this.ctx.arc(this.cursor.x, this.cursor.y, 6, 0, 2 * Math.PI)
        this.ctx.fill();
        this.ctx.fillStyle = "#ff0000"
        this.ctx.beginPath();
        this.ctx.arc(this.cursor.x, this.cursor.y, 5, 0, 2 * Math.PI)
        this.ctx.fill();
    }
}