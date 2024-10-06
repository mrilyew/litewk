class ClassicListView {
    constructor(object = {}) {
        this.setParams(object)
    }

    setParams(object = {}) {
        this.default_stats = {
            'count': object.presetCount ? object.presetCount : 0,
            'page': object.presetPage ? object.presetPage : 0,
            'pagesCount': object.presetPagesCount ? object.presetPagesCount : 0,
            'perPage': object.presetPerPage ? object.presetPerPage : window.consts.DEFAULT_COUNT,
            'offset': 0,
            'filled': false,
        }

        this.stats = Object.assign({}, this.default_stats)
        if(object.handler) {
            this.handler = object.handler
        }

        this.insertNodeText = object.insertNode
        this.inverse = false
        if(object.method_params) {
            this.method_params = object.method_params
        } else {
            if(!this.method_params) {
                this.method_params = {}
            }
        }

        this.insertNode().append(`<div class='listview_insert'></div>`)

        if(object.setPage) {
            this.setPage = object.setPage
        }
    }

    showSkeleton() {
        this.insertItemsNode().html(`<span id='_skeleton'>Loading...</span>`)
    }

    removeSkeleton() {
        this.insertItemsNode().find('#_skeleton').remove()
    }

    error(e) {
        this.insertItemsNode().html(`<span id='_error'>${e}</span>`)
    }

    noItemsError() {
        this.insertItemsNode().html(`
        <div class='bordered_block' id='_error'>
            <span>${_('errors.not_found_default')}</span>
        </div>`)
    }

    insertItems(items) {
        items.forEach(item => {
            try {
                this.insertItemsNode().append(item.getTemplate())
            } catch(e) {
                console.error(e)
                this.error(_('errors.template_insert_failed', Utils.escape_html(e.message)))
            }
        })
    }

    async getItems() {
        return {
            'count': 0,
            'items': [],
        }
    }

    hasNextPageButton() {
        return this.insertNode().find('.show_more').length > 0
    }

    createNextPageButton() {
        if(!this.hasNextPageButton()) {
            this.insertNode().append(`<div data-handler='${this.handler}' class='show_more'>${_('pagination.show_more')}</div>`)
            
            window.main_class.setupObservers()
            if(window.settings_manager.getItem('ux.auto_scroll').isChecked()) {
                window.show_more_observer.observe(u(`.show_more[data-handler='${this.handler}']`).nodes[0])
            }
        } else {
            this.insertNode(false).append(this.insertNode().find('.show_more').nodes[0])
        }
    }

    clear() {
        this.stats = Object.assign({}, this.default_stats)
        this.insertNode().html('')
        this.insertNode().append(`<div class='listview_insert'></div>`)
    }

    clearItems() {
        this.insertItemsNode().html('')
    }

    insertNode(umbrella = true) {
        if(typeof(this.insertNodeText) == 'string') {
            return umbrella ? u(this.insertNodeText) : document.querySelector(this.insertNodeText)
        }
        
        return this.insertNodeText
    }

    insertItemsNode(umbrella = true) {
        const node = this.insertNode(true).find('.listview_insert')
        if(umbrella) {
            return node
        } else {
            return node.nodes[0]
        }
    }

    setHandler(handler = 'wall') {
        this.handler = handler

        return handler
    }

    getHandler() {
        return this.handler
    }

    getPage() {
        return this.stats.page
    }

    getPagesCount() {
        return this.stats.pagesCount
    }

    getPerPage() {
        return this.stats.perPage
    }

    getCount() {
        return this.stats.count
    }

    isInversed() {
        return this.inverse == true
    }

    setInverse(is_inversed = false) {
        this.inverse = is_inversed
        if(!is_inversed) {
            this.stats.page = 0
        } else {
            this.stats.page = this.getPagesCount()
        }
    }

    toggleInverse() {
        if(this.inverse) {
            this.setInverse(false)
        } else {
            this.setInverse(true)
        }

        return this.inverse
    }

    async hydrateResult(api_result) {
        try {
            await this.setPage(0, api_result)
        } catch(e) {
            this.error(e)

            return
        }

        if(this.isNotLastPage()) {
            this.createNextPageButton()
        }
    }

    isNotLastPage() {
        if(!this.stats.filled) {
            return false
        }

        if(!this.isInversed()) {
            return this.getPage() + 1 <= this.getPagesCount()
        } else {
            return this.getPage() + 1 > 0
        }
    }

    isLastPage() {
        if(!this.stats.filled) {
            return false
        }

        if(!this.isInversed()) {
            return (this.getPage() + 1 > this.getPagesCount()) || this.getPagesCount() == 0
        } else {
            return this.getPage() < 0
        }
    }

    async nextPage() {
        if(this.insertItemsNode().html() == '') {
            this.showSkeleton()
        }

        if(this.isLastPage()) {
            console.info('Scroller | Last page reached.')
            this.insertNode().find('.show_more').remove()
            
            return
        }

        try {
            await this.setPage(this.getPage())
        } catch(e) {
            console.error(e)
            return
        }

        this.removeSkeleton()
        
        if(this.isNotLastPage()) {
            this.createNextPageButton()
        } else {
            this.insertNode().find('.show_more').remove()
        }

        window.main_class.undom()
    }

    async setPage(page_number = 0, hydrated_result = null) {
        if(page_number < 0) {
            page_number = 0
        }

        let api_result = null

        try {
            api_result = await this.getItems(hydrated_result)
        } catch(e) {
            this.error(e)
            return
        }

        if(!api_result.items) {
            throw new Error
        }

        let items = api_result.items
        const count = api_result.count
        this.updateCounters(count, Number(!this.isInversed() ? page_number + 1 : page_number - 1))

        if(this.isInversed()) {
            items = items.reverse()
        }

        if(this.getCount() < 1) {
            this.noItemsError()
        } else {
            this.insertItems(items)
        }

        this.saveProgress()
        this.updatePaginator()
    }

    saveProgress() {
        if(window.settings_manager.getItem('ux.save_scroll').isChecked()) {
            window.main_url.setParam('p', this.getPage())
            Utils.replace_state(window.main_url)
        }
    }

    updateCounters(new_count, new_page, new_per_page = null) {
        if(new_per_page) {
            this.stats.perPage = new_per_page
        }
        
        if(new_count) {
            this.stats.count = new_count
            this.stats.pagesCount = Math.ceil(this.stats.count / this.stats.perPage)
        }

        if(new_page != null) {
            this.stats.page = new_page
        }

        this.stats.filled = true
    }

    updatePaginator() {
        if(window.settings_manager.getItem('ux.update_paginators').isChecked()) {
            return
        }

        if(this.paginator_node) {
            const paginator_node = u(this.paginator_node)
            const parent = paginator_node.parent()
            paginator_node.remove()

            parent.append(window.templates.paginator(this.getPagesCount(), this.getPage() + 1))
        }
    }
}

class NextFromListView extends ClassicListView {
    getItems() {
        return {
            'count': 0,
            'items': [],
            'next_from': '--'
        }
    }

    async nextPage() {
        if(this.insertItemsNode().html() == '') {
            this.showSkeleton()
        }

        if(this.isLastPage()) {
            console.info('Scroller | Last page reached.')
            this.insertNode().find('.show_more').remove()
            
            return
        }

        try {
            let api_result = null
            try {
                api_result = await this.getItems()
            } catch(e) {
                this.error(e)
                return
            }

            if(!api_result.items) {
                throw new Error
            }

            let items = api_result.items
            const count = api_result.count
            this.updateCounters(count, this.getPage() + 1)
            this.method_params.next_from = api_result.next_from

            if(this.isInversed()) {
                items = items.reverse()
            }

            if(this.getCount() < 1) {
                this.noItemsError()
            } else {
                this.insertItems(items)
            }

            this.saveProgress()
            this.updatePaginator()
        } catch(e) {
            console.error(e)
            return
        }

        this.removeSkeleton()
        
        if(this.isNotLastPage()) {
            this.createNextPageButton()
        } else {
            this.insertNode().find('.show_more').remove()
        }

        window.main_class.undom()
    }

    clear() {
        delete this.method_params.start_from
        this.getInsertNode().innerHTML = ''
    }
}

class Wall extends ClassicListView {
    // гемор
    async getInverseCount() {
        const res = await this.getItems()

        this.updateCounters(res.count)
        this.stats.page = this.stats.pagesCount - 1
    }

    noItemsError() {
        switch(this.method_params.section) {
            case 'all':
                this.insertItemsNode().html(`
                <div class='bordered_block' id='_error'>
                    <span>${_('errors.wall_empty_posts')}</span>
                </div>`)
                break
            default:
                this.insertItemsNode().html(`
                <div class='bordered_block' id='_error'>
                    <span>${_('errors.tab_empty_posts')}</span>
                </div>`)
                break
        }

    }

    showSkeleton() {
        this.insertItemsNode().html(window.templates.wall_skeleton())
    }

    async nextPage()
    {
        if(this.isInversed()) {
            if(!this.stats.filled) {
                await this.getInverseCount()
            }
        }
        
        await super.nextPage()
    }

    async getItems(pre_result = null) {
        const result_array = []
        let method = 'wall.get'
        const params = {'owner_id': this.method_params.owner_id, 'count': this.stats.perPage, 'extended': 1, 'fields': window.consts.TYPICAL_USERS_GROUPS_FIELDS}
        params.offset = (this.getPage() * this.getPerPage())

        if(this.method_params.section) {
            switch(this.method_params.section) {
                default:
                    params.filter = this.method_params.section
                    break
                case 'search':
                    method = 'wall.search'
                    params.query = this.method_params.q
                    params.count = 100

                    break
            }
        }

        let api_result = null
        if(pre_result) {
            api_result = pre_result
        } else {
            api_result = await window.vk_api.call(method, params)
        }

        api_result.items.forEach(item => {
            const post = new Post
            post.hydrate(item, api_result.profiles, api_result.groups, api_result.reaction_sets)

            result_array.push(post)
        })

        return {
            'count': api_result.count,
            'items': result_array,
        }
    }

    setSection(section) {
        this.method_params.section = section
    }

    async search(query = '') 
    {
        this.method_params.q = query
        this.method_params = Utils.applyPostsSearchParams(window.main_url, this.method_params)

        window.main_url.setParam('section', 'search')
        window.main_url.setParam('q', query ?? '')

        Utils.replace_state(window.main_url)
        this.updateCounters(1000, 0, 1000)

        this.setSection('search')
        this.clear()

        await this.nextPage()
    }

    static getTabsByEntity(entity) {
        const wall_sections = ['all', 'owner']

        if(entity.getRealId() > 0) {
            if(entity.isThisUser()) {
                wall_sections.push('others')
                wall_sections.push('archived')
            } else if(entity.canSeeAllPosts()) {
                wall_sections.push('others')
            }
        } else {
            if(entity.isAdmin()) {
                wall_sections.push('suggests')
                wall_sections.push('postponed')
            }

            if(entity.info.can_suggest == 1) {
                wall_sections.push('suggests')
            }
        }

        return wall_sections
    }

    static async create(entity, process_tabs = true, hydrate = true) {
        let wall_temp = main_url.getParam('section') ?? 'all'
        const wall_sections = Wall.getTabsByEntity(entity)

        if(!main_url.getParams('section')) {
            wall_temp = entity.info.wall_default
        }

        const wall_section = wall_temp && wall_sections.includes(wall_temp) ? wall_temp : 'all'
        const wall_invert  = main_url.getParam('invert') == '1'
        if(process_tabs) {
            u('.wall_inserter').append(window.templates.wall(entity.getRealId(), wall_sections, wall_section, wall_invert))
        }

        // Creating wall as object
        window.main_classes['wall'] = new Wall({
            'insertNode': '.wall_block_insert', 
            'handler': 'wall',
            'presetPage': main_url.hasParam('p') ? Number(main_url.getParam('p')) : null,
            'method_params': {
                'owner_id': entity.getRealId(),
                'section': wall_section,
            }
        })
        if(entity.info.counters && hydrate && wall_section == 'all') {
            window.main_classes['wall'].updateCounters(entity.info.counters.posts)
        }

        window.main_classes['wall'].setInverse(wall_invert)

        if(wall_temp != 'search') {
            if(entity.info.posts && hydrate && window.main_classes['wall'].getPage() < 2 && wall_section == 'all') {
                await window.main_classes['wall'].hydrateResult(entity.info.posts)
            } else {
                await window.main_classes['wall'].nextPage()
            }
            
            return
        }

        u('.wall_block .searchIcon').trigger('click')
        u(`.wall_block input[type='search']`).attr('value', main_url.getParam('q'))

        await window.main_classes['wall'].search(main_url.getParam('q'))
    }
}

class Subscriptions extends ClassicListView {
    async getItems(pre_result = null) {
        const result_array = []
        let method = 'users.getSubscriptions'
        const params = {'user_id': this.method_params.owner_id, 'count': this.stats.perPage, 'extended': 1, 'fields': window.consts.TYPICAL_USERS_GROUPS_FIELDS}
        params.offset = (this.getPage() * this.getPerPage())

        let api_result = null
        if(pre_result) {
            api_result = pre_result
        } else {
            api_result = await window.vk_api.call(method, params)
        }

        api_result.items.forEach(item => {
            let entity = null
            if(item.type != 'page' && item.type != 'group' && item.type != 'event' && item.type != 'public') {
                entity = new User
            } else {
                entity = new Club
            }
    
            entity.hydrate(item)
            result_array.push(entity)
        })

        return {
            'count': api_result.count,
            'items': result_array,
        }
    }

    insertItems(items) {
        items.forEach(item => {
            try {
                this.insertItemsNode().append(window.templates._subs_listview(item))
            } catch(e) {
                console.error(e)
                this.error(_('errors.template_insert_failed', Utils.escape_html(e.message)))
            }
        })
    }
}

class Comments extends ClassicListView {
    changeSort(sort) {
        this.method_params.sort = sort
    }

    getEntity() {
        return this.method_params.entity
    }

    async getItems(pre_result = null) {
        const entity = this.getEntity()
        const result_array = []
        const params = {}
        let method = 'wall.getComments'
        switch(entity._getInternalType()) {
            case 'post':
                params.owner_id = entity.getWallId()
                params.post_id = entity.getCorrectID()

                break
            case 'photo':
                method = 'photos.getComments'
                break
            case 'video':
                method = 'video.getComments'
                break
        }

        params.offset = (this.getPage() * this.getPerPage())
        if(this.method_params.sort) {
            params.sort = this.method_params.sort
        }
        params.need_likes = 1
        params.extended = 1
        params.fields = window.consts.TYPICAL_USERS_GROUPS_FIELDS
        params.thread_items_count = window.consts.THREADS_ITEMS_COUNT

        let api_result = null
        if(pre_result) {
            api_result = pre_result
        } else {
            api_result = await window.vk_api.call(method, params)
        }

        api_result.items.forEach(item => {
            const comment = new Comment
            comment.hydrate(item, api_result.profiles, api_result.groups, api_result.reaction_sets)

            result_array.push(comment)
        })

        return {
            'count': api_result.count,
            'items': result_array,
            'current_level_count': api_result.current_level_count,
            'can_post': api_result.can_post,
            'groups_can_post': api_result.groups_can_post,
            'show_reply_button': api_result.show_reply_button,
        }
    }

    static create(entity, node = '#comms') {
        const handler = 'comms_' + entity._getInternalType() + '_' + entity.getId()
        window.main_classes[handler] = new Comments({
            'insertNode': node, 
            'handler': handler,
            'method_params': {
                'entity': entity,
                'sort': window.settings_manager.getItem('ux.default_sort').getValue(),
            }
        })

        if(main_url.hasParam('p')) {
            window.main_classes[handler].updateCounters(null, Number(main_url.getParam('p')))
        }

        window.main_classes[handler].nextPage()

        return handler
    }
}
/*

class Notifications extends ClassicListView {
    constructor(insert_node, error_message = 'No_count)') {
        super(null, insert_node, error_message)
        this.insert_node = insert_node
        this.profiles = []
        this.groups = []
        this.photos = []
        this.videos = []
        this.apps = []
        this.notifications = []
    }

    async nextPage() {
        let api_result = null
        let templates = document.createElement('div') 
        templates.innerHTML = `
            <div id='not_viewed'>
            
            </div>
            <div id='viewed_mark' style='display:none;'>
                <b>${_('notifications.viewed')}</b>
            </div>
        `

        let error = (text) => {
            text = text ? text : api_result.error.error_msg
            this.getInsertNode().insertAdjacentHTML('beforeend', _('errors.error_getting_notifs', text))

        }

        try {
            api_result = await window.vk_api.call(this.method_name, this.method_params)

            if(api_result.items.length < 1) {
                error(this.error.error_message)

                return
            }

            if(!api_result.photos) {
                error(_('errors.notifications_old_error'))

                return
            }

            this.profiles = api_result.profiles
            this.groups = api_result.groups
            this.photos = api_result.photos
            this.videos = api_result.videos
            this.apps = api_result.apps

            api_result.items.forEach(item => {
                const notif = new ApiNotification(item)
                const is_not_viewed = api_result.last_viewed < item.date
                this.notifications.push(notif)

                try {
                    if(!is_not_viewed) {
                        templates.insertAdjacentHTML('beforeend', notif.getTemplate())
                    } else {
                        templates.querySelector('#not_viewed').insertAdjacentHTML('beforeend', notif.getTemplate())
                        templates.querySelector('#viewed_mark').style.display = 'block'
                    }
                } catch(e) {
                    console.error(e)
                    templates += _('errors.error_getting_news', e)
                    error(e)
                }
                
            })
        } catch(e) {
            console.error(e)
            error()
        }

        this.method_params.start_from = api_result.next_from

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.main_url.setParam('start_hash', api_result.next_from)
            Utils.push_state(window.main_url)
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates.innerHTML)
        if(api_result.next_from) {
            this.createNextPage()
        } else {
            u('.show_more').remove()
        }
    }

    clear() {
        delete this.method_params.start_from
        this.getInsertNode().innerHTML = ''
    }
}

class Friends extends ClassicListView {
    async page(number = 0)
    {
        if(number < 0) {
            number = 0
        }
        
        let objects_data = null
        this.method_params.offset = number * this.objects.perPage + (this.objects.special_offset ?? 0)

        let error = () => {
            this.objects.count = 0
            this.objects.pagesCount = 0

            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_wall', objects_data.error.error_msg ? objects_data.error.error_msg : 'unknown error :( maybe timeout')}</div>
            `)
        }

        try {
            objects_data = await window.vk_api.call(this.method_name, this.method_params, false)

            if(!objects_data.response) {
                objects_data.response = {}
                objects_data.count = 0
            }
        } catch(e) {
            error()
            return
        }

        let items  = objects_data.response.items
        let count  = objects_data.response.count
        let error_message = ''

        switch(this.method_name) {
            default:
                break
            case 'friends.get':
                if(this.method_params.list_id) {
                    error_message = _('errors.friends_list_error')
                } else {
                    error_message = _('errors.friends_get_error')
                }
                
                break
            case 'friends.getOnline':
                error_message = _('errors.friends_get_online_error')

                count = objects_data.response.total_count
                items = objects_data.response.online
                break
            case 'friends.search':
                error_message = _('errors.friends_search_error')

                break
            case 'friends.getRequests':
                if(this.method_params.out == 0) {
                    error_message = _('errors.friends_incoming_error')
                } else {
                    error_message = _('errors.friends_outcoming_error')
                }

                break
            case 'friends.getSuggestions':
                error_message = _('errors.friends_suggestions_error')

                break
            case 'users.getFollowers':
                error_message = _('errors.friends_followers_error')

                break
            case 'execute':
                error_message = _('errors.friends_mutual_error')

                break
        }
        this.objects.count = count

        if(objects_data.error) {
            error()
            return
        }

        if(this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                ${error_message}
            `)
        }

        this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        let templates = ''

        if(items) {
            items.forEach(obj => {
                let ob_j = new this.object_class
                ob_j.hydrate(obj, objects_data.response.profiles, objects_data.response.groups)

                try {
                    templates += ob_j.getTemplate()
                } catch(e) {
                    console.error(e)
    
                    templates += `
                        <div class='error_template bordered_block'>
                            <span>${_('errors.template_insert_failed', Utils.escape_html(e.message))}</span>
                        </div>
                    `
                }
            })
        }

        this.objects.page = Number(number) + 1
        this.getInsertNode().insertAdjacentHTML('beforeend', templates)
        this.updatePaginator()
    }
}

class Search extends ClassicListView {
    constructor(object_class, insert_node) {
        super(object_class, insert_node, _('errors.search_not_found'))
    }

    async page(number = 0)
    {
        if(number < 0) {
            number = 0
        }
        
        let api_result = null
        this.method_params.offset = number * this.objects.perPage + (this.objects.special_offset ?? 0)

        let error = () => {
            this.objects.count = 0
            this.objects.pagesCount = 0

            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_wall', api_result.error.error_msg ? api_result.error.error_msg : 'unknown error :( maybe timeout')}</div>
            `)
        }

        try {
            api_result = await window.vk_api.call(this.method_name, this.method_params, false)

            if(!api_result.response) {
                api_result.response = {}
                api_result.count = 0
            }
        } catch(e) {
            error()
            return
        }

        let items = api_result.response.items
        let count = api_result.response.count
        this.objects.count = count

        if(api_result.error) {
            error()
            return
        }

        if(this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${this.error_empty_message}</div>
            `)
        }

        this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        let templates = ''

        if(items) {
            items.forEach(obj => {
                let ob_j = new this.object_class
                ob_j.hydrate(obj, api_result.response.profiles, api_result.response.groups)

                try {
                    templates += ob_j.getTemplate({'tags_to': 1})
                } catch(e) {
                    console.error(e)
    
                    templates += `
                        <div class='error_template bordered_block'>
                            <span>${_('errors.template_insert_failed', Utils.escape_html(e.message))}</span>
                        </div>
                    `
                }
            })
        }

        this.objects.page = Number(number) + 1
        this.getInsertNode().insertAdjacentHTML('beforeend', templates)
        this.updatePaginator()
    }
}
*/
