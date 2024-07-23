if(!window.templates) {
    window.templates = {}
}

window.templates.notification = (notification) => {
    const url = notification.getURL()

    console.log(notification)
    return `
        <a class='notification nodecoration ${notification.isMultiple() ? 'ungroup' : ''}' id='${notification.getId()}' href='${url.url}' ${url.blank ? `target='_blank'` : ''}>
            <div class='notification_icon'>
                ${notification.has('main_item') ? notification.getIcon() : ''}
                ${notification.hasSmallerIcon() ? `<img class='notification_icon_smaller' src='${notification.getSmallerIcon()}'>` : ''}
            </div>
            <div class='notification_body'>
                ${notification.has('header') ? `<object class='notification_title'>
                    ${notification.getTitle()}
                </object>` : ''}
                ${notification.has('attachments') ? `<div class='notification_attachments'>
                    ${notification.getAttachmentsHTML()}
                </div>` : ''}
                ${notification.has('text') ? `<div class='notification_attachments'>
                    ${notification.getText()}
                </div>` : ''}
                ${notification.info.footer ? `<object class='notification_down'>
                    ${notification.getSubtext()}
                </object>` : ''}
                ${notification.has('buttons') ? `<div class='notification_buttons'>
                    ${notification.getButtons()}
                </div>` : ''}
            </div>
        </a>
    `
}
