window.templates.two_blocks_grid = () => {
    return `
    <div class='default_wrapper layer_two_columns'>
        <div class='layer_two_columns_content'></div>
        <div class='layer_two_columns_tabs bordered_block'></div>
    </div>
    `
}

window.templates.two_blocks_grid_skeleton = () => {
    return `
    <div class='default_wrapper layer_two_columns' id='_skeleton'>
        <div class='layer_two_columns_content'>
            <div class='filler bordered_block default_tabs'></div>
            <div class='filler contenter bordered_block padding'></div>
        </div>
        <div class='layer_two_columns_tabs bordered_block filler'></div>
    </div>
    `
}
