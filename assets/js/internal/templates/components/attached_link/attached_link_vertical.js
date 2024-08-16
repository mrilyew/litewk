window.templates.attached_link_vertical = (link) => {
    const photo = link.getPhoto()

    console.log(photo)
    return `
        <div class='list_attachment link_attachment link_attachment_vertical'>
            ${link.hasPhoto() ? `
            <div class='link_attachment_photo'>
                <img class='photo_attachment photo_viewer_open' loading='lazy' data-type='attached_link' data-full='${photo.getFullSizeURL()}' src='${photo.getURL()}'>
            </div>` : ''}

            <div class='link_attachment_info'>
                <a href='${link.getURL()}' target='_blank'><b>${link.getTitle()}</b></a>
                <a href='${link.getCaptionURL()}' target='_blank'><span>${link.getCaption()}</span></a>
            </div>

            <div class='link_attachment_actions'>
                <svg id='_toggleLinkFave' data-url='${link.getUnsafeURL()}' class='fave_tglike ${link.isFaved() ? 'faved' : ''}' viewBox="0 0 16.5 19.9"><polygon class="cls-1" points="0.5 0.5 0.5 18.5 7.84 9.5 16 18.5 16 0.5 0.5 0.5"/></svg>
            </div>
        </div>
    `
}
