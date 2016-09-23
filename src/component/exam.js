/**
 * @file Exam
 * @author treelite(c.xinle@gmail.com)
 */

import Vue from 'vue';

function defaultData() {
    return {
        index: -1,
        sorce: 0,
        count: 0,
        checked: false,
        finished: false,
        showMean: false,
        pass: false,
        resultMsg: '',
        input: ''
    };
}

Vue.component(
    'w-exam',
    {
        props: {
            source: {
                type: Array,
                default() {
                    return [];
                }
            }
        },

        data: defaultData,

        computed: {
            len() {
                return this.source.length;
            },
            item() {
                if (this.index < 0) {
                    this.index = Math.floor(Math.random() * this.source.length);
                }
                return this.source[this.index];
            }
        },

        methods: {
            play() {
                this.$dispatch('pronounce', this.item.pronunciation.uk);
            },

            check() {
                let input = this.input.trim();
                this.checked = true;
                if (input === this.item.word) {
                    this.pass = true;
                    this.sorce++;
                    this.resultMsg = '√';
                }
                else {
                    this.pass = false;
                    this.resultMsg = this.item.word;
                }
            },

            toggleMean(e) {
                this.showMean = !this.showMean;
            },

            next() {
                let index = this.index;
                let source = this.source.slice(0, index);
                this.source = source.concat(this.source.slice(index + 1, this.len));
                this.index = -1;
                if (!this.source.length) {
                    this.finished = true;
                }
                else {
                    this.checked = false;
                    this.input = '';
                }
                this.count++;
            },

            finish() {
                // reset
                this.$data = defaultData();
                this.$dispatch('finish');
            }
        },

        template: ''
            + '<div class="exam">'
            +   '<h2>Test<span v-show="!finished">{{len}}</span></h2>'
            +   '<div v-show="!finished">'
            +     '<p>'
            +       '<button class="voice" v-on:click="play">Pronounce</button>'
            +       '<a class="toggleMean" v-on:click="toggleMean">?</a>'
            +     '</p>'
            +     '<p>'
            +       '<input type="text" v-model="input" v-on:keyup.enter="check" />'
            +       '<button v-show="checked" class="next" v-on:click="next" autofocus="true">Next</button>'
            +       '<button class="check" v-show="!checked" v-on:click="check">Check</button>'
            +     '</p>'
            +     '<p v-show="checked" class="result" v-bind:class="{pass : pass}">{{resultMsg}}</p>'
            +     '<ul class="mean-list" v-show="showMean" v-if="item">'
            +       '<li v-for="mean in item.means"><b v-if="mean.title">{{mean.title}}</b>{{mean.text}}</li>'
            +     '</ul>'
            +     '<p><a v-on:click="finish">Cancel</a></p>'
            +   '</div>'
            +   '<div class="sorce" v-show="finished">'
            +     '<p><strong>{{sorce}}</strong> / {{count}}</p>'
            +     '<p><button v-on:click="finish">Finish</button></p>'
            +   '</div>'
            + '</div>'
    }
);
