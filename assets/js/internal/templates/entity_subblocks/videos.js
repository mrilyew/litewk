if(!window.templates) {
    window.templates = {}
}

window.templates.videos_block = (items, link, ref = '') => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${_('videos.videos')}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list entity_albums'>`

    items.items.forEach(item => {
        let video = new Video
        video.hydrate(item)

        status += `
            <a data-ignore='1' class='video_item video_attachment_viewer_open' href='#video${video.getId()}' data-videoid='${video.getId()}'>
                <img src='${video.getPreview().url}' class='outliner'>

                <div class='small_video_info'>
                    <span class='title'>${video.getTitle()}</span>
                    <span class='size'>${video.getDuration()}</span>
                </div>
            </a>
        `
    })

    status += '</div></div>'

    return status
}
