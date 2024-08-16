if(!window.templates) {
    window.templates = {}
}

window.templates._settings_nav = () => {
    return `
    <div class='settings_sublock'>
        <p class='settings_title'><b>${_('settings_ui.settings_ui_left_menu')}</b></p>
        <div id='__menupostedit' class='hidden' style='margin-top: 5px;'>
            <div>
                <input type='button' id='_resetdef' value='${_('settings_ui.settings_ui_left_reset_default')}'>
                <input type='button' id='_addnav' value='${_('settings_ui.settings_ui_left_add')}'>
            </div>
                
            <span>${_('settings_ui.settings_ui_left_click_tip')}</span>
                
            <div id='__menupostedittab' class='hidden' data-tab=''>
                <div class='table'>
                    <div class='table_element'>
                        <span>${_('settings_ui.settings_ui_left_text')}</span>

                        <div class='table_element_value'>
                            <input type='text' id='_leftmenu_text'>
                        </div>
                    </div>
                    <div class='table_element'>
                        <span></span>
                        <div class='table_element_value'>
                            ${_('settings_ui.settings_ui_i18n_tip')}
                        </div>
                    </div>
                    <div class='table_element'>
                        <span>${_('settings_ui.settings_ui_left_href')}</span>
                        <div class='table_element_value'>
                            <input type='text' id='_leftmenu_href'>
                        </div>
                    </div>
                    <div class='table_element'>
                        <span>${_('settings_ui.settings_ui_left_anchor')}</span>
                        <div class='table_element_value'>
                            <input type='text' id='_leftmenu_anchor'>
                            <span>${_('settings_ui.settings_ui_anchor_tip')}</span>
                        </div>
                    </div>
                    <div class='table_element'>
                        <span></span>
                        <div class='table_element_value'>
                            <label>
                                <input type='checkbox' id='_leftmenu_newpage'>
                                <span>${_('settings_ui.settings_ui_left_new_page')}</span>
                            </label>
                        </div>
                    </div>
                    <div class='table_element'>
                        <span></span>
                        <div class='table_element_value'>
                            <label>
                                <input type='checkbox' id='_leftmenu_disabled'>
                                <span>${_('settings_ui.settings_ui_left_disabled')}</span>
                            </label>
                        </div>
                    </div>
                    <div class='table_element'>
                        <span></span>
                        <div class='table_element_value'>
                            <label>
                                <input type='checkbox' id='_leftmenu_hidden'>
                                <span>${_('settings_ui.settings_ui_left_hidden')}</span>
                            </label>
                        </div>
                    </div>
            </table>
        </div>

        <div id='__movement_buttons' style='display:none;'>
            <input type='button' id='_delnav' value='${_('settings_ui.settings_ui_left_delete')}'>
            <input type='button' id='_upnav' value='${_('settings_ui.settings_ui_left_up')}'>
            <input type='button' id='_downnav' value='${_('settings_ui.settings_ui_left_down')}'>
        </div>
    </div>
</div>
    `
}