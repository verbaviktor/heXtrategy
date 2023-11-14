import { camera } from "./script.js"

const ButtonState = {
    UP: 0,
    DOWN: 1,
    PRESSED: 2,
    RELEASED: 3,
}

export class InputHandler {
    constructor() {
        this.mouseButtons = [ButtonState.UP, ButtonState.UP, ButtonState.UP]
        this.mousePosition = [0, 0]
        this.keys = {}
        document.addEventListener('mousemove', (mouseMove) => {
            this.mousePosition = [mouseMove.clientX, mouseMove.clientY]
        })
        document.addEventListener('keydown', (event) => {
            if (!this.isKeyDown(event.key)) {
                this.keys[event.key] = ButtonState.PRESSED
            }
        })
        document.addEventListener('keyup', (event) => {
            if (this.isKeyDown(event.key)) {
                this.keys[event.key] = ButtonState.RELEASED
            }
        })
    }
    update() {
        for (const key in this.keys) {
            switch (this.keys[key]) {
                case ButtonState.PRESSED:
                    this.keys[key] = ButtonState.DOWN
                    break;
                case ButtonState.RELEASED:
                    this.keys[key] = ButtonState.UP
                    break;
                default:
                    break;
            }
        }
    }
    isKeyDown(key) {
        return this.keys[key] == ButtonState.DOWN || this.keys[key] == ButtonState.PRESSED
    }
    isKeyUp(key) {
        return this.keys[key] == ButtonState.UP || this.keys[key] == ButtonState.RELEASED
    }
    isKeyPressed(key) {
        return this.keys[key] == ButtonState.PRESSED
    }
    isKeyReleased(key) {
        return this.keys[key] == ButtonState.RELEASED
    }
}

