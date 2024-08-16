window.templates.entity_page_cover_upper = (entity) => {
    return `
    <div class='entity_page_cover'>
        <picture>
            <source srcset="${entity.getCoverURL(1)}" media="(min-width: 1920px)" />
            <source srcset="${entity.getCoverURL(2)}" media="(min-width: 700px)" />
            <source srcset="${entity.getCoverURL(4)}" media="(min-width: 300px)" />
            <source srcset="${entity.getCoverURL(3)}" media="(min-width: 100px)" />
            <img src='${entity.getCoverURL(1)}'>
        </picture>
    </div>`
}
