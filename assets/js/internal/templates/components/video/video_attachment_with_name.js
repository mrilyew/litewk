window.templates.video_attachment_with_name = (video) => {
    const preview = video.getPreview(1)

    return `
    <div class='ordinary_attachment video_any_attachment video_attachment_viewer_open outliner video_attachment_big big_attachment' data-height='${preview.height ?? 0}' data-width='${preview.width ?? 0}' data-videoid='${video.getId()}'>
        <div class='video_preview_block'>
            <svg class='play_button' viewBox="0 0 61 74"><polygon class="cls-1" points="1.5 1.5 59.5 37.5 1.5 72.5 1.5 1.5"/></svg>

            <div class='time_block'>
                <span>${video.getDuration()}</span>
            </div>
            ${video.hasPreview() ? `<img loading='lazy' class='video_preview' src='${preview.url}'>` : ''}
        </div>
        <div class='video_attachment_info'>
            <b><a href='#video${video.getId()}'>${video.getTitle()}</a></b>
            <p>${_('videos.views_count', video.getViews())}</p>
        </div>
    </div>`
}
