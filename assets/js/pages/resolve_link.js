window.page_class = new class {
    async render_page() {
        let text = window.s_url.searchParams.get('id')
        let link_start = window.s_url.origin + window.s_url.pathname
        let link = ''

        if(!text) {
            not_found_not_specified()
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
            if(text.indexOf('club') != -1) {
                let id = text.replace('club', '')
                link = link_start + '#club'+id
            } else if(text.indexOf('id') != -1) {
                let id = text.replace('id', '')
                link = link_start + '#id'+id
            } else if(text.indexOf('app') != -1) {
                let id = text.replace('app', '')
                link = link_start + '#app'+id
            } else if(text.indexOf('wall') != -1) {
                let id = text.replace('wall', '')
                link = link_start + '#wall'+id
            } else {
                let res = await window.vk_api.call('utils.resolveScreenName', {'screen_name': text})
                let page = ''
    
                if(!res.response.type) {
                    window.location.assign('https://vk.com/' + text)
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
