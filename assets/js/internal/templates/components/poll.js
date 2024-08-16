window.templates.poll = (poll, force_results = false) => {
    const el = u(`
        <div class='list_attachment poll_list_attachment poll_object' data-obj='${poll.getStringInfo()}' data-pollid='${poll.getId()}'>
            <div class='poll_content'>
                <div class='poll_head flex_column'>
                    <span class='question'>${poll.getQuestion()}</span>
                    <span class='meta_info'>${poll.getMeta()}</span>
                </div>
                <div class='poll_answers'></div>
                <div class='poll_footer flex_row justifier'>
                    ${poll.canSeeResults() ? `
                        <a href='#poll${poll.getId()}'>${poll.getVotesCountString()}</a>
                    ` : 
                    `
                        <span>${poll.getVotesCountString()}</span>
                    `} 
                    

                    ${poll.canVote() && !poll.isVotedHere() ? `<input type='button' class='stopped poll_vote_button' value='${_('polls.vote_verb')}'>` : ''}
                    ${poll.canVote() && poll.isVotedHere() ? `<input type='button' class='poll_unvote_button' value='${_('polls.unvote_verb')}'>` : ''}
                </div>
            </div>
            <div class='poll_background' style='${poll.getBackground()}'></div>
        </div>
    `)

    if(poll.canVote() && !poll.isVotedHere() && !force_results) {
        poll.getAnswers().forEach(answer => {
            el.find(`.poll_answers`).append(`
                <label>
                    ${!poll.isMultiple() ? `<input type='radio' name='poll_${poll.getId()}_answer' value='${answer.id}'>` : 
                    `<input type='checkbox' name='poll_${poll.getId()}_answer' value='${answer.id}'>`}
                    <span>${answer.text.escapeHtml()}</span>
                </label>
            `)
        })
    } else {
        const voted_answers = poll.getVotedVariants()
        poll.getAnswers().forEach(answer => {
            const is_voted = voted_answers.find(ans => ans == answer.id)

            el.find(`.poll_answers`).append(`
                <div class='poll_answer_bar'>
                    <div class='flex_row justifier poll_answer_bar_text'>
                        <span ${is_voted ? `class='answer_bold'` : ''}>
                            ${answer.text.escapeHtml()} 
                            • 
                            ${answer.votes}
                        </span>
                        
                        <span>
                            ${answer.rate}%
                        </span>
                    </div>
                    <div class='poll_answer_bar_filler ${is_voted ? 'voted_from_me' : ''}' style='width:${answer.rate}%;'></div>
                </label>
            `)
        })
    }

    return el.nodes[0].outerHTML
}
