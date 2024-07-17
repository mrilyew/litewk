class VkApi {
    constructor(url, token) {
        this.url = url
        this.token = token
    }

    async call(method, params = [], force = true) {
        let path = this.url + method + `?v=5.199&access_token=` + this.token + '&' + $.param(params)
        let result = null

        try {
            if(window.site_params.get('internal.use_proxy', '0') == '1') {
                path = `https://api.allorigins.win/get?url=${encodeURIComponent(path)}`
                result = JSON.parse(await Utils.jsonp(path))
                result = JSON.parse(result.contents)
            } else {
                result = JSON.parse(await Utils.jsonp(path))
            }
        } catch(ex) {
            if(!force) {
                let msg = new MessageBox(_('errors.network_error'), Utils.cut_string(ex.message, 500), ['OK'], [() => {msg.close()}])
            }

            console.error(ex)
            return
        }

        if(window.site_params.get('ux.online_status', 'none') == 'method_call' && method != 'account.setOnline') {
            await this.call('account.setOnline')
        }
        
        console.log(`Called method ${method} with params ${JSON.stringify(params)} with force=${String(force)}`)
        
        if(!force) {
            //log(`NO FORCE, result: `)
            //log(result)

            return result
        }

        if(result.error) {
            switch(result.error.error_code) {
                default:
                case 0:
                    console.log(`${method} with params ${JSON.stringify(params)} caused error: ${result.error.error_code} '${result.error.error_msg}'`)
                    
                    window.main_class.add_error(_('errors.vk_api_error', result.error.error_msg), 'vkapierr')
                    document.cookie = ''
                    return result
                case 14:
                    console.log(`${method} caused captcha`)
                    return new Promise((resolve, reject) => {
                        let sid = result.error.captcha_sid

                        document.cookie = ''
                        let msg = new MessageBox(_('captcha.enter_captcha'), `
                            <div class='captcha_box'>
                                <div>
                                    <img src='${result.error.captcha_img}'>
                                </div>
                                <input type='text' id='_captchaEnter' placeholder='${_('captcha.enter_captcha_there')}'>
                            </div>
                        `, [_('messagebox.cancel'), _('messagebox.enter')], [
                            () => {
                                console.log('Captcha closed.')
                                msg.close()
                            },
                            () => {
                                let new_params = params

                                new_params.captcha_sid = sid
                                new_params.captcha_key = $('#_captchaEnter')[0].value

                                msg.close()

                                console.log('Entered captcha.')
                                resolve(this.call(method, new_params, force))
                            }
                        ])
                    })
            }
        } else {
            document.cookie = ''
            return result
        }
    }

    async resolveScreenName(link) {
        let res = await this.call('utils.resolveScreenName', {'screen_name': link}, false)
        res = res.response

        return res
    }
}
