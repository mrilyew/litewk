class DocumentationSubItem extends Hasable {
    getChildren() {
        return this.info.children
    }

    hasChildren() {
        return this.info.children.length > 0
    }
}

class Documentation extends DocumentationSubItem {
    async fromId(path) {
        try {
            const docs_page = await window.doc_vk_api.call({method: 'documentation.getPage', params: {'page': path}})
            switch(docs_page.code) {
                case 302:
                    window.router.route('#dev?path=/' + docs_page.redirect_to)
                    return
            }
    
            this.hydrate(docs_page.page.contents)
            this.info.type = docs_page.page.type
        } catch(e) {
            throw e
        }
    }

    getId() {
        return this.info.page_id
    }

    getMenuId() {
        return this.info.menu_id
    }

    getTitle() {
        return this.info.title.escapeHtml()
    }

    getText() {
        return marked.parse(this.info.text ?? '')
    }
    
    getRawText() {
        return this.info.text
    }

    getDescription() {
        return this.info.description
    }

    getType() {
        return this.info.type
    }

    getParams() {
        return this.info.params
    }

    getCommonDescription() {
        return this.info.params_common_description.escapeHtml()
    }

    getResultDescription() {
        return this.info.result_description
    }

    getLinkedVersions() {
        return this.info.linked_versions
    }

    getErrorCodes() {
        return this.info.errors
    }
}

class DocumentationMethodParam extends DocumentationSubItem {
    getName() {
        return this.info.name.escapeHtml()
    }

    getType() {
        return this.info.type.escapeHtml()
    }

    getDescription() {
        return Utils.nl2br(this.info.description)
    }

    isRequired() {
        return this.info.is_required
    }
}

class DocumentationApiVersion extends DocumentationSubItem {
    getVersion() {
        return this.info.title
    }

    getDescription() {
        return this.info.description
    }

    getURL() {
        return this.info.url
    }
}

class DocumentationMenuItem extends DocumentationSubItem {
    constructor(info) {
        super(info)
        this.info = info
    }

    getType() {
        return this.info.type
    }

    getTitle() {
        return this.info.title.escapeHtml()
    }

    getURL() {
        return '/' + this.info.url
    }

    getFullURL() {
        return `#dev?path=` + this.getURL()
    }

    isSelected() {
        return window.main_url.getParam('path') == this.getURL()
    }

}