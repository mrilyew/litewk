window.controllers['WallController'] = (function() {
    return {
        Post: async function() {
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
    
            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .layer_two_columns_content').html(`
            <div class='wall_wrapper_post'>
                ${post.getTemplate({'hide_comments_button': 1, 'force_full_text': 1, 'show_comments_block': 1})}
            </div>
            `)

            u('.page_content .layer_two_columns_tabs').html(`<div class='settings_tabs tabs flex flex_column horizontal_tabs'></div>`)
            u('.page_content .layer_two_columns_tabs .settings_tabs').html(`
                ${window.templates.content_pages_owner(owner_entity)}
                <hr>
                ${window.templates.wall_tabs(owner_id, tabs)}
                <a data-ignore='1' class='selected'>${_(`wall.post_on_wall`)}</a>
            `)
    
            if(!post.needToHideComments()) {
                let handler = ''
                try {
                    handler = await Comments.create(post, '.post_comments_wrapper .post_comments_wrapper_wrapper')
                } catch(e){}
                
                u('#post_comment_sort select').attr('data-handler', handler)
                u('.comment_select_block').append(window.templates.paginator(window.main_classes[handler].getPagesCount(), (Number(window.main_url.getParam('page') ?? 1))))
            }
        },
        PostSkeleton: function() {
            u('.page_content').html(`
                <div id='_skeleton' class='default_wrapper layer_two_columns'>
                    <div class='layer_two_columns_content'>
                        <div class='wall_wrapper_post'>
                            ${window.templates.post_skeleton()}
                        </div>
                    </div>
                    <div class='layer_two_columns_tabs bordered_block filler'>
                        <div class='empty_space' style='height: 100px;'></div>
                    </div>
                </div>
            `)
        },
        Wall: async function() {
            function __fallback() {
                main_class.addOnpageErrorWithTitle(_('user_page.info'), `
                    <span>${_('errors.wall_not_found')}</span>
                    <input type='button' id='__comeback' value='${_('messagebox.comeback')}'>
                `)
            }

            const section = window.main_url.getParam('section') ?? 'all'
            let owner_id = parseInt(window.main_class['hash_params'].owner_id)
            let owner_entity = null
            try {
                owner_entity = await Utils.getOwnerEntityById(owner_id)
            } catch(e) {
                __fallback()
            }

            const tabs = Wall.getTabsByEntity(owner_entity)
            tabs.push('search')
            const posts_count = (owner_entity.info.counters.posts ? owner_entity.info.counters.posts : (owner_entity.info.posts ? owner_entity.info.posts.count : 0))
            if(!owner_id && isNaN(owner_id)) {
                __fallback()
                return
            }

            let sub_params = `
            <div class='wall_additional_tabs'>
                <div class='layer_two_columns_params'>
                    <select id='_wall_sorter'>
                        <option value='new'>${_('wall.sort_new_first')}</option>
                        <option value='old' ${window.main_url.getParam('invert') == '1' ? 'selected' : ''}>${_('wall.sort_old_first')}</option>
                    </select>
                </div>
            </div>
            `
            let upper_panel = `
            <div class='bordered_block layer_two_columns_up_panel wall_search_page' id='paginator_here'>
                <div class='layer_two_columns_up_panel_count'>
                    <b>${_(`wall.${section}_posts`)}</b>
                    <span>${posts_count}</span>
                </div>
            </div>
            `
    
            if(section == 'search') {
                sub_params = window.templates.search_posts_params(true)
                upper_panel = `
                <div class='flex_row flex_row_sticky flex_nowrap' id='_global_search' style='margin-bottom: 10px;'>
                    <input type='text' placeholder='${_('search.search')}' value='${window.main_url.getParam('q', '')}'>
                    <input type='button' style='margin-left: 5px;' value='${_('wall.search')}'>
                </div>
                `
            }
    
            main_class.changeTitle(_('wall.wall_of_x', owner_entity.getFullNameCase('gen')))
            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .layer_two_columns_tabs').html(`<div class='settings_tabs tabs flex flex_column horizontal_tabs'></div>`)
            u('.page_content .layer_two_columns_content').html(`
            <div class='layer_two_columns_content_wrapper'>
                ${upper_panel}
    
                <div class='wall_block_insert'></div>
            </div>
            `)
    
            u('.page_content .layer_two_columns_tabs .settings_tabs').html(`
                ${window.templates.content_pages_owner(owner_entity)}
                <hr>
                ${window.templates.wall_tabs(owner_id, tabs, section)}
    
                ${sub_params}
            `)
    
            try {
                await Wall.create(owner_entity, false, false)
                if(window.main_classes['wall'].getPagesCount() > 2 && section != 'search') {
                    u('.layer_two_columns_up_panel').append(window.templates.paginator(window.main_classes['wall'].getPagesCount(), (Number(window.main_classes['wall'].getPage() ?? 1))))
                }
            } catch(e) {}
            
            u('.wall_search_page').on('change', `.wall_select_block input[type='query']`, (e) => {
                e.preventDefault()
                window.main_classes['wall'].search(e.target.value)
            })

            u('.wall_search_page').on('click', `.wall_select_block input[type='button']`, async (e) => {
                u(`.wall_search_page input[type='text']`).trigger('change')
            })
        },
        LikesList: async function() {
            const __drawReactions = function(items, reactions) {
                const formatted_set = []
    
                items.forEach(item => {
                    formatted_set.push(new PostReaction(item, {'count': 0,'items': []}))
                })
    
                formatted_set.forEach(reaction => {
                    u('.page_content .layer_two_columns_tabs').append(`
                        <a href='${link}?tab=reaction_${reaction.getId()}' class='reaction_tab ${tab == 'reaction_'+reaction.getId() ? `selected` : ''}'>
                            <img src='${reaction.getImageURL()}'>
                            ${reaction.getTitle()}
                        </a>
                    `)
                })
            }
    
            const display_type = window.main_class['hash_params'].type
            let type = display_type
            if(type == 'wall') {
                type = 'post'
            }
    
            const owner_id = window.main_class['hash_params'].owner_id
            const item_id = window.main_class['hash_params'].item_id
            const tab = window.main_url.getParam('tab', 'likes')
            const params = {'type': type, 'owner_id': owner_id, 'item_id': item_id, 'extended': 1, 'count': window.consts.DEFAULT_COUNT, 'fields': window.consts.TYPICAL_FIELDS}
           
            if(tab == 'reposts') {
                params.filter = 'copies'
            } else if(tab.indexOf('reaction') != -1) {
                const reaction = tab.split('_')
                params.reaction_id = reaction[1]
            }
            
            main_class.changeTitle(_('likes.list_of_likers'), _('likes.list_of_likers_type_' + type))
    
            const owner_entity = await Utils.getOwnerEntityById(owner_id)
            const link = `#${display_type}/${owner_id}_${item_id}/likes`
    
            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .layer_two_columns_tabs').append(
                window.templates.content_pages_owner(owner_entity, _('likes.list_of_likers_type_' + type), `#${display_type}${owner_id}_${item_id}`)
            )
            u('.page_content .layer_two_columns_content').html(`
                <div class='bordered_block' id='_likes_insert'></div>
            `)
    
            u('.page_content .layer_two_columns_tabs').append(`
                <a href='${link}' ${tab == 'likes' ? `class='selected'` : ''}>${_(`likes.likes_tab`)}</a>
                ${owner_entity.isThisUser() ? `
                    <a href='${link}?tab=reposts' ${tab == 'reposts' ? `class='selected'` : ''}>${_('likes.reposts_tab')}</a>
                ` : ''}
            `)
            
            if(this.reacts) {
                __drawReactions(this.reacts[0], this.reacts[1])
            }
    
            const likes = await window.vk_api.call('likes.getList', params)
    
            if(!this.reacts && likes.reaction_sets) {
                this.reacts = [likes.reaction_sets[0].items, likes.reactions]
                __drawReactions(likes.reaction_sets[0].items, likes.reactions)
            }
    
            window.main_classes['likes'] = new ClassicListView(UserListView, '#_likes_insert', 'placeholder')
            window.main_classes['likes'].setHandler('likes')
            window.main_classes['likes'].setParams('likes.getList', params)
            window.main_classes['likes'].hydrateFirstPage(likes)
        }
    }
})()
