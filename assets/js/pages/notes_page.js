window.page_class = new class {
    async render_page() {
        document.title = _('notes.notes')
        
        let section  = window.main_url.getParam('section') ?? 'all'
        let owner_id = Number(window.main_class['hash_params'].owner ?? window.active_account.info.id)
        let is_this  = owner_id == window.active_account.info.id
        let us_info  = null

        if(owner_id < 0) {
            main_class.add_onpage_error(_('errors.notes_cant_club'))
            return
        }

        if(!is_this) {
            if(owner_id > 0) {
                us_info = new User
            } else {
                us_info = new Club
            }

            await us_info.fromId(Math.abs(owner_id))
        } else {
            us_info = new User
            us_info.hydrate(window.active_account.info)
        }

        let method = 'notes.get'
        let method_params = {'user_id': owner_id, 'count': window.consts.DEFAULT_COUNT, 'sort': 0}

        switch(section) {
            default:
                break
            case 'friends':
                method = 'notes.getFriendsNotes'

                break
        }

        $('.page_content')[0].innerHTML = `
            <div class='default_wrapper layer_two_columns'>
                <div>   
                    <div class='layer_two_columns_up_panel bordered_block' id='insert_paginator_here_bro'>
                        <div class='tabs'>
                            <a data-ignore='1' class='selected'>${_('notes.notes')}</a>
                        </div>
                    </div>

                    <div class='bordered_block' id='_notes_root'>
                        <div class='notes_insert short_list'>
                        </div>
                    </div>
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
                    ${is_this ? `
                        <a href='#notes?section=all' ${section == 'all' ? `class='selected'` : ''}>
                            ${_('notes.all_notes')}
                        </a>
                        <a href='#notes?section=friends' ${section == 'friends' ? `class='selected'` : ''}>
                            ${_('notes.friends_notes')}
                        </a>
                    ` : `
                    <a href='#notes${owner_id}' ${section == 'all' ? `class='selected'` : ''}>
                        ${_('notes.all_notes')}
                    </a>
                    `}
                </div>
            </div>
        `

        let tab_dom = $(`.layer_two_columns_up_panel a`)

        window.main_classes['wall'] = new ClassicListView(Note, '.notes_insert', _('errors.not_es_found'))
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
    }
}
