if(!window.templates) {
    window.templates = {}
}

window.templates.paginator = (pagesCount, activePage, stepCount = 3) => {
    pagesCount += 1

    if(pagesCount < 3) {
        return ``
    }

    let template = `
        <div class='paginator' data-pagescount='${pagesCount}'></div>
    `

    let template_div = document.createElement('div')
    template_div.innerHTML = template

    let pages = []
    let temp_url = new BetterURL(location.href)

    for(let t_page = (activePage - (stepCount - 1)); t_page <= (activePage + (stepCount - 1)); t_page++) {
        if(t_page < 1 || t_page > pagesCount) {
            continue
        }

        pages.push(t_page)
    }
        
    if(activePage > stepCount - 1) {
        temp_url.setParam('page', 1)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' class='paginator_arrow' data-page='1' href='${temp_url.hash}'>«</a>
        `
    }

    if(activePage > 1) {
        temp_url.setParam('page', activePage - 1)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' class='paginator_arrow' data-page='${activePage - 1}' href='${temp_url.hash}'>‹</a>
        `
    }

    pages.forEach(page => {
        temp_url.setParam('page', page)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${page}' data-page='${activePage}' href='${temp_url.hash}' ${activePage == page ? `class='active'` : ''}>${page}</a>
        `
    })

    if(activePage < pagesCount) {
        temp_url.setParam('page', activePage + 1)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' class='paginator_arrow' data-page='${activePage + 1}' href='${temp_url.hash}'>›</a>
        `
    }

    if(activePage < pagesCount - (stepCount - 1)) {
        temp_url.setParam('page', pagesCount)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${pagesCount}' class='paginator_arrow' href='${temp_url.hash}'>»</a>
        `
    }

    return template_div.innerHTML
}
