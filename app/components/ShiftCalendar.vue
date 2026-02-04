<template>
    <div class="calendar-container">
        <!-- Calendar Header -->
        <div class="calendar-header">
            <button @click="previousMonth" class="btn btn-secondary">←</button>
            <h3 class="calendar-title">{{ monthNames[currentMonth] }} {{ currentYear }}</h3>
            <button @click="nextMonth" class="btn btn-secondary">→</button>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
            <!-- Day Headers -->
            <div v-for="day in dayNames" :key="day" class="calendar-day-header">
                {{ day }}
            </div>

            <!-- Calendar Days -->
            <div v-for="(day, index) in calendarDays" :key="index" class="calendar-day" :class="{
                'other-month': !day.isCurrentMonth,
                'today': day.isToday,
                'has-shifts': day.shifts.length > 0
            }" @click="selectDay(day)">
                <div class="day-number">{{ day.date }}</div>

                <!-- Shift Indicators -->
                <div v-if="day.shifts.length > 0" class="shift-indicators">
                    <div v-for="shift in day.shifts.slice(0, 3)" :key="shift.id" class="shift-indicator"
                        :style="{ background: getShiftColor(shift.shiftTime) }"
                        :title="`${shift.employeeName} - ${formatShiftTime(shift.shiftTime)}`">
                        {{ formatShiftTimeShort(shift.shiftTime) }}
                    </div>
                    <div v-if="day.shifts.length > 3" class="more-shifts">
                        +{{ day.shifts.length - 3 }} more
                    </div>
                </div>
            </div>
        </div>

        <!-- Selected Date Details -->
        <div v-if="selectedDay && selectedDay.shifts.length > 0" class="selected-date-details">
            <h4>Shifts for {{ formatDate(selectedDay.fullDate) }}</h4>
            <div class="grid grid-3 gap-md mt-md">
                <div v-for="shift in selectedDay.shifts" :key="shift.id" class="shift-detail-card">
                    <div class="badge" :style="{ background: getShiftColor(shift.shiftTime) }">
                        {{ formatShiftTime(shift.shiftTime) }}
                    </div>
                    <div class="mt-sm">
                        <strong>{{ shift.employeeName }}</strong>
                    </div>
                    <div class="text-muted">{{ shift.status }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Shift {
    id: number;
    employeeId: number;
    employeeName: string;
    shiftTime: string;
    date: string;
    status: string;
}

interface CalendarDay {
    date: number;
    fullDate: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    shifts: Shift[];
}

const props = defineProps<{
    shifts: Shift[];
}>();

const currentDate = new Date();
const currentMonth = ref(currentDate.getMonth());
const currentYear = ref(currentDate.getFullYear());
const selectedDay = ref<CalendarDay | null>(null);

const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const calendarDays = computed(() => {
    // ... logic remains same ...
    const days: CalendarDay[] = [];
    const firstDay = new Date(currentYear.value, currentMonth.value, 1);
    const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);
    const prevLastDay = new Date(currentYear.value, currentMonth.value, 0);

    const firstDayOfWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    // Previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const date = prevLastDate - i;
        const fullDate = new Date(currentYear.value, currentMonth.value - 1, date);
        days.push({
            date,
            fullDate: fullDate.toISOString().split('T')[0],
            isCurrentMonth: false,
            isToday: false,
            shifts: getShiftsForDate(fullDate.toISOString().split('T')[0])
        });
    }

    // Current month days
    for (let date = 1; date <= lastDate; date++) {
        const fullDate = new Date(currentYear.value, currentMonth.value, date);
        const dateString = fullDate.toISOString().split('T')[0];
        const today = new Date();
        const isToday =
            date === today.getDate() &&
            currentMonth.value === today.getMonth() &&
            currentYear.value === today.getFullYear();

        days.push({
            date,
            fullDate: dateString,
            isCurrentMonth: true,
            isToday,
            shifts: getShiftsForDate(dateString)
        });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let date = 1; date <= remainingDays; date++) {
        const fullDate = new Date(currentYear.value, currentMonth.value + 1, date);
        days.push({
            date,
            fullDate: fullDate.toISOString().split('T')[0],
            isCurrentMonth: false,
            isToday: false,
            shifts: getShiftsForDate(fullDate.toISOString().split('T')[0])
        });
    }

    return days;
});

const getShiftsForDate = (dateString: string): Shift[] => {
    return props.shifts.filter(shift => shift.date === dateString);
};

const getShiftColor = (time: string) => {
    const colors: Record<string, string> = {
        '08-16': '#fbbf24',
        '08-20': '#34d399',
        '08-24': '#a78bfa',
        '16-24': '#f472b6',
        '24-08': '#60a5fa'
    };
    return colors[time] || '#94a3b8';
};

const formatShiftTime = (time: string) => {
    return time.replace('-', ':00 - ') + ':00';
};

const formatShiftTimeShort = (time: string) => {
    const [start] = time.split('-');
    return `${start}:00`;
};

// ... date formatting helper removed as unused in simplified template ...

const previousMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value--;
    } else {
        currentMonth.value--;
    }
    selectedDay.value = null;
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value++;
    } else {
        currentMonth.value++;
    }
    selectedDay.value = null;
};

const emit = defineEmits(['select-date']);

const selectDay = (day: CalendarDay) => {
    emit('select-date', day.fullDate);

    if (!day.isCurrentMonth) return;
    selectedDay.value = day;
};
</script>

<style scoped>
.calendar-container {
    background: white;
    /* Removed padding/radius to fit inside parent card */
}

.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border);
}

.calendar-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    border-bottom: 1px solid var(--border);
}

.calendar-day-header {
    background: white;
    /* Minimal: white header */
    color: var(--text-secondary);
    padding: 0.5rem;
    text-align: center;
    font-weight: 500;
    font-size: 0.875rem;
    border-bottom: 1px solid var(--border);
}

.calendar-day {
    background: white;
    min-height: 100px;
    padding: 0.5rem;
    cursor: pointer;
    border-right: 1px solid #f1f3f4;
    /* Minimal grid lines */
    border-bottom: 1px solid #f1f3f4;
    transition: background-color 0.2s;
}

.calendar-day:nth-child(7n) {
    border-right: none;
}

.calendar-day:hover {
    background: var(--bg-secondary);
}

.calendar-day.other-month {
    background: #fcfcfc;
    color: #dadce0;
}

.calendar-day.today {
    background-color: #f8f9fa;
    /* Subtle highlight */
}

.day-number {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}

.calendar-day.other-month .day-number {
    color: #dadce0;
}

.calendar-day.today .day-number {
    color: var(--primary);
    background: #e8f0fe;
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 50%;
}

.shift-indicators {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.shift-indicator {
    font-size: 0.7rem;
    padding: 2px 4px;
    border-radius: 4px;
    /* Softer radius */
    color: white;
    font-weight: 500;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.more-shifts {
    font-size: 0.7rem;
    color: var(--text-secondary);
    padding: 1px 4px;
}

.selected-date-details {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid var(--border-light);
}

.shift-detail-card {
    background: var(--bg-secondary);
    padding: 1rem;
    border-radius: 0.5rem;
}

@media (max-width: 768px) {
    .calendar-container {
        padding: 0.75rem;
        /* Less padding on mobile */
    }

    .calendar-header {
        margin-bottom: 0.75rem;
        padding: 0.5rem;
        flex-direction: row;
        /* Keep row layout */
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
    }

    .calendar-title {
        font-size: 1rem;
        white-space: nowrap;
        /* Prevent wrap */
    }

    .calendar-day-header {
        padding: 0.25rem;
        font-size: 0.75rem;
        /* Smaller header text */
    }

    .calendar-day {
        min-height: 80px;
        /* Taller for easier tapping */
        padding: 4px;
    }

    .day-number {
        font-size: 0.8rem;
        margin-bottom: 2px;
    }

    .shift-indicator {
        font-size: 0;
        /* Hide text */
        width: 8px;
        height: 8px;
        padding: 0;
        border-radius: 50%;
        margin: 2px;
        display: inline-block;
        /* Stack horizontally */
    }
}
</style>
