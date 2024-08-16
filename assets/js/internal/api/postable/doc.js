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

    getTitleWithExt() {
        if(this.getTitle().indexOf('.') != -1) {
            return this.getTitle()
        } else {
            return this.getTitle() + '.' + this.getExtension()
        }
    }

    getDate() {
        return Utils.short_date(this.info.date)
    }

    getTags() {
        if(!this.info.tags) {
            return []
        }

        return this.info.tags
    }

    getCSVTags() {
        let iter = 1
        let final_string = ''

        this.getTags().forEach(tag => {
            final_string += tag.escapeHtml() + (iter < this.getTags().length ? ', ' : '')
            
            iter += 1
        })

        return final_string
    }

    getURL() {
        return this.info.url
    }

    getType() {
        if(this.getExtension() == 'pdf') {
            return 7
        }

        return this.info.type
    }

    getPreview(size = null) {
        if(this.info.preview && this.info.preview.photo) {
            const photo = new MinimalPhoto(this.info.preview.photo.sizes)

            if(!size) {
                return photo.info[0]
            } else {
                return photo.info[size]
            }
        }

        return null
    }
    
    getVideoPreview() {
        if(this.info.preview && this.info.preview.video) {
            return this.info.preview.video.src
        }

        return ''
    }

    getTextType() {
        switch(this.getType()) {
            case 1:
                return _('docs.doc_type_text')
            case 2:
                return _('docs.doc_type_archive')
            case 3:
                return _('docs.doc_type_gif')
            case 4:
                return _('docs.doc_type_image')
            case 5:
                return _('docs.doc_type_audio')
            case 6:
                return _('docs.doc_type_video')
            case 7:
                return _('docs.doc_type_book')
            case 8:
                return _('docs.doc_type_unknown')
        }
    }

    getTemplate(additional = {}) {
        return window.templates.doc_list_view(this, additional)
    }

    getMiniTemplate() {
        return this.getTemplate({'hideTags': true})
    }

    getRealTemplate() {
        if(!this.isImage()) {
            return this.getTemplate()
        } else if(this.isGif()) {
            return window.templates.doc_gif_attachment(this)
        } else {
            return window.templates.doc_image_attachment(this)
        }
    }

    getFullsizeTemplate() {
        if(!this.isImage()) {
            return this.getTemplate()
        } else if(this.isGif()) {
            return window.templates.doc_gif_attachment(this)
        } else {
            return window.templates.doc_image_attachment(this)
        }
    }
    
    getGridTemplate() {
        return this.getFullsizeTemplate()
    }

    getHTMLPreview() {
        return window.templates._doc_html_preview(this)
    }

    // 0 — личный файл
    // 1 — для чего-то зарезервирован
    // 2 — учебный файл
    // 3 — книга
    // 4 — другой
    getFolderId() {
        return this.info.folder_id
    }

    hasPreview() {
        return this.has('preview')
    }

    isImage() {
        let ext = this.getExtension()
        return ext == 'gif' || ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'apng'
    }

    isGif() {
        return this.getExtension() == 'gif'
    }

    canEdit() {
        return this.info.can_manage
    }
}
