/**
 * @file Util
 * @author treelite(c.xinle@gmail.com)
 */

const HOUR = 60 * 60 * 1000;

export function today() {
    let date = new Date();
    date.setHours(0);
    let time = date.getTime();
    time = Math.floor(time / HOUR) * HOUR;
    return new Date(time);
}
