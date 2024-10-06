u(document).on('click', '.header_account', (e) => {
    window.header.toggleAccountActions()
})

u(document).on('click', 'body > *', (e) => {
    u('.dropdown_menu_wrapper.shown, .ndropdown.shown').removeClass('shown')
    u('.dropdown_menu_wrapper.animated, .ndropdown.animated').removeClass('animated')
    
    if(e.target.closest('.header_account')) {
        return
    } else {
        if(u('.header_account.pressed').length > 0) {
            window.header.hideAccountActions()
        }
    }
})

u(document).on('click', '.header .header_actions_profile_accounts_account', (e) => {
    e.preventDefault()
    e.stopPropagation()

    let target = e.target
    if(target.closest('svg')) {
        return
    }

    if(!target.dataset.id) {
        target = target.closest('.header_actions_profile_accounts_account')
    }

    const acc = Account.findViaUid(target.dataset.id)
    acc.makeActive()

    window.router.restart(null, 'ignore_menu')
    return
})

u(document).on('click', '.header #header_actions_edit_account', (e) => {
    e.preventDefault()
    let target = e.target
    if(!target.dataset.id) {
        target = target.closest('.header_actions_profile_accounts_account_token')
    }

    const acc = Account.findViaUid(target.dataset.id)
    const vk_acc = acc.getVkAccount()

    let msg = new MessageBox(_('settings_accounts.edit'), `
        <div class='account_local_edit_wrapper'>
            <div class='flex flex_row account_local_edit'>
                <div class='account_local_edit_avatar'>
                    <img src='${vk_acc.getAvatar()}'>
                </div>

                <div class='flex flex_column account_local_edit_setts'>
                    <label>
                        <b>${_('user_page.first_name')}</b>
                        <input type='text' placeholder='${vk_acc.getFirstName().escapeHtml()}' id='_set_first' value='${vk_acc.getFirstName().escapeHtml()}'>
                    </label>
                    
                    <label>
                        <b>${_('user_page.last_name')}</b>
                        <input type='text' placeholder='${vk_acc.getLastName().escapeHtml()}' id='_set_last' value='${vk_acc.getLastName().escapeHtml()}'>
                    </label>
                </div>
            </div>
            <div class='flex flex_column account_local_edit'>
                <label>
                    <b>${_('auth.path_to_api')}</b>
                    <input type='text' id='_set_path' placeholder='https://api.vk.com/method/' value='${Utils.escape_html(acc.path)}'>
                </label>

                <label>
                    <b>${_('auth.vk_api_token')}</b>
                    <input type='text' id='_token_hider' disabled  placeholder='...' value='${acc.token}'>
                </label>
            </div>

            <span>${_('auth.edit_account_note')}</span>
        </div>
    `, [_('settings_accounts.delete'), _('messagebox.save')], [() => {
        const msg2 = new MessageBox('?', `
        <div class='flex flex_column space_between' style='height: 81px;'>
            <p>${_('settings_accounts.sure_deleting')}</p>

            <label>
                <input type='checkbox' id='_revoke_token' checked>
                ${_('settings_accounts.revoke_token')}
            </label>
        </div>
        `, [_('messagebox.no'), _('messagebox.yes')], [() => {
            msg2.close()
        }, () => {
            if(u('#_revoke_token').nodes[0].checked) {
                if(acc.settings && acc.settings.client_id) {
                    const t_vk_api = new VkApi(acc.path, acc.token)
                    t_vk_api.call('auth.logout', {'client_id': acc.settings.client_id})
                }
            }

            acc.remove()

            msg.close()
            msg2.close()

            if(window.active_account && window.active_account.token == acc.token) {
                Accounts.logout()
                window.router.restart(null, 'ignore_menu')
            } else {
                u(`a[data-id='${acc.uid}']`).remove()
            }
        }])

        msg2.getNode().querySelectorAll(`input[type='button']`)[0].classList.add('primary')
    }, () => {
        acc.edit(u('#_set_first').nodes[0].value, u('#_set_last').nodes[0].value, u('#_set_path').nodes[0].value)
        window.router.restart(null, 'ignore_menu')

        msg.close()
    }])

    msg.getNode().style.width = '300px'
    msg.getNode().style.height = '356px'
    msg.getNode().querySelectorAll(`input[type='button']`)[1].classList.add('primary')

    return
})

u(document).on('click', '.header #fastLogout', async (e) => {
    await Accounts.logout()
    window.router.restart(null, 'ignore_menu')
})

u(document).on('keyup', `input[name='global_query']`, async (e) => {
    if(e.key == 'Enter') {
        switch(window.header.search_state) {
            default:
                break
            case 'documentation':
                const query = e.target.value
                window.router.route('/#dev/query?q=' + query)

                break
        }
        
        e.target.value = ''
    }
})

u(document).on('click', '.dimmed .fullscreen_dimmer', (e) => {
    if(!e.target.classList.contains('fullscreen_dimmer')) {
        return
    }

    window.messagebox_stack[window.messagebox_stack.length - 1].close()
})

u(document).on('mouseover', '#_go_to_vk_global', (e) => {
    e.target.href = 'https://' + window.consts.DEFAULT_VK_WEB_DOMAIN + '/' + window.main_url.hash.removePart('#')
})

function loginBox(current_tab = 'oauth') {
    const msg = new MessageBox(_('auth.auth'), '', current_tab == 'token' ? [_('auth.auth') + '|primary'] : null, current_tab == 'token' ? [async () => {
        if(u(`#__apiUrl`).nodes[0].value == '' || u(`#__ouathToken`).nodes[0].value == '') {
            return
        }

        const result = await window.accounts.addAccount(u('#__apiUrl').nodes[0].value, u('#__ouathToken').nodes[0].value)
        if(result) {
            msg.close()

            window.router.restart('', 'ignore_menu')
            window.router.route('#id0')
        }
    }] : null, {'as_window': 1})

    msg.getNode().style.width = '35%'
    msg.getNode().style.margin = '10% auto 0 auto'
    msg.getNode().style.minHeight = '235px'
    msg.getNode().querySelector('.messagebox_body').innerHTML = ''

    u(msg.getNode()).find('.messagebox_body').html(`
        <div class='auth_wrapper'>
            <div class='auth_block'>
                <div class='tabs default_tabs' style='padding: 0;'>
                    <a data-section='oauth' class='tab${current_tab == 'oauth' ? ` selected` : ''}'>OAuth</a>
                    <a data-section='token' class='tab${current_tab == 'token' ? ` selected` : ''}'>${_('auth.by_token')}</a>
                </div>

                <div class='auth_block_input flex flex_column'></div>
            </div>
        </div>
    `)
    
    switch(current_tab) {
        case 'oauth':
            u('.auth_block_input').html(`
                <div class='big_auth_button'>
                    <input type='button' class='primary' id='_authentificate' value='${_('auth.auth')}'>
                </div>

                <div>
                    ${_('auth.copy_token_from_address')}
                </div>
                
                <div>
                    <b>${_('auth.optional')}</b>

                    <div class='flex flex_column' style='gap:5px;'>
                        <div>
                            <p>${_('auth.auth_choose_app')}</p>
                            <select id='__appChoose'></select>
                        </div>

                        <div>
                            <p>${_('auth.auth_oauth_link')}</p>
                            <input type='text' id='__ouathUrl' value='https://oauth.vk.com/authorize'>
                        </div>
                    </div>
                </div>
            `)

            window.consts.ACCOUNTS_OAUTH_APPS.forEach(app => {
                u('.auth_block_input #__appChoose').append(`
                    <option value='${app.app_id}'>${app.name}</option>
                `)
            })

            u('.auth_block_input').on('click', '#_authentificate', async () => {
                if(u(`#__ouathUrl`).nodes[0].value == '') {
                    return
                }

                const api_url = u(`#__ouathUrl`).nodes[0].value
                const app_id = u(`#__appChoose`).nodes[0].value
                const so_link = api_url + `?client_id=${app_id}&scope=${window.consts.ACCOUNTS_MAX_SCOPE}&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1`
                
                window.open(so_link)

                u(`.tabs a[data-section='token']`).trigger('click')
            })

            break
        case 'token':
            u('.auth_block_input').html(`
                <div>
                    <p>${_('auth.auth_enter_token_desc')}</p>

                    <div class='flex flex_column' style='gap:5px;align-items: end;'>
                        <input type='text' id='__ouathToken' placeholder='${_('auth.auth_enter_token')}'>
                    </div>
                </div>
                
                <div>
                    <b>${_('auth.optional')}</b>

                    <div class='flex flex_column' style='gap:5px;'>
                        <p>${_('auth.auth_api_url')}</p>
                        <input type='text' id='__apiUrl' value='https://api.vk.com/method/'>
                    </div>
                </div>
            `)

            break
    }

    u(msg.getNode()).on('click', '.tabs a', (e) => {
        msg.close()
        loginBox(e.target.dataset.section)
    })
}
