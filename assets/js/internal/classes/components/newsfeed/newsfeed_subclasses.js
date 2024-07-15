class NewsfeedClass extends Post {
    hydrate(info, profiles, groups) {
        this.info = info
        this.profiles = profiles
        this.groups   = groups
    }

    getOwnerID() {
        return this.info.source_id
    }
}

class WallPhoto extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = window.templates.post(this, {'added_photos': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        diver.querySelector('.post_date a').removeAttribute('href')

        this.info.photos.items.forEach(att => {
            att.photo = att
            att.type = 'photo'
        })

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', window.templates.attachments(this.info.photos.items))

        return diver.innerHTML
    }
}

class WallTag extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = window.templates.post(this, {'tagged_photo': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        diver.querySelector('.post_date a').removeAttribute('href')

        this.info.photo_tags.items.forEach(att => {
            att.photo = att
            att.type = 'photo'
        })

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', window.templates.attachments(this.info.photo_tags.items))

        return diver.innerHTML
    }
}

class WallVideo extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = window.templates.post(this, {'uploaded_videos': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        diver.querySelector('.post_date a').removeAttribute('href')

        this.info.video.items.forEach(att => {
            att.video = att
            att.type = 'video'
        })

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', window.templates.attachments(this.info.video.items))

        return diver.innerHTML
    }
}

class WallAudio extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = window.templates.post(this, {'uploaded_videos': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        diver.querySelector('.post_date a').removeAttribute('href')

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', window.templates.attachments(this.info.attachments))

        return diver.innerHTML
    }
}

class Newsfeed extends ClassicListView {
    constructor(insert_node, error_message = 'No_count)') {
        super(null, insert_node, error_message)
        this.insert_node   = insert_node
    }

    setParams(method_name, method_params) 
    {
        this.method_name = method_name
        this.method_params = method_params
    }

    async nextPage() {
        let objects_data = null

        let error = () => {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_news', objects_data.error.error_msg)}</div>
            `)
        }

        try {
            if(window.use_execute) {
                objects_data = await window.vk_api.call('execute', {'code': `
                    var all = []; 
                    var news = API.${this.method_name}(${JSON.stringify(this.method_params)}); 
                    ${!this.method_params.start_from ? 
                    `var lists = API.newsfeed.getLists();
                    all.lists = lists; 
                    ` : ''}
                    all.news = news; 
                    
                    
                    return all;
                `}, false)
            } else {
                objects_data = {'response': {}}
                let news = await window.vk_api.call(this.method_name, this.method_params)

                if(!this.method_params.start_from) {
                    let lists = await window.vk_api.call('newsfeed.getLists')
                    objects_data.response.lists = lists.response
                }

                objects_data.response.news = news.response
            }
        } catch(e) {
            error()
            return
        }

        let templates = ''
        this.lists = objects_data.response.lists

        if(objects_data.response.news.items.length < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.search_not_found')}</div>
            `)
            return
        }

        objects_data.response.news.items.forEach(obj => {
            let object_class = Post

            switch(obj.type) {
                case 'post':
                    object_class = Post
                    break
                case 'wall_photo':
                    object_class = WallPhoto
                    break
                case 'photo_tag':
                    object_class = WallTag
                    break
                case 'video':
                    object_class = WallVideo
                    break
                case 'audio':
                    object_class = WallAudio
                    break
                default:
                    return
            }

            let ob_j = new object_class
            ob_j.hydrate(obj, objects_data.response.news.profiles, objects_data.response.news.groups)

            try {
                templates += ob_j.getTemplate()
            } catch(e) {
                console.error(e)

                templates += `
                    <div class='error_template bordered_block'>
                        <span>${_('errors.template_insert_failed', Utils.escape_html(e.message))}</span>
                    </div>
                `
            }
        })

        this.method_params.start_from = objects_data.response.news.next_from

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.main_url.setParam('start_hash', objects_data.response.news.next_from)
            Utils.push_state(window.main_url)
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if(objects_data.response.news.items.length > 9) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }
    }

    clear() {
        delete this.method_params.start_from
        this.getInsertNode().innerHTML = ''
    }
}
