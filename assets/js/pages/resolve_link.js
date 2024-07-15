window.page_class = new class {
    async render_page() {
        let text = window.main_url.getParam('id') ?? window.main_class['hash_params'].id
        let link_start = window.main_url.origin + window.main_url.pathname
        let link = null

        if(!text) {
            Utils.not_found_not_specified()
        }

        const special_addresses = [
            'https://vk.com/', 
            'https://vkontakte.ru/', 
            'http://vk.com/', 
            'http://vkontakte.ru/', 
            'https://m.vk.com/', 
            'http://m.vk.com/',
            'https://new.vk.com/',
            'http://new.vk.com/',
            'https://wap.vk.com/',
            'http://wap.vk.com/',
            'https://0.vk.com/',
            'http://0.vk.com/',
        ]
        
        special_addresses.forEach(address => {
            text = text.replace(address, '')
        })

        if(text.indexOf('https://') != -1 || text.indexOf('http://') != -1) {
            let res = await window.vk_api.call('utils.checkLink', {'url': text})
            
            if(res.response.status != 'not_banned') {
                $('.page_content')[0].insertAdjacentHTML('beforeend', `
                    <div class="onpage_error" style='width: 400px;'>
                        ${_('navigation.suspicious_link')}

                        <div class='away_buttons'>
                            <input type='button' id='__awayno' value='${_('messagebox.no')}'>
                            <input type='button' id='__awayes' value='${_('messagebox.yes')}'>
                        </div>
                    </div>
                `)

                $('#__awayno').on('click', (e) => {
                    window.router.route(link_start + '#id0')
                })

                $('#__awayes').on('click', (e) => {
                    window.open(text, '_blank')
                })
            } else {
                window.location.assign(text)
            }

            return
        }

        if(Boolean(parseInt(text))) {
            let inter = parseInt(text)
            if(inter > 0) {
                link = link_start + '#id'+inter
            } else {
                link = link_start + '#club'+Math.abs(inter)
            }
        } else {
            let id = null

            if(text.indexOf('club') != -1) {
                id = text.replace('club', '')

                if(!isNaN(parseInt(id))) {
                    link = link_start + '#club'+id
                }
            } else if(text.indexOf('id') != -1) {
                id = text.replace('id', '')
                
                if(!isNaN(parseInt(id))) {
                    link = link_start + '#id'+id
                }
            } else if(text.indexOf('app') != -1) {
                id = text.replace('app', '')
                
                if(!isNaN(parseInt(id))) {
                    link = link_start + '#app'+id
                }
            } else if(text.indexOf('wall') != -1) {
                id = text.replace('wall', '')

                if(!isNaN(parseInt(id))) {
                    link = link_start + '#wall'+id
                }
            }

            if(!link) {
                let res = await window.vk_api.call('utils.resolveScreenName', {'screen_name': text})
                let page = ''
    
                if(!res.response.type) {
                    $('.page_content')[0].insertAdjacentHTML('beforeend', `
                        <div class="onpage_error" style='width: 400px;'>
                            ${_('navigation.not_found_shortcode')}
        
                            <div class='away_buttons'>
                                <input type='button' id='__gono' value='${_('messagebox.no')}'>
                                <input type='button' id='__goyes' value='${_('messagebox.yes')}'>
                            </div>
                        </div>
                    `)
        
                    $('#__gono').on('click', (e) => {
                        history.back()
                    })
        
                    $('#__goyes').on('click', (e) => {
                        window.open('https://vk.com/' + text, '_blank')
                    })
                    return
                }

                switch(res.response.type) {
                    case 'user':
                        page = 'id'
                        break
                    case 'group':
                    case 'event':
                    case 'page':
                        page = 'club'
                        break
                    case 'application':
                    case 'vk_app':
                        page = 'app'
                        break
                }
    
                link = link_start + `#${page}${res.response.object_id}`
            }
        }
        
        window.router.route(link)
    }
}
