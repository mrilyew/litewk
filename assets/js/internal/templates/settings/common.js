if(!window.templates) {
    window.templates = {}
}

window.templates._settings_common = () => {
    return `
    <div class='settings_block bordered_block padding'>
        <div class='bordered_block_name'>
            <span>${_('settings.settings_common')}</span>
        </div>

        <div class='table'>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_site_menu')}</p>

                <div class='table_element_value'>
                    <a id='toggle_menu_edit' href='javascript:void(0)'>${_('settings_ux.settings_ux_navigation_edit')}</a>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_navigation')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='ux.hide_back_button' ${window.settings_manager.getItem('ux.hide_back_button').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_hide_back')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.navigation_away_enable' ${window.settings_manager.getItem('ux.navigation_away_enable').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_away_enable')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.navigation_counters' ${window.settings_manager.getItem('ux.navigation_counters').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_update_counters')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.live_notifications' ${window.settings_manager.getItem('ux.live_notifications').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_live_notifications')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <div>
                    <p>${_('settings_ux.settings_ux_online_status')}</p>
                </div>

                <div class='table_element_value'>
                    <label><input name='_online_format' ${window.settings_manager.getItem('ux.online_status').isEqual('none') ? 'checked' : ''} value='none' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_ux_send_online_none')}</label>
                    <label><input name='_online_format' ${window.settings_manager.getItem('ux.online_status').isEqual('method_call') ? 'checked' : ''} value='method_call' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_ux_send_online_method_call')}</label>
                    <label><input name='_online_format' ${window.settings_manager.getItem('ux.online_status').isEqual('timeout') ? 'checked' : ''} value='timeout' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_ux_send_online_timeout')}</label>
                    <span class='tip'>${_('settings_ux.settings_ux_send_online_warn')}</span>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_proxy')}</p>

                <div class='table_element_value'>
                    <div>
                        <p>${_('settings_ux.settings_ux_proxy_url')}</p>
                        <input type='text' value='${window.settings_manager.getItem('internal.proxy_url').getValue()}' data-sett='internal.proxy_url' placeholder='${window.settings_manager.getItem('internal.proxy_url').getDefault()}'>
                    </div>

                    <div>
                        <p>${_('settings_ux.settings_ux_proxy_useragent')}</p>
                        <input type='text' value='${window.settings_manager.getItem('internal.proxy_useragent').getValue()}' data-sett='internal.proxy_useragent' placeholder='-'>
                    </div>

                    <label>
                        <input type='checkbox' data-sett='internal.use_proxy_everywhere' ${window.settings_manager.getItem('internal.use_proxy_everywhere').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_use_proxy')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_others')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='internal.use_execute' ${window.settings_manager.getItem('internal.use_execute').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_use_execute')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.hide_waterfall' ${window.settings_manager.getItem('ux.hide_waterfall').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_hide_waterfall')}
                    </label>
                    <input type='button' class='min_width primary' id='_reset_all_settings' value='${_('settings.reset_settings')}'>
                </div>
            </div>
            <div class='table_element tricolon'>
                <p>${_('settings_ux.settings_ux_lang')}</p>

                <div class='table_element_value'>
                    ${window.lang.lang_info.native_name}
                </div>

                <div class='table_element_value'>
                    <a href='javascript:' id='_lang_change_button'>${_('settings_language.change_language_verb')}</a>
                </div>
            </div>
        </div>
    </div>
    `
}
