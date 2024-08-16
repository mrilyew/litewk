window.pages['likes_page'] = new class {
    async render_page() {
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
