window.page_class = new class {
    async render_page() {
        let id = window.s_url.searchParams.get('id')
        if(id == 0 || id == null) {
            id = window.active_account.vk_info.id
        }

        // Drawing user page
        let info = (await window.vk_api.call('users.get', {'user_ids': id, 'fields': 'about,activities,bdate,blacklisted,blacklisted_by_me,books,can_see_all_posts,career,city,common_count,connections,contacts,counters,country,cover,crop_photo,domain,education,exports,followers_count,friend_status,games,has_photo,has_mobile,has_mail,house,home_town,interests,is_subscribed,is_no_index,is_favorite,is_friend,image_status,is_hidden_from_feed,is_verified,last_seen,maiden_name,movies,music,military,nickname,online,occupation,personal,photo_200,photo_50,quotes,relatives,relation,schools,sex,site,status,tv,universities,verified,wall_default'})).response[0]
        if(!info) {
            add_onpage_error(_('errors.profile_not_found', id))
            return
        }
    
        let user = new User(info)
        document.title = escape_html(user.getName())

        $('.page_content')[0].insertAdjacentHTML('beforeend', await user.getTemplate())
    
        // Drawing wall
        if(user.hasAccess() && !user.isDeactivated()) {
            // Wall sections
            let wall_sections = ['all', 'owner']
            
            if(user.isThisUser()) {
                wall_sections.push('others')
                wall_sections.push('archived')
            }

            let wall_temp = window.s_url.searchParams.get('wall_section') ?? 'all'
            let wall_section = wall_temp && wall_sections.includes(wall_temp) ? wall_temp : 'all' // Wall active section

            // Get wall template
            let wall_template_ = await wall_template(user.getId(), wall_sections, wall_section)
            
            // Inserting wall
            $('.user_page_wrapper')[0].insertAdjacentHTML('beforeend', wall_template_)
            $(`.wall_block a[data-section='${wall_section}']`).addClass('selectd')

            // Creating wall as object
            let wall_params   = {'owner_id': user.getId(), 'extended': 1, 'count': 10, 'filter': wall_sections.includes(wall_section) ? wall_section : 'all'}
            window.wall = new ClassicListView(post_template, $('.user_page_wrapper .wall_block .wall_block_insert')[0])
            window.wall.setParams('wall.get', wall_params, window.s_url.searchParams.get('wall_invert') == 'yes')
            
            if(window.s_url.searchParams.has('page')) {
                window.wall.objects.page = Number(window.s_url.searchParams.get('page'))
            }

            if(wall_temp != 'search') {
                window.wall.clear()
                await window.wall.nextPage()
            } else {
                // Reactjsing
                $('.wall_block .searchIcon').trigger('click')
                $(`.wall_block input[type='query']`)[0].value = window.s_url.searchParams.get('wall_query')
                await window.wall.search(window.s_url.searchParams.get('wall_query'))
            }
        }
    }
}
