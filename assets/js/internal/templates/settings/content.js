window.templates._settings_content = () => {
    return `
    <div class='settings_block bordered_block padding'>
        <div class='bordered_block_name'>
            <span>${_('settings.settings_content')}</span>
        </div>

        <div class='table'>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_date_format')}</p>

                <div class='table_element_value'>
                    <label><input name='_date_format' ${window.settings_manager.getItem('ui.date_format').isEqual('default') ? 'checked' : ''} value='default' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_default')}</label>
                    <label><input name='_date_format' ${window.settings_manager.getItem('ui.date_format').isEqual('default_seconds') ? 'checked' : ''} value='default_seconds' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_default_seconds')}</label>
                    <label><input name='_date_format' ${window.settings_manager.getItem('ui.date_format').isEqual('month') ? 'checked' : ''} value='month' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_day_month')}</label>
                    <label><input name='_date_format' ${window.settings_manager.getItem('ui.date_format').isEqual('month_seconds') ? 'checked' : ''} value='month_seconds' type='radio' data-sett='ui.date_format'>${_('settings_ux.settings_ux_date_format_day_month_seconds')}</label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_scrolling')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='ux.save_scroll' ${window.settings_manager.getItem('ux.save_scroll').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_scrolling_save_progress')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.auto_scroll' ${window.settings_manager.getItem('ux.auto_scroll').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_scrolling_auto')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.update_paginators' ${window.settings_manager.getItem('ux.update_paginators').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_update_paginators')}
                    </label>
                        <label>
                        <input type='checkbox' data-sett='ux.previous_page_deletion' ${window.settings_manager.getItem('ux.previous_page_deletion').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_previous_page_deletion')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_content_settings')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='ux.twemojify' ${window.settings_manager.getItem('ux.twemojify').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_content_settings_format_emojis')}
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ux.shortify_text' ${window.settings_manager.getItem('ux.shortify_text').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_content_shortify_text')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_posts_settings')}</p>

                <div class='table_element_value'>
                    <label>
                        ${_('settings_ux.settings_ux_content_settings_comment_sort_default')}
                        <select class='empty_select' data-sett='ux.default_sort'>
                            <option value='asc' ${window.settings_manager.getItem('ux.default_sort').isEqual('asc') ? 'selected' : ''}>${_('wall.sort_old_first')}</option>
                            <option value='desc' ${window.settings_manager.getItem('ux.default_sort').isEqual('desc')  ? 'selected' : ''}>${_('wall.sort_new_first')}</option>
                            <option value='smart' ${window.settings_manager.getItem('ux.default_sort').isEqual('smart')  ? 'selected' : ''}>${_('wall.sort_interesting_first')}</option>
                        </select>
                    </label>
                    <label>
                        <input type='checkbox' data-sett='ui.lottie_sticker_animations' ${window.settings_manager.getItem('ui.lottie_sticker_animations').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_content_settings_show_lottie_stickers')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_user')}</p>

                <div class='table_element_value'>
                    <label>
                        <input type='checkbox' data-sett='ux.show_reg' ${window.settings_manager.getItem('ux.show_reg').isChecked() ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_user_show_register')}
                    </label>
                </div>
            </div>
            <div class='table_element'>
                <p>${_('settings_ux.settings_ux_cover')}</p>

                <div class='table_element_value'>
                    <label>
                        <input name='_cover_upper' type='radio' value='0' data-sett='ui.cover_upper' ${window.settings_manager.getItem('ui.cover_upper').isEqual('0') ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_on_up')}
                    </label>
                    <label>
                        <input name='_cover_upper' type='radio' value='1' data-sett='ui.cover_upper' ${window.settings_manager.getItem('ui.cover_upper').isEqual('1') ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_from_name')}
                    </label>
                    <label>
                        <input name='_cover_upper' type='radio' value='4' data-sett='ui.cover_upper' ${window.settings_manager.getItem('ui.cover_upper').isEqual('4') ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_body_background')}
                    </label>
                    <label>
                        <input name='_cover_upper' type='radio' value='3' data-sett='ui.cover_upper' ${window.settings_manager.getItem('ui.cover_upper').isEqual('3') ? 'checked' : ''}>
                        ${_('settings_ux.settings_ux_cover_no')}
                    </label>
                </div>
            </div>
        </div>
    </div>`
}
