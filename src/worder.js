/**
 * @file Worder
 * @author treelite (c.xinle@gmail.com)
 */

(function () {

    var htmlTagExp = /<[^>]+>/g;

    function trimHTML(str) {
        return str.replace(htmlTagExp, '');
    }

    function getInfo(word) {
        let res = {means: [], word};

        let infoEle = document.querySelector('span.di-info');
        res.type = infoEle.querySelector('span.posgram span.pos').innerHTML;
        res.phonogram = trimHTML(infoEle.querySelector('span.pron').innerHTML);
        res.pronunciation = {
            uk: infoEle.querySelector('span.uk span.sound').getAttribute('data-src-mp3'),
            us: infoEle.querySelector('span.us span.sound').getAttribute('data-src-mp3')
        };

        let body = document.querySelector('div.di-body');
        let blocks = body.querySelectorAll('div.sense-block');
        for (let ele of blocks) {
            res.means.push(
                ele.querySelector('span.sense-title strong').innerHTML + ' | ' + trimHTML(ele.querySelector('b.def').innerHTML)
            );
        }

        return res;
    }

    function getWord() {
        return document.querySelector('h2.di-title').innerHTML;
    }

    function addWord(word) {
        let meta = getInfo(word);
        chrome.runtime.sendMessage({type: 'add', meta}, addTag);
    }

    function clear() {
        let title = document.querySelector('h2.di-title');
        let spans = title.querySelectorAll('span');
        for (let ele of spans) {
            title.removeChild(ele);
        }
    }

    function addTag() {
        clear();
        let title = document.querySelector('h2.di-title');
        let ele = document.createElement('span');
        ele.innerHTML = '√';
        title.appendChild(ele);
    }

    function addButton() {
        clear();
        let title = document.querySelector('h2.di-title');
        let button = document.createElement('span');
        let word = getWord();
        button.innerHTML = '+';
        button.addEventListener('click', () => addWord(word));
        title.appendChild(button);
    }

    chrome.runtime.sendMessage({type: 'check', word: getWord()}, exist => exist ? addTag() : addButton());

})();
