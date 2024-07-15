window.page_class = new class {
    async render_page() {
        document.title = _('bookmarks.bookmarks')
        
        let section = window.main_class['hash_params'].section ?? 'all'
        let tabs_html = ``
        let method = 'fave.get'
        let method_params = {'count': 10, 'extended': 1, 'fields': window.Utils.typical_fields}

        switch(section) {
            default:
                document.title = _('bookmarks.all_bookmarks')

                break
            case 'pages':
                document.title = _('bookmarks.pages_bookmarks')
    
                method = 'fave.getPages'
                method_params.fields = window.Utils.typical_group_fields + ',' + window.Utils.typical_fields
                break
            case 'user':
                document.title = _('bookmarks.user_bookmarks_title')

                method = 'fave.getPages'
                method_params.type = 'users'
                break
            case 'group':
                document.title = _('bookmarks.group_bookmarks_title')
    
                method = 'fave.getPages'
                method_params.type = 'groups'
                method_params.fields = window.Utils.typical_group_fields
                break
            case 'post':
                document.title = _('bookmarks.post_bookmarks_title')

                method_params.item_type = 'post'
                break
            case 'article':
                document.title = _('bookmarks.article_bookmarks_title')
    
                method_params.item_type = 'article'
                break
            case 'link':
                document.title = _('bookmarks.link_bookmarks_title')
        
                method_params.item_type = 'link'
                break
            case 'video':
                document.title = _('bookmarks.video_bookmarks_title')
            
                method_params.item_type = 'video'
                break
        }

        if(window.main_class['hash_params'].tag) {
            method_params.tag_id = window.main_class['hash_params'].tag
        }

        tabs_html = `
            <a href='#fave/${section}' data-section='${section}'>${_('bookmarks.bookmarks')}</a>
        `

        let sections_list = ``
        let sections = ['all', 'pages', 'divider', 'user', 'group', 'post', 'article', 'link', 'video']
        sections.forEach(el => {
            if(el == 'divider') {
                sections_list += `
                    <hr>
                `
                
                return
            }

            sections_list += `
                <a href='#fave${method_params.tag_id ? '/' + method_params.tag_id : ''}/${el}' ${section == el ? 'class=\'selected\'' : ''}>${_(`bookmarks.${el}_bookmarks`)}</a>
            `
        })

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper layer_two_columns'>
                    <div>
                        <div class='layer_two_columns_up_panel bordered_block' id='insert_paginator_here_bro'>
                            <div class='tabs'>${tabs_html}</div>
                        </div>

                        <div class='flex_row flex_nowrap' id='_bookmarks_search' style='margin-bottom: 10px;'>
                            <input type='text' placeholder='${_('bookmarks.search_by_loaded_bookmarks')}'>
                            <input type='button' style='margin-left: 5px;' value='${_('wall.search')}'>
                        </div>

                        <div class='bookmarks_insert bordered_block short_list'></div>
                    </div>
                    <div class='layer_two_columns_tabs bordered_block'>
                        <div>
                            ${sections_list}

                            <div class='layer_two_columns_params'>
                                <input type='button' id='__markbookmarks' value='${_('bookmarks.mark_as_viewed')}'>

                                <span>${_('bookmarks.tags')}</span>
                            </div>
                            <div id='__inserttags'></div>
                        </div>
                    </div>
                </div>
            `
        )
        
        let tab_dom = $(`.layer_two_columns_up_panel a[data-section='${section}']`)
        tab_dom.addClass('selected')

        window.main_classes['wall'] = new Bookmarks('.bookmarks_insert')
        window.main_classes['wall'].setParams(method, method_params)
        window.main_classes['wall'].clear()
            
        if(window.main_url.hasParam('page')) {
            window.main_classes['wall'].objects.page = Number(window.main_url.getParam('page')) - 1
        }

        await window.main_classes['wall'].nextPage()
        if(tab_dom[0]) {
            tab_dom[0].innerHTML = tab_dom[0].innerHTML + ` (${window.main_classes['wall'].objects.count})`
        }

        $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
       
        let tags = await window.vk_api.call('fave.getTags', false)
        tags = tags.response

        if(tags.count > 0) {
            tags.items.forEach(tag => {
                console.log(tag)
                let is_this = Number(window.main_class['hash_params'].tag) == tag.id

                $('#__inserttags')[0].insertAdjacentHTML('beforeend', 
                    `
                        <a href='#fave${!is_this ? '/' + tag.id : ''}/${section}' class=\'${is_this ? 'selected' : ''} tag_selector\'>${Utils.escape_html(tag.name)}</a>
                    `
                )
            })
        }
    }
}
