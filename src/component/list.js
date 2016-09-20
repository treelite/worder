/**
 * @file List
 * @author treelite(c.xinle@gmail.com)
 */

Vue.component(
    'w-list',
    {
        props: {
            source: {
                type: Array,
                default() {
                    return [];
                },
            }
        },

        template: ''
            + '<section class="list">'
            +   '<ul>'
            +   '<li v-for="item in source">'
            +     '{{item.word}}'
            +   '</li>'
            +   '</ul>'
            + '</section>'
    }
);
