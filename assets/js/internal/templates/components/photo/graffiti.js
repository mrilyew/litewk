window.templates.photo_graffiti = (graffiti) => {
    return `<img class='ordinary_attachment photo_attachment photo_viewer_open outliner' loading='lazy' style='width: 40%;' data-type='graffiti' data-full='${graffiti.getURL()}' src='${graffiti.getURL()}'>`
}
