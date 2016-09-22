/**
 * @file Exam
 * @author treelite(c.xinle@gmail.com)
 */

function defaultData() {
    return {
        index: 0,
        sorce: 0,
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
                let index = this.index + 1;
                if (index < this.len) {
                    this.index = index;
                    this.checked = false;
                    this.input = '';
                }
                else {
                    this.finished = true;
                }
            },

            finish() {
                // reset
                this.$data = defaultData();
                this.$dispatch('finish');
            }
        },

        template: ''
            + '<div class="exam">'
            +   '<h2>Test<span v-show="!finished">{{index + 1}}/{{len}}</span></h2>'
            +   '<div v-show="!finished">'
            +   '<p>'
            +     '<button class="voice" v-on:click="play">Pronounce</button>'
            +     '<a class="toggleMean" v-on:click="toggleMean">?</a>'
            +   '</p>'
            +   '<p>'
            +     '<input type="text" v-model="input" v-on:keyup.enter="check" />'
            +     '<button v-show="checked" class="next" v-on:click="next" autofocus="true">Next</button>'
            +     '<button class="check" v-show="!checked" v-on:click="check">Check</button>'
            +   '</p>'
            +   '<p v-show="checked" class="result" v-bind:class="{pass : pass}">{{resultMsg}}</p>'
            +   '<ul class="mean-list" v-show="showMean">'
            +     '<li v-for="mean in item.means"><b v-if="mean.title">{{mean.title}}</b>{{mean.text}}</li>'
            +   '</ul>'
            +   '<p><a v-on:click="finish">Cancel</a></p>'
            +   '</div>'
            +   '<div class="sorce" v-show="finished">'
            +     '<p><strong>{{sorce}}</strong> / {{len}}</p>'
            +     '<p><button v-on:click="finish">Finish</button></p>'
            +   '</div>'
            + '</div>'
    }
);
