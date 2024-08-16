if(!window.templates) {
    window.templates = {}
}

window.templates.univer_template = (university) => {
    return `
        <div class='table_element'>
            <span><b>${_('user_page.university')}</b></span>
        </div>
        <div class='table_element'>
            <span>${_('user_page.school_name')}</span>
            <div class='table_element_value'>${Utils.escape_html(university.name)}</div>
        </div>
        ${university.city ? 
        `<div class='table_element'>
            <span>${_('user_page.city')}</span>
            <div class='table_element_value'>
                <span>${Utils.escape_html(university.city_name)}</span>
            </div>
        </div>` : ''}
        ${university.faculty_name ? 
        `<div class='table_element'>
            <span>${_('user_page.university_faculty')}</span>
            <div class='table_element_value'>
                <span>${Utils.escape_html(university.faculty_name)}</span>
            </div>
        </div>` : ''}
        ${university.chair_name ? 
        `<div class='table_element'>
            <span>${_('user_page.university_chair')}</span>
            <div class='table_element_value'>
                <span>${Utils.escape_html(university.chair_name)}</span>
            </div>
        </div>` : ''}
        ${university.graduation ? 
        `<div class='table_element'>
            <span>${_('user_page.school_graduation_year')}</span>
            <div class='table_element_value'>
                <span>${university.graduation}</span>
            </div>
        </div>` : ''}
        ${university.education_form ? 
        `<div class='table_element'>
            <span>${_('user_page.education_form')}</span>
            <div class='table_element_value'>
                <span>${university.education_form}</span>
            </div>
        </div>` : ''}
        ${university.education_status ? 
        `<div class='table_element'>
            <span>${_('user_page.education_status')}</span>
            <div class='table_element_value'>
                <span>${Utils.escape_html(university.education_status)}</span>
            </div>
        </div>` : ''}
    `
}
