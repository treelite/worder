/**
 * @file List
 * @author treelite(c.xinle@gmail.com)
 */

import Vue from 'vue';

Vue.component(
    'w-list',
    {
        props: {
            source: {
                type: Array,
                default() {
                    return [];
                }
            }
        },

        methods: {
            play(e) {
                let src = e.target.parentNode.getAttribute('data-src');
                this.$dispatch('pronounce', src);
            }
        },

        template: ''
            + '<section class="word-list">'
            +   '<div class="item" v-for="item in source">'
            +     '<p data-src="{{item.pronunciation.uk}}">'
            +       '<strong>{{item.word}}</strong>'
            +       '<span class="phon" v-on:click="play">{{item.phonogram}}</span>'
            +       '<button v-on:click="play">Pronounce</button>'
            +     '</p>'
            +     '<ul class="mean-list">'
            +       '<li v-for="mean in item.means"><b v-if="mean.title">{{mean.title}}</b>{{mean.text}}</li>'
            +     '</ul>'
            +   '</div>'
            + '</section>'
    }
);
