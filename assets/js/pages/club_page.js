if(!window.pages) {
    window.pages = {}
}

window.pages['club_page'] = new class {
    async render_page() 
    {
        const _clubNotFound = () => {
            main_class.addOnpageErrorWithTitle(_('user_page.info'), `
                <span>${_('errors.group_not_found')}</span>
                <input type='button' id='__comeback' value='${_('messagebox.comeback')}'>
            `)
        }

        const id = window.main_class['hash_params'].id

        if(!id || id == '0') {
            _clubNotFound()
            return
        }

        let club = new Club
        await club.fromId(id, true, window.main_url.getParam('section', 'all'))

        if(club.isDummy()) {
            _clubNotFound()
            return
        }

        this.club = club

        main_class.changeTitle(club.getName().escapeHtml())
        u('.page_content').html(club.getTemplate())

        if(club.isDeactivated()) {
            u('.club_page_wrapper').append(club.getDeactivationMessage())
            
            return
        }
        
        if(club.hasAccess()) {
            await Wall.fastWallCreate(club)
        }
    }
    
    show_skeleton() {
        u('.page_content').html(window.templates.club_page_skeleton())
    }
}
