import { Entity } from "./Entity.js"
import { Player } from "./Player.js"

export class Game {
    constructor() {
        this.canvas = document.querySelector("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.middle = Math.round(this.canvas.width / 2)
        this.objects = new Set()
        this.player = new Player(this, {y:0})
        this.gravity = 1

        this.cursor = {
            x: 0,
            y: 0
        }
        this.anglefollower = new Entity(this, { x: 25, y: 250, color: "red", width: 100, height: 1, angle: 0 })
        this.objects.add(this.anglefollower)
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
            if (o.uuid === this.uuid) return
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
            
            let angle = (Math.atan((this.cursor.y - this.anglefollower.realY) / (this.cursor.x - this.anglefollower.realX)) * 180 / Math.PI)
            if (this.cursor.x < this.anglefollower.realX) {
                angle -= 180
            }
            this.anglefollower.angle = angle
        })

        this.objects.add(this.player)

        this.draw()
    }
    draw() {
        requestAnimationFrame(() => {
            this.draw()
        })
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.player.refresh()
        this.objects.forEach(o => {
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