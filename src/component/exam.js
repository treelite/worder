/**
 * @file Exam
 * @author treelite(c.xinle@gmail.com)
 */

import Vue from 'vue';

let delayFocus = (vm, name) => vm.$nextTick(() => vm.$els[name].focus());

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

        watch: {
            checked(val) {
                delayFocus(this, val ? 'nextButton' : 'pronounceButton');
            },

            finished(val) {
                if (val) {
                    delayFocus(this, 'finishButton');
                }
            }
        },

        methods: {
            play() {
                this.$dispatch('pronounce', this.item.pronunciation.uk);
                this.$els.input.focus();
            },

            check() {
                if (this.checked) {
                    return;
                }
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
                this.showMean = true;
            },

            toggleMean() {
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
                    this.showMean = false;
                }
                this.count++;
            },

            finish() {
                // reset
                this.$data = defaultData();
                this.$dispatch('finish');
            },

            show() {
                this.$el.style.display = '';
                this.$dispatch('show');
                this.$els.pronounceButton.focus();
            },

            hide() {
                this.$el.style.display = 'none';
                this.$dispatch('hide');
            }
        },

        template: ''
            + '<div class="exam">'
            +   '<h2>Test<span v-show="!finished">Remain: {{len}}</span></h2>'
            +   '<div v-show="!finished">'
            +     '<p>'
            +       '<button class="voice" v-on:click="play" v-el:pronounce-button>Pronounce</button>'
            +       '<a class="toggleMean" v-on:click="toggleMean">?</a>'
            +     '</p>'
            +     '<p>'
            +       '<input type="text" v-model="input" v-el:input v-on:keypress.enter="check" />'
            +       '<button v-show="checked" class="next" v-on:click="next" v-el:next-button>Next</button>'
            +       '<button class="check" v-show="!checked" v-on:click="check">Check</button>'
            +     '</p>'
            +     '<p v-show="checked" class="result" v-bind:class="{pass : pass}">{{resultMsg}}</p>'
            +     '<div v-show="showMean" v-if="item" class="word-item">'
            +       '<p><span class="pos">{{item.type}}</span><span class="phon" v-on:click="play">{{item.phonogram}}</span></p>'
            +       '<ul class="mean-list">'
            +         '<li v-for="mean in item.means"><b v-if="mean.title">{{mean.title}}</b>{{mean.text}}</li>'
            +       '</ul>'
            +     '</div>'
            +     '<p><a v-on:click="finish">Cancel</a></p>'
            +   '</div>'
            +   '<div class="sorce" v-show="finished">'
            +     '<p><strong>{{sorce}}</strong> / {{count}}</p>'
            +     '<p><button v-on:click="finish" v-el:finish-button>Finish</button></p>'
            +   '</div>'
            + '</div>'
    }
);
