// Admin Dashboard JavaScript - Office Pantry Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize charts
    initializeCharts();
    
    // Start real-time updates
    startRealTimeUpdates();
    
    console.log('Admin Dashboard loaded successfully!');
});

// Dashboard initialization
function initializeDashboard() {
    // Update notification count
    updateNotificationCount();
    
    // Load initial data
    loadDashboardData();
    
    // Set up accessibility features
    setupAccessibility();
}

// Event listeners setup
function setupEventListeners() {
    // Refresh data button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboardData);
    }
    
    // Export report button
    const exportBtn = document.getElementById('exportReport');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboardReport);
    }
    
    // Notification bell
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', toggleNotifications);
    }
    
    // Chart controls
    const timeRangeSelect = document.getElementById('timeRange');
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', updateWeeklyChart);
    }
    
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            chartBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Update chart type
            updateDistributionChart(this.dataset.type);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Chart initialization
let weeklyChart, distributionChart;

function initializeCharts() {
    // Weekly consumption chart
    const weeklyCtx = document.getElementById('weeklyChart');
    if (weeklyCtx) {
        weeklyChart = new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Tea',
                        data: [12, 15, 8, 18, 22, 5, 3],
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'Coffee',
                        data: [8, 12, 15, 20, 18, 2, 1],
                        backgroundColor: 'rgba(139, 92, 246, 0.8)',
                        borderColor: 'rgba(139, 92, 246, 1)',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'Biscuits',
                        data: [25, 30, 18, 35, 28, 8, 5],
                        backgroundColor: 'rgba(245, 158, 11, 0.8)',
                        borderColor: 'rgba(245, 158, 11, 1)',
                        borderWidth: 2,
                        borderRadius: 6,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' items consumed';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11,
                                weight: '500'
                            },
                            color: '#6b7280',
                            callback: function(value) {
                                return value + ' items';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }
    
    // Distribution chart
    const distributionCtx = document.getElementById('distributionChart');
    if (distributionCtx) {
        distributionChart = new Chart(distributionCtx, {
            type: 'pie',
            data: {
                labels: ['Tea', 'Coffee', 'Biscuits', 'Other'],
                datasets: [{
                    data: [15, 5, 45, 10],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(107, 114, 128, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(107, 114, 128, 1)'
                    ],
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 12,
                                weight: '500'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed / total) * 100).toFixed(1);
                                return context.label + ': ' + context.parsed + ' items (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update weekly chart based on time range
function updateWeeklyChart() {
    const timeRange = document.getElementById('timeRange').value;
    let newData;
    
    switch(timeRange) {
        case 'week':
            newData = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    { label: 'Tea', data: [12, 15, 8, 18, 22, 5, 3] },
                    { label: 'Coffee', data: [8, 12, 15, 20, 18, 2, 1] },
                    { label: 'Biscuits', data: [25, 30, 18, 35, 28, 8, 5] }
                ]
            };
            break;
        case 'month':
            newData = {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [
                    { label: 'Tea', data: [85, 92, 78, 88] },
                    { label: 'Coffee', data: [76, 84, 91, 79] },
                    { label: 'Biscuits', data: [149, 156, 142, 151] }
                ]
            };
            break;
        case 'quarter':
            newData = {
                labels: ['Month 1', 'Month 2', 'Month 3'],
                datasets: [
                    { label: 'Tea', data: [343, 298, 312] },
                    { label: 'Coffee', data: [330, 285, 301] },
                    { label: 'Biscuits', data: [598, 542, 567] }
                ]
            };
            break;
    }
    
    if (weeklyChart) {
        weeklyChart.data = newData;
        weeklyChart.update('active');
    }
}

// Update distribution chart type
function updateDistributionChart(type) {
    if (distributionChart) {
        distributionChart.config.type = type;
        distributionChart.update('active');
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate API call
    setTimeout(() => {
        updateStockMetrics();
        updateAlerts();
        updateRecentActivity();
    }, 500);
}

// Update stock metrics
function updateStockMetrics() {
    const stockData = {
        tea: 15,
        coffee: 5,
        biscuits: 45,
        total: 65
    };
    
    // Update stock values with animation
    animateValue('teaStock', 0, stockData.tea, 1000);
    animateValue('coffeeStock', 0, stockData.coffee, 1000);
    animateValue('biscuitsStock', 0, stockData.biscuits, 1000);
    animateValue('totalStock', 0, stockData.total, 1000);
}

// Animate value changes
function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Update alerts
function updateAlerts() {
    const alertsSection = document.getElementById('alertsSection');
    if (!alertsSection) return;
    
    // Check stock levels and show/hide alerts
    const teaStock = parseInt(document.getElementById('teaStock').textContent);
    const coffeeStock = parseInt(document.getElementById('coffeeStock').textContent);
    
    // Show/hide tea alert
    const teaAlert = alertsSection.querySelector('.alert-warning');
    if (teaAlert) {
        teaAlert.style.display = teaStock < 20 ? 'flex' : 'none';
    }
    
    // Show/hide coffee alert
    const coffeeAlert = alertsSection.querySelector('.alert-danger');
    if (coffeeAlert) {
        coffeeAlert.style.display = coffeeStock < 10 ? 'flex' : 'none';
    }
}

// Update recent activity
function updateRecentActivity() {
    // This would typically fetch from an API
    console.log('Recent activity updated');
}

// Refresh dashboard data
function refreshDashboardData() {
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
    }
    
    // Simulate refresh
    setTimeout(() => {
        loadDashboardData();
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            refreshBtn.disabled = false;
        }
        
        showNotification('Dashboard data refreshed successfully!', 'success');
    }, 1500);
}

// Export dashboard report
function exportDashboardReport() {
    const exportBtn = document.getElementById('exportReport');
    if (exportBtn) {
        exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        exportBtn.disabled = true;
    }
    
    // Simulate export
    setTimeout(() => {
        // In a real application, this would generate and download a report
        showNotification('Report exported successfully!', 'success');
        
        if (exportBtn) {
            exportBtn.innerHTML = '<i class="fas fa-download"></i> Export Report';
            exportBtn.disabled = false;
        }
    }, 2000);
}

// Toggle notifications panel
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

// Update notification count
function updateNotificationCount() {
    const countElement = document.getElementById('notificationCount');
    if (countElement) {
        // Simulate notification count
        const count = Math.floor(Math.random() * 5) + 1;
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

// Quick actions handler
function quickAction(action, item) {
    const actions = {
        'restock': () => {
            showNotification(`Restocking ${item}...`, 'info');
            // Simulate restock
            setTimeout(() => {
                const stockElement = document.getElementById(item + 'Stock');
                if (stockElement) {
                    const currentStock = parseInt(stockElement.textContent);
                    const newStock = currentStock + 50;
                    animateValue(item + 'Stock', currentStock, newStock, 1000);
                }
                showNotification(`${item} restocked successfully!`, 'success');
            }, 1500);
        },
        'view': () => {
            showNotification(`Viewing ${item} details...`, 'info');
            // In a real app, this would navigate to item details
        },
        'add': () => {
            showNotification('Opening add item form...', 'info');
            // In a real app, this would open a modal or navigate to add item page
        },
        'users': () => {
            showNotification('Opening user management...', 'info');
            // In a real app, this would navigate to user management
        },
        'reports': () => {
            showNotification('Generating report...', 'info');
            // In a real app, this would generate a report
        },
        'settings': () => {
            showNotification('Opening system settings...', 'info');
            // In a real app, this would open settings
        },
        'backup': () => {
            showNotification('Creating data backup...', 'info');
            // In a real app, this would create a backup
        },
        'export': () => {
            showNotification('Exporting data...', 'info');
            // In a real app, this would export data
        }
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// Handle alert actions
function handleAlert(item) {
    quickAction('restock', item);
    
    // Hide the alert after action
    setTimeout(() => {
        const alert = event.target.closest('.alert');
        if (alert) {
            alert.style.display = 'none';
        }
    }, 1000);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.toast-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `toast-notification toast-${type}`;
    notification.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        .toast-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        .toast-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Get notification color
function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Start real-time updates
function startRealTimeUpdates() {
    // Update data every 30 seconds
    setInterval(() => {
        updateStockMetrics();
        updateAlerts();
        updateNotificationCount();
    }, 30000);
}

// Setup accessibility features
function setupAccessibility() {
    // Add ARIA labels
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const value = card.querySelector('.current-stock').textContent;
        const unit = card.querySelector('.stock-unit').textContent;
        card.setAttribute('aria-label', `${title}: ${value} ${unit}`);
    });
    
    // Add keyboard navigation for charts
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'img');
        container.setAttribute('aria-label', 'Interactive chart');
    });
}

// Handle keyboard navigation
function handleKeyboardNavigation(e) {
    // Close notifications with Escape
    if (e.key === 'Escape') {
        const panel = document.getElementById('notificationPanel');
        if (panel && panel.classList.contains('open')) {
            panel.classList.remove('open');
        }
    }
    
    // Refresh with F5 or Ctrl+R
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        refreshDashboardData();
    }
}

// Make functions globally available
window.quickAction = quickAction;
window.handleAlert = handleAlert;
window.toggleNotifications = toggleNotifications;


