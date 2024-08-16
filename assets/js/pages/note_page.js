window.pages['note_page']  = new class {
    async render_page() {
        document.title = _('notes.note')

        let owner_id = Number(window.main_class['hash_params'].owner)
        let item_id = Number(window.main_class['hash_params'].id)
        let note_api = await window.vk_api.call('notes.getById', {'owner_id': owner_id, 'note_id': item_id})
        let content_html = ``

        let note = new Note
        note.hydrate(note_api)

        if(!note_api) {
            main_class.add_onpage_error(_('errors.note_not_found'))
            return
        }

        document.title = note.getTitle()

        u('.page_content').append(`
            <div>
                ${note.getText()}
            </div>
        `
        )
    }
}
