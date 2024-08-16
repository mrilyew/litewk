class ClassicListView {
    constructor(object_class, insert_node, error_empty_message = 'No_count)', skeleton = null)
    {
        this.objects = {
            'count': null,
            'page': -1,
            'pagesCount': null,
            'perPage': window.consts.DEFAULT_COUNT
        }

        this.object_class  = object_class
        this.insert_node   = insert_node
        this.error_empty_message = error_empty_message
        this.skeleton = skeleton
        this.handler = 'wall'
    }

    setHandler(handler = 'wall') {
        this.handler = handler
    }

    showSkeleton() {
        if(!this.skeleton) {
            return
        }

        this.getInsertNode().innerHTML = this.skeleton()
    }

    removeSkeleton() {
        u(this.getInsertNode().querySelectorAll('#_skeleton')).remove()
    }

    hydrateFirstPage(api_result) {
        this.page(0, {'response': api_result})

        if(this.getPagesCount() > this.getPage()) {
            this.createNextPage()
        }

        return
    }

    updateCounters(count = null, page = null) {
        if(count) {
            this.objects.count = count
            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        }
        
        if(this.inverse) {
            if(!page) {
                this.objects.page = this.objects.pagesCount - 1
            } else {
                this.objects.page = page - 1
            }
        } else {
            this.objects.page = page + 1
        }
    }

    setParams(method_name, method_params) 
    {
        this.method_name       = method_name
        this.method_params     = method_params
        this.objects.perPage   = method_params.count ?? window.consts.DEFAULT_COUNT
        method_params.count    = this.objects.perPage ?? window.consts.DEFAULT_COUNT
    }

    toggleInverse(inverse = false) 
    {
        this.method_params.offset = 0

        if(!inverse) {
            this.objects.page = -1
        } else {
            this.objects.page = this.getPagesCount()
        }


        this.inverse = inverse
    }

    getInsertNode() {
        if(typeof(this.insert_node) == 'string') {
            return document.querySelector(this.insert_node)
        }
            
        return this.insert_node
    }
    
    getCount() {
        return this.objects.count
    }

    getPage() {
        return this.objects.page
    }

    setPage(page) {
        return this.objects.page = Number(page) - 1
    }

    getPagesCount() {
        return this.objects.pagesCount
    }

    createNextPage() {
        if(!u('.show_more').nodes[0]) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `<div data-handler='${this.handler}' class='show_more'>${_('pagination.show_more')}</div>`)
            
            if(window.site_params.get('ux.auto_scroll', '1') == '1') {
                main_class.setupObservers()
            }
        } else {
            this.getInsertNode().append(u('.show_more').nodes[0])
        }
    }

    async nextPage()
    {
        if(this.getInsertNode().innerHTML == '') {
            this.showSkeleton()
        }

        let page_condition = this.getPagesCount() >= this.getPage()
        let last_condition = (this.getPage() + 1 > this.getPagesCount()) || this.getPagesCount() == 0
        let error_count    = this.getCount() < 1
        let resulter = null

        if(this.inverse) {
            page_condition = this.getPage() >= 0
            last_condition = this.getPage() <= 0
        }

        if(this.getPage() == -1) {
            this.objects.page = 0
        }

        if(last_condition) {
            console.info('Last page reached.')
            u('.show_more').remove()
            
            if(error_count) {
                //this.causeError(this.error_empty_message)
            }

            return
        }

        try {
            resulter = await this.page(this.getPage())
        } catch(e) {
            console.error(e)

            return
        }

        this.removeSkeleton()

        if(page_condition) {
            this.createNextPage()
        } else {
            u('.show_more').remove()
        }

        SavedPage.save()
        return resulter
    }

    causeEmptyError() {
        this.causeError(this.error_empty_message)
    }

    causeError(text) {
        this.objects.count = 0
        this.objects.pagesCount = 0

        this.getInsertNode().insertAdjacentHTML('beforeend', `
            <div class='error_template bordered_block'>${text}</div>
        `)
    }

    insertItems(items, profiles, groups) {
        if(window.site_params.get('ux.previous_page_deletion', '0') == '0') {
            items.forEach(item => {
                const item_class = new this.object_class
                item_class.hydrate(item, profiles, groups)
    
                try {
                    this.getInsertNode().insertAdjacentHTML('beforeend', item_class.getTemplate())
                } catch(e) {
                    console.error(e)
    
                    this.causeError(_('errors.template_insert_failed', Utils.escape_html(e.message)))
                }
            })
        } else {
            let whole_html = `<div class='scrollPage' id='_scrollpage${this.getPage()}'>`
            items.forEach(item => {
                const item_class = new this.object_class
                item_class.hydrate(item, profiles, groups)
    
                try {
                    whole_html += item_class.getTemplate()
                } catch(e) {
                    console.error(e)
    
                    this.causeError(_('errors.template_insert_failed', Utils.escape_html(e.message)))
                }
            })

            whole_html += `</div>`
            
            this.getInsertNode().insertAdjacentHTML('beforeend', whole_html)

            const scrollPages = u('.scrollPage').length
            if(scrollPages > 3) {
                u('.scrollPage').nodes[0].remove()
                u('.scrollPage').children().nodes[9].scrollIntoView()
            }
        }
    }

    async page(page_number = 0, hydrated_result = null)
    {
        if(page_number < 0) {
            page_number = 0
        }
        
        let api_result = null
        this.method_params.offset = (page_number * this.objects.perPage)

        if(!hydrated_result) {
            try {
                api_result = await window.vk_api.call(this.method_name, this.method_params, false)
    
                if(!api_result.response) {
                    api_result.response = {}
                    api_result.count = 0
                }
            } catch(e) {
                this.causeError(e.message)
    
                return
            }
        } else {
            api_result = hydrated_result
        }

        if(this.inverse) {
            api_result.response.items = api_result.response.items.reverse()
        }

        const items  = api_result.response.items

        if(api_result.error) {
            this.causeError(api_result.error.error_msg)

            return
        }
        
        this.updateCounters(api_result.response.count, page_number)

        if(this.getCount() < 1) {
            this.causeEmptyError()
        }

        if(items) {
            this.insertItems(items, api_result.response.profiles, api_result.response.groups)
        }

        this.saveProgress()
        this.updatePaginator()

        return api_result
    }

    clear() {
        this.method_params.offset = 0
        this.objects.count = null
        this.objects.pagesCount = 10000
        this.objects.page = -1

        this.getInsertNode().innerHTML = ''
    }

    saveProgress() {
        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.main_url.setParam('page', this.getPage())
            Utils.replace_state(window.main_url)
        }
    }
    
    updatePaginator() {
        if(window.site_params.get('ux.update_paginators', '0') == '0') {
            return
        }

        if(u('.paginator').nodes[0]) {
            const parent = u('.paginator').nodes[0].parentNode
            u('.paginator').remove()

            parent.insertAdjacentHTML('beforeend', window.templates.paginator(this.getPagesCount(), this.getPage() + 1))
        }
    }
}
