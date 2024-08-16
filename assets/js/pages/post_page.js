window.pages['post_page']  = new class {
    async render_page() {
        const _postNotFound = () => {
            main_class.addErrorWithBackButton(_('errors.post_not_found'))
        }
        
        let   owner_id = parseInt(window.main_class['hash_params'].owner_id)
        const post_id  = parseInt(window.main_class['hash_params'].post_id)

        if(isNaN(owner_id) || isNaN(post_id) || !owner_id || !post_id || post_id == 0) {
            _postNotFound()

            return
        }

        if(owner_id == 0) {
            owner_id = window.active_account.info.id
        }

        const post = new Post
        try {
            await post.fromId(owner_id + '_' + post_id)
        } catch(e) {
            console.error(e)
            _postNotFound()

            return
        }

        if(!post.info) {
            _postNotFound()
            return
        }

        const owner_entity = await Utils.getOwnerEntityById(owner_id)
        const tabs = Wall.getTabsByEntity(owner_entity)
        const raw_text = post.getRawText()
        tabs.push('search')

        main_class.changeTitle(raw_text ? raw_text.escapeHtml().circum(20) : _('wall.post_from', post.getDateForTitle()), _('wall.wall_of_x', owner_entity.getFullNameCase('gen')))
        const comment_sort = window.main_url.getParam('comment_sort') && ['asc', 'desc', 'smart'].indexOf(window.main_url.getParam('comment_sort')) != -1 ? window.main_url.getParam('comment_sort') : window.site_params.get('ux.default_sort', 'asc')

        u('.page_content').html(window.templates.two_blocks_grid())

        u('.page_content .layer_two_columns_content').html(`
        <div class='wall_wrapper_post'>
            ${post.getTemplate({'hide_comments': 1, 'force_full_text': 1})}

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
        `)

        u('.page_content .layer_two_columns_tabs').html(`
            ${window.templates.content_pages_owner(owner_entity)}

            ${window.templates.wall_tabs(owner_id, tabs)}
            <a data-ignore='1' class='selected'>${_(`wall.post`)}</a>
        `)

        if(!post.needToHideComments()) {
            window.main_classes['wall'] = Comments.fastCreate('wall.getComments', {'owner_id': post.info.owner_id, 'post_id': post.getCorrectID(), 'need_likes': 1, 'extended': 1, 'thread_items_count': 3, 'fields': window.consts.TYPICAL_FIELDS + ',' + window.consts.TYPICAL_GROUPS_FIELDS, 'sort': comment_sort})
            await window.main_classes['wall'].nextPage()
            
            u('.comment_select_block span').html(_('wall.comments_count_with_threads', window.main_classes['wall'].objects.count, post.info.comments.count))
            u('.comment_select_block').append(window.templates.paginator(window.main_classes['wall'].getPagesCount(), (Number(window.main_url.getParam('page') ?? 1))))
        }
    }

    show_skeleton() {
        u('.page_content').html(`
        <div id='_skeleton' class='default_wrapper layer_two_columns'>
            <div class='layer_two_columns_content'>
                <div class='wall_wrapper_post'>
                    ${window.templates.post_skeleton()}
                </div>
            </div>
            <div class='layer_two_columns_tabs bordered_block'>
                ${window.templates.content_pages_owner_skeleton()}
    
                <div class='filler empty_space' style='height: 100px;'></div>
            </div>
        </div>
        `)
    }
}
