class Gift {
    constructor(item) {
        this.info = item
    }

    getURL() {
        if(this.info.gift.thumb_96) {
            return this.info.gift.thumb_96
        } else if(this.info.gift.thumb_48) {
            return this.info.gift.thumb_48
        } else if(this.info.gift.thumb_256) {
            return this.info.gift.thumb_256
        }
    }

    getMessage() {
        return Utils.escape_html(this.info.message)
    }
}
