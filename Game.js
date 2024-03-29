import { Control } from "./Control.js"
import { Entity } from "./Entity.js"
import { PhoneControl } from "./PhoneControl.js"
import { Player } from "./Player.js"
import { Projectile } from "./Projectile.js"
import { Background } from "./Background.js";

export class Game {
    constructor() {
        this.canvas = document.querySelector("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.middle = Math.round(this.canvas.width / 2)
        this.objects = new Set()
        this.buttons = new Set()
        this.player = new Player({game: this, x:1, y:0, color: "#311212"})
        this.gravity = 1

        this.control = new Control(this)
        this.phoneControl = new PhoneControl(this)
        this.background = new Background({game: this})

        this.objects.add(new Entity({game: this, x: 100, image: "assets/crate.png"}))
        this.objects.add(new Entity({game: this, x: 150, y: 50, image: "assets/crate.png"}))
        this.objects.add(new Entity({game: this, x: 200, y: 100, image: "assets/crate.png"}))
        this.objects.add(new Entity({game: this, x: 250, y: 150, image: "assets/crate.png"}))
        this.objects.add(new Entity({game: this, x: -1, y: 0, height: 810, width: 1, color: "red", collidable: false}))

        this.cursor = {
            x: 0,
            y: 0
        }
    }
    get isMobileUser() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
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
        if (obj.x <= 4) {
            res["left"] = true
            res["left-object"] = {"y": 0, "x": 0, "width": 0, "height": Infinity}
            res.not = false
        }
        if (obj.y <= 0) {
            res["bottom"] = true
            res["bottom-object"] = {"y": 0, "x": -Infinity, "width": Infinity, height: 0}
            res["not"] = false
        }
        this.objects.forEach(o => {
            if (o.uuid === obj.uuid || !o.collidable) return
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
            if (obj.x < o.x + o.width + 1 && obj.x >= o.x + (o.width / 2) && (vector ? obj.vx < 0 : true) && obj.y < o.y + o.height && obj.y + obj.height > o.y) {
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
        if (this.isMobileUser) {
            this.canvas.height = innerHeight
        } else {
            this.canvas.height = 500
        }
    }
    init() {
        if (this.isMobileUser) {
            screen.orientation.lock("landscape").catch((e) => {
                console.warn(e);
            })
        }
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
        this.canvas.addEventListener("touchstart", ME => {
            let x = Math.ceil((ME.touches[0].clientX - this.canvas.getBoundingClientRect().left) / this.canvas.getBoundingClientRect().width * this.canvas.width)
            let y = Math.ceil((ME.touches[0].clientY - this.canvas.getBoundingClientRect().top) / this.canvas.getBoundingClientRect().height * this.canvas.height)
            this.cursor.x = x
            this.cursor.y = y
        })

        this.objects.add(this.player)
        this.control.init()
        this.phoneControl.init()
        
        this.canvas.addEventListener(this.isMobileUser ? "touchstart" : "mousedown", (ME) => {
            if (this.isMobileUser) {
                this.canvas.requestFullscreen()
            }
            let can = true
            this.buttons.forEach(b => {
                if (b.pressed) {
                    can = false 
                }
            })
            if (!can) return
            this.objects.add(new Projectile({game: this, x: this.player.x + this.player.width/2, y: this.player.y + this.player.height/2}))
        })

        this.draw()
    }
    draw() {
        requestAnimationFrame(() => {
            this.draw()
        })
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.background.update()
        this.objects.forEach(o => {
            if (o.refresh) {
                o.refresh()
            }
            if (o.gravitysubject && !this.collision(o).bottom) {
                o.vy -= Math.min(this.gravity + this.gravity*.1, this.gravity)
            }
            o.draw()
        })
        if (!this.isMobileUser) {
            this.ctx.fillStyle = "#ffffff"
            this.ctx.beginPath();
            this.ctx.arc(this.cursor.x, this.cursor.y, 6, 0, 2 * Math.PI)
            this.ctx.fill();
            this.ctx.fillStyle = "#ff0000"
            this.ctx.beginPath();
            this.ctx.arc(this.cursor.x, this.cursor.y, 5, 0, 2 * Math.PI)
            this.ctx.fill();
        }
        this.buttons.forEach(b => {
            b.draw()
        })
    }
}