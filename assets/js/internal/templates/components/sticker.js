window.templates.sticker_attachment = (sticker) => {
    const uid = sticker.getId() + '_' + Utils.random_int(0, 10000)
    const htmloutput = `
    <div data-uid='${uid}' class='list_attachment sticker_attachment'>
        <div class='sticker'>
            <img src='${sticker.getURL()}' loading='lazy'>
        </div>
    </div>
    `

    if(sticker.isAnimated() && window.lottie) {
        u(document).on('click', `.sticker_attachment[data-uid='${uid}']`, (e) => {          
            let target = e.target

            if(!target.classList.contains('.sticker_attachment')) {
                target = e.target.closest('.sticker_attachment')
            }

            if(!target.classList.contains('playing')) {
                let lottier = lottie.loadAnimation({
                    container: u(`.sticker_attachment[data-uid='${uid}'] .sticker`).nodes[0],
                    renderer: 'svg',
                    loop: true,
                    autoplay: true,
                    path: 'https://vk.com/sticker/3-'+sticker.getId()+'.json'
                })

                target.classList.add('playing')
            } else {
                lottie.destroy()
                target.innerHTML = `
                    <div class='sticker'>
                        <img src='${sticker.getURL()}' loading='lazy'>
                    </div>
                `

                target.classList.remove('playing')
            }
        })
    }

    return htmloutput
}
