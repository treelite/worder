/**
 * @file Exam
 * @author treelite(c.xinle@gmail.com)
 */

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

        data() {
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
        },

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
                let src = this.item.pronunciation.uk;
                let audio = document.createElement('audio');
                audio.setAttribute('autoplay', 'true');
                audio.addEventListener('ended', () => {
                    document.body.removeChild(audio);
                });
                audio.src = src;
                document.body.appendChild(audio);
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
                    this.resultMsg = `X ${this.item.word}`;
                }
            },

            toggleMean(e) {
                this.showMean = !this.showMean;
                e.target.innerHTML = this.showMean ? '-' : '+';
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
                this.$dispatch('finish');
            }
        },

        template: ''
            + '<div class="exam">'
            +   '<div v-show="!finished">'
            +   '<p>'
            +     '<button class="voice" v-on:click="play">Play</button>'
            +     '<span class="toggleMean" v-on:click="toggleMean">+</span>'
            +   '</p>'
            +   '<p>'
            +     '<input type="text" v-model="input" v-on:keyup.enter="check" />'
            +     '<button v-show="checked" class="next" v-on:click="next" autofocus="true">Next</button>'
            +     '<button class="check" v-show="!checked" v-on:click="check">Check</button>'
            +   '</p>'
            +   '<p v-show="checked" class="result" v-bind:class="\'pass\' : pass">{{resultMsg}}</p>'
            +   '<ul class="means" v-show="showMean">'
            +     '<li v-for="mean in item.means">{{mean}}</li>'
            +   '</ul>'
            +   '<p><button v-on:click="finish">Cancel</button></p>'
            +   '</div>'
            +   '<div v-show="finished">'
            +     '<p><strong>{{sorce}}</strong>/{{len}}</p>'
            +     '<p><button v-on:click="finish">Finish</button></p>'
            +   '</div>'
            + '</div>'
    }
);
