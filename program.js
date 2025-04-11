const schedule = [
    {
        id: 1,
        timeStart: '07:00',
        timeEnd: '08:00',
        title: 'REGISTRATION',
        description: []
    },
    {
        id: 2,
        timeStart: '08:00',
        timeEnd: '08:30',
        title: 'OPENING PROGRAM',
        description: [
            'Invocation',
            'Singing of National Anthem',
            'WVSU Hymn',
            'Welcoming Remarks - Miguel Jacob Artillero, VP for Program, LINK.exe',
            'Message - Dr. Ma. Beth S. Concepcion, Dean, CICT'
        ]
    },
    {
        id: 3,
        timeStart: '08:30',
        timeEnd: '11:30',
        title: 'Tech-TALK',
        description: [
            'Talk Proper - Engr. Laurelly Joyce Aporto, Guest Speaker',
            'Open Mic for Attendees - Engr. Laurelly Joyce Aporto',
            'Awarding of Token and Certificate to Speaker - Miguel Jacob Artillero, VP for Program, LINK.exe'
        ]
    },
    {
        id: 4,
        timeStart: '11:30',
        timeEnd: '13:00',
        title: 'LUNCH',
        description: []
    },
    {
        id: 5,
        timeStart: '13:00',
        timeEnd: '16:20',
        title: 'CONTEST PROPER',
        description: [
            'IDEATHON - Introduction of Judges and Reading of Criteria',
            'Pitching Proper - All registered IDEATHON participants'
        ]
    },
    {
        id: 6,
        timeStart: '16:20',
        timeEnd: '17:00',
        title: 'AWARDING',
        description: [
            'Awarding of Winners of METROPOLENS (Photo Contest)',
            'Awarding of Winners of PIXELCRAFT (Digital Art Contest)',
            'Awarding of Winners of REEL-IT (Video Reels Contest)',
            'Awarding of Winners of IDEATHON (Pitching Contest)',
            'Awarding of Certificates to Partner Organizations and Student Councils'
        ]
    },
    {
        id: 7,
        timeStart: '17:00',
        timeEnd: '17:30',
        title: 'CLOSING PROGRAM',
        description: [
            'Closing Remarks - Miguel Jacob Artillero, VP for Program, LINK.exe',
            'Photo Opportunity'
        ]
    }
];

// Function to format time from 24-hour to 12-hour format
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

// Function to convert time string to Date object
function timeToDate(timeStr) {
    const today = new Date();
    const [hours, minutes] = timeStr.split(':');
    
    today.setHours(parseInt(hours));
    today.setMinutes(parseInt(minutes));
    today.setSeconds(0);
    
    return today;
}

// Find current event index
function getCurrentEventIndex() {
    const now = new Date();
    
    for (let i = 0; i < schedule.length; i++) {
        const startTime = timeToDate(schedule[i].timeStart);
        const endTime = timeToDate(schedule[i].timeEnd);
        
        if (now >= startTime && now < endTime) {
            return i;
        }
    }
    
    // If current time is before first event
    if (now < timeToDate(schedule[0].timeStart)) {
        return 0;
    }
    
    // If current time is after last event
    return schedule.length - 1;
}

// Function to render the schedule
function renderSchedule() {
    const scheduleContainer = document.getElementById('schedule');
    scheduleContainer.innerHTML = '';
    
    const now = new Date();
    
    schedule.forEach(item => {
        const startTime = timeToDate(item.timeStart);
        const endTime = timeToDate(item.timeEnd);
        
        const isActive = now >= startTime && now < endTime;
        const isCompleted = now > endTime;
        
        const scheduleItem = document.createElement('div');
        scheduleItem.className = `schedule-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        scheduleItem.id = `item-${item.id}`;
        
        scheduleItem.innerHTML = `
            <div class="schedule-time">${formatTime(item.timeStart)} - ${formatTime(item.timeEnd)}</div>
            <div class="schedule-details">
                <div class="schedule-title">${item.title}</div>
                <div class="schedule-description">
                    ${item.description.length > 0 ? 
                        item.description.map(desc => `<div>${desc}</div>`).join('') : 
                        '<div>No additional details</div>'}
                </div>
            </div>
        `;
        
        scheduleContainer.appendChild(scheduleItem);
    });
}

// Function to update current session
function updateCurrentSession() {
    const now = new Date();
    const currentTimeElement = document.getElementById('current-time');
    const currentEventElement = document.getElementById('current-event');
    const timeLeftElement = document.getElementById('time-left');
    
    // Format current time
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    currentTimeElement.textContent = `Current Time: ${formattedHours}:${minutes} ${ampm}`;
    
    // Find current event
    let currentEvent = null;
    let currentEventIndex = -1;
    
    for (let i = 0; i < schedule.length; i++) {
        const item = schedule[i];
        const startTime = timeToDate(item.timeStart);
        const endTime = timeToDate(item.timeEnd);
        
        if (now >= startTime && now < endTime) {
            currentEvent = item;
            currentEventIndex = i;
            break;
        }
    }
    
    // Update active class on all items
    document.querySelectorAll('.schedule-item').forEach(item => {
        item.classList.remove('active');
    });
    
    if (currentEvent) {
        currentEventElement.textContent = currentEvent.title;
        
        // Calculate time remaining
        const endTime = timeToDate(currentEvent.timeEnd);
        const timeRemaining = endTime - now;
        
        const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
        const hoursRemaining = Math.floor(minutesRemaining / 60);
        const remainingMinutes = minutesRemaining % 60;
        
        if (hoursRemaining > 0) {
            timeLeftElement.textContent = `Time Remaining: ${hoursRemaining}h ${remainingMinutes}m until next session`;
        } else {
            timeLeftElement.textContent = `Time Remaining: ${remainingMinutes}m until next session`;
        }
        
        // Highlight active session
        const activeItem = document.getElementById(`item-${currentEvent.id}`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    } else {
        // Check if before first event
        const firstEvent = schedule[0];
        const firstEventStart = timeToDate(firstEvent.timeStart);
        
        if (now < firstEventStart) {
            currentEventElement.textContent = "Event hasn't started yet";
            
            const timeUntilStart = firstEventStart - now;
            const minutesUntilStart = Math.floor(timeUntilStart / (1000 * 60));
            const hoursUntilStart = Math.floor(minutesUntilStart / 60);
            const remainingMinutes = minutesUntilStart % 60;
            
            if (hoursUntilStart > 0) {
                timeLeftElement.textContent = `Starting in: ${hoursUntilStart}h ${remainingMinutes}m`;
            } else {
                timeLeftElement.textContent = `Starting in: ${remainingMinutes}m`;
            }
            
            // Highlight first item
            const firstItem = document.getElementById(`item-1`);
            if (firstItem) {
                firstItem.classList.add('active');
            }
        } else {
            // After last event
            currentEventElement.textContent = "Event has concluded";
            timeLeftElement.textContent = "Thank you for participating!";
            
            // Highlight last item
            const lastItem = document.getElementById(`item-${schedule.length}`);
            if (lastItem) {
                lastItem.classList.add('active');
            }
        }
    }
}

// Function to scroll to current session
function scrollToCurrentSession() {
    const currentIndex = getCurrentEventIndex();
    const currentItem = document.getElementById(`item-${schedule[currentIndex].id}`);
    
    if (currentItem) {
        // Add smooth scrolling
        currentItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Handle next session button
function setupNextSessionButton() {
    const nextButton = document.getElementById('next-session');
    
    nextButton.addEventListener('click', function() {
        const currentIndex = getCurrentEventIndex();
        const nextIndex = (currentIndex + 1) % schedule.length;
        
        const nextItem = document.getElementById(`item-${schedule[nextIndex].id}`);
        if (nextItem) {
            nextItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// Initialize and set up interval updates
function init() {
    renderSchedule();
    updateCurrentSession();
    
    // Set up scroll to current button
    document.getElementById('scroll-to-current').addEventListener('click', scrollToCurrentSession);
    
    // Set up next session button
    setupNextSessionButton();
    
    // Update every minute
    setInterval(() => {
        updateCurrentSession();
    }, 60000);
    
    // Initial scroll to current session after a short delay
    setTimeout(scrollToCurrentSession, 1000);
}

// Start when page loads
window.addEventListener('load', init);