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
