<template>
    <div class="page-content">
        <div class="container">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title">Shift Management</h1>
                    <p class="text-muted">View and manage shift schedules</p>
                </div>

                <!-- View Toggle -->
                <div class="flex gap-md mb-lg">
                    <button @click="viewMode = 'calendar'" class="btn"
                        :class="viewMode === 'calendar' ? 'btn-primary' : 'btn-secondary'">
                        📅 Calendar View
                    </button>
                    <button @click="viewMode = 'cards'" class="btn"
                        :class="viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'">
                        📋 Card View
                    </button>
                </div>

                <!-- Calendar View -->
                <div v-if="viewMode === 'calendar'" class="animate-fade-in">
                    <ShiftCalendar :shifts="shifts" />
                </div>

                <!-- Card View -->
                <div v-else class="animate-fade-in">
                    <!-- Filters -->
                    <div class="flex gap-md mb-lg">
                        <select v-model="filterDate" class="form-select" style="width: 200px;">
                            <option value="">All Dates</option>
                            <option v-for="date in uniqueDates" :key="date" :value="date">
                                {{ formatDate(date) }}
                            </option>
                        </select>

                        <select v-model="filterShiftTime" class="form-select" style="width: 200px;">
                            <option value="">All Shift Times</option>
                            <option value="08-16">08:00 - 16:00</option>
                            <option value="08-20">08:00 - 20:00</option>
                            <option value="08-24">08:00 - 24:00</option>
                            <option value="16-24">16:00 - 24:00</option>
                            <option value="24-08">24:00 - 08:00</option>
                        </select>
                    </div>

                    <!-- Shift Cards -->
                    <div class="grid grid-3 gap-md">
                        <div v-for="shift in filteredShifts" :key="shift.id" class="shift-card">
                            <div class="shift-card-header" :style="{ borderLeftColor: getShiftColor(shift.shiftTime) }">
                                <span class="badge" :style="{ background: getShiftColor(shift.shiftTime) }">
                                    {{ formatShiftTime(shift.shiftTime) }}
                                </span>
                                <button @click="deleteShift(shift.id)" class="btn-icon">🗑️</button>
                            </div>

                            <div class="shift-card-body">
                                <div class="shift-info">
                                    <strong>👤 {{ shift.employeeName }}</strong>
                                </div>
                                <div class="shift-info">
                                    📅 {{ formatDate(shift.date) }}
                                </div>
                                <div class="shift-info">
                                    <span class="badge badge-success">{{ shift.status }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-if="filteredShifts.length === 0" class="text-center mt-xl">
                        <div style="font-size: 4rem;">📭</div>
                        <h3>No shifts found</h3>
                        <p class="text-muted">Go to Sign In to register a new shift</p>
                        <NuxtLink to="/signin" class="btn btn-primary mt-md">Register Shift</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ShiftCalendar from '~/components/ShiftCalendar.vue';

useHead({
    title: 'Shifts - Hospital Shift Calendar'
});

interface Shift {
    id: number;
    employeeId: number;
    employeeName: string;
    shiftTime: string;
    date: string;
    status: string;
}

const shifts = ref<Shift[]>([]);
const viewMode = ref<'calendar' | 'cards'>('calendar');
const filterDate = ref('');
const filterShiftTime = ref('');

const loadShifts = async () => {
    try {
        const response = await $fetch('/api/shifts');
        shifts.value = response.data;
    } catch (error) {
        console.error('Failed to load shifts:', error);
    }
};

onMounted(() => {
    loadShifts();
});

const filteredShifts = computed(() => {
    let result = shifts.value;

    if (filterDate.value) {
        result = result.filter(s => s.date === filterDate.value);
    }

    if (filterShiftTime.value) {
        result = result.filter(s => s.shiftTime === filterShiftTime.value);
    }

    return result;
});

const uniqueDates = computed(() => {
    return [...new Set(shifts.value.map(s => s.date))].sort();
});

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

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const deleteShift = async (id: number) => {
    if (!confirm('Are you sure you want to delete this shift?')) {
        return;
    }

    try {
        await $fetch(`/api/shifts/${id}`, {
            method: 'DELETE'
        });
        alert('Shift deleted successfully!');
        await loadShifts();
    } catch (error: any) {
        alert(error.data?.message || 'Failed to delete shift');
    }
};
</script>

<style scoped>
.shift-card {
    background: white;
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-base);
}

.shift-card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.shift-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--bg-secondary);
    border-left: 4px solid;
}

.shift-card-body {
    padding: 1rem;
}

.shift-info {
    margin-bottom: 0.5rem;
}

.btn-icon {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity var(--transition-fast);
}

.btn-icon:hover {
    opacity: 1;
}
</style>
