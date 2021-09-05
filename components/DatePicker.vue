<template>
    <div class="picker" ref="inside" v-hammer:swipe="onClose" v-body-scroll-lock:reserveScrollBarGap="true">
        <div class="picker__title">
            <img
                src="@/assets/icons/left.svg"
                alt="left"
                class="picker__title--arrow picker__title--arrow--left"
                @click="goLeft"
            />
            <div class="picker__title--month">{{ monthName }} {{ year }}</div>
            <img
                src="@/assets/icons/right.svg"
                alt="right"
                class="picker__title--arrow picker__title--arrow--right"
                @click="goRight"
            />
        </div>
        <table class="picker__month">
            <tr v-for="(week, i) in weeks" :key="i" class="picker__week">
                <td
                    class="picker__date"
                    :class="{
                        'picker__date--disabled': !day.hasOwnProperty('date'),
                        'picker__date--selected': day.hasOwnProperty('date')
                            ? day.date.toLocaleDateString() == selectedDate.date.toLocaleDateString()
                            : false,
                    }"
                    v-for="(day, j) in week"
                    :key="j"
                    @click="selected(day)"
                >
                    {{ day.dayOfMonth }}
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
export default {
    name: 'DatePicker',
    props: {
        initDate: { type: Date, required: false },
    },
    data() {
        return {
            weeks: [],
            month: null,
            year: null,
            monthName: null,
            selectedDate: null,
            monthNames: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ],
        };
    },
    methods: {
        goLeft() {
            if (this.month == 0) {
                this.year -= 1;
                this.month = 11;
            } else {
                this.month -= 1;
            }
            this.setMonthName();
            this.initCal();
        },
        goRight() {
            if (this.month == 11) {
                this.year += 1;
                this.month = 0;
            } else {
                this.month += 1;
            }
            this.setMonthName();
            this.initCal();
        },
        setMonthName() {
            this.monthName = this.monthNames[this.month];
        },
        selected(d) {
            if (!d.hasOwnProperty('date')) return;
            this.selectedDate = d;
            this.$emit('selected', d.date);
        },
        initCal() {
            this.weeks = [];
            let aDayOfWeek = new Date(this.year, this.month, 1).getDay();
            let zDayOfMonth = new Date(this.year, this.month + 1, 0).getDate();
            let zDayOFLastMonth = new Date(this.year, this.month, 0).getDate();
            let dayCounter = 1;
            let start;
            let nextMonthStart = 1;

            // populate calendar
            for (let w = 0; dayCounter < zDayOfMonth + 1; w++) {
                // add new week
                this.weeks.push([]);

                // add filler days in 1st week before 1st date
                if (w == 0) {
                    for (let k = 0; k < aDayOfWeek; k++) {
                        this.weeks[0].unshift({
                            dayOfMonth: zDayOFLastMonth - k,
                        });
                    }

                    start = aDayOfWeek;
                } else {
                    start = 0;
                }

                // add dates to week
                for (let j = start; j < 7; j++) {
                    if (dayCounter <= zDayOfMonth) {
                        let d = new Date(this.year, this.month, dayCounter);
                        this.weeks[w].push({
                            date: d,
                            dayOfMonth: d.getDate(),
                        });
                    } else {
                        this.weeks[w].push({
                            dayOfMonth: nextMonthStart,
                        });

                        nextMonthStart += 1;
                    }

                    dayCounter += 1;
                }
            }
        },
        isClickOutside(e) {
            if (this.$refs.inside) {
                var inside = this.$refs.inside.contains(e.target);
                if (!inside) this.onClose();
            }
        },
        onClose() {
            this.$emit('close');
        },
    },
    mounted() {
        let date = this.initDate ? this.initDate : new Date();
        this.month = date.getMonth();
        this.setMonthName();
        this.year = date.getFullYear();
        this.selectedDate = {
            date,
            dayOfMonth: date.getDate(),
        };
        this.initCal();

        setTimeout(() => {
            window.addEventListener('click', this.isClickOutside, false);
        }, 10);
    },
    beforeDestroy() {
        window.removeEventListener('click', this.isClickOutside, false);
    },
};
</script>

<style lang="scss" scoped>
.picker {
    background-color: var(--bg);
    position: absolute;
    top: 90px;
    left: 160px;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);

    @media only screen and (max-width: 600px) {
        left: calc((100vw - 280px) / 2);
    }

    &__title {
        width: 100%;
        text-align: center;
        position: relative;
        padding: 20px 0 20px 0;

        &--month {
            color: var(--color-text);
        }

        &--arrow {
            cursor: pointer;
            padding: 20px;
            margin: -20px;
            position: absolute;
            top: 18px;

            &--right {
                right: 30px;
            }

            &--left {
                left: 30px;
            }
        }
    }

    &__month {
        height: 200px;
        width: 280px;
        margin: 0 auto 0 auto;
        // border: 1px solid var(--color-text);
    }

    &__week {
        // height: 20%;
    }

    &__date {
        width: 14%;
        border: 2px solid transparent;
        color: var(--color-text);
        font-weight: bold;
        text-align: center;

        &--selected {
            color: var(--color-main);
            border: 2px solid var(--color-main);
        }

        &--disabled {
            color: var(--color-text-secondary);
        }
    }

    &__date:hover {
        color: var(--color-main);
        border: 2px solid var(--color-main);
    }

    &__date--disabled:hover {
        color: var(--color-text-secondary);
        border: none;
    }
}
</style>
