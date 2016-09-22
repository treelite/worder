/**
 * @file App
 * @author treelite(c.xinle@gmail.com)
 */

const DAY = 24 * 60 * 60 * 1000;

let today = () => Math.floor(Date.now() / DAY) * DAY;

function query(date) {
    if (!date) {
        let time = new Date(today());
        date = {
            start: time,
            end: time
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

