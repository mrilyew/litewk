if(!window.templates) {
    window.templates = {}
}

window.templates.univer_template = (university) => {
    return `
    <tr>
        <td>
            <span><b>${_('user_page.university')}</b></span>
        </td>
    </tr>
    <tr>
        <td>${_('user_page.school_name')}</td>
        <td>${Utils.escape_html(university.name)}</td>
    </tr>
    ${university.city ? `<tr>
        <td>
            <span>${_('user_page.city')}</span>
        </td>
        <td>
            <span>${Utils.escape_html(university.city_name)}</span>
        </td>
    </tr>` : ''}
    ${university.faculty_name ? `<tr>
        <td>
            <span>${_('user_page.university_faculty')}</span>
        </td>
        <td>
            <span>${Utils.escape_html(university.faculty_name)}</span>
        </td>
    </tr>` : ''}
    ${university.chair_name ? `<tr>
        <td>
            <span>${_('user_page.university_chair')}</span>
        </td>
        <td>
            <span>${Utils.escape_html(university.chair_name)}</span>
        </td>
    </tr>` : ''}
    ${university.graduation ? `<tr>
        <td>
            <span>${_('user_page.school_graduation_year')}</span>
        </td>
        <td>
            <span>${university.graduation}</span>
        </td>
    </tr>` : ''}
    ${university.education_form ? `<tr>
        <td>
            <span>${_('user_page.education_form')}</span>
        </td>
        <td>
            <span>${university.education_form}</span>
        </td>
    </tr>` : ''}
    ${university.education_status ? `<tr>
        <td>
            <span>${_('user_page.education_status')}</span>
        </td>
        <td>
            <span>${Utils.escape_html(university.education_status)}</span>
        </td>
    </tr>` : ''}`
}
