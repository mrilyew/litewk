window.page_class = new class {
    async render_page() {
        let id = window.s_url.searchParams.get('post')
        let splitted = id.split('_')

        if(!id || id == '0' || id.split(',').length > 1) {
            add_onpage_error(':(')
            return
        }

        // Drawing user page
        let info = null
        let post = null

        try {
            info = (await window.vk_api.call('wall.getById', {'posts': id, 'extended': 1, 'fields': 'image_status,friend_status,photo_50,photo_200,sex'})).response
            post = new Post
            post.hydrate(info.items[0], info.profiles, info.groups)
        } catch(e) {}

        if(!info) {
            add_onpage_error(_('errors.post_not_found', id))
            return
        }

        let tabs = ['all', 'owner']
        let tabs_ = ''

        if(Number(splitted[0]) == window.active_account.vk_info.id) {
            tabs.push('others')
            tabs.push('archived')
        }

        document.title = _('wall.post')
        tabs.forEach(tab => {tabs_ += `<a href='site_pages/wall.html?id=${splitted[0]}&wall_section=${tab}'>${_(`wall.${tab}_posts`)}</a>`})

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper wall_wrapper'>
                    <div class='wall_wrapper_post'>
                        ${post.getTemplate({'hide_comments': 1})}

                        ${!post.needToHideComments() ?
                        `<div class='bordered_block comment_select_block' id='insert_paginator_here_bro'>
                            <span>${_('wall.comments_count', 0)}</span>
                        </div>

                        <div class='wall_wrapper_comments'></div>` : ''}
                    </div>
                    <div class='wall_wrapper_tabs bordered_block'>
                        ${tabs_}
                        <a href='site_pages/wall.html?id=${id}&wall_section=search'>${_(`wall.search_posts`)}</a>
                        <a data-ignore='1' class='selectd'>${_(`wall.post`)}</a>
                    </div>
                </div>
            `
        )

        if(!post.needToHideComments()) {
            window.main_classes['wall'] = new ClassicListView(Comment, '.wall_wrapper_post .wall_wrapper_comments')
            window.main_classes['wall'].setParams('wall.getComments', {'owner_id': post.info.owner_id, 'post_id': post.getCorrectID(), 'need_likes': 1, 'extended': 1, 'thread_items_count': 3, 'fields': 'image_status,friend_status,photo_50,photo_200,sex'})
                
            if(window.s_url.searchParams.has('page')) {
                window.main_classes['wall'].objects.page = Number(window.s_url.searchParams.get('page')) - 1
            }
    
            window.main_classes['wall'].clear()
            await window.main_classes['wall'].nextPage()
    
            $('.comment_select_block span')[0].innerHTML = _('wall.comments_count', window.main_classes['wall'].objects.count)
            $('.comment_select_block')[0].insertAdjacentHTML('beforeend', paginator_template(window.main_classes['wall'].objects.pagesCount, (Number(window.s_url.searchParams.get('page') ?? 1))))
        }
    }
}
