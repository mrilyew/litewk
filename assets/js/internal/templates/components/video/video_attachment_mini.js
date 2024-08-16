window.templates.video_attachment_mini = (video) => {
    const preview = video.getPreview(2)

    return `<div class='ordinary_attachment video_any_attachment video_attachment_viewer_open outliner video_attachment' data-height='${preview.height ?? 0}' data-width='${preview.width ?? 0}' data-videoid='${video.getId()}'>
        <svg class='play_button' viewBox="0 0 61 74"><polygon class="cls-1" points="1.5 1.5 59.5 37.5 1.5 72.5 1.5 1.5"/></svg>

        <div class='time_block remove_if_small'>
            <span>${video.getDuration()}</span>
        </div>
        ${video.hasPreview() ? `<img loading='lazy' src='${preview.url}'>` : ''}
    </div>`
}
