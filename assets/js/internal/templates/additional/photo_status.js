if(!window.templates) {
    window.templates = {}
}

window.templates.photo_status = (photos) => {
    if(!photos || !photos.items || photos.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_photoblock entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a>
            <b>${_('photos.photos')}</b>
            ${photos.count}
        </a>
    </div>

    <div id='entity_photoblock_insert'>`
    photos.items.forEach(photo => {
        let tmp_photo = new Photo
        tmp_photo.hydrate(photo)

        status += `
            <div class='entity_photoblock_image photo_viewer_open outliner' data-full='${tmp_photo.getFullSizeURL()}' style="background-image: url('${tmp_photo.getURL()}')"></div>
        `
    })

    status += '</div></div>'

    return status
}
