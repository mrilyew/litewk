class RecommendedGroups extends Newsfeed {
    t_count = 0
    
    async nextPage() {
        let recoms = await window.vk_api.call(this.method_name, this.method_params)
        let templates = ''
        this.t_count += 10

        if(recoms.response.items.length < 1 || this.t_count > recoms.response.count) {
            $('.show_more').remove()
            return
        }

        recoms.response.items.forEach(obj => {
            let ob_j = new ClubListView
            ob_j.hydrate(obj.group)

            try {
                templates += ob_j.getTemplate()
            } catch(e) {
                templates += `
                    <div class='error_template bordered_block'>
                        <span>${_('errors.template_insert_failed', escape_html(e.message))}</span>
                    </div>
                `
            }
        })

        this.method_params.start_from = recoms.response.next_from

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.s_url.searchParams.set('start_hash', recoms.response.next_from)
            Utils.push_state(window.s_url)
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if(recoms.response.items.length > 8) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }
    }
}
