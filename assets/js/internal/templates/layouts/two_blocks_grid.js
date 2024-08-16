if(!window.templates) {
    window.templates = {}
}

window.templates.two_blocks_grid = () => {
    return `
    <div class='default_wrapper layer_two_columns'>
        <div class='layer_two_columns_content'></div>
        <div class='layer_two_columns_tabs bordered_block'></div>
    </div>
    `
}
