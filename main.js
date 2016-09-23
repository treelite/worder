/**
 * @file Background
 * @author treelite (c.xinle@gmail.com)
 */

(function () {

    let query = keys => new Promise((resolve, reject) => {
        chrome.storage.local.get(keys, data => chrome.runtime.lastError ? reject() : resolve(data));
    });

    let save = data => new Promise((resolve, reject) => {
        chrome.storage.local.set(data, () => chrome.runtime.lastError ? reject() : resolve());
    });

    let processors = {

        check(req) {
            let word = req.word;
            let name = `index${word.charAt(0).toUpperCase()}`;
            return query(name).then(data => {
                let index = data[name] || {};
                return !!index[word];
            });
        },

        add(req) {
            let meta = req.data;
            let indexName = 'index' + meta.word.charAt(0).toUpperCase();
            return query(['list', `${indexName}`]).then(data => {
                let list = data.list || [];
                meta.date = Date.now();
                list.unshift(meta);
                let index = data[indexName] || {};
                index[meta.word] = true;
                data.list = list;
                data[indexName] = index;
                return save(data).then(() => true, () => false);
            });
        },

        remove(req) {
            let word = req.data;
            let indexName = 'index' + word.charAt(0).toUpperCase();
            return query(['list', `${indexName}`]).then(data => {
                let list = data.list;
                for (let [i, v] of list.entries()) {
                    if (v.word === word) {
                        list.splice(i, 1);
                        break;
                    }
                }
                delete data[indexName][word];
                return save(data).then(() => true, () => false);
            });
        },

        query(req) {
            let start = req.start;
            let end = req.end + 24 * 60 * 60 * 1000;
            return query('list').then(({list = []}) => {
                let res = [];
                for (let item of list) {
                    if (item.date < start) {
                        break;
                    }
                    if (item.date < end) {
                        res.push(item);
                    }
                }
                return res;
            });
        }

    };

    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
        let process = processors[req.type];
        process(req).then(sendResponse);
        // Set asynchronously
        return true;
    });

    chrome.browserAction.onClicked.addListener(() => {
        chrome.tabs.create({url: 'index.html'});
    });

})();
