window.templates._settings_ui = () => {
    return `
    <div class='settings_block_tweaks'>
        <b>${_('settings_ui.page_section')}</b>
        <div class='settings_block_tweaks_insert'>
            <div>
                <p>${_('settings_ux.settings_ux_header_name')}</p>
                <input maxlength='15' type='text' data-reload='1' value='${window.settings_manager.getItem('ui.header_name').getValue()}' data-sett='ui.header_name' placeholder='${window.consts.NAME}'>
            </div>
            <label>
                <input type='checkbox' data-cssreload='1' data-sett='ui.strabismus' ${window.settings_manager.getItem('ui.strabismus').isChecked() ? 'checked' : ''}>
                ${_('settings_ui_tweaks.vk_like_padding')}
            </label>
            <label>
                <input type='checkbox' data-cssreload='1' data-sett='ui.smooth' ${window.settings_manager.getItem('ui.smooth').isChecked() ? 'checked' : ''}>
                ${_('settings_ui_tweaks.transitions_everywhere')}
            </label>
        </div>
    </div>
    <div class='settings_block_tweaks'>
        <b>${_('settings_ui.users_section')}</b>
        <div class='settings_block_tweaks_insert'>
            <label>
                <input type='checkbox' data-cssreload='1' data-sett='ui.hide_imagestatus' ${window.settings_manager.getItem('ui.hide_imagestatus').isChecked() ? 'checked' : ''}>
                ${_('settings_ui_tweaks.hide_image_status')}
            </label>
            <label>
                <input type='checkbox' data-cssreload='1' data-sett='ui.round_avatars' ${window.settings_manager.getItem('ui.round_avatars').isChecked() ? 'checked' : ''}>
                ${_('settings_ui_tweaks.round_avatars')}
            </label>
        </div>
    </div>
    <div class='settings_block_tweaks'>
        <b>${_('settings_ui_tweaks.colors')}</b>
        <div class='settings_block_tweaks_insert'>
            <label>
                <input type='color' data-cssreload='1' data-sett='ui.accent_color' value='${window.settings_manager.getItem('ui.accent_color').getValue()}'>
                <div class='fake_color' style='background:${window.settings_manager.getItem('ui.accent_color').getDefault()}'></div>
                ${_('settings_ui_tweaks.accent_color')}
            </label>
        </div>
    </div>`
}