if(!window.pages) {
    window.pages = {}
}

window.pages['faves_page'] = new class {
    async render_page() {
        main_class.changeTitle(_('bookmarks.bookmarks'))
        
        const section = window.main_class['hash_params'].section ?? 'all'
        const method_params = {'count': 10, 'extended': 1, 'fields': window.consts.TYPICAL_FIELDS}
        let tabs_html = `
            <a href='#fave/${section}' data-section='${section}'>${_('bookmarks.bookmarks')}</a>
        `
        let method = 'fave.get'

        switch(section) {
            default:
                main_class.changeTitle(_('bookmarks.all_bookmarks'), _('bookmarks.bookmarks'))
                
                break
            case 'pages':
                main_class.changeTitle(_('bookmarks.pages_bookmarks'), _('bookmarks.bookmarks'))

                method = 'fave.getPages'
                method_params.fields = window.consts.TYPICAL_FIELDS + ',' + window.consts.TYPICAL_GROUPS_FIELDS
                break
            case 'user':
                main_class.changeTitle(_('bookmarks.user_bookmarks'), _('bookmarks.bookmarks'))

                method = 'fave.getPages'
                method_params.type = 'users'
                break
            case 'group':
                main_class.changeTitle(_('bookmarks.group_bookmarks'), _('bookmarks.bookmarks'))
    
                method = 'fave.getPages'
                method_params.type = 'groups'
                method_params.fields = window.consts.TYPICAL_GROUPS_FIELDS
                break
            case 'post':
                main_class.changeTitle(_('bookmarks.post_bookmarks'), _('bookmarks.bookmarks'))

                method_params.item_type = 'post'
                break
            case 'article':
                main_class.changeTitle(_('bookmarks.article_bookmarks'), _('bookmarks.bookmarks'))
    
                method_params.item_type = 'article'
                break
            case 'link':
                main_class.changeTitle(_('bookmarks.link_bookmarks'), _('bookmarks.bookmarks'))
        
                method_params.item_type = 'link'
                break
            case 'video':
                main_class.changeTitle(_('bookmarks.video_bookmarks'), _('bookmarks.bookmarks'))
            
                method_params.item_type = 'video'
                break
        }

        if(window.main_url.hasParam('tag')) {
            method_params.tag_id = window.main_url.getParam('tag')
        }

        if(!this.tags) {
            this.tags = await window.vk_api.call('fave.getTags')
        }

        u('.page_content').html(window.templates._faves_page_layout(tabs_html, window.consts.FAVE_SECTIONS, section, this.tags, method_params.tag_id))

        window.main_classes['wall'] = new Bookmarks('.bookmarks_insert')
        window.main_classes['wall'].setParams(method, method_params)
        window.main_classes['wall'].clear()
            
        if(window.main_url.hasParam('page')) {
            window.main_classes['wall'].setPage(Number(window.main_url.getParam('page')))
        }

        await window.main_classes['wall'].nextPage()
        u('#insert_paginator_here_bro').append(window.templates.paginator(window.main_classes['wall'].getPagesCount(), (Number(window.main_url.getParam('page') ?? 1))))
    }
}
