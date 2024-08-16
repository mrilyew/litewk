u(document).on('click', '.photo_viewer_open', (e) => {
    e.preventDefault()
    
    if(u('.messagebox').length > 0) {
        return
    }

    new MessageWindow(!e.target.dataset.type ? _('photos.photo') : _(`photos.${e.target.dataset.type}`), (insert, additional) => {
        insert.insertAdjacentHTML('beforeend', `
            <div class='photo_viewer'>
                <img src='${e.target.dataset.full}'>
            </div>
        `)
    })
})
