window.pages['wall_page'] = new class {
    async render_page() {
        function __fallback() {
            main_class.addOnpageErrorWithTitle(_('user_page.info'), `
                <span>${_('errors.wall_not_found')}</span>
                <input type='button' id='__comeback' value='${_('messagebox.comeback')}'>
            `)
        }
        
        let owner_id = parseInt(window.main_class['hash_params'].owner_id)
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
        <div class='bordered_block layer_two_columns_up_panel wall_search_page' id='insert_paginator_here_bro'>
            <div></div>
        </div>
        `

        const section = window.main_url.getParam('section') ?? 'all'
        let owner_entity = null

        if(section == 'search') {
            sub_params = window.templates.search_posts_params(true)
            upper_panel = `
            <div class='flex_row flex_row_sticky flex_nowrap' id='_global_search' style='margin-bottom: 10px;'>
                <input type='text' placeholder='${_('search.search')}' value='${window.main_url.getParam('q', '')}'>
                <input type='button' style='margin-left: 5px;' value='${_('wall.search')}'>
            </div>
            `
        }

        if(!owner_id && isNaN(owner_id)) {
            __fallback()
            return
        }

        try {
            owner_entity = await Utils.getOwnerEntityById(owner_id)
        } catch(e) {
            __fallback()
        }

        const posts_count = (owner_entity.info.counters.posts ? owner_entity.info.counters.posts : (owner_entity.info.posts ? owner_entity.info.posts.count : 0))
        const tabs = Wall.getTabsByEntity(owner_entity)
        tabs.push('search')

        main_class.changeTitle(_('wall.wall_of_x', owner_entity.getFullNameCase('gen')))
        u('.page_content').html(window.templates.two_blocks_grid())
        u('.page_content .layer_two_columns_content').html(`
        <div class='layer_two_columns_content_wrapper'>
            ${upper_panel}

            <div class='wall_block_insert'></div>
        </div>
        `)

        u('.page_content .layer_two_columns_tabs').html(`
            ${window.templates.content_pages_owner(owner_entity, _('counters.posts_on_wall_count', posts_count))}
            ${window.templates.wall_tabs(owner_id, tabs, section)}

            ${sub_params}
        `)

        await Wall.fastWallCreate(owner_entity, false, false)

        try {
            console.log(window.main_classes['wall'].objects)
            if(window.main_classes['wall'].objects.pagesCount < 2) {
                u('.layer_two_columns_up_panel').remove()
            } else {
                if(section != 'search') {
                    u('.layer_two_columns_up_panel').append(window.templates.paginator(window.main_classes['wall'].getPagesCount(), (Number(window.main_classes['wall'].getPage() ?? 1))))
                }
            }
        } catch(e) {}
    }
    
    show_skeleton() {
        u('.page_content').html(`
        <div id='_skeleton' class='default_wrapper layer_two_columns'>
            <div class='layer_two_columns_content'>
                <div class='bordered_block layer_two_columns_up_panel wall_select_block' id='insert_paginator_here_bro'>
                    <span>...</span>
                </div>
                <div class='wall_block_insert'>
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                </div>
            </div>
            <div class='layer_two_columns_tabs bordered_block'>
                ${window.templates.content_pages_owner_skeleton()}
    
                <div class='filler empty_space' style='height: 100px;'></div>
            </div>
        </div>
        `)
    }

    execute_buttons() {
        u('.wall_search_page').on('change', `.wall_select_block input[type='query']`, (e) => {
            e.preventDefault()

            window.main_classes['wall'].objects.page = -1
            window.main_classes['wall'].error_empty_message = _('errors.search_wall_not_found')
            window.main_classes['wall'].search(e.target.value)
        })

        u('.wall_search_page').on('click', `.wall_select_block input[type='button']`, async (e) => {
            u(`.wall_search_page input[type='text']`).trigger('change')
        })
    }
}
