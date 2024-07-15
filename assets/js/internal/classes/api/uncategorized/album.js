class Album {
    hydrate(info) {
        this.info = info
    }

    getTitle() {
        return Utils.escape_html(this.info.title)
    }

    getThumbnail() {
        return this.info.thumb_src
    }

    getId() {
        return this.info.owner_id + '_' + this.info.id
    }

    getSize() {
        return this.info.size
    }
}
