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

        switch(this.method_name) {
            default:
                break
            case 'friends.getOnline':
                count = objects_data.response.total_count
                items = objects_data.response.online
                break
        }
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
}