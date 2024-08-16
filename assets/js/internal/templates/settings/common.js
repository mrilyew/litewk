if(!window.templates) {
    window.templates = {}
}

window.templates._settings_common = () => {
    let date_val = window.site_params.get('ui.date_format') ?? 'default'
    let online_val = window.site_params.get('ux.online_status') ?? 'none'

    return `
    <div class='settings_block'>
        <div class='table' style='gap:10px;'>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_navigation')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='ux.better_my_page' data-reload='1' ${window.site_params.get('ux.better_my_page', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_better_my_page')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.hide_back_button' ${window.site_params.get('ux.hide_back_button', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_hide_back')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.savepager' ${window.site_params.get('ux.savepager', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_save_pages')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.navigation_away_enable' ${window.site_params.get('ux.navigation_away_enable', '1') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_away_enable')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.navigation_counters' ${window.site_params.get('ux.navigation_counters', '1') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_update_counters')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.live_notifications' ${window.site_params.get('ux.live_notifications', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_navigation_live_notifications')}
                    </label>
                    <a href='#settings/navigation'>${_('settings_ux.settings_ux_navigation_edit')}</a>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_date_format')}</p>

                <div class='table_element_value'>
                    <label><input name='_date_format' ${date_val == 'default' ? 'checked' : ''} value='default' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_default')}</label>
                    <label><input name='_date_format' ${date_val == 'default_seconds' ? 'checked' : ''} value='default_seconds' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_default_seconds')}</label>
                    <label><input name='_date_format' ${date_val == 'month' ? 'checked' : ''} value='month' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_day_month')}</label>
                    <label><input name='_date_format' ${date_val == 'month_seconds' ? 'checked' : ''} value='month_seconds' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_day_month_seconds')}</label>
                </div>
            </div>
            <div class='table_element'>
                <div>
                    <p>${_('settings_ux.settings_ux_online_status')}</p>
                </div>

                <div class='table_element_value'>
                    <label><input name='_online_format' ${online_val == 'none' ? 'checked' : ''} value='none' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_ux_send_online_none')}</label>
                    <label><input name='_online_format' ${online_val == 'method_call' ? 'checked' : ''} value='method_call' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_ux_send_online_method_call')}</label>
                    <label><input name='_online_format' ${online_val == 'timeout' ? 'checked' : ''} value='timeout' type='radio' data-sett='ux.online_status'>${_('settings_ux.settings_ux_send_online_timeout')}</label>
                    <span class='tip'>${_('settings_ux.settings_ux_send_online_warn')}</span>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_scrolling')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='ux.save_scroll' ${window.site_params.get('ux.save_scroll', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_scrolling_save_progress')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.auto_scroll' ${window.site_params.get('ux.auto_scroll', '1') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_scrolling_auto')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.update_paginators' ${window.site_params.get('ux.update_paginators', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_update_paginators')}
                    </label>
                        <label>
                        <input type='checkbox' data-sett='ux.previous_page_deletion' ${window.site_params.get('ux.previous_page_deletion', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_previous_page_deletion')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_content_settings')}</p>

                <div class='table_element_value'>
                    <label>
                        ${_('settings_ux.settings_ux_content_settings_comment_sort_default')}
                        <select class='empty_select' data-sett='ux.default_sort'>
                            <option value='asc' ${window.site_params.get('ux.default_sort', 'asc') == 'asc' ? 'selected' : ''}>${_('wall.sort_old_first')}</option>
                            <option value='desc' ${window.site_params.get('ux.default_sort', 'asc') == 'desc' ? 'selected' : ''}>${_('wall.sort_new_first')}</option>
                            <option value='smart' ${window.site_params.get('ux.default_sort', 'asc') == 'smart' ? 'selected' : ''}>${_('wall.sort_interesting_first')}</option>
                        </select>
                    </label>

                    <label>
                        <input type='checkbox' data-sett='ux.twemojify' ${window.site_params.get('ux.twemojify', '1') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_content_settings_format_emojis')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ui.lottie_sticker_animations' ${window.site_params.get('ui.lottie_sticker_animations', '1') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_content_settings_show_lottie_stickers')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.shortify_text' ${window.site_params.get('ux.shortify_text', '1') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_content_shortify_text')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_user')}</p>

                <div class='table_element_value'>
                    <label>
                        ${_('settings_ux.settings_ux_user_friends_block_sort')}
                        <select class='empty_select' data-sett='ux.friends_block_sort'>
                            <option value='hints'  ${window.site_params.get('ux.friends_block_sort', 'hints') == 'hints' ? 'selected' : ''}>${_('settings_ux.settings_ux_user_friends_block_sort_rating')}</option>
                            <option value='random' ${window.site_params.get('ux.friends_block_sort', 'random') == 'random' ? 'selected' : ''}>${_('settings_ux.settings_ux_user_friends_block_sort_random')}</option>
                        </select>
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.show_reg' ${window.site_params.get('ux.show_reg', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_user_show_register')}
                    </label>
                </div>
            </div>

            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_cover')}</p>

                <div class='table_element_value'>
                    <label>
                        <input name='_cover_upper' type='radio' value='0' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '0' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_on_up')}
                    </label>
                    <label>
                        <input name='_cover_upper' type='radio' value='1' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_from_name')}
                    </label>
                    <label>
                        <input name='_cover_upper' type='radio' value='2' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '2' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_background')}
                    </label>
                    <label>
                        <input name='_cover_upper' type='radio' value='4' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '4' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_body_background')}
                    </label>
                    <label>
                        <input name='_cover_upper' type='radio' value='3' data-sett='ui.cover_upper' ${window.site_params.get('ui.cover_upper', '0') == '3' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_no')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_proxy')}</p>

                <div class='table_element_value'>
                    <p>${_('settings_ux.settings_ux_proxy_url')}</p>
                    <input type='text' style='width: 288px;' value='${window.site_params.get('internal.proxy_url', 'https://api.allorigins.win/get?url=')}' data-sett='internal.proxy_url' placeholder='https://api.allorigins.win/get?url='>
                    
                    <p>${_('settings_ux.settings_ux_proxy_useragent')}</p>
                    <input type='text' style='width: 288px;' value='${window.site_params.get('internal.proxy_useragent', '')}' data-sett='internal.proxy_useragent' placeholder='-'>
                    
                    <label>
                        <input type='checkbox' data-sett='internal.use_proxy_everywhere' ${window.site_params.get('internal.use_proxy_everywhere', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_use_proxy')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_others')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='internal.use_execute' ${window.site_params.get('internal.use_execute', '1') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_use_execute')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.hide_waterfall' ${window.site_params.get('ux.hide_waterfall', '0') == '1' ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_hide_waterfall')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_about')}</p>

                <div class='table_element_value'>
                    <a href='${window.consts.SETTINGS_README_LINK}' target='_blank'>${_('settings.settings_about')}</a>
                    <a href='${window.consts.SETTINGS_GITHUB_LINK}' target='_blank'>GitHub</a>
                    <span>${_('settings_ux.settings_ux_about_last_update', Utils.short_date(window.consts.LAST_UPDATE))}</span>
                </div>
            </div>
        </div>
    </div>
    `
}
