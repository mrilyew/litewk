window.Utils = new class {
    typical_fields = 'common_count,country,city,id,is_favorite,is_hidden_from_feed,image_status,last_seen,online,lists,friend_status,photo_50,photo_100,photo_200,photo_orig,status,sex'
    typical_group_fields = 'activity,photo_100,description,members_count'
    
    compute_age(date) {
        let age = moment().diff(moment(date, "DD-MM-YYYY"), 'years')

        return _('time.age', age)
    }

    format_birthday(bdate) {
        if(!bdate) {
            return _('hidden')
        }

        let tempdate = bdate.split('.')

        if(tempdate[2]) {
            let moment_tempdate = moment(bdate, 'DD.MM.YYYY')
            bdate = moment_tempdate.format('DD.MM.YYYY')

            bdate += ': ' + this.compute_age(bdate)
        } else {
            let moment_tempdate = moment(bdate, 'DD.MM')
            bdate = moment_tempdate.format('DD.MM')
        }

        return bdate
    }

    find_owner_in_arrays(id, profiles = [], groups = []) {
        if(id < 0) {
            return groups.find(item => item.id == Math.abs(id))
        } else {
            return profiles.find(item => item.id == Math.abs(id))
        }
    }

    find_owner_in_arrays_and_return_entity(id, profiles = [], groups = []) {
        if(id < 0) {
            let res = groups.find(item => item.id == Math.abs(id))

            let entity = new Club
            entity.hydrate(res)

            return entity
        } else {
            let res = profiles.find(item => item.id == Math.abs(id))

            let entity = new User
            entity.hydrate(res)

            return entity
        }
    }

    random_int(min, max) {
        return Math.round(Math.random() * (max - min) + min)
    }

    escape_html(text) {
        try {
            return text.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        } catch(e) {
            return ''
        }
    }

    nl2br(text) {
        return text.replace(/(\r\n|\n\r|\r|\n)/g, '<br>')
    }

    format_links(text)
    {
        return text.replace(/(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig, 
        `<a href='#away?id=$1' target='_blank'>$1</a>`)
    }

    format_hashtags(text) 
    {
        return text.replace(/#(\S*)/g, `<a href='#search/posts?query=#$1'>#$1</a>`)
    }

    format_mentions(text)
    {
        return text.replace(/\[([^|]+)\|([^\]]+)\]/g, `<a href="#away?id=$1">$2</a>`)
    }

    format_emojis(text)
    {
        if(window.site_params.get('ux.twemojify', '1') == '0') {
            return text
        }

        return twemoji.parse(text)
    }

    format_text(text) {
        let formatted_text = text

        formatted_text = this.escape_html(formatted_text)
        formatted_text = this.nl2br(formatted_text)
        formatted_text = this.format_hashtags(formatted_text)
        formatted_text = this.format_mentions(formatted_text)
        formatted_text = this.format_links(formatted_text)
        formatted_text = this.format_emojis(formatted_text)

        return formatted_text
    }

    format_seconds(duration) 
    {
        let my_time = moment.duration(duration * 1000)
        let hours = String(my_time.hours()).padStart(2, '0')
        let minutes = String(my_time.minutes()).padStart(2, '0')
        let seconds = String(my_time.seconds()).padStart(2, '0')

        return `${hours && hours > 0 ? hours + ':' : ''}${minutes}:${seconds}`
    }

    format_file_size(bytes, si = null) 
    {
        let thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        let units = si
            ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
            : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    }

    append_script(link, toBody = false, script_name = '') {
        return new Promise( function (resolve, reject) {
            let script = document.createElement('script')
            script.src = link
            script.async = "true";
            script.setAttribute('id', '_main_page_script')
            script.setAttribute('data-name', script_name)

            script.onerror = () => {
                reject( Error("Network error loading " + script.src) );
            }

            script.onload = async () => {
                await window.page_class.render_page()

                $('textarea').trigger('input')
                resolve(true)
            }

            if(!toBody) {
                document.head.appendChild(script)
            } else {
                document.body.appendChild(script)
            }
        }) 
    }

    async resolve_city(id)
    {
        try {
            let cities_cache = JSON.parse(localStorage.cities_cache ?? `[{"id": "1", "name": "Москва"}]`)
            let seek_city = cities_cache.find(item => item.id == id)
            
            if(seek_city) {
                return seek_city.name
            } else {
                let city = await window.vk_api.call('database.getCitiesById', {'city_ids': id})

                cities_cache.push({'id': id, 'name': city.response[0].title})
                localStorage.cities_cache = JSON.stringify(cities_cache)
        
                return city.response[0].title
            }
        } catch(e) {
            console.error(e)

            return 'Воркута'
        }
    }

    async resolve_club(id)
    {
        let clubs_cache = JSON.parse(localStorage.clubs_cache ?? `[{"id": "0", "name": "API"}]`)
        let seek_club = clubs_cache.find(item => item.id == id)
        
        if(seek_club) {
            return seek_club
        } else {
            let club = await window.vk_api.call('groups.getById', {'group_id': id})

            clubs_cache.push(club.response.groups[0])
            localStorage.clubs_cache = JSON.stringify(clubs_cache)

            return club.response.groups[0]
        }
    }

    // https://gist.github.com/walsh9/c4722c5f3c90e1cc0a5b
    jsonp(url, def_timeout = 20000) {
        function urlJoinChar(url) {
            return url.indexOf('?') >= 0 ? '&' : '?'
        }

        return new Promise( function (resolve, reject) {
            var timeout = def_timeout || 10000; // default timeout
            var callbackName = 'jsonp_callback_' + Date.now();
            var head = document.getElementsByTagName('head')[0] || document.documentElement;
            var script = document.createElement('script');
            script.src = url +  urlJoinChar( url ) + 'callback=' + callbackName;
            script.async = "true";

            window[callbackName] = function(data) {
                cleanUp()
                resolve(JSON.stringify(data))
            }

            script.onerror = function() {
                cleanUp()
                reject(new Error("Network error loading " + script.src) )
            }

            head.appendChild(script)
            var timeoutFunction = setTimeout(function() {
                cleanUp();
                reject(new Error("Request to " + url + " failed to execute callback after " + timeout + "ms.") )  
            }, timeout);
    
            function cleanUp() {
                timeoutFunction && clearTimeout(timeoutFunction)
                window[callbackName] && delete window[callbackName]
                script && head.removeChild(script)

                document.cookie = ''
            }
        } )
    }

    push_state(url)
    {
        history.pushState({'go': 1}, null, url)
        
        window.main_url = new BetterURL(location.href)
    }

    replace_state(url)
    {
        history.replaceState({'go': 1}, null, url)

        window.main_url = new BetterURL(location.href)
    }

    // клянусь джаваскрипт ненавидеть
    array_splice(array, key)
    {
        let resultArray = [];

        for(let i = 0; i < array.length; i++){
            if(i != key){
                resultArray.push(array[i]);
            }
        }

        return resultArray;
    }

    array_swap(array, first, last) 
    {
        let temp = array[first]
        array[first] = array[last]
        array[last] = temp

        return array
    }

    not_found_not_specified()
    {
        window.location.assign('https://youtu.be/QR8PVIaqW_A?ref=litewk')
    }

    cut_string(string, length = 0) {
        const newString = string.substring(0, length)

        return newString + (string !== newString ? "…" : "")
    }

    array_deep_search(obj, query) 
    {
        if(typeof obj !== 'object' || obj === null) {
            return String(obj).toLowerCase().includes(query.toLowerCase())
        }
    
        return Object.values(obj).some(value => {
            if(Array.isArray(value)) {
                return value.some(item => Utils.array_deep_search(item, query))
            }

            return Utils.array_deep_search(value, query)
        })
    }

    short_date(unix_time, need_time = true, hide_year = false) {
        let date = new Date(unix_time * 1000)
        let current_date = new Date()
        
        switch(window.site_params.get('ui.date_format')) {
            default:
            case 'default':
                return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}${hide_year ? '' : '.' + date.getFullYear()} ` + (need_time ? `в ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
            case 'month':
                if(current_date.getFullYear() != date.getFullYear()) {
                    return _('time.date_formatted_month', String(date.getDate()).padStart(2, '0'), _(`time.month_${date.getMonth()+1}_gen`), hide_year ? '' : '' + date.getFullYear(), need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
                } else {
                    return _('time.date_formatted_month_no_year', String(date.getDate()).padStart(2, '0'), _(`time.month_${date.getMonth()+1}_gen`), need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
                }
                
        }
    }

    debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            };
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    async sleep(time) {
        return await new Promise(r => setTimeout(r, time));
    }
}