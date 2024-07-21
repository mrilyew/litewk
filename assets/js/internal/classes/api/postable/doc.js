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
            final_string += Utils.escape_html(tag) + (iter < this.getTags().length ? ', ' : '')
            
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

    getPreview() {
        if(this.info.preview && this.info.preview.photo) {
            let photo = new Photo()
            photo.hydrate(this.info.preview.photo)

            if(photo.hasSize('s')) {
                return photo.getUrlBySize('s')
            } else {
                return photo.info.sizes[0].src
            }
        }

        return ''
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
        let tags_html = ``
        let tags = this.getTags()
        let iter = 1

        tags.forEach(tag => {
            tags_html += `
                <object>
                    <a ${!additional.tags_to ? `href='#search/docs?query=${encodeURIComponent(tag)}'` : `id='__tagadder' href='javascript:void(0)' data-tag='${Utils.escape_html(tag)}' data-ignore='1'`}>${Utils.escape_html(tag)}</a>
                    <span style='margin-left: -2px;'>${iter < tags.length ? ',' : ''}</span>
                </object>
            `

            iter += 1
        })
        
        return `
            <a class='document_block flex_row justifier' data-docid='${this.getId()}' data-url='${this.getURL()}' ${this.isImage() ? /*`id='not_gif_attachment'`*/ '' : ''} href='#doc${this.getId()}'>
                <div class='document_block_full_info'>
                    ${this.getHTMLPreview()}

                    <div class='document_block_info'>
                        <b>${this.getTitle()}</b>
                        
                        <div>
                            <span>${this.getFileSize()},</span>
                            <span>${this.getDate()}</span>
                        </div>

                        ${tags.length > 0 ? `<div class='document_block_tags'>
                            ${tags_html}
                        </div>` : ''}
                    </div>
                </div>

                ${!additional.hide_acts ? `<div class='document_block_actions'>
                    ${!this.canEdit() ? `
                        <object class='outline_object'>
                            <a class='doc_list_button add_doc_button' data-type='add' data-docid='${this.getId()}'>
                                <svg viewBox="0 0 41 41"><polygon points="41 19 22 19 22 0 19 0 19 19 0 19 0 22 19 22 19 41 22 41 22 22 41 22 41 19"/></svg>
                            </a>
                        </object>
                    `: `
                        <object class='outline_object edit_doc_button_wrap'>
                            <a class='doc_list_button edit_doc_button' data-inform='${this.getStringInfo()}'>
                                <svg viewBox="0 0 44.32 44.17"><polygon points="40.88 11.87 32.95 3.9 32.95 3.9 40.88 11.87 40.88 11.87"/><polygon points="35.36 0.5 4.95 30.77 0.5 43.66 13.42 39.27 43.82 9.01 35.36 0.5"/></svg>
                            </a>
                        </object>
                        <object class='outline_object delete_doc_button_wrap'>
                            <a class='doc_list_button delete_doc_button' data-type='delete' data-docid='${this.getId()}'>
                                <svg viewBox="0 0 45.12 45.12"><line x1="1.07" y1="1.07" x2="43.07" y2="44.07"/><line x1="44.07" y1="1.07" x2="1.07" y2="43.07"/></svg>
                            </a>
                        </object>
                    `}
                </div>` : ''}
            </a>
        `
    }

    getRealTemplate() {
        if(!this.isImage()) {
            return this.getTemplate()
        } else if(this.isGif()) {
            return `
            <a href='#doc${this.getId()}' data-ignore='1' class='ordinary_attachment gif_attachment doc_attachment' data-url='${this.getURL()}' data-docid='${this.getId()}' title='${this.getTitle()}'>
                <div class='ext_block'>
                    <span>${Utils.escape_html(this.getExtension().toUpperCase())} | ${this.getFileSize()}</span>
                </div>

                <div id='_photo'>
                    <img loading='lazy' class='outliner' src='${this.getPreview()}'>
                </div>

                <div id='_vid'>
                    <video data-src='${this.getVideoPreview()}' loop>
                </div>
            </a>
            `
        } else {
            return `
            <a href='#doc${this.getId()}' data-ignore='1' class='ordinary_attachment doc_attachment' id='not_gif_attachment' data-url='${this.getURL()}' data-docid='${this.getId()}' title='${this.getTitle()}'>
                <div class='ext_block'>
                    <span>${Utils.escape_html(this.getExtension().toUpperCase())} | ${this.getFileSize()}</span>
                </div>
                <img loading='lazy' class='outliner' src='${this.getPreview()}'>
            </a>
            `
        }
    }

    getHTMLPreview() {
        if(this.isImage()) {
            return `<div class='document_block_preview with_image' style='background-image: url("${this.getPreview()}")'></div>`
        } else {
            return `
            <div class='document_block_preview only_ext'>
                ${this.getExtension()}
            </div>`
        }
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
