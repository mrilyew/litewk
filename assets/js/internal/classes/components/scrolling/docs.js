class Docs extends ClassicListView {
    constructor(insert_node)
    {
        super(null, insert_node)
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
                <div class='bordered_block error_block'>${_('errors.error_getting_wall', objects_data.error.error_msg ? objects_data.error.error_msg : 'unknown error :( maybe timeout')}</div>
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
            return 'fatal'
        }

        let items  = objects_data.response.items
        let count  = objects_data.response.count
        this.objects.count = count

        if(items.length < 10) {
            this.objects.pagesCount = number + 1
        } else {
            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        }
        
        this.objects.page = Number(number) + 1

        if(objects_data.error) {
            error()
            return 'fatal'
        }

        if(this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block error_block'>${_('errors.docs_not_found')}</div>
            `)

            this.pagesCount = 0
            return 'error'
        }

        let templates = ''
        
        if(items) {
            items.forEach(obj => {
                let ob_j = new Doc
                ob_j.hydrate(obj)

                templates += ob_j.getTemplate()
            })
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)
        this.updatePaginator()

        return 'success'
    }

    async nextPage()
    {
        let resulter = null

        if(this.objects.pagesCount < this.objects.page + 1) {
            console.info('Last page reached. Do not care.')

            $('.show_more').remove()
            return
        }

        if(this.objects.page == -1) {
            this.objects.page = 0
        }

        try {
            resulter = await this.page(this.objects.page)
        } catch(e) {
            console.error(e)
        }

        let page_condition = this.objects.pagesCount > this.objects.page

        if(page_condition) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.main_url.setParam('page', this.objects.page)
            history.pushState({}, '', window.main_url)
        }

        return resulter
    }
}
