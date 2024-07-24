if(!window.templates) {
    window.templates = {}
}

window.templates.notification = (notification) => {
    const url = notification.getURL()
    
    return `
        <div class='notification nodecoration dropdown_root ${notification.isMultiple() ? 'ungroup' : ''}' id='${notification.getId()}' href='${url.url}' ${url.blank ? `target='_blank'` : ''}>
            <div class='notification_icon'>
                ${notification.has('main_item') ? notification.getIcon() : ''}
                ${notification.hasSmallerIcon() ? `<img class='notification_icon_smaller' src='${notification.getSmallerIcon()}'>` : ''}
            </div>
            <div class='notification_body'>
                ${notification.has('header') ? `<div class='notification_title'>
                    ${notification.getTitle()}
                </div>` : ''}
                ${notification.has('text') ? `<div class='notification_attachments'>
                    ${notification.getText()}
                </div>` : ''}
                ${notification.has('attachments') ? `<div class='notification_attachments'>
                    ${notification.getAttachmentsHTML()}
                </div>` : ''}
                ${notification.info.footer ? `<div class='notification_down'>
                    ${notification.getSubtext()}
                </div>` : ''}
                ${notification.has('buttons') ? `<div class='notification_buttons'>
                    ${notification.getButtons()}
                </div>` : ''}
                ${notification.has('action_buttons') ? `<div class='notifs_toggle_wrap'>
                    <a href='javascript:'>
                        <svg class='notifs_menu_toggle dropdown_toggle' data-onid='_actposts${notification.getId()}' viewBox="0 0 18.35 7.54"><g><polyline points="0.44 0.63 8.73 6.63 17.94 0.63"/></g></svg>
                    </a>

                    <div class='dropdown_actions dropdown_wrapper'>
                        <div class='dropdown_menu' id='_actposts${notification.getId()}'>
                            ${notification.getActionButtons()}
                        </div>
                    </div>
                </div>` : ''}
            </div>
        </div>
    `
}
