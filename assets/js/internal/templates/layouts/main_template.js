if(!window.templates) {
    window.templates = {}
}

window.templates.css_settings = () => {
    return `
    ${window.settings_manager.getItem('ui.hide_imagestatus').isChecked() ? `
    .image_status {
        display: none;
    }
    ` : ''}
    ${window.settings_manager.getItem('ui.strabismus').isChecked() ? `
    .site_wrapper {
        padding-left: unset !important;
        padding-right: unset !important;
    }
    
    .header {
        padding: 10px 2%;
    }
    
    #up_panel {
        display: none;
    }
    ` : ''}
    ${window.settings_manager.getItem('ui.smooth').isChecked() ? `
    * {
        transition: 200ms all ease-in;
    }

    textarea {
        transition: unset !important;
    }
    ` : ''}
    ${window.settings_manager.getItem('ui.round_avatars').isChecked() ? `
    .avatar > img, .avatar {
        border-radius: 100%;
    }

    .main_avatar {
        border-radius: 6px;
    }
    ` : ''}
    :root {
        --accent-color: ${window.settings_manager.getItem('ui.accent_color').getValue()};
    }
    `
}

window.templates.main = (menu_html = '') => {
    const accs_count = window.accounts.getAccountsCount()
    let vk_account = null
    if(window.active_account) {
        vk_account = window.active_account.getVkAccount()
    }

    return `
    <style id='_customcss'>
        ${window.site_params.get('ui.custom_css') ? Utils.escape_html(window.site_params.get('ui.custom_css')) : '{}'}
    </style>

    <style id='_css_settings'>
        ${window.templates.css_settings()}
    </style>
    
    <div class='fast_errors'></div>
    <div class='background_fixed'></div>
    
    <div class='fullscreen_dimmer'></div>
    <div class='dimmer'></div>

    <div class='notification_global_wrap left'></div>
    <div class='notification_global_wrap right'></div>

    <div class='load_circle'>
        <img src='assets/images/upload.gif'>
    </div>

    <div id='up_panel' class='menu_up_hover_click'>
        <div id='to_up'>
            <svg id="to_up_icon" viewBox="0 0 10 6"><polygon points="0 6 5 0 10 6 0 6"/></svg>
            <span>${_('navigation.to_up')}</span>
        </div>
        
        <div id='come_back'>
            <svg id="come_back_icon" viewBox="0 0 10 6"><polygon points="0 0 5 6 10 0 0 0"/></svg>
            <span>${_('navigation.come_back')}</span>
        </div>

        <div id='to_back'>
            <svg id="to_back_icon" viewBox="0 0 10 6"><polygon points="0 6 5 0 10 6 0 6"/></svg>
            <span>${_('navigation.to_back')}</span>
        </div>
    </div>

    <div class='main_wrapper'>
        <div class='header fixed full_width'>
            <div class='flex'>
                <div class='header_title_wrapper'>
                    <a href='#' class='header_title'>${window.settings_manager.getItem('ui.header_name').getValue()}</a>
                </div>

                <div class='header_second_part_wrapper flex flex_row'>
                    <div class='header_search'>
                        <label id='_header_icons_search' class='header_search_wrapper search_icon_wrapper relative'>
                            <svg viewBox="-1 -1 15 15"><line class="cls-1" x1="14.5" y1="14.5" x2="8.5" y2="8.5"/><circle class="cls-1" cx="5" cy="5" r="4.5"/></svg>
                            <input type='search' maxlength='100' onfocus="_header_icons_search.classList.add('focused')" onblur="_header_icons_search.classList.remove('focused')" name='global_query' placeholder='${_('navigation.my_search')}'>
                        </label>
                    </div>

                    ${vk_account ? `
                    <div class='header_icons flex'>
                        <div id='header_icon_notification' data-state='no-unread'>
                            <div id='header_icon_notification_counter' class='absolute'>0</div>
                            <svg viewBox="0 0 13 14"><path d="M13,12V10l-.4-.8c-.34-.69-1.16-1.94-1.1-2.7.14-1.83.5-5-4-5H7c-4.91,0-4.65,3.17-4.5,5A6.5,6.5,0,0,1,1.44,9.2L1,10v2Z" transform="translate(-0.5 -1)" style="fill:none;stroke-miterlimit:10"/><path d="M7.5,14.5c-3,0-2.94-2.5-2.94-2.5h5A2.42,2.42,0,0,1,7,14.5" transform="translate(-0.5 -1)" style="fill:none;stroke-miterlimit:10"/></svg>
                        </div>
                        <div id='header_icon_mus'>
                            <svg viewBox="0 0 16 15.69"><polyline points="5.71 12.84 5.71 3.55 14.29 0.69 14.29 11.41" style="fill:none;stroke-miterlimit:10"/><polyline points="5.71 11.77 5.71 6.41 14.29 3.67 14.29 10.2" style="fill:none;stroke-miterlimit:10"/><ellipse cx="3.21" cy="13.19" rx="3.21" ry="2.5" style="fill:none;" /><ellipse cx="11.79" cy="11.77" rx="3.21" ry="2.5" style="fill:none;" /></svg>
                        </div>
                    </div>` : ''}
                </div>
            </div>

            <div class='header_account_wrapper relative'>
                <div class='header_account flex'>
                    ${vk_account ? `
                        <div class='avatar header_account_name flex'>
                            <b>${vk_account.getName()}</b>
                            <img src='${vk_account.getAvatar(true)}'>
                        </div>

                        <svg id='down_icon' viewBox="0 0 10 6"><polygon points="0 0 5 6 10 0 0 0"/></svg>
                        <svg id='up_icon' viewBox="0 0 10 6"><polygon points="0 6 5 0 10 6 0 6"/></svg>
                    ` : `
                        ${accs_count > 0 ? `
                        <div class='header_account_name flex'>
                            <b>${_('navigation.no_account')}</b>
                        </div>

                        <svg id='down_icon' viewBox="0 0 10 6"><polygon points="0 0 5 6 10 0 0 0"/></svg>
                        <svg id='up_icon' viewBox="0 0 10 6"><polygon points="0 6 5 0 10 6 0 6"/></svg>
                        ` : `
                            <span>${_('navigation.authorize')}</span>
                        `}
                    `}
                </div>

                <div id='header_actions' class='absolute'>
                    <div style='z-index:2'>
                    ${vk_account ? `
                        <div class='header_actions_profile relative'>
                            <div class='header_actions_profile_name flex relative' style='z-index: 1;'>
                                <a href='#id${vk_account.getId()}'>
                                    <img class='avatar header_actions_profile_avatar' src='${vk_account.getAvatar(true)}'>
                                </a>

                                <div>
                                    <a href='#id${vk_account.getId()}'>${vk_account.getFullName()}</a>
                                    <svg class='hoverish header_actions_profile_accounts_account_token' id="header_actions_edit_account" data-id='${window.active_account.uid}' viewBox="0 0 14.46 15.59"><polygon points="9.84 0.53 1.82 9.45 0.52 15.01 5.91 13.13 13.93 4.21 9.84 0.53" style="fill:none;stroke-miterlimit:10;"/><line x1="7.79" y1="2.81" x2="11.93" y2="6.44" style="fill:none;stroke-miterlimit:10;"/></svg>

                                    <div>
                                        <span>${vk_account.getPhone()}</span>
                                        •
                                        <span>${_('counters.votes_count', vk_account.getVotes())}</span>
                                        •
                                        <span>${vk_account.getId()}</span>
                                    </div>
                                </div>

                            </div>
                            <div class='header_actions_profile_cover absolute' style='background-image: url(${vk_account.getCoverURL()});'></div>
                        </div>` : ''}

                        ${vk_account ? `
                        <div class='header_actions_list'>
                            <a href='#edit'>${_('navigation.edit_info')}</a>
                            <a href='#settings'>${_('navigation.my_settings')}</a>
                            <a id='fastLogout'>${_('navigation.logout')}</a>
                        </div>` : `
                        <div class='header_actions_list'>
                            <a href='#settings'>${_('navigation.my_settings')}</a>
                        </div>
                        `}

                        ${window.templates.main_dropdown_accounts(window.accounts.getAccounts())}
                    </div>
                </div>
            </div>
        </div>

        <div class='site_wrapper'>
            <div class='site_wrapper_sub'>
                <div class="navigation flex flex_column">
                    <div class='navigation_list'>
                        ${menu_html}
                    </div>

                    <div class='navigation_editor'>
                        <input class='primary' type='button' id='_resetdef' value='${_('settings_ui.settings_ui_left_reset_default')}'>
                        <input class='primary' type='button' id='toggle_menu_edit' value='${_('settings_ui.settings_ui_left_over')}'>
                    </div>

                    <div class='navigation_editor_side'>
                        <input class='primary' type='button' id='_addnav' value='+'>
                        <input class='primary' type='button' id='_delnav' value='✕'>
                        <input class='primary' type='button' id='_upnav' value='▲'>
                        <input class='primary' type='button' id='_downnav' value='▼'>
                    </div>

                    <div class='navigation_list_editor_info'>
                        <div class='bordered_block flex flex_column' id='navigation_list_editor_info_block'>
                            <div>
                                <b>${_('settings_ui.settings_ui_left_text')}</b>

                                <div>
                                    <input type='text' id='_leftmenu_text'>
                                    <p id='i18n_menu_tip'>${_('settings_ui.settings_ui_i18n_tip')}</p>
                                </div>
                            </div>

                            <div>
                                <b>${_('settings_ui.settings_ui_left_href')}</b>
                                <div>
                                    <input type='text' id='_leftmenu_href'>
                                </div>
                            </div>

                            <div>
                                <b>${_('settings_ui.settings_ui_left_anchor')}</b>
                                <div>
                                    <input type='text' id='_leftmenu_anchor'>
                                    <span>${_('settings_ui.settings_ui_anchor_tip')}</span>
                                </div>
                            </div>

                            <div>
                                <label class='block'>
                                    <input type='checkbox' id='_leftmenu_newpage'>
                                    <span>${_('settings_ui.settings_ui_left_new_page')}</span>
                                </label>
                                <label class='block'>
                                    <input type='checkbox' id='_leftmenu_disabled'>
                                    <span>${_('settings_ui.settings_ui_left_disabled')}</span>
                                </label>
                                <label class='block'>
                                    <input type='checkbox' id='_leftmenu_hidden'>
                                    <span>${_('settings_ui.settings_ui_left_hidden')}</span>
                                </label>
                                <label class='block'>
                                    <select id='_leftmenu_type'>
                                        <option value='link'>${_('settings_ui.settings_ui_left_type_link')}</option>
                                        <option value='footer_link'>${_('settings_ui.settings_ui_left_type_footer_link')}</option>
                                    </select>
                                    ${_('settings_ui.settings_ui_left_type')}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class='menu_up_hover menu_up_hover_click'></div>
                </div>

                <div class="page_content"></div>
            </div>
        </div>
    </div>
    `
}

window.templates.main_dropdown_accounts = (accounts) => {
    const htmler = u(`
    <div>
        <hr>
        <div class='header_actions_profile_accounts flex flex_column'></div>
    </div>
    `)

    accounts.forEach(acc => {
        const vk_acc = acc.getVkAccount()
        if(window.active_account && acc.token == window.active_account.token) {
            return
        }

        htmler.find('.header_actions_profile_accounts').append(`
            <a data-ignore='1' class='header_actions_profile_accounts_account header_actions_profile_accounts_account_token flex' data-id='${acc.uid}' href='#id${vk_acc.getId()}'>
                <div class='_'>
                    <img src='${vk_acc.getAvatar(true)}'>

                    <div>
                        <span>${vk_acc.getFullName()}</span>
                        ${acc.path != 'https://api.vk.com/method/' ? `<span class='gray'>${acc.path.escapeHtml()}</span>` : ''}
                    </div>
                </div>

                <svg class='hoverish' id="header_actions_edit_account" viewBox="0 0 14.46 15.59"><polygon points="9.84 0.53 1.82 9.45 0.52 15.01 5.91 13.13 13.93 4.21 9.84 0.53" style="fill:none;stroke-miterlimit:10;"/><line x1="7.79" y1="2.81" x2="11.93" y2="6.44" style="fill:none;stroke-miterlimit:10;"/></svg>
            </a>
        `)
    })

    htmler.find('.header_actions_profile_accounts').append(`
        <a href='javascript:loginBox()'>${_('navigation.add_account')}</a>
        <a href='javascript:void(0)' style='display:block' id='_go_to_vk_global' target='_blank'>${_('navigation.go_to_vk')}</a>
    `)

    return htmler.html()
}
