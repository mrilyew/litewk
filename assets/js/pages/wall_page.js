window.page_class = new class {
    async render_page() {
        let id = window.main_class['hash_params'].owner_id

        let us_info = null
        let section = window.main_class['hash_params'].section ?? 'all'

        if(!id) {
            Utils.add_onpage_error(_('errors.wall_not_found', id))
            return
        }

        let is_this = (id == window.active_account.info.id)
        if(!is_this) {
            if(id > 0) {
                us_info = new User
            } else {
                us_info = new Club
            }

            await us_info.fromId(Math.abs(id))
        } else {
            us_info = new User
            us_info.hydrate(window.active_account.info)
        }
        
        let tabs = ['all', 'owner']
        let tabs_ = ''

        if(id == window.active_account.info.id) {
            tabs.push('others')
            tabs.push('archived')
        }

        if(id < 0 && us_info.isAdmin()) {
            tabs.push('suggests')
            tabs.push('postponed')
        }

        tabs.push('search')

        document.title = _('wall.wall')
        tabs.forEach(tab => {tabs_ += `<a href='#wall${id}/${tab}' ${tab == section ? 'class=\'selected\'' : ''}>${_(`wall.${tab}_posts`)}</a>`})

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper layer_two_columns'>
                    <div>
                        <div class='bordered_block layer_two_columns_up_panel wall_select_block' id='insert_paginator_here_bro'>
                            ${section != 'search' ? `<span>${_('counters.posts_on_wall_count', 0)}</span>` : `
                                <input type="query" placeholder="${_('wall.search')}">
                            `}
                        </div>
                        <div class='wall_wrapper_post'></div>
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

                        <div class='wall_additional_tabs'>
                            <label>
                                <input type='checkbox' id='_invert_wall' ${window.main_url.searchParams.get('wall_invert') == 'yes' ? 'checked' : ''}>
                                ${_('wall.posts_invert')}
                            </label>
                        </div>
                    </div>
                </div>
            `
        )

        let wall_params = {'owner_id': id, 'extended': 1, 'count': 10, 'filter': tabs.includes(section) ? section : 'all', 'fields': window.Utils.typical_fields}
        window.main_classes['wall'] = new Wall(Post, '.wall_wrapper_post')
        window.main_classes['wall'].setParams('wall.get', wall_params, window.main_url.getParam('wall_invert') == 'yes')
    
        if(window.main_url.hasParam('page')) {
            window.main_classes['wall'].objects.page = Number(window.main_url.getParam('page')) - 1
        }

        if(section != 'search') {
            window.main_classes['wall'].clear()
            await window.main_classes['wall'].nextPage()
        } else {
            if(window.main_url.hasParam('wall_query')) {
                $(`input[type='query']`)[0].value = window.main_url.getParam('wall_query')
                await window.main_classes['wall'].search(window.main_url.getParam('wall_query'))
            }
        }

        try {
            if($('.layer_two_columns_up_panel span')[0]) {
                $('.layer_two_columns_up_panel span')[0].innerHTML = _('counters.posts_on_wall_count', window.main_classes['wall'].objects.count)
            }
            
            $('.layer_two_columns_up_panel')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
        } catch(e) {}
    }
}
