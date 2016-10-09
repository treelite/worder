<template>
    <div class="worder">
        <w-header v-bind:selected="tagSelected"></w-header>
    </div>
</template>

<style>
    html, body {
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
        color: #333;
    }

    a {
        color: #4078C0;
        text-decoration: none;
        cursor: pointer;
    }
</style>

<script>
    import {today} from '../util';
    import WHeader from './header.vue';

    function query(date) {
        if (!date) {
            date = {
                start: today(),
                end: today()
            };
        }

        return new Promise(
            resolve => chrome.runtime.sendMessage(
                {type: 'query', start: date.start.getTime(), end: date.end.getTime()},
                list => resolve(list)
            )
        );
    }

    export default {
        components: {WHeader},

        data() {
            return {
                tagSelected: 'today',
                isExam: false,
                list: []
            };
        },

        events: {
            mounted() {
                query().then(list => this.list = list);
            }
        },

        /*
        watch: {
            isExam(val) {
                if (val) {
                    this.$refs.examArea.show();
                }
                else {
                    this.$refs.examArea.hide();
                }
            }
        },
        */

        methods: {
            search(date) {
                this.isExam = false;
                query(date).then(list => this.list = list);
            },

            finishExam() {
                this.isExam = false;
            },

            startExam() {
                this.isExam = true;
            },
            play(src) {
                let audio = document.createElement('audio');
                audio.setAttribute('autoplay', 'true');
                audio.addEventListener('ended', () => {
                    document.body.removeChild(audio);
                });
                audio.src = src;
                document.body.appendChild(audio);
            }
        }
    }
</script>
