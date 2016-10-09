<template>
    <div class="worder">
        <w-header default-selected="today" v-on:submit="search" v-bind:testable="!!list.length" v-on:test="startExam" />
        <main v-if="list.length">
            <w-exam ref="examArea" style="display:none" v-bind:list="list" v-on:finish="finishExam" />
            <section class="word-list" v-show="!isExam">
                <w-item v-for="item in list" v-bind:data="item" />
            </section>
        </main>
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

    main {
        width: 600px;
        margin: 70px auto 0;
    }

    .word-list .word-item {
        padding: 0 10px;
        margin-top: 10px;
        border-bottom: 1px dashed #E5E5E5
    }

    .word-list .word-item:last-child {
        border-bottom: none;
    }
</style>

<script>
    import {today} from '../util';
    import WItem from './item.vue';
    import WExam from './exam.vue';
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
        components: {WHeader, WItem, WExam},

        data() {
            return {
                isExam: false,
                list: []
            };
        },

        mounted() {
            query().then(list => this.list = list);
        },

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
            }
        }
    }
</script>
