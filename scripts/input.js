import { camera, recieveInput } from "./script.js"

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
        this.mouseWheel = 0;
        this.keys = {}
        document.addEventListener('mousedown', (mouseButtonDown) => {
            if (recieveInput) {
                const key = 'mouseButton' + mouseButtonDown.button
                if (!this.isKeyDown(key)) {
                    this.keys[key] = ButtonState.PRESSED
                }
            }
        })
        document.addEventListener('mouseup', (mouseButtonDown) => {
            if (recieveInput) {
                const key = 'mouseButton' + mouseButtonDown.button
                if (this.isKeyDown(key)) {
                    this.keys[key] = ButtonState.RELEASED
                }
            }
        })
        document.addEventListener('mousemove', (mouseMove) => {
            if (recieveInput) {
                this.mousePosition = [mouseMove.clientX, mouseMove.clientY]
            }
        })
        document.addEventListener('wheel', (mouseWheel) => {
            if (recieveInput) {
                this.mouseWheel = -Math.sign(mouseWheel.deltaY)
            }
        })
        document.addEventListener('keydown', (event) => {
            if (recieveInput) {
                if (!this.isKeyDown(event.key)) {
                    this.keys[event.key] = ButtonState.PRESSED
                }
            }
        })
        document.addEventListener('keyup', (event) => {
            if (recieveInput) {
                if (this.isKeyDown(event.key)) {
                    this.keys[event.key] = ButtonState.RELEASED
                }
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
        this.mouseWheel = 0
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

