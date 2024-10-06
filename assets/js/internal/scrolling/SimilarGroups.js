class SimilarGroups extends NextFromListView {
    async getItems(pre_result = null) {
        const result_array = []
        let method = 'groups.getSuggestions'
        const params = {'group_id': this.method_params.club_id, 'count': this.stats.perPage, 'fields': window.consts.TYPICAL_GROUPS_FIELDS}

        let api_result = null
        if(pre_result) {
            api_result = pre_result
        } else {
            api_result = await window.vk_api.call(method, params)
        }

        api_result.items.forEach(item => {
            const club = new Club
            club.hydrate(item.group)

            result_array.push(club)
        })

        return {
            'count': api_result.count,
            'items': result_array,
            'next_from': api_result.next_from,
        }
    }

    insertItems(items) {
        items.forEach(item => {
            try {
                this.insertItemsNode().append(item.getCarouselTemplate())
            } catch(e) {
                console.error(e)
                this.error(_('errors.template_insert_failed', Utils.escape_html(e.message)))
            }
        })
    }
}
