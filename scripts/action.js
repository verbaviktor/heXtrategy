export const ActionType {
    BUILDCAMP,
    BUILDTOWER,
    BUILDCASTLE,
    TRAINARMY,
    MOVEARMY,
}

export class Action {
    constructor(x, y, type, destX = 0, destY = 0) {
        this.x = x
        this.y = y
        this.type = type
        this.destX = destX
        this.destY = destY
    }
}