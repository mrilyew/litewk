window.controllers['PollController'] = new class {
    poll = null

    async render_page() {
        main_class.changeTitle(_('polls.poll'))
        u('.page_content').html(window.templates.two_blocks_grid())

        const owner_id  = parseInt(window.main_class['hash_params'].owner_id)
        let   answer_id = Number(window.main_url.getParam('answer_id', 0))
        const poll_id   = parseInt(window.main_class['hash_params'].poll_id)
        const from_board = Number(window.main_url.getParam('from_board'))

        if(isNaN(owner_id) || isNaN(poll_id) || !owner_id || !poll_id || poll_id == 0) {
            main_class.addOnpageErrorWithTitle(_('user_page.info'), `
                <span>${_('errors.poll_not_found')}</span>
                <input type='button' id='__comeback' value='${_('messagebox.comeback')}'>
            `)

            return
        }

        let poll = null

        if(this.poll && this.poll.getCorrectID() == poll_id) {
            poll = this.poll
        } else {
            poll = new Poll
            await poll.fromId(owner_id, poll_id, from_board)

            this.poll = poll
        }

        const owner_entity = await Utils.getOwnerEntityById(owner_id)

        if(answer_id == 0) {
            answer_id = poll.info.answers[0].id
        }

        u('.layer_two_columns_content').html(`
            <div id='_poll_fullsize'>
                ${poll.getFullsizeTemplate()}
            </div>

            <div class='bordered_block' style='margin-top: 7px;' id='_poll_insert_users'></div>
        `)
        u('.page_content .layer_two_columns_tabs').html(`
            ${window.templates.content_pages_owner(owner_entity)}
        `)

        poll.getAnswers().forEach(ans => {
            u('.page_content .layer_two_columns_tabs').append(`
                <a href='#poll${poll.getId()}?answer_id=${ans.id}' ${answer_id == ans.id ? 'class=\'selected\'' : ''}>${ans.text.escapeHtml().circum(25)}</a>
            `)
        })

        if(poll.isAnonymous()) {
            u('#_poll_insert_users').html(_('errors.poll_is_anonymous'))
        } else if(!poll.canSeeResults()) {
            u('#_poll_insert_users').html(_('errors.poll_no_voted'))
        } else {
            u('.page_content .layer_two_columns_tabs').append(`
            <div class='layer_two_columns_params'>
                <div class='search_params'>
                    ${window.templates.search_users_params_poll()}
                    <div>
                        <input style='display:none;width: 100%;margin-top: -8px;' type='button' value='${_('messagebox.apply')}' id='_applypollsettings'>
                    </div>
                </div>
            </div>
            `)

            console.log(window.main_url.getHash())
            let method_params = {'owner_id': poll.getOwnerID(), 'poll_id': poll.getCorrectID(), 'is_board': from_board, 'answer_ids': answer_id, 'fields': window.consts.TYPICAL_FIELDS, 'count': window.consts.DEFAULT_COUNT}
            window.main_classes['wall'] = new VotersListView(UserListView, '#_poll_insert_users', _('errors.no_voters_poll'))
            
            method_params = Utils.applyUsersSearchParams(window.main_url, method_params)
            
            window.main_classes['wall'].setParams('polls.getVoters', method_params)
            await window.main_classes['wall'].nextPage()
        }
    }

    execute_buttons() {
        u(`.layer_two_columns_params input`).on('change', async () => {
            u('#_applypollsettings').nodes[0].style.display = 'block'
        })

        u('.layer_two_columns #_applypollsettings').on('click', async () => {
            u('#_applypollsettings').nodes[0].style.display = 'none'
            console.log(window.main_url.searchParams)
            let method_params = Utils.applyUsersSearchParams(window.main_url, window.main_classes['wall'].method_params)
                
            window.main_classes['wall'].setParams('polls.getVoters', method_params)
            window.main_classes['wall'].clear()
            await window.main_classes['wall'].nextPage()
        })
    }
}
