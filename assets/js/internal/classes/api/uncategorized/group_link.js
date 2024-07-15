class GroupLink {
    constructor(info) {
        this.info = info
    }

    getURL() {
        return '#away?id=' + this.info.url
    }

    getIcon() {
        return this.info.photo_50
    }

    getName() {
        return Utils.escape_html(this.info.name)
    }

    getDescription() {
        return Utils.escape_html(this.info.desc)
    }
}
