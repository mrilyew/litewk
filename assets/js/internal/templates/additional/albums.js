if(!window.templates) {
    window.templates = {}
}

window.templates.albums = (items, link, ref = '') => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${_('photos.albums')}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list entity_albums'>`

    items.items.forEach(item => {
        let album = new Album
        album.hydrate(item)

        status += `
            <a class='album_item' href='#album${album.getId()}' data-back='${ref}'>
                <img src='${album.getThumbnail()}' class='outliner'>

                <div class='small_album_info'>
                    <span class='title'>${album.getTitle()}</span>
                    <span>${album.getSize()}</span>
                </div>
            </a>
        `
    })

    status += '</div></div>'

    return status
}
