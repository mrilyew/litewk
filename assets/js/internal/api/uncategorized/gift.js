class Gift extends PostLike {
    constructor(item) {
        super(item)
        this.info = item
    }

    hydrate(info, profiles, groups) {
        this.info = info
        this.profiles = profiles
        this.groups = groups
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
        return this.info.message.escapeHtml()
    }

    getTemplate() {
        return window.templates.gift_fullsize(this)
    }
}
