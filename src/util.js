/**
 * @file Util
 * @author treelite(c.xinle@gmail.com)
 */

const HOUR = 60 * 60 * 1000;

/**
 * 获取今天零时的Date对象
 *
 * @public
 * @return {Date}
 */
export function today() {
    let date = new Date();
    date.setHours(0);
    let time = date.getTime();
    time = Math.floor(time / HOUR) * HOUR;
    return new Date(time);
}

/**
 * 播放音频
 *
 * @public
 * @param {string} src 音频地址
 */
export function play(src) {
    let audio = document.createElement('audio');
    audio.setAttribute('autoplay', 'true');
    audio.addEventListener('ended', () => {
        document.body.removeChild(audio);
    });
    audio.src = src;
    document.body.appendChild(audio);
}
