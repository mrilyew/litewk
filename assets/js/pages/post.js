window.page_class = new class {
    async render_page() {
        let id = window.s_url.searchParams.get('post')
        let splitted = id.split('_')

        if(!id || id == '0' || id.split(',').length > 1) {
            add_onpage_error(':(')
            return
        }

        // Drawing user page
        let info = null

        try {
            info = (await window.vk_api.call('wall.getById', {'posts': id, 'extended': 1})).response
        } catch(e) {}
        
        if(!info) {
            add_onpage_error(_('errors.post_not_found', id))
            return
        }

        let post = new Post(info.items[0], info.profiles, info.groups)
        let tabs = ['all', 'owner']
        let tabs_ = ''

        if(Number(splitted[0]) == window.active_account.vk_info.id) {
            tabs.push('others')
            tabs.push('archived')
        }

        document.title = _('wall.post')
        tabs.forEach(tab => {tabs_ += `<a href='site_pages/wall.html?id=${splitted[0]}&wall_section=${tab}'>${_(`wall.${tab}_posts`)}</a>`})

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper wall_wrapper'>
                    <div class='wall_wrapper_post'>
                        ${post.getTemplate({'hide_comments': 1})}
                    </div>
                    <div class='wall_wrapper_tabs bordered_block'>
                        ${tabs_}
                        <a href='site_pages/wall.html?id=${id}&wall_section=search'>${_(`wall.search_posts`)}</a>
                        <a data-ignore='1' class='selectd'>${_(`wall.post`)}</a>
                    </div>
                </div>
            `
        )
    }
}
