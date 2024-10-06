class VkApi {
    constructor(url, token) {
        this.api_url = url
        this.api_token = token
    }

    async recieveToken() {
        this.api_token = prompt('Enter new token:')
        return this.api_token
    }

    async call(...args) {
        try {
            if(typeof args[0] == 'object') {
                return await this.callModern(args[0])
            } else {
                return await this.callClassic(args[0], args[1], args[2])
            }
        } catch(e) {
            throw e
        }
    }

    async callClassic(method, params = {}, raw_result = false, flash_error = false) {
        return await this.callModern({method: method, params: params, raw_result: raw_result, flashError: flash_error})
    }

    async callModern(params = {method: '', params: {}, raw_result: false, flashError: false}) {
        const url = new URL(this.api_url + params.method)

        // Setting params
        url.searchParams.set('v', window.consts.VK_API_VERSION)
        if(window.main_url.hasParam('v_override')) {
            url.searchParams.set('v', window.main_url.getParam('v_override'))
        }

        if(this.api_token) {
            url.searchParams.set('access_token', this.api_token)
        }

        url.searchParams.set('lang', window.lang.lang_info.short_name)

        if(window.main_url.hasParam('lang_override')) {
            url.searchParams.set('lang', window.main_url.getParam('lang_override'))
        }

        /*url.searchParams.set('https', 1)
        if(window.site_params.get('internal.enable_tracking', '0') == '1') {
            url.searchParams.set('track_events', 1)
        }*/

        Object.entries(params.params ?? {}).forEach(([index, key]) => {
            url.searchParams.set(index, key)
        })

        let path = ''
        if(window.settings_manager.getItem('internal.use_proxy_everywhere').isChecked()) {
            path = `${window.settings_manager.getItem('internal.proxy_url').getValue()}${encodeURIComponent(url.href)}`
            
            if(window.settings_manager.getItem('internal.proxy_useragent').getValue() != '') {
                path += `&userAgent=` + window.settings_manager.getItem('internal.proxy_useragent').getValue()
            }
        } else {
            path = url.href
        }

        let result = null
        try {
            result = await Utils.request(path, true)
        } catch(ex) {
            console.info(`VKAPI | ${params.method} did not respond; error: `, ex)
            return
        }
        
        if(params.flashError && result.error) {
            Utils.vklikeError(result.error.error_code + ': ' + result.error.error_msg)
        }

        if(params.raw_result) {
            return result
        }
        
        if(window.settings_manager.getItem('ux.online_status').isEqual('method_call') && params.method != 'account.setOnline') {
            await this.accountSetOnline()
        }
        
        if(result.error) {
            const error = result.error
            console.log(`VKAPI | ${params.method} caused error: ${error.error_code} '${error.error_msg}'`)

            switch(error.error_code) {
                case 104:
                    throw new ApiNotFoundError(error.error_msg, error.error_code)
                // Account was banned error
                case 5:
                    if(!error.ban_info) {
                        break
                    }

                    const ban_info = error.ban_info
                    Utils.fastmessagebox_error(_('errors.page_has_blocked'), _('errors.page_has_blocked_desc', ban_info.restore_url))

                    break
                case 9:
                    Utils.fastmessagebox_error('Flood control', _('errors.page_floodcontrolled'))
                    
                    break
                // Rate limit error
                case 14:
                    return new Promise((resolve, reject) => {
                        const sid = error.captcha_sid
                        const msg = new MessageBox(_('captcha.enter_captcha'), `
                            <div class='captcha_box'>
                                <div>
                                    <img src='${error.captcha_img}'>
                                </div>
                                <input type='text' id='_captchaEnter' placeholder='${_('captcha.enter_captcha_there')}'>
                            </div>
                        `, [_('messagebox.cancel'), _('messagebox.enter') + '|primary'], [
                            () => {
                                msg.close()
                            },

                            () => {
                                params.params.captcha_sid = sid
                                params.params.captcha_key = u('#_captchaEnter').nodes[0].value
                                msg.close()

                                resolve(this.call(params))
                            }
                        ])
                    })
                // Token expired error
                case 1114:
                    await this.recieveToken()
                    return this.call(params)
            }

            throw new ApiError(error.error_msg, error.error_code)
        }
        
        return result.response
    }

    async accountSetOnline() {
        return await this.call({method: 'account.setOnline'})
    }

    async resolveScreenName(link) {
        let res = await this.call({method: 'utils.resolveScreenName', params: {'screen_name': link}, raw_result: true})

        return res.response
    }

    // Буквально использую метод инфоаппа, ибо сам не знаю как делается эта магия.
    async getAdminedGroupsByUser(id) 
    {
        if(!this.infoapp_launch_params) {
            const params = await this.call('apps.getAppLaunchParams', {'mini_app_id': '7183114', 'referer': 'vk.com'})
            this.infoapp_launch_params = params
        }

        let launch_params_encoded_arr = []
        Object.entries(this.infoapp_launch_params).forEach(param => {
            launch_params_encoded_arr.push(`${param[0]}=${param[1]}`)
        })
        let launch_params_encoded = launch_params_encoded_arr.join('&')

        const origin = 'https://prod-app7183114-b92d4fa7941e.pages-ac.vk-apps.com'
        const url = `https://infoapp-api.i1l.ru/method/getGroups?origin=${origin}`
        const formdata = new FormData
        formdata.append('id', id)
        formdata.append('v', '41eaff84')

        const result = await fetch(`${window.settings_manager.getItem('internal.proxy_url').getValue()}${encodeURIComponent(url)}`, {
            body: new URLSearchParams([...formdata.entries()]),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Vk-Sign': launch_params_encoded,
            },
            method: 'POST',
        })

        return await result.json()
    }
}

class AnonymousVkApi extends VkApi {
    async recieveToken() 
    {
		try {
			const anonym_url = 'https://login.vk.com/?act=get_anonym_token'
			const post_params = new FormData
			post_params.append('client_secret', 'QbYic1K3lEV5kTGiqlq2')
			post_params.append('client_id', '6287487')
			post_params.append('scopes', 'audio_anonymous,video_anonymous,photos_anonymous,profile_anonymous')
			post_params.append('version', '1')
			post_params.append('app_id', '6287487')

			if(window.site_params.has('anonymous_token')) {
				post_params.append('access_token', window.site_params.get('anonymous_token'))
			}
			
			const token = await Utils.request(`${window.settings_manager.getItem('internal.proxy_url').getValue()}${encodeURIComponent(anonym_url)}&origin=https://vk.com`, false, post_params)
			if(token.type != 'okay') {
				throw new Error
			}

			window.site_params.set('anonymous_token', token.data.access_token)

			this.api_token = window.site_params.get('anonymous_token')
		} catch(e) {
			console.log(e)
		}
    }
}

class AnonymousDocumentationVkApi extends AnonymousVkApi {
    async recieveToken() 
    {
        const token = await Utils.request(`${window.settings_manager.getItem('internal.proxy_url').getValue()}${encodeURIComponent('https://dev.vk.com/getAnonymousToken')}&origin=dev.vk.com`)
        window.site_params.set('anonymous_docs_token', token.response.token)

        this.api_token = window.site_params.get('anonymous_docs_token')
    }
}
