window.templates._photo_fullsize_attachment = (photo, additional) => {
    const size = photo.info.sizes[2]

    return `<img style='min-height:${size.height / 2}px;min-width:${size.width / 2}px' data-height='${size.height}' data-width='${size.width}' class='ordinary_attachment photo_attachment_big photo_attachment ${!additional.no_viewers ? 'photo_viewer_open' : ''} outliner' data-full='${photo.getFullSizeURL()}' loading='lazy' data-photoid='${photo.getId()}' src='${size.url}'>`
}
