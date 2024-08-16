window.templates.attached_link_playlist = (link) => {
    const photo = link.getPhoto()

    return `
    <div class='list_attachment link_attachment_normal margined link_playlist link_attachment'>
        <div class='link_attachment_photo'>
            ${link.hasPhoto() ? `<img class='photo_attachment photo_viewer_open' loading='lazy' data-type='attached_link' data-full='${photo.getFullSizeURL()}' src='${photo.getURL()}'>` : ''}
            <svg id='_toggleLinkFave' data-url='${link.getUnsafeURL()}' class='fave_tglike ${link.isFaved() ? 'faved' : ''}' viewBox="0 0 16.5 19.9"><polygon class="cls-1" points="0.5 0.5 0.5 18.5 7.84 9.5 16 18.5 16 0.5 0.5 0.5"/></svg>
        
            <div class='link_attachment_info_title_absoluter flex_column'>
                <a href='${link.getURL()}' title='${link.getTitle()}' target='_blank'><b>${link.getTitle().circum(50)}</b></a>
                <span>${link.getDescription()}</span>
            </div>
        </div>
    </div>
    `
}
