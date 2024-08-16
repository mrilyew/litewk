class Album extends Hasable {
    constructor(info) {
        super(info)
        this.info = info
    }
     
    hydrate(info) {
        this.info = info
    }

    hasThumbnail() {
        return this.info.thumb && this.info.thumb.album_id != 0
    }

    getTitle() {
        return this.info.title.escapeHtml()
    }

    getDescription() {
        return this.info.description.escapeHtml()
    }

    getThumbnail() {
        return this.info.thumb_src
    }

    getThumbnailURL() {
        if(!this.hasThumbnail()) {
            return '' // todo add placeholder
        }

        return this.getThumbnailAsPhoto().getURL()
    }

    getThumbnailAsPhoto() {
        if(!this.info.thumb) {
            return null
        }

        return new Photo(this.info.thumb)
    }

    getId() {
        return this.info.owner_id + '_' + this.info.id
    }

    getSize() {
        return this.info.size
    }

    getFullsizeTemplate() {
        return window.templates.album_as_attachment(this)
    }
}
