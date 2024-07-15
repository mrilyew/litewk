window.page_class = new class {
    async render_page() {
        let id = window.main_class['hash_params'].owner_id + '_' + window.main_class['hash_params'].post_id
        let splitted = id.split('_')
        let us_info = null

        if(!id || id == '0' || id.split(',').length > 1) {
            add_onpage_error(':(')
            return
        }

        // Drawing user page
        let post = new Post

        try {
            await post.fromId(id)
        } catch(e) {}

        if(!post.info) {
            main_class.add_onpage_error(_('errors.post_not_found', id))
            return
        }

        let is_this = (Number(window.main_class['hash_params'].owner_id) == window.active_account.info.id)
        if(!is_this) {
            if(splitted[0] > 0) {
                us_info = new User
            } else {
                us_info = new Club
            }

            await us_info.fromId(Math.abs(splitted[0]))
        } else {
            us_info = new User
            us_info.hydrate(window.active_account.info)
        }

        let tabs = ['all', 'owner']
        let tabs_ = ''

        if(Number(splitted[0]) == window.active_account.info.id) {
            tabs.push('others')
            tabs.push('archived')
        }

        if(Number(splitted[0]) < 0 && us_info.isAdmin()) {
            tabs.push('suggests')
            tabs.push('postponed')
        }

        tabs.push('search')

        document.title = _('wall.post')
        tabs.forEach(tab => {tabs_ += `<a href='#wall${splitted[0]}/${tab}'>${_(`wall.${tab}_posts`)}</a>`})

        let comment_sort = window.main_url.getParam('comment_sort') && ['asc', 'desc', 'smart'].indexOf(window.main_url.getParam('comment_sort')) != -1 ? window.main_url.getParam('comment_sort') : window.site_params.get('ux.default_sort', 'asc')
        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper layer_two_columns'>
                    <div class='wall_wrapper_post'>
                        ${post.getTemplate({'hide_comments': 1})}

                        ${!post.needToHideComments() ?
                        `<div class='bordered_block comment_select_block' id='insert_paginator_here_bro'>
                            <span>${_('wall.comments_count', post.info.comments.count)}</span>
                        </div>
                        
                        ${post.info.comments.count > 1 ? `
                        <div id='post_comment_sort' class='comment_sort'>
                            <select>
                                <option value='desc' ${comment_sort == 'desc' ? 'selected' : ''}>${_('wall.sort_new_first')}</option>
                                <option value='asc' ${comment_sort == 'asc' ? 'selected' : ''}>${_('wall.sort_old_first')}</option>
                                <option value='smart' ${comment_sort == 'smart' ? 'selected' : ''}>${_('wall.sort_interesting_first')}</option>
                            </select>
                        </div>` : ''}

                        <div class='wall_wrapper_comments'></div>` : ''}
                    </div>
                    <div class='layer_two_columns_tabs bordered_block'>
                        <a href='${us_info.getUrl()}' class='layer_two_columns_tabs_user_info'>
                            <div>
                                <img class='avatar' src='${us_info.getAvatar()}'>
                            </div>

                            <div class='layer_two_columns_tabs_user_info_name'>
                                <b ${us_info.isFriend() ? `class='friended'` : ''}>${Utils.cut_string(us_info.getName(), 15)}</b>
                                <span>${_('user_page.go_to_user_page')}</span>
                            </div>
                        </a>

                        ${tabs_}
                        <a data-ignore='1' class='selected'>${_(`wall.post`)}</a>
                    </div>
                </div>
            `
        )

        if(!post.needToHideComments()) {
            window.main_classes['wall'] = new Comments(Comment, '.wall_wrapper_post .wall_wrapper_comments')
            window.main_classes['wall'].setParams('wall.getComments', {'owner_id': post.info.owner_id, 'post_id': post.getCorrectID(), 'need_likes': 1, 'extended': 1, 'thread_items_count': 3, 'fields': window.Utils.typical_fields + ',' + window.Utils.typical_group_fields, 'sort': comment_sort})
                
            if(window.main_url.hasParam('page')) {
                window.main_classes['wall'].objects.page = Number(window.main_url.getParam('page')) - 1
            }
    
            window.main_classes['wall'].clear()
            await window.main_classes['wall'].nextPage()
    
            $('.comment_select_block span')[0].innerHTML = _('wall.comments_count_with_threads', window.main_classes['wall'].objects.count, post.info.comments.count)
            $('.comment_select_block')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
        }
    }
}
