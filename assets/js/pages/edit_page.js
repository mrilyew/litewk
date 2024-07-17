window.page_class = new class {
    async render_page(section = null) 
    {
        if(section == null) {
            section = window.main_class['hash_params'].section ?? 'main'
        }

        document.title = _('user_page_edit.edit_page_' + section)
        $('.page_content')[0].innerHTML = `
            <div class='default_wrapper'>
                <div class='edit_page bordered_block'>
                    <div class='tabs'>
                        <a href='#edit/main' data-section='main'>${_('user_page_edit.main_info')}</a>
                        <a href='#edit/blacklist' data-section='blacklist'>${_('user_page_edit.blacklist')}</a>
                        <a href='#edit/privacy' data-section='privacy'>${_('user_page_edit.privacy')}</a>
                        <a href='#edit/notifications' data-section='notifications'>${_('user_page_edit.notifications')}</a>
                    </div>

                    <div class='content'></div>
                </div>
            </div>
        `

        switch(section) {
            case 'main':
                $('.content')[0].innerHTML = `Not_done) :D`
                break
            case 'blacklist':
                let list = null

                if(!window.black_list) {
                    list = await window.vk_api.call('account.getBanned', {'fields': window.Utils.typical_fields + ',domain', 'count': 100})
                    list = list.response

                    window.black_list = list
                } else {
                    list = window.black_list
                }

                $('.content')[0].innerHTML = `
                    <div class='flex_row justifier'>
                        <b>${_('user_page_edit.accounts_in_bl', list.count)}</b>

                        <input id='_bl_add_user' style='height: 20px;padding: 0px 3px;' type='button' value='${_('user_page_edit.add')}'>
                    </div>

                    <div class='content_blacklist_search flex_row flex_nowrap'>
                        <input type='query' placeholder='${_('user_page_edit.search_by_blacklist')}'>
                        <input type='button' style='margin-left: 5px;' value='${_('wall.search')}'>
                    </div>

                    <div class='content_blacklist'></div>
                `

                function insert_profiles(items) {
                    const base = $('.content .content_blacklist')[0]
                    base.innerHTML = ''

                    items.forEach(item => {
                        let user = new User
                        user.hydrate(item)

                        base.insertAdjacentHTML('beforeend', `
                            <div class='content_blacklist_item'>
                                <div class='content_blacklist_item_info'>
                                    <div class='content_blacklist_item_avatar'>
                                        <a href='${user.getUrl()}'>
                                            <img class='outliner' src='${user.getAvatar(true)}'>
                                        </a>
                                    </div>
    
                                    <div class='content_blacklist_item_name'>
                                        <div class='user_info_with_name'>
                                            <a href='${user.getUrl()}' class='user_name ${user.isFriend() ? ' friended' : ''}'><b>${user.getFullName()}</b></a>
                                
                                            ${user.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                                            `<div class='image_status' data-id='${user.getId()}' title='${user.getImageStatus().name}'>
                                                <img src='${user.getImageStatusURL()}'>
                                            </div>` : ``}
                                        </div>
                                        <div>
                                            ${user.has('online') ? `<span>${user.getFullOnline()}</span> | ` : ''}
    
                                            <a data-ignore='1' href='#' id='_toggleBlacklist' data-addid='${user.getId()}' data-val='1'>${_('blacklist.remove_from_blacklist')}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `)
                    })
                }

                insert_profiles(list.profiles)

                $('.content_blacklist_search input[type=\'query\']').on('change', (e) => {
                    let query = e.target.value

                    if(query.length < 1) {
                        insert_profiles(window.black_list.profiles)
                        return
                    }
            
                    let arr = window.black_list.profiles.filter(obj => Utils.array_deep_search(obj, query));
                    if(arr && arr.length > 0) {
                        insert_profiles(arr)
                    } else {
                        return
                    }
                })

                break
            case 'privacy':
                $('.content')[0].innerHTML = `Not_done) :D`
                break
            case 'notifications':
                $('.content')[0].innerHTML = `Not_done) :D`
                break
        }

        $(`.tabs a[data-section=${section}]`).addClass('selected')
    }
}
