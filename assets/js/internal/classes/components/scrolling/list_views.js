class ClassicListView {
    constructor(object_class, insert_node)
    {
        this.objects = {
            'count': null,
            'page': -1,
            'pagesCount': null,
            'perPage': 10
        }

        this.object_class = object_class
        this.insert_node  = insert_node
    }

    setParams(method_name, method_params) 
    {
        this.method_name       = method_name
        this.method_params     = method_params
        this.objects.perPage   = method_params.count ?? 10
        method_params.count    = this.objects.perPage ?? 10
    }

    getInsertNode() {
        if(typeof(this.insert_node) == 'string') {
            return document.querySelector(this.insert_node)
        } else {
            return this.insert_node
        }
    }

    createNextPage() {
        if(!$('.show_more')[0]) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `<div class='show_more'>${_('pagination.show_more')}</div>`)
            
            if(window.site_params.get('ux.auto_scroll', '1') == '1') {
                main_class.init_observers()
            }
        } else {
            this.getInsertNode().append($('.show_more')[0])
        }
    }

    async nextPage()
    {
        let page_condition = false
        if(this.objects.pagesCount < this.objects.page + 1) {
            console.info('Last page reached. Do not care.')
            $('.show_more').remove()
            return
        }

        if(this.objects.page == -1) {
            this.objects.page = 0
        }

        try {
            await this.page(this.objects.page)
        } catch(e) {
            console.error(e)

            return 'ERR'
        }
        
        page_condition = this.objects.pagesCount > this.objects.page

        if(page_condition) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.main_url.searchParams.set('page', this.objects.page)
            history.pushState({}, '', window.main_url)
        }
    }

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
        this.objects.count = count

        if(objects_data.error) {
            error()
            return
        }

        if(this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>No_count)</div>
            `)
        }

        this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        let templates = ''

        if(items) {
            items.forEach(obj => {
                console.log(obj)
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

        if($('.paginator')[0]) {
            let parent = $('.paginator')[0].parentNode
            $('.paginator').remove()

            parent.insertAdjacentHTML('beforeend', window.templates.paginator(this.objects.pagesCount, number + 1))
        }
    }

    clear()
    {
        this.method_params.offset = 0
        this.objects.count = null
        this.objects.pagesCount = 10000

        this.getInsertNode().innerHTML = ''
    }
}
