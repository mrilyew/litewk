u(document).on('click', '.poll_list_attachment .poll_answers input', (e) => {
    const target = e.target
    const poll = target.closest('.poll_object')

    if(target.type == 'radio') {
        poll.querySelector('.poll_vote_button').classList.remove('stopped')
    } else {
        const result = poll.querySelectorAll(`input[type='checkbox']:checked`)

        if(result.length > 0) {
            poll.querySelector('.poll_vote_button').classList.remove('stopped')
        } else {
            poll.querySelector('.poll_vote_button').classList.add('stopped')
        }
    }
})

u(document).on('click', '.poll_list_attachment .poll_unvote_button', async (e) => {
    const target = e.target
    const poll_node = target.closest('.poll_object')
    const poll = new Poll
    poll.hydrate(JSON.parse(poll_node.dataset.obj))

    poll_node.classList.add('stopped')
    const result = await poll.deleteVote()

    poll_node.outerHTML = poll.getFullsizeTemplate()

    if(window.page_class.poll) {
        window.page_class.poll = poll
    }
})

u(document).on('click', '.poll_list_attachment .poll_vote_button', async (e) => {
    const target = e.target
    const poll_node = target.closest('.poll_object')
    const poll = new Poll
    poll.hydrate(JSON.parse(poll_node.dataset.obj))

    const answer_nodes = poll_node.querySelectorAll('input:checked')
    const answer_ids = []

    answer_nodes.forEach(el => {
        answer_ids.push(el.value)
    })

    poll_node.classList.add('stopped')
    const result = await poll.addVote(answer_ids)
    poll_node.outerHTML = poll.getFullsizeTemplate()
    
    if(window.page_class.poll) {
        window.page_class.poll = poll
    }
})
