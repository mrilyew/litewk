class Doc extends PostLike {
    getExtension() {
        return this.info.ext
    }

    getFileSize() {
        return Utils.format_file_size(this.info.size)
    }

    getTitle() {
        return Utils.escape_html(this.info.title)
    }

    getURL() {
        return this.info.url
    }

    getPreview() {
        if(this.info.preview.photo) {
            if(this.info.preview.photo.sizes[3]) {
                return this.info.preview.photo.sizes[3].src
            } else {
                return this.info.preview.photo.sizes[0].src
            }
        }

        return ''
    }
}
