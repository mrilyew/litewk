if(!window.pages) {
    window.pages = {}
}

window.pages['auth_page'] = new class {
    render_page() {
        const current_tab = window.main_class['hash_params'].section ?? 'oauth'
        main_class.changeTitle(_('auth.auth'))

        u('.page_content').html(`
            <div class='auth_wrapper'>
                <div class='bordered_block auth_block'>
                    <div class='tabs'>
                        <a href='#login/oauth' data-section='ouath' ${current_tab == 'oauth' ? `class='selected'` : ''}>OAuth</a>
                        <a href='#login/token' data-section='token' ${current_tab == 'token' ? `class='selected'` : ''}>${_('auth.by_token')}</a>
                    </div>

                    <div class='auth_block_input'></div>
                </div>
            </div>
        `)

        switch(current_tab) {
            default:
            case 'direct':
                const limited = window.site_params.get('internal.use_proxy', '0') == '0'

                u('.page_content .auth_block_input').html(`
                    <input type='text' style='margin-bottom: -4px;' disabled id='__authUrl' value='https://oauth.vk.com/token'>
                    <input type='text' disabled id='__authMethod' value='https://api.vk.com/method/'>

                    <div>
                        <input type='text' style='margin-bottom: -4px;' id='__authLogin' placeholder='${_('auth.login')}'>
                        <input type='password' id='__authPussword' placeholder='${_('auth.password')}'>
                    </div>

                    <select id='__appChooseStraight'></select>

                    ${limited ? _('auth.auth_enter_login_also') : _('auth.auth_enter_login')}

                    <input style='margin-top: 6px;' type='button' id='_aut' value='${_('auth.auth')}'>
                `)

                window.consts.ACCOUNTS_DIRECT_AUTH_APPS.forEach(el => {
                    u('#__appChooseStraight').append(`
                        <option value='${el.client_id}'>${el.name}</option>
                    `)
                })
                                
                u('.auth_block_input #_aut').on('click', async () => {
                    if(u(`#__authUrl`).nodes[0].value == '' || $(`#__authLogin`).nodes[0].value == '') {
                        main_class.addError(_('errors.not_all_fields'), 'fill_form')
                        return
                    }

                    const auth_url = u(`#__authUrl`).nodes[0].value
                    const auth_method = u(`#__authMethod`).nodes[0].value
                    const auth_login = u(`#__authLogin`).nodes[0].value
                    const auth_pass = u(`#__authPussword`).nodes[0].value
                    const app_id = u(`#__appChooseStraight`).nodes[0].value

                    const app = window.consts.ACCOUNTS_DIRECT_AUTH_APPS.find(app => app.client_id == app_id)
                    const app_secret = app.client_secret

                    let so_link = auth_url + `?grant_type=password&client_id=${app_id}&client_secret=${app_secret}&scope=${window.consts.ACCOUNTS_MAX_SCOPE}&username=${auth_login}&password=${auth_pass}&2fa_supported=1`
                
                    if(window.site_params.get('internal.use_proxy', '0') == '0') {
                        window.open(so_link)

                        u(`.tabs a[data-section='token']`).trigger('click')
                    } else {
                        const path = `${window.site_params.get('internal.proxy_url', 'https://api.allorigins.win/get?url=')}${encodeURIComponent(so_link)}`
                        let result = JSON.parse(await Utils.jsonp(path))

                        if(path.indexOf('api.allorigins.win') != -1) {
                            result = JSON.parse(result.contents)
                        }

                        if(result.error) {
                            main_class.addError(result.error_description, 'api-err')
                        } else {
                            const get_token = result.access_token
                        
                            if(await window.accounts.addAccount(auth_method, get_token)) {
                                window.router.restart('', 'ignore_menu')
                                window.router.route(document.querySelector('base').href + `#id0`)
                            }
                        }
                    }
                })

                break
            case 'oauth':
                u('.page_content .auth_block_input').html(`
                    <p>${_('auth.auth_choose_app')}</p>

                    <input type='text' disabled id='__ouathUrl' value='https://oauth.vk.com/authorize'>
                    <select id='__appChoose'></select>

                    <input type='button' id='_authentificate' value='${_('auth.auth')}'>
                    ${_('auth.copy_token_from_address')}
                `)

                window.consts.ACCOUNTS_OAUTH_APPS.forEach(app => {
                    u('.auth_block_input #__appChoose').append(`
                        <option value='${app.app_id}'>${app.name}</option>
                    `)
                })

                break
            case 'token':
                u('.page_content .auth_block_input').html(`
                    <p>${_('auth.auth_enter_token')}</p>
                    
                    <input type='text' id='__ouathToken' placeholder='${_('auth.auth_enter_token')}'>
                    <input type='text' id='__apiUrl' value='https://api.vk.com/method/'>

                    <input type='button' id='_authentificate' value='${_('auth.auth')}'>

                    ${_('auth.auth_token_description')}
                `)

                break
        }
    }

    execute_buttons() 
    {
        const current_tab = window.main_class['hash_params'].section ?? 'oauth'
        
        switch(current_tab) {
            case 'oauth':
                u('.auth_block_input #_authentificate').on('click', async () => {
                    if(u(`#__ouathUrl`).nodes[0].value == '') {
                        main_class.addError(_('errors.not_all_fields'), 'fill_form')
                        return
                    }

                    let api_url = u(`#__ouathUrl`).nodes[0].value
                    let app_id = u(`#__appChoose`).nodes[0].value
                    let so_link = api_url + `?client_id=${app_id}&scope=${window.consts.ACCOUNTS_MAX_SCOPE}&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1`
                    
                    window.open(so_link)

                    u(`.tabs a[data-section='token']`).nodes[0].click()
                })
                break
            case 'token':
                u('.auth_block_input #_authentificate').on('click', async () => {
                    if(u(`#__apiUrl`).nodes[0].value == '' || u(`#__ouathToken`).nodes[0].value == '') {
                        main_class.addError(_('errors.not_all_fields'), 'fill_form')
                        return
                    }

                    const result = await window.accounts.addAccount(u('#__apiUrl').nodes[0].value, u('#__ouathToken').nodes[0].value)

                    if(result) {
                        window.router.restart('', 'ignore_menu')
                        window.router.route('#id0')
                    }
                })

                break
        }
    }
}
