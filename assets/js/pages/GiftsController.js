window.controllers['GiftsController'] = (function() {
    return {
        Gifts: async function() {
            const id = Number(window.main_class['hash_params'].id ?? 0)
            const is_this = (id == window.active_account.info.id)
            const owner = await Utils.getOwnerEntityById(id)
            const params = {'user_id': id, 'count': window.consts.DEFAULT_COUNT}
    
            main_class.changeTitle(_('gifts.gifts_of_x', owner.getFullNameCase()))
    
            u('.page_content').html(window.templates.two_blocks_grid())
            u('.page_content .layer_two_columns_tabs').append(
                window.templates.content_pages_owner(owner)
            )
            u('.page_content .layer_two_columns_content').html(`
                <div class='bordered_block' id='_gifts_insert'></div>
            `)
    
            const likes = await window.vk_api.call('gifts.get', params)
    
            window.main_classes['gifts'] = new ClassicListView(Gift, '#_gifts_insert', 'placeholder')
            window.main_classes['gifts'].setHandler('gifts')
            window.main_classes['gifts'].setParams('gifts.get', params)
            window.main_classes['gifts'].hydrateFirstPage(likes)
        }
    }
})()