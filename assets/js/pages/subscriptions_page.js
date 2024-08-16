window.pages['subscriptions_page'] = new class {
    async render_page() {
        const id = Number(window.main_class['hash_params'].id ?? 0)
        const is_this = (id == window.active_account.info.id)
        const owner = await Utils.getOwnerEntityById(id)
        const params = {'user_id': id, 'extended': 1, 'count': window.consts.DEFAULT_COUNT, 'fields': window.consts.TYPICAL_FIELDS + ',' + window.consts.TYPICAL_GROUPS_FIELDS}

        main_class.changeTitle(_('subscriptions.subscriptions_of_x', owner.getFullNameCase()))

        u('.page_content').html(window.templates.two_blocks_grid())
        u('.page_content .layer_two_columns_tabs').append(
            window.templates.content_pages_owner(owner)
        )
        u('.page_content .layer_two_columns_content').html(`
            <div class='bordered_block' id='_entities_insert'></div>
        `)

        const likes = await window.vk_api.call('users.getSubscriptions', params)

        window.main_classes['subs'] = new ClassicListView(EntityListView, '#_entities_insert', 'placeholder')
        window.main_classes['subs'].setHandler('subs')
        window.main_classes['subs'].setParams('users.getSubscriptions', params)
        window.main_classes['subs'].hydrateFirstPage(likes)
    }
}
