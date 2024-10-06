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
        let attachments = []
        diver.innerHTML = window.templates.post(this, {'uploaded_audios': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        diver.querySelector('.post_date a').removeAttribute('href')
        this.info.audio.items.forEach(audi => {
            attachments.push({
                'type': 'audio',
                'audio': audi
            })
        })

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', window.templates.attachments(attachments))

        return diver.innerHTML
    }
}

class RecommendedGroups extends NextFromListView {
    t_count = 0
    
    async nextPage() {
        let recoms = await window.vk_api.call(this.method_name, this.method_params)
        let templates = ''
        this.t_count += 10

        if(recoms.items.length < 1 || this.t_count > recoms.count) {
            u('.show_more').remove()
            return
        }

        recoms.items.forEach(obj => {
            let ob_j = new ClubListView
            ob_j.hydrate(obj.group)

            try {
                templates += ob_j.getTemplate()
            } catch(e) {
                templates += `
                    <div class='error_template bordered_block'>
                        <span>${_('errors.template_insert_failed', escape_html(e.message))}</span>
                    </div>
                `
            }
        })

        this.method_params.start_from = recoms.next_from

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if(recoms.items.length > 8) {
            this.createNextPage()
        } else {
            u('.show_more').remove()
        }
    }
}
