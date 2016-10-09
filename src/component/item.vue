<template>
    <div class="word-item">
        <p v-bind:data-src="data.pronunciation.uk">
            <strong v-if="displayWord">{{data.word}}</strong>
            <span class="pos">{{data.type}}</span><span class="phon" v-on:click="play">{{data.phonogram}}</span>
            <button v-if="displayWord" v-on:click="play">Pronounce</button>
        </p>
        <ul class="mean-list">
            <li v-for="mean in data.means"><b v-if="mean.title">{{mean.title}}</b>{{mean.text}}</li>
        </ul>
    </div>
</template>

<style>
    .word-item strong {
        font-size: 25px;
        margin-right: 20px;
    }

    .word-item .phon {
        cursor: help;
    }

    .word-item .pos {
        font-style: italic;
        margin-right: 10px;
    }

    .word-item button {
        float: right;
    }

    .word-item p {
        margin: 5px 0;
    }

    .word-item .mean-list {
        margin: 0 0 10px;
    }

    .word-item .mean-list li {
        color: #666;
    }

    .word-item .mean-list li b {
        margin-right: 5px;
    }
</style>

<script>
    import {play} from '../util';

    export default {
        props: {
            data: {
                type: Object,
                default: null
            },
            displayWord: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            play(e) {
                let src = e.target.parentNode.getAttribute('data-src');
                play(src);
            }
        }
    }
</script>
