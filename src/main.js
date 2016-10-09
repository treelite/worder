/**
 * @file Main
 * @author treelite(c.xinle@gmail.com)
 */

import Vue from 'vue';
import App from './component/app.vue';

new Vue({
    el: '#app',
    render: create => create(App)
});
