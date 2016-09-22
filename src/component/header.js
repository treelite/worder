/**
 * @file Header
 * @author treelite(c.xinle@gmail.com)
 */

const TYPE_TODAY = 'today';
const TYPE_CUSTOM = 'custom';
const TYPE_YESTERDAY = 'yesterday';
const TYPE_LAST3DAYS = 'last3days';
const TYPE_LASTWEEK = 'lastweak';
const OFFSET_DAYS = {
    [TYPE_TODAY]: 0,
    [TYPE_YESTERDAY]: 1,
    [TYPE_LAST3DAYS]: 3,
    [TYPE_LASTWEEK]: 7
};

function formatDate(date = new Date()) {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    return `${year}-${month}-${day}`;
}

function calculateDate(type) {
    let date = {
        start: new Date(formatDate()),
        end: new Date(formatDate())
    };
    let offsetDays = OFFSET_DAYS[type];
    date.start.setDate(date.start.getDate() - offsetDays);
    return date;
}

Vue.component(
    'w-header',
    {
        props: ['selected'],
        data() {
            return {
                custom: null,
                endDate: formatDate(),
                startDate: formatDate()
            };
        },

        methods: {
            search() {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                if (start.getTime() > end.getTime()) {
                    alert('开始时间必须要小于结束时间');
                    return;
                }
                this.custom = true;
                this.submit(TYPE_CUSTOM);
            },

            click(e) {
                let ele = e.target;
                if (ele.tagName !== 'LI') {
                    return;
                }
                this.submit(ele.getAttribute('data-type'));
            },

            submit(type) {
                let date;
                this.selected = type;
                if (type === TYPE_CUSTOM) {
                    date = {
                        start: new Date(this.startDate),
                        end: new Date(this.endDate)
                    };
                }
                else {
                    date = calculateDate(type);
                }
                this.$dispatch('submit', date);
            },

            test() {
                this.$dispatch('test');
            }
        },

        template: ''
            + '<header>'
            +   '<div>'
            +     '<ul v-on:click="click" v-bind:data-selected="selected">'
            +       `<li data-type="${TYPE_TODAY}">今天</li>`
            +       `<li data-type="${TYPE_YESTERDAY}">昨天</li>`
            +       `<li data-type="${TYPE_LAST3DAYS}">三天</li>`
            +       `<li data-type="${TYPE_LASTWEEK}">一周</li>`
            +       `<li data-type="${TYPE_CUSTOM}" v-if="custom">{{startDate}} : {{endDate}}</li>`
            +     '</ul>'
            +     'From<input type="date" v-model="startDate">To<input type="date" v-model="endDate">'
            +     '<button v-on:click="search">Search</button>'
            +     '<button v-on:click="test">Test</button>'
            + '</div>'
    }
);
