/**
 * @file Worder
 * @author treelite (c.xinle@gmail.com)
 */

(function () {

    const CLS = 'worder';

    let htmlTagExp = /<[^>]+>/g;

    function trimHTML(str) {
        return str.replace(htmlTagExp, '').trim();
    }

    function getInfo() {
        let res = {means: [], word: getWord()};

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
            let item = {
                text: trimHTML(ele.querySelector('b.def').innerHTML)
            };
            item.text = item.text.substring(0, item.text.length - 1);
            ele = ele.querySelector('span.sense-title strong');
            if (ele) {
                item.title = ele.innerHTML;
            }
            res.means.push(item);
        }

        return res;
    }

    function getWord() {
        return document.querySelector('h2.di-title').innerHTML;
    }

    function clickHandler() {
        let type = this.getAttribute('data-type');
        let data;
        if (type === 'add') {
            data = getInfo();
        }
        else {
            data = getWord();
        }
        chrome.runtime.sendMessage(
            {type, data},
            res => {
                if (!res) {
                    alert('Ooops, please try again later...');
                }
                else {
                    toggleBtn();
                }
            }
        );
    }

    function toggleBtn() {
        let header = document.querySelector('div.di-head');
        let ele = header.querySelector(`ins.${CLS}`);
        let type = ele.getAttribute('data-type');
        type = type === 'add' ? 'remove' : 'add';
        ele.setAttribute('data-type', type);
    }

    function showBtn(type) {
        let header = document.querySelector('div.di-head');
        let ele = header.querySelector(`ins.${CLS}`);
        if (!ele) {
            ele = document.createElement('ins');
            ele.className = CLS;
            ele.addEventListener('click', clickHandler);
            header.insertBefore(ele, header.firstChild);
        }
        ele.setAttribute('data-type', type);
    }

    chrome.runtime.sendMessage({type: 'check', word: getWord()}, exist => showBtn(exist ? 'remove' : 'add'));

})();
