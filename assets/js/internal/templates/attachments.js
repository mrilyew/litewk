if(!window.templates) {
    window.templates = {}
}

window.templates.attachments = (attachments) => {
    let attachms = document.createElement('div')
    attachms.innerHTML = `
    <div class='attachments' ${attachments.length == 1 ? `style='text-align: center;'` : ''}>
        <div class='ordinary_attachments'></div>
        <div class='other_attachments'></div>
    </div>`

    if(attachments.length == 1 && attachments[0].type == 'photo') {
        let photo = new Photo(attachments[0].photo)
        
        attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
            `
            <img class='ordinary_attachment photo_attachment' data-full='${photo.getFullSizeURL()}' data-photoid='${photo.getId()}' src='${photo.getURL()}'>
            `
        )
    } else if(attachments.length == 1 && attachments[0].type == 'video') {
        let video = new Video(attachments[0].video)
        
        attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
            `
            <div class='ordinary_attachment video_attachment_viewer_open video_attachment_big big_attachment' data-videoid='${video.getId()}'>
                <div class='video_preview_block'>
                    <img src='assets/images/playicon.png' class='play_button'>

                    <div class='time_block'>
                        <span>${video.getDuration()}</span>
                    </div>
                    ${video.hasPreview() ? `<img class='video_preview' src='${video.getPreview(3)}'>` : ''}
                </div>
                <div class='video_attachment_info'>
                    <b><a href='#video${video.getId()}'>${video.getTitle()}</a></b>
                    <p>${_('videos.views_count', video.getViews())}</p>
                </div>
            </div>
            `
        )
    } else {
        attachments.forEach(attachment => {
            switch(attachment.type) {
                case 'photo':
                    let photo = new Photo(attachment.photo)

                    attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
                        `
                            <img class='ordinary_attachment photo_attachment' data-full='${photo.getFullSizeURL()}' data-photoid='${photo.getId()}' src='${photo.getURL()}'>
                        `
                    )
                    break
                case 'video':
                    let video = new Video(attachment.video)

                    attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
                        `
                            <div class='ordinary_attachment video_attachment_viewer_open video_attachment' data-videoid='${video.getId()}'>
                                <img src='assets/images/playicon.png' class='play_button'>
    
                                <div class='time_block'>
                                    <span>${video.getDuration()}</span>
                                </div>
                                ${video.info.image ? `<img src='${video.getPreview()}'>` : ''}
                            </div>
                        `
                    )
                    break
                case 'doc':
                    let doc = new Doc()
                    doc.hydrate(attachment.doc)
                    
                    if(doc.getExtension() == 'gif' || doc.getExtension() == 'jpg' || doc.getExtension() == 'png') {
                        attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
                        `
                            <div class='ordinary_attachment doc_attachment' data-url='${doc.getURL()}' data-docid='${doc.getId()}' title='${doc.getTitle()}'>
                                <div class='ext_block'>
                                    <span>${Utils.escape_html(doc.getExtension().toUpperCase())} | ${doc.getFileSize()}</span>
                                </div>
                                <img src='${doc.getPreview()}'>
                            </div>
                        `)
                    } else {
                        attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                        `
                            <a href='${doc.getURL()}'>
                                <div class='list_attachment doc_list_attachment' data-docid='${doc.getId()}'>
                                    <div class='list_attachment_format'>${doc.getExtension()}</div>
                                    <div class='list_attachment_info'>
                                        <p><b>${doc.getTitle()}</b></p>
                                        <p>${doc.getFileSize()}</p>
                                    </div>
                                </div>
                            </a>
                        `)
                    }
                    break
                case 'poll':
                    let op_poll = new Poll(attachment.poll)
                    op_poll.hydrate(attachment.poll)

                    attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                    `
                        <div class='list_attachment poll_list_attachment' data-pollid='${op_poll.getId()}'>
                            <div class='poll_head'>
                                <span class='question'>${Utils.escape_html(op_poll.getQuestion())}</span>
                            </div>
                            <div class='poll_answers'></div>
                        </div>
                    `)
    
                    op_poll.getAnswers().forEach(answer => {
                        attachms.querySelector(`.poll_list_attachment[data-pollid='${op_poll.getId()}'] .poll_answers`).insertAdjacentHTML('beforeend', `
                            <label>
                                <input type='radio' name='poll_${op_poll.getId()}'>
                                ${Utils.escape_html(answer.text)}
                            </label>
                        `)
                    })
                    break
                case 'audio':
                    let op_audio = new Audio(attachment.audio)
    
                    attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                    `
                        <div class='list_attachment audio_list_attachment audio_player' data-audioid='${op_audio.getId()}'>
                            <span>${op_audio.getName()}</span>
                            <span>${op_audio.getDuration()}</span>
                        </div>
                    `)
                    break
                case 'link':
                    let op_link = new Link
                    op_link.hydrate(attachment.link)
                    let att_photo = op_link.getPhoto()

                    if(!att_photo.isVertical()) {
                        attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                        `
                            <div class='list_attachment link_attachment'>
                                ${op_link.hasPhoto() ? `
                                <div class='link_attachment_photo'>
                                    <img class='photo_attachment' data-type='attached_link' data-full='${att_photo.getURL()}' src='${att_photo.getURL()}'>
                                </div>` : ''}
    
                                <div class='link_attachment_info'>
                                    ${op_link.has('caption') ? `<a href='?id=${op_link.getCaption()}#away' target='_blank'><span>${op_link.getCaption()}</span></a>` : ''}
                                    <a href='${op_link.getURL()}' target='_blank'><b>${op_link.getTitle()}</b></a>
                                </div>
                            </div>
                        `)
                    } else {
                        attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                        `
                            <div class='list_attachment link_attachment link_attachment_vertical'>
                                ${op_link.hasPhoto() ? `
                                <div class='link_attachment_photo'>
                                    <img class='photo_attachment' data-type='attached_link' data-full='${att_photo.getURL()}' src='${att_photo.getURL()}'>
                                </div>` : ''}
    
                                <div class='link_attachment_info'>
                                    ${op_link.has('caption') ? `<a href='?id=${op_link.getURL()}#away' target='_blank'><b>${op_link.getTitle()}</b></a>` : ''}
                                    <a href='?id=${op_link.getCaption()}#away' target='_blank'><span>${op_link.getCaption()}</span></a>
                                </div>
                            </div>
                        `)
                    }

                    break
                case 'graffiti':
                    let graf = attachment.graffiti
                    let url = ''

                    if(graf.photo_586) {
                        url = graf.photo_586
                    } else if(graf.photo_604) {
                        url = graf.photo_604
                    }
                    
                    attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
                        `
                            <img class='ordinary_attachment photo_attachment' data-type='graffiti' data-full='${url}' src='${url}'>
                        `
                    )
                    break
                case 'sticker':
                    attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                    `
                        <div class='list_attachment sticker_attachment'>
                            <div class='sticker'></div>
                        </div>
                    `)

                    break
                default:
                    attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                    `
                        Attachment type: ${attachment.type}
                    `)
                    break
            }
        })
    }

    return attachms.innerHTML
}
