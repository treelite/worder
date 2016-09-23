/**
 * @file App
 * @author treelite(c.xinle@gmail.com)
 */

import Vue from 'vue';
import {today} from './util';

import './component/header';
import './component/exam';
import './component/list';

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

query().then(list => {
    new Vue({
        el: '#app',
        data: {
            tagSelected: 'today',
            isExam: false,
            list
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
    });
});

