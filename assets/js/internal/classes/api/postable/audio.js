class Audio extends PostLike {
    constructor(info) {
        super(info)
        this.info = info
    }

    getName() {
        return Utils.escape_html(this.info.artist + ' — ' + this.info.title)
    }

    getDuration() {
        return Utils.format_seconds(this.info.duration)
    }
}
