window.pages['photo_page'] = new class {
    async render_page() {
        main_class.changeTitle(_('photos.photo'))

        const owner_id = Number(window.main_class['hash_params'].owner)
        const item_id = Number(window.main_class['hash_params'].id)

        const photo = new Photo
        try {
            await photo.fromId(owner_id, item_id)
        } catch(e) {
            main_class.addErrorWithBackButton(_('errors.photo_not_found'))
            return
        }
        
        if(!photo || !photo.info) {
            main_class.addErrorWithBackButton(_('errors.photo_not_found'))
            return
        }

        main_class.changeTitle(_('photos.photo_from', photo.getDateForTitle()))

        u('.page_content').html(`
            <div class='default_wrapper photo_page_wrapper'>
                <div class='photo_page_block'>
                    <img src='${photo.getFullSizeURL()}'>
                </div>

                <div class='photo_page_info'>
                    <div class='photo_page_description bordered_block'>
                        ${photo.hasDescription() ? `<span>${photo.getDescription()}</span>` : ''}
                    </div>

                    <div class='layer_two_columns'>
                        <div id='_commsInsert'></div>

                        <div class='bordered_block photo_page_subinfo'>

                        </div>
                    </div>
                </div>
            </div>
        `)

        const comment_sort = window.main_url.getParam('comment_sort') && ['asc', 'desc'].indexOf(window.main_url.getParam('comment_sort')) != -1 ? window.main_url.getParam('comment_sort') : window.site_params.get('ux.default_sort', 'asc')
        window.main_classes['wall'] = Comments.fastCreate('photos.getComments', {'owner_id': photo.getOwnerID(), 'photo_id': photo.getCorrectID(), 'need_likes': 1, 'extended': 1, 'fields': window.consts.TYPICAL_FIELDS + ',' + window.consts.TYPICAL_GROUPS_FIELDS, 'sort': comment_sort}, '#_commsInsert')
        await window.main_classes['wall'].nextPage()
    }
}