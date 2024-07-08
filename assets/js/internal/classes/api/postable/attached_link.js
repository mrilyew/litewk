class Link extends PostLike {
    hasPhoto() {
        return this.has('photo')
    }

    getPhoto() {
        let photo = new Photo
        photo.hydrate(this.info.photo)

        return photo
    }

    getURL() {
        return '?id=' + this.info.url + '#away'
    }

    getTitle() {
        return Utils.escape_html(this.info.title)
    }
    
    getCaption() {
        return Utils.escape_html(this.info.caption)
    }
}
