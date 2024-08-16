class RecommendedGroups extends Newsfeed {
    t_count = 0
    
    async nextPage() {
        let recoms = await window.vk_api.call(this.method_name, this.method_params)
        let templates = ''
        this.t_count += 10

        if(recoms.items.length < 1 || this.t_count > recoms.count) {
            $('.show_more').remove()
            return
        }

        recoms.items.forEach(obj => {
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

        this.method_params.start_from = recoms.next_from

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if(recoms.items.length > 8) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }
    }
}
