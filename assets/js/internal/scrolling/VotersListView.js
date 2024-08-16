class VotersListView extends ClassicListView {
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
                this.causeError(e.getMessage())
    
                return
            }
        } else {
            api_result = hydrated_result
        }

        if(this.inverse) {
            api_result.response.items = api_result.response[0].users.items.reverse()
        }

        const items  = api_result.response[0].users.items

        if(api_result.error) {
            this.causeError(api_result.error.error_msg)

            return
        }
        
        this.updateCounters(api_result.response[0].users.count, page_number)

        if(this.getCount() < 1) {
            this.causeEmptyError()
        }

        if(items) {
            this.insertItems(items, api_result.response.profiles, api_result.response.groups)
        }

        this.saveProgress()
        this.updatePaginator()
    }
}
