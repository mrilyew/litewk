window.templates._photo_mini_attachment = (photo, additional) => {
    return `<img data-height='${photo.info.sizes[2].height}' data-width='${photo.info.sizes[2].width}' class='ordinary_attachment photo_attachment photo_viewer_open outliner' loading='lazy' data-full='${photo.getFullSizeURL()}' data-photoid='${photo.getId()}' src='${photo.getURL()}'>`
}
