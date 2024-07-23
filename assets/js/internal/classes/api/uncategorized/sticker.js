class Sticker {
    constructor(info) {
        this.info = info
    }

    getId() {
        return this.info.sticker_id
    }

    getURL(size = '128', postfix = 'b') {
        return `https://vk.com/sticker/1-${this.getId()}-${size}${postfix}`
    }

    isAnimated() {
        return this.info.animation_url != null
    }

    isAllowed() {
        return this.info.is_allowed
    }
}
