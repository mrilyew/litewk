window.routes = [
    {
        'url': 'id{id}',
        'script_name': 'user_page'
    },
    {
        'url': 'search/{section}',
        'script_name': 'search_page'
    },
    {
        'url': 'groups{id}/{section}',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups{id}',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups/{section}',
        'script_name': 'groups_page'
    },
    {
        'url': 'event{id}',
        'script_name': 'club_page'
    },
    {
        'url': 'public{id}',
        'script_name': 'club_page'
    },
    {
        'url': 'group{id}',
        'script_name': 'club_page'
    },
    {
        'url': 'club{id}',
        'script_name': 'club_page'
    },
    {
        'url': 'login/{section}',
        'script_name': 'auth_page'
    },
    {
        'url': 'login',
        'script_name': 'auth_page'
    },
    {
        'url': 'fave/{tag}/{section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'fave/{section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'fave',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks/{tag}/{section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks/{section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks',
        'script_name': 'faves_page'
    },
    {
        'url': 'settings/{section}',
        'script_name': 'settings_page'
    },
    {
        'url': 'settings',
        'script_name': 'settings_page'
    },
    {
        'url': 'friends{id}/{section}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends{id}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends/{section}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends',
        'script_name': 'friends_page'
    },
    {
        'url': 'feed/{section}',
        'script_name': 'news_page'
    },
    {
        'url': 'feed',
        'script_name': 'news_page'
    },
    {
        'url': 'wall{owner_id}_{post_id}',
        'script_name': 'post_page'
    },
    {
        'url': 'wall{owner_id}/{section}',
        'script_name': 'wall_page'
    },
    {
        'url': 'wall{owner_id}',
        'script_name': 'wall_page'
    },
    {
        'url': 'away',
        'script_name': 'resolve_link'
    },
    {
        'url': 'search',
        'script_name': 'search_page'
    },
    {
        'url': '{shortcode}',
        'script_name': 'shortcode_page'
    },
]

class Router {
    reset_page() {
        $('#_main_page_script').remove()
        $('.page_content')[0].innerHTML = ``
        
        window.page_class = null
        window.temp_scroll = null
    }
    
    restart(add, condition = '') {
        let temp_menu = $('.menu')[0].innerHTML

        $('style').remove()
        $('div').remove()
        
        window.main_class.load_layout(add)
        $(document).trigger('scroll')

        if(condition != 'ignore_menu') {
            $('.menu')[0].innerHTML = temp_menu
        }
    }

    parse_route(url) {
        for(let route of window.routes) {
            const formatted_route = Utils.escape_html(route.url)
            const pattern = formatted_route.replace(/\{([^}]+)\}/g, '([^/]+)')
            const match = url.match(pattern)
            
            if(match) {
                const t_matches = route.url.match(/\{([^}]+)\}/g)
                let params = []

                if(t_matches && t_matches.length > 0) {
                    params = t_matches.map(placeholder => placeholder.slice(1, -1))
                }

                return {'route': route, 'params': params, 'match': match}
            }
        }

        return null
    }

    async route(input_url, history_log = true) {
        let url = input_url

        if(!url || url == '' || url == location.origin + location.pathname) {
            if(window.active_account) {
                url = location.origin + location.pathname + '#id0'
            } else {
                url = location.origin + location.pathname + '#settings'
            }
        }

        if(url.indexOf(location.origin) == -1) {
            url = location.origin + location.pathname + url
        }

        let may = SavedPage.find(url)

        if(may && may.info.url.indexOf('login') == -1 && may.info.url.indexOf('settings') == -1 && may.info.url.indexOf('away') == -1) {
            may.load()
            return
        }

        this.reset_page()

        let splitted_url = url.split('#')
        let found_route  = this.parse_route(splitted_url[1])

        if(found_route) {
            if(history_log && location.hash != url) {
                Utils.push_state(url)
            }

            let matches = found_route['match']
            let params  = found_route['params']
            let final_params = {}

            params.forEach((name, index) => {
                final_params[name] = matches[index + 1]
            })

            window.main_class['hash_params'] = final_params
            await Utils.append_script(`assets/js/pages/${found_route['route'].script_name}.js`, true)

            SavedPage.save(url)
        } else {
            $('.page_content')[0].innerHTML = '404'
        }

        window.main_class.init_observers()
        $(document).trigger('scroll')
    }
}

class SavedPage {
    constructor(page) {
        if(!page) {
            return null
        }

        this.info = page
    }

    getInfo() {
        return {
            'url': this.info.url,
            'html': this.info.html,
            'classes': this.info.classes,
            'scroll': this.info.scroll,
            'temp_scroll': this.info.temp_scroll,
            'title': this.info.title
        }
    }

    load() {
        window.main_classes = null
        window.main_classes = this.info.classes
        window.temp_scroll  = this.info.temp_scroll
        document.title = this.info.title
        
        Utils.replace_state(this.info.url)

        $('.page_content')[0].innerHTML = this.info.html
        window.main_class.init_observers()
        
        window.scrollTo(0, this.info.scrollY)
        $(document).trigger('scroll')
    }

    static get() {
        let pages = []

        window.saved_pages.forEach(el => {
            pages.push(new this(el))
        })

        return pages
    }

    static find(url) {
        let found_page = window.saved_pages.find(el => el.url == url)

        if(!found_page || found_page == undefined) {
            return null
        }

        return new this(found_page)
    }

    static save(url) {
        let found_page = SavedPage.find(url)
        let copied_classes = Object.assign({}, window.main_classes)
        //debugger
        let insert = {
            'url': url,
            'html': $('.page_content')[0].innerHTML,
            'classes': copied_classes,
            'scroll': window.scrollY,
            'temp_scroll': window.temp_scroll,
            'title': document.title
        }

        if(found_page && window.saved_pages.indexOf(found_page.getInfo()) != -1) {
            window.saved_pages[window.saved_pages.indexOf(found_page.getInfo())] = insert
        } else {
            window.saved_pages.push(insert)
        }

        return true
    }
}