<template>
    <div class="calendar-wrapper">
        <FullCalendar :options="calendarOptions" />
    </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const props = defineProps({
    shifts: {
        type: Array as PropType<any[]>,
        default: () => []
    }
});

const emit = defineEmits(['select-date']);

const shiftTimes = [
    { value: '08-16', color: '#fbbf24', label: 'เช้า' },
    { value: '08-20', color: '#34d399', label: 'บ่าย' },
    { value: '08-24', color: '#a78bfa', label: 'ยาว' },
    { value: '16-24', color: '#f472b6', label: 'ดึก' },
    { value: '24-08', color: '#60a5fa', label: 'ข้ามคืน' }
];

// Map shifts to FullCalendar events
const calendarEvents = computed(() => {
    return props.shifts.map(shift => {
        const shiftInfo = shiftTimes.find(s => s.value === shift.shiftTime);
        return {
            id: String(shift.id),
            title: shift.employeeName, // Desktop: Show Name
            start: shift.date,
            backgroundColor: shiftInfo?.color || '#a78bfa',
            borderColor: 'transparent',
            extendedProps: {
                shiftTime: shift.shiftTime
            },
            classNames: ['shift-event']
        };
    });
});

const handleDateClick = (arg: any) => {
    emit('select-date', arg.dateStr);
};

const calendarOptions = computed(() => ({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'th',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: '' // Clean look
    },
    events: calendarEvents.value,
    dateClick: handleDateClick,
    height: 'auto',
    dayMaxEvents: true, // Allow "more" link
    eventContent: (arg: any) => {
        // Custom rendering to ensure color visibility
        const color = arg.event.backgroundColor;
        const title = arg.event.title;
        // The border-left is only for desktop, but we can simplify and use full background for cleaner look on desktop too
        // or keep specific desktop style. Let's make it cleaner for both.
        return {
            html: `<div class="custom-event-content" style="background-color: ${color};">
                    <span class="custom-event-title">${title}</span>
                   </div>`
        };
    }
}));
</script>

<style>
/* Override FullCalendar Styles for Minimal Theme */
.calendar-wrapper {
    background: white;
    padding: 1rem;
    border-radius: 8px;
}

.fc {
    font-family: 'Kanit', sans-serif !important;
    --fc-border-color: var(--border);
    --fc-today-bg-color: transparent;
}

/* Custom Event Styling */
.custom-event-content {
    padding: 2px 6px;
    border-radius: 4px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 0.75rem;
    color: white;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    /* For Desktop: add a small left accent if preferred, OR full fill. Full fill is better for "bars". */
}

.fc-daygrid-event {
    background: transparent !important;
    /* Let our custom div handle bg */
    border: none !important;
    margin-top: 2px;
}

/* Header */
.fc-toolbar-title {
    font-size: 1.25rem !important;
    font-weight: 600;
    color: var(--primary);
}

.fc-button-primary {
    background: transparent !important;
    border: 1px solid var(--border) !important;
    color: var(--text-primary) !important;
    box-shadow: none !important;
    text-transform: capitalize;
    font-weight: 500;
}

.fc-button-primary:hover {
    background: var(--bg-secondary) !important;
}

.fc-button-primary:disabled {
    opacity: 0.5;
}

.fc-scroller {
    overflow-y: hidden !important;
    /* Fix double scrollbar issue */
}

/* Day Cells */
.fc-day-today {
    background-color: var(--bg-secondary) !important;
}

.fc-daygrid-day-number {
    color: var(--text-primary);
    font-weight: 500;
    text-decoration: none !important;
    padding: 8px !important;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .calendar-wrapper {
        padding: 0;
    }

    .fc-toolbar {
        flex-direction: row !important;
        /* Force row on mobile */
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 2rem !important;
        padding: 0 0.5rem;
    }

    .fc-toolbar-title {
        font-size: 1.1rem !important;
    }

    .fc-button {
        padding: 0.25rem 0.5rem !important;
        font-size: 0.8rem !important;
    }

    /* CAPSULE STYLE BARS for Mobile */
    .custom-event-content {
        height: 8px;
        /* Thicker for visibility */
        padding: 0;
        border-radius: 4px;
        /* Fully rounded capsule feeling */
        margin-bottom: 2px;
        width: 100%;
    }

    .custom-event-title {
        display: none;
        /* Hide text on mobile */
    }

    .fc-daygrid-day-events {
        display: flex;
        flex-direction: column;
        gap: 2px;
        /* Distinct gap between bars */
        min-height: 12px;
        padding: 0 4px;
        /* Padding inside cell so bars don't touch edges */
    }

    /* Clean Cell */
    .fc-daygrid-day-frame {
        min-height: 85px !important;
        padding-bottom: 4px;
    }
}
</style>
