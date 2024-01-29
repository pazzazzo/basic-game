import { Game } from "./Game.js";

export class Background {
    constructor (config = {game: new Game()}) {
        this.game = config.game
        this.image = new Image()
        this.image.src = "./assets/bg.png"
    }
    update() {
        for (let i = 0; i < this.game.canvas.width + (this.game.player.x / 5); i = i + 1000 - 1) {
            this.game.ctx.drawImage(this.image, i - (this.game.player.x / 5), this.game.y(0) - 750)
        }
    }
}