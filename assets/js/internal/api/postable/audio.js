class Audio extends PostLike {
    getName() {
        return Utils.escape_html(this.info.artist + ' — ' + this.info.title)
    }

    getDuration() {
        return Utils.format_seconds(this.info.duration)
    }

    getTemplate() {
        return `Audio: 
            ${this.getName()}<br>
        `
    }

    getFullsizeTemplate() {
        return this.getTemplate()
    }
}
