class Link extends PostLike {
    hasPhoto() {
        return this.has('photo')
    }

    getPhoto() {
        let photo = new LinkPhoto
        photo.hydrate(this.info.photo)

        return photo
    }

    getURL() {
        return '#away?id=' + this.info.url
    }

    getTitle() {
        return Utils.escape_html(this.info.title)
    }
    
    getCaption() {
        return Utils.escape_html(this.info.caption)
    }
}
