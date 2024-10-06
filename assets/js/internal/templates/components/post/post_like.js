window.templates._post_like = (user_likes = false, has_likes = false, likes_count = 0, reactions = null, id = '') => {
    const templater = u(`
    <div>
        <a href='#wall/${id}/likes' id='_reactions_${id}' data-ignore='1' class='like _like_add post_like ${user_likes ? 'activated' : '' }'>
            <svg class='like_icon_hearted' viewBox="0 0 17 16.22"><g><path id="heart" d="M12.43,1A4.67,4.67,0,0,0,9,2.48,4.67,4.67,0,0,0,5.57,1,4.44,4.44,0,0,0,1,5.29C1,7.65,9,16,9,16s8-8.35,8-10.71A4.44,4.44,0,0,0,12.43,1Z" transform="translate(-0.5 -0.5)"/></g></svg>
            ${has_likes ? `<span class='likes_handler'>${likes_count}</span>` : ''}
        </a>
        <div class='like_another ndropdown' data-preferdirection='top' data-trigger='#_reactions_${id}' data-type='hover'></div>
    </div>
    `)

    reactions.forEach(reaction => {
        templater.find('.like_another').append(`
            <a class='_like_add reaction_like ${reaction.isSet() ? 'activated' : '' }' data-ignore='1' data-reaction='${reaction.getId()}' title='${reaction.getTitle()}'>
                <img src='${reaction.getImageURL()}'>
                ${reaction.getCount() > 0 ? `<span>${reaction.getCount()}</span>` : ''}
            </a>
        `)
    })

    return templater.nodes[0].innerHTML
}
