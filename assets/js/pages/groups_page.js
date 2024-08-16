window.pages['groups_page'] = new class {
    async render_page() {
        document.title = _('groups.groups')
        let section = window.main_class['hash_params'].section ?? 'all'

        let id = Number(window.main_class['hash_params'].id ?? 0)
        if(id == 0 || id == null || isNaN(id)) {
            id = window.active_account.info.id
        }

        let is_this = (id == window.active_account.info.id)
        let owner_info = await Utils.getOwnerEntityById(id)

        let tabs_html = `
            <a href='#groups${id}/all' data-section='all'>${_('groups.all_groups')}</a>
            ${is_this ? `<a href='#groups${id}/managed' data-section='managed'>${_('groups.managed_groups')}</a>` : ''}
        `

        let error_message = _('errors.groups_get_error')
        let method = 'groups.get'
        let method_params = {'user_id': id, 'count': 10, 'extended': 1, 'fields': window.Utils.typical_fields + ',' + window.Utils.typical_group_fields}

        switch(section) {
            default:
                break
            case 'managed':
                document.title = _('groups.managed_groups_title')

                error_message = _('errors.groups_managed_error')
                method_params.filter = 'moder'
                break
            case 'events':
                document.title = _('groups.events_title')

                tabs_html = `
                    <a href='#groups${id}/events' data-section='events'>${_('groups.events')}</a>
                `

                error_message = _('errors.groups_events_error')
                method_params.filter = 'events'
                break
            case 'recommend':
                document.title = _('groups.recommended_title')
                tabs_html = ''

                error_message = _('errors.groups_recommend_error')
                method = 'groups.getRecommendedGroups'
                break
            case 'recents':
                document.title = _('groups.recent_title')

                tabs_html = `
                    <div class='flex_row justifier'>
                        <a href='#groups${id}/recents' data-section='recents'>${_('groups.recent')}</a>
                        <input type='button' value='${_('groups.clear_recents')}' id='__clearrecentgroups'>
                    </div>
                `

                error_message = _('errors.groups_recents_error')
                method = 'groups.getRecents'
                break
        }

        u('.page_content').html(`
            <div class='default_wrapper layer_two_columns'>
                <div>
                    ${tabs_html != '' ? `
                        <div class='layer_two_columns_up_panel bordered_block' id='insert_paginator_here_bro'>
                            <div class='tabs' ${section == 'recents' ? `style='width:100%;'` : ''}>${tabs_html}</div>
                        </div>` : ''}

                    <div class='groups_insert short_list bordered_block'></div>
                </div>
                <div class='layer_two_columns_tabs bordered_block'>
                    <div>
                        ${window.templates.content_pages_owner(owner_info)}

                        ${is_this ? `
                            <a href='#groups${id}/all' ${section == 'all' || section == 'managed' ? 'class=\'selected\'' : ''}>${_(`groups.all_groups`)}</a>
                            <a href='#groups${id}/events' ${section == 'events' ? 'class=\'selected\'' : ''}>${_(`groups.events`)}</a>
                            <a href='#groups${id}/recommend' ${section == 'recommend' ? 'class=\'selected\'' : ''}>${_(`groups.recommended`)}</a>
                            <a href='#groups${id}/recents' ${section == 'recents' ? 'class=\'selected\'' : ''}>${_(`groups.recent`)}</a>
                        ` : `
                            <a href='#groups${id}/all' ${section == 'all' || section == 'managed' ? 'class=\'selected\'' : ''}>${_(`groups.all_groups`)}</a>
                        `}
                    </div>
                </div>
            </div>
        `
        )

        let tab_dom = u(`.layer_two_columns_up_panel a[data-section='${section}']`)
        tab_dom.addClass('selected')

        if(section == 'recommend') {
            window.main_classes['wall'] = new RecommendedGroups('.groups_insert', error_message)
        } else {
            window.main_classes['wall'] = new ClassicListView(ClubListView, '.groups_insert', error_message)
        }

        window.main_classes['wall'].setParams(method, method_params)
        window.main_classes['wall'].clear()
        
        if(window.main_url.hasParam('page')) {
            window.main_classes['wall'].objects.page = Number(window.main_url.getParam('page')) - 1
        }

        await window.main_classes['wall'].nextPage()

        if(section == 'recents') {
            u('.show_more').remove()
        }

        if(tab_dom.nodes[0]) {
            tab_dom.nodes[0].innerHTML = tab_dom.nodes[0].innerHTML + ` (${window.main_classes['wall'].objects.count})`
        }

        if(section != 'recents' && section != 'recommend') {
            u('#insert_paginator_here_bro').append(window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
        }
    }
}
