window.templates.album_as_attachment = (album) => {
    return `
        <a href='#album${album.getId()}' class='list_attachment album_attachment' style='background-image: url(${album.getThumbnailURL()})'}>
            <div class='album_attachment_info'>
                <div class='album_attachment_info_bottom'>
                    <span>${_('photos.album')} • </span>
                    <span>${_('counters.photos_count', album.getSize())}</span>
                </div>
                <div class='album_attachment_info_upper flex_column'>
                    <h3>${album.getTitle()}</h3>
                    ${album.has('description') ? `<span>${album.getDescription().circum(100)}</span>` : ''}
                </div>
            </div>
        </a>
    `
}
