<template>
    <header>
        <div>
            <ul v-on:click="click" v-bind:data-selected="selected">
                <li data-type="today">Today</li>
                <li data-type="yesterday">Yesterday</li>
                <li data-type="last3days">3 Days</li>
                <li data-type="lastweek">1 weeak</li>
                <li data-type="custom" v-if="custom" v-bind:title="startDate + ' : ' + endDate">Custom</li>
            </ul>
            From<input type="date" v-model="startDate" />To<input type="date" v-model="endDate" />
            <button v-on:click="search">Search</button>
            <button v-on:click="test" v-bind:disabled="!testable">Test</button>
        </div>
    </header>
</template>

<style>
    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #FAFAFA;
        border-bottom: 1px solid #E5E5E5;
        padding-top: 10px;
        color: #666;
    }

    header div {
        margin: 0 auto;
        width: 960px;
        line-height: 38px;
    }

    header div::after {
        content: ' ';
        display: block;
        clear: both;
    }

    header ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    header li {
        position: relative;
        bottom: -1px;
        float: left;
        padding: 10px 20px;
        line-height: 1;
        overflow: hidden;
        cursor: pointer;
        border: 1px solid transparent;
        border-top: 3px solid transparent;
    }

    header li:last-child {
        margin-right: 20px;
    }

    header ul[data-selected="today"] li[data-type="today"],
    header ul[data-selected="yesterday"] li[data-type="yesterday"],
    header ul[data-selected="last3days"] li[data-type="last3days"],
    header ul[data-selected="lastweek"] li[data-type="lastweek"],
    header ul[data-selected="custom"] li[data-type="custom"] {
        border-color: #D26911 #E5E5E5 #FFF #E5E5E5;
        background: #FFF;
        border-radius: 3px 3px 0 0;
        cursor: default;
        color: #333;
    }

    header input[type="date"] {
        width: 10em;
        margin: 0 10px;
    }

    header button {
        margin-right: 10px;
    }
</style>

<script>
    import {today} from '../util';

    const TYPE_TODAY = 'today';
    const TYPE_CUSTOM = 'custom';
    const TYPE_YESTERDAY = 'yesterday';
    const TYPE_LAST3DAYS = 'last3days';
    const TYPE_LASTWEEK = 'lastweek';
    const OFFSET_DAYS = {
        [TYPE_TODAY]: 0,
        [TYPE_YESTERDAY]: 1,
        [TYPE_LAST3DAYS]: 3,
        [TYPE_LASTWEEK]: 7
    };

    function formatDate(date = new Date()) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        if (month < 10) {
            month = `0${month}`;
        }
        if (day < 10) {
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    }

    function calculateDate(type) {
        let date = {
            start: today(),
            end: today()
        };
        let offsetDays = OFFSET_DAYS[type];
        date.start.setDate(date.start.getDate() - offsetDays);
        if (type === TYPE_YESTERDAY) {
            date.end.setDate(date.end.getDate() - 1);
        }
        return date;
    }

    export default {
        props: ['defaultSelected', 'testable'],

        data() {
            return {
                custom: null,
                endDate: formatDate(),
                startDate: formatDate(),
                selected: this.defaultSelected
            };
        },

        methods: {
            search() {
                let start = new Date(this.startDate);
                let end = new Date(this.endDate);
                if (start.getTime() > end.getTime()) {
                    [this.startDate, this.endDate] = [this.endDate, this.startDate];
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
                if (type === TYPE_CUSTOM) {
                    date = {
                        start: new Date(this.startDate),
                        end: new Date(this.endDate)
                    };
                }
                else {
                    date = calculateDate(type);
                }
                this.$emit('submit', date);
                this.selected = type;
            },

            test() {
                this.$emit('test');
            }
        }
    }
</script>
