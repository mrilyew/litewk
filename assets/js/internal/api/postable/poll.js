class Poll extends PostLike {
    async fromId(owner_id, poll_id, is_board = 0) {
        const info = await window.vk_api.call('polls.getById', {'owner_id': owner_id, 'poll_id': poll_id, 'extended': 1, 'friends_count': 3, 'is_board': is_board, 'fields': window.consts.TYPICAL_FIELDS})

        this.hydrate(info)
    }

    getQuestion() {
        return this.info.question.escapeHtml()
    }

    getAnswers() {
        return this.info.answers
    }

    getFullsizeTemplate() {
        return window.templates.poll(this)
    }

    getBackground() {
        const bg = this.info.background
        const photo = this.info.photo

        if(photo) {
            const color = photo.color
            const photo_entity = new MinimalPhoto(photo.images)

            return `background-image: linear-gradient(180deg, transparent 0%, #${color} 100%), url(${photo_entity.getImage(1).url  });`  
        }
        
        if(!bg) {
              return `background-color: var(--elements-contrast-color);`  
        }

        switch(bg.type) {
            default:
            case 'gradient':
                let points_html = ''
                let iter = 1

                bg.points.forEach(point => {
                    points_html += `#${point.color} ${point.position * 100}%`

                    if(iter < bg.points.length) {
                        points_html += ','
                    }

                    iter += 1
                })
                return `background-image: linear-gradient(${bg.angle}deg, ${points_html})`
            case 'tile':
                console.log(bg)
                return ''
        }
    }

    getEndDate() {
        if(this.info.end_date == 0) {
            return null
        }

        return this.info.end_date
    }

    getCreationTime() {
        return this.info.created
    }

    getMeta() {
        const info_array = []

        if(this.isAnonymous()) {
            info_array.push(_('polls.anonymous_poll'))
        } else {
            info_array.push(_('polls.public_poll'))
        }

        if(this.isMultiple()) {
            info_array.push(_('polls.many_variants'))
        }

        if(this.isClosed()) {
            info_array.push(_('polls.ended', Utils.short_date(this.getEndDate())))
        } else {
            if(this.getEndDate()) {
                info_array.push(_('polls.ends_x', Utils.short_date(this.getEndDate())))
            }
        }

        if(this.isUnvoteDisabled()) {
            info_array.push(_('polls.cant_revote'))
        }

        if(this.getCreationTime()) {
            info_array.push(_('polls.created', Utils.short_date(this.getCreationTime())))
        }

        let info_string = ''
        let iter = 1
        info_array.forEach(str => {
            info_string += str

            if(iter < info_array.length) {
                info_string += ' • '
            }

            iter += 1
        })

        return info_string
    }

    getVotesCount() {
        return this.info.votes
    }

    getVotesCountString() {
        if(this.getVotesCount() < 1) {
            return _('polls.vote_as_first')
        } else {
            return _('polls.votes_count', this.getVotesCount())
        }
    }

    getVotedVariants() {
        return this.info.answer_ids
    }

    isAnonymous() {
        return this.info.anonymous
    }

    isMultiple() {
        return this.info.multiple
    }

    isVotedHere() {
        return this.info.answer_ids && this.info.answer_ids.length > 0
    }

    isClosed() {
        return this.info.closed
    }

    isUnvoteDisabled() {
        return this.info.disable_unvote
    }

    isBoard() {
        return this.info.is_board
    }

    canVote() {
        return this.info.can_vote
    }

    canSeeResults() {
        return this.isClosed() || this.isVotedHere() && !this.isAnonymous()
    }

    async deleteVote() {
        const answers_id = this.info.answer_ids
        const input_answers = answers_id.toString()
        let request = null
        if(window.use_execute) {
            request = await window.vk_api.call('execute', {'code': `
                var result = API.polls.deleteVote({
                    "owner_id": ${this.getOwnerID()}, 
                    "poll_id": ${this.getCorrectID()},
                    "answer_id": "${input_answers}",
                    "is_board": ${Number(this.isBoard())}
                });
                var new_poll = API.polls.getById({
                    "owner_id": ${this.getOwnerID()}, 
                    "poll_id": ${this.getCorrectID()},
                    "is_board": ${Number(this.isBoard())}
                });
                
                return {"code": result, "new_poll": new_poll};
            `})
        } else {
            request = {}
            request.code = await window.vk_api.call('polls.deleteVote', {
                'owner_id': this.getOwnerID(), 
                'poll_id': this.getCorrectID(),
                'answer_id': input_answers,
                'is_board': Number(this.isBoard())
            })

            request.new_poll = await window.vk_api.call('polls.getById', {
                'owner_id': this.getOwnerID(), 
                'poll_id': this.getCorrectID(),
                'is_board': Number(this.isBoard())
            })
        }

        this.info = request.new_poll

        return request.code
    }

    async addVote(answer_ids) {
        const input_answers = answer_ids.toString()
        let request = null

        if(window.use_execute) {
            request = await window.vk_api.call('execute', {'code': `
                var result = API.polls.addVote({
                    "owner_id": ${this.getOwnerID()}, 
                    "poll_id": ${this.getCorrectID()},
                    "answer_ids": "${input_answers}",
                    "is_board": ${Number(this.isBoard())}
                });
                var new_poll = API.polls.getById({
                    "owner_id": ${this.getOwnerID()}, 
                    "poll_id": ${this.getCorrectID()},
                    "is_board": ${Number(this.isBoard())}
                });
                
                return {"code": result, "new_poll": new_poll};
            `})
        } else {
            request = {}
            request.code = await window.vk_api.call('polls.addVote', {
                'owner_id': this.getOwnerID(), 
                'poll_id': this.getCorrectID(),
                'answer_ids': input_answers,
                'is_board': Number(this.isBoard())
            })

            request.new_poll = await window.vk_api.call('polls.getById', {
                'owner_id': this.getOwnerID(), 
                'poll_id': this.getCorrectID(),
                'is_board': Number(this.isBoard())
            })
        }

        this.info = request.new_poll

        return request.code
    }
}
