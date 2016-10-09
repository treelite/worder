<template>
    <div class="exam">
        <h2>Test<span v-show="!finished">Remain: {{len}}</span></h2>
        <div v-show="!finished">
            <p>
                <button class="voice" v-on:click="play" ref="pronounceButton">Pronounce</button>
                <a class="toggleMean" v-on:click="toggleMean">?</a>
            </p>
            <p>
                <input type="text" v-model="input" ref="input" v-on:keypress.enter="check" />
                <button v-show="checked" class="next" v-on:click="next" ref="nextButton">Next</button>
                <button class="check" v-show="!checked" v-on:click="check">Check</button>
            </p>
            <p v-show="checked" class="result" v-bind:class="{pass : pass}">{{resultMsg}}</p>
            <w-item v-show="showMean" v-if="item" v-bind:display-word="false" v-bind:data="item" />
            <p><a v-on:click="finish">Cancel</a></p>
        </div>
        <div class="sorce" v-show="finished">
            <p><strong>{{sorce}}</strong> / {{count}}</p>
            <p><button v-on:click="finish" ref="finishButton">Finish</button></p>
        </div>
    </div>
</template>

<style>
    .exam {
        background: #FAFAFA;
        border: 1px solid #E5E5E5;
        border-radius: 3px;
        padding: 10px;
    }

    .exam h2 {
        font-size: 18px;
        margin: 0;
    }

    .exam h2 span {
        float: right;
        font-weight: normal;
        font-size: 14px;
    }

    .exam p {
        text-align: center;
    }

    .exam .word-item p {
        text-align: left;
        margin-left: 20px;
    }

    .exam input[type="text"] {
        width: 20em;
    }

    .exam button {
        margin: 0 5px;
    }

    .exam .result {
        margin: 0;
        font-weight: bold;
        font-size: 16px;
        color: #CB0F0F;
    }
    .exam .result.pass {
        color: #43CA11;
    }

    .exam .sorce {
        font-size: 16px;
    }

    .exam .sorce strong {
        color: #43CA11;
        font-size: 20px;
    }
</style>

<script>

    import {play} from '../util';
    import WItem from './item.vue';

    let delayFocus = (vm, name) => vm.$nextTick(() => vm.$refs[name].focus());

    function defaultData(vm) {
        return {
            index: -1,
            sorce: 0,
            count: 0,
            checked: false,
            finished: false,
            showMean: false,
            pass: false,
            resultMsg: '',
            input: '',
            source: vm.list.slice(0)
        };
    }

    export default {
        components: {WItem},
        props: {
            list: {
                type: Array,
                default() {
                    return [];
                }
            }
        },

        data() {
            return defaultData(this);
        },

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
                play(this.item.pronunciation.uk);
                if (this.checked) {
                    this.$refs.nextButton.focus();
                }
                else {
                    this.$refs.input.focus();
                }
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
                this.source.splice(index, 1);
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
                let data = defaultData(this);
                Object.keys(data).forEach(key => {
                    this.$data[key] = data[key];
                });
                this.$emit('finish');
            },

            show() {
                this.$el.style.display = '';
                this.$emit('show');
                this.$refs.pronounceButton.focus();
            },

            hide() {
                this.$el.style.display = 'none';
                this.$emit('hide');
            }
        }
    }
</script>
