// Reports & Analytics JavaScript - Office Pantry Management System

// Global variables
let consumptionData = [];
let filteredData = [];
let currentPage = 1;
let pageSize = 25;
let sortColumn = 'date';
let sortDirection = 'desc';
let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize reports
    initializeReports();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load sample data
    loadSampleData();
    
    // Initialize charts
    initializeCharts();
    
    // Apply initial filters
    applyFilters();
    
    console.log('Reports & Analytics loaded successfully!');
});

// Initialize reports
function initializeReports() {
    // Set default date range
    setDefaultDateRange();
    
    // Initialize table
    initializeTable();
}

// Set up event listeners
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshReportsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshReports);
    }
    
    // Export button
    const exportBtn = document.getElementById('exportReportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', openExportModal);
    }
    
    // Table search
    const tableSearch = document.getElementById('tableSearch');
    if (tableSearch) {
        tableSearch.addEventListener('input', debounce(filterTable, 300));
    }
    
    // Page size change
    const pageSizeSelect = document.getElementById('pageSize');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', changePageSize);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Load sample data
function loadSampleData() {
    const sampleData = [
        {
            id: '1',
            item: 'tea-bags',
            quantity: 3,
            date: '2024-01-15',
            time: '09:30',
            user: 'John Doe',
            notes: 'Morning tea break',
            category: 'beverages'
        },
        {
            id: '2',
            item: 'coffee-beans',
            quantity: 2,
            date: '2024-01-15',
            time: '10:15',
            user: 'Jane Smith',
            notes: '',
            category: 'beverages'
        },
        {
            id: '3',
            item: 'biscuits',
            quantity: 5,
            date: '2024-01-15',
            time: '14:20',
            user: 'Mike Johnson',
            notes: 'Afternoon snack',
            category: 'snacks'
        },
        {
            id: '4',
            item: 'cookies',
            quantity: 4,
            date: '2024-01-14',
            time: '15:45',
            user: 'Sarah Wilson',
            notes: 'Team meeting',
            category: 'snacks'
        },
        {
            id: '5',
            item: 'tea-bags',
            quantity: 2,
            date: '2024-01-14',
            time: '11:00',
            user: 'John Doe',
            notes: '',
            category: 'beverages'
        },
        {
            id: '6',
            item: 'coffee-beans',
            quantity: 3,
            date: '2024-01-14',
            time: '08:30',
            user: 'Jane Smith',
            notes: 'Early morning coffee',
            category: 'beverages'
        },
        {
            id: '7',
            item: 'sugar',
            quantity: 1,
            date: '2024-01-13',
            time: '16:20',
            user: 'Guest User',
            notes: 'Added to coffee',
            category: 'other'
        },
        {
            id: '8',
            item: 'biscuits',
            quantity: 3,
            date: '2024-01-13',
            time: '13:15',
            user: 'Mike Johnson',
            notes: 'Lunch break',
            category: 'snacks'
        },
        {
            id: '9',
            item: 'tea-bags',
            quantity: 4,
            date: '2024-01-12',
            time: '10:30',
            user: 'Sarah Wilson',
            notes: 'Client meeting',
            category: 'beverages'
        },
        {
            id: '10',
            item: 'cookies',
            quantity: 6,
            date: '2024-01-12',
            time: '15:00',
            user: 'John Doe',
            notes: 'Birthday celebration',
            category: 'snacks'
        }
    ];
    
    consumptionData = sampleData;
    filteredData = [...consumptionData];
}

// Initialize charts
function initializeCharts() {
    // Consumption Distribution Chart
    const consumptionCtx = document.getElementById('consumptionChart');
    if (consumptionCtx) {
        charts.consumptionChart = new Chart(consumptionCtx, {
            type: 'pie',
            data: {
                labels: ['Tea Bags', 'Coffee Beans', 'Biscuits', 'Cookies', 'Other'],
                datasets: [{
                    data: [12, 8, 15, 10, 3],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(107, 114, 128, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(139, 92, 246, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
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
    
    // Daily Trends Chart
    const trendsCtx = document.getElementById('trendsChart');
    if (trendsCtx) {
        charts.trendsChart = new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: ['Jan 12', 'Jan 13', 'Jan 14', 'Jan 15'],
                datasets: [
                    {
                        label: 'Tea Bags',
                        data: [4, 0, 2, 3],
                        borderColor: 'rgba(16, 185, 129, 1)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Coffee Beans',
                        data: [0, 0, 3, 2],
                        borderColor: 'rgba(139, 92, 246, 1)',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Biscuits',
                        data: [0, 3, 0, 5],
                        borderColor: 'rgba(245, 158, 11, 1)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
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
                        mode: 'index',
                        intersect: false
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
    
    // User Activity Chart
    const userCtx = document.getElementById('userChart');
    if (userCtx) {
        charts.userChart = new Chart(userCtx, {
            type: 'bar',
            data: {
                labels: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Guest User'],
                datasets: [{
                    label: 'Items Consumed',
                    data: [9, 5, 8, 4, 1],
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                                return context.parsed.y + ' items consumed';
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
                }
            }
        });
    }
    
    // Time-based Chart
    const timeCtx = document.getElementById('timeChart');
    if (timeCtx) {
        charts.timeChart = new Chart(timeCtx, {
            type: 'bar',
            data: {
                labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
                datasets: [{
                    label: 'Consumption',
                    data: [2, 5, 8, 6, 3, 4, 7, 9, 5, 2],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    borderWidth: 2,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
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
                                return context.parsed.y + ' items consumed';
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
                }
            }
        });
    }
}

// Handle date range change
function handleDateRangeChange() {
    const dateRange = document.getElementById('dateRange').value;
    const customDateGroup = document.getElementById('customDateGroup');
    const customDateGroup2 = document.getElementById('customDateGroup2');
    
    if (dateRange === 'custom') {
        customDateGroup.style.display = 'block';
        customDateGroup2.style.display = 'block';
    } else {
        customDateGroup.style.display = 'none';
        customDateGroup2.style.display = 'none';
        setDefaultDateRange();
    }
    
    applyFilters();
}

// Set default date range
function setDefaultDateRange() {
    const dateRange = document.getElementById('dateRange').value;
    const today = new Date();
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    let start, end;
    
    switch(dateRange) {
        case 'today':
            start = end = today;
            break;
        case 'yesterday':
            start = end = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'thisWeek':
            start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            end = today;
            break;
        case 'lastWeek':
            start = new Date(today.getTime() - 14 * 60 * 60 * 1000);
            end = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'thisMonth':
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = today;
            break;
        case 'lastMonth':
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            end = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'thisQuarter':
            const quarter = Math.floor(today.getMonth() / 3);
            start = new Date(today.getFullYear(), quarter * 3, 1);
            end = today;
            break;
        default:
            return;
    }
    
    if (startDate && endDate) {
        startDate.value = start.toISOString().split('T')[0];
        endDate.value = end.toISOString().split('T')[0];
    }
}

// Update custom range
function updateCustomRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        applyFilters();
    }
}

// Apply filters
function applyFilters() {
    const dateRange = document.getElementById('dateRange').value;
    const itemFilter = document.getElementById('itemFilter').value;
    const userFilter = document.getElementById('userFilter').value;
    const sortBy = document.getElementById('sortBy').value;
    
    // Filter by date range
    let filtered = [...consumptionData];
    
    if (dateRange !== 'all') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return itemDate >= start && itemDate <= end;
            });
        }
    }
    
    // Filter by item type
    if (itemFilter !== 'all') {
        filtered = filtered.filter(item => item.category === itemFilter);
    }
    
    // Filter by user
    if (userFilter !== 'all') {
        filtered = filtered.filter(item => item.user.toLowerCase().includes(userFilter.toLowerCase()));
    }
    
    // Sort data
    filtered.sort((a, b) => {
        let aVal, bVal;
        
        switch(sortBy) {
            case 'date':
                aVal = new Date(a.date);
                bVal = new Date(b.date);
                break;
            case 'quantity':
                aVal = a.quantity;
                bVal = b.quantity;
                break;
            case 'item':
                aVal = a.item;
                bVal = b.item;
                break;
            case 'user':
                aVal = a.user;
                bVal = b.user;
                break;
            default:
                aVal = a.date;
                bVal = b.date;
        }
        
        if (sortDirection === 'desc') {
            return bVal > aVal ? 1 : -1;
        } else {
            return aVal > bVal ? 1 : -1;
        }
    });
    
    filteredData = filtered;
    currentPage = 1;
    
    // Update displays
    updateSummaryCards();
    updateCharts();
    updateTable();
}

// Update summary cards
function updateSummaryCards() {
    const totalItems = filteredData.reduce((sum, item) => sum + item.quantity, 0);
    const activeUsers = new Set(filteredData.map(item => item.user)).size;
    
    // Find most popular item
    const itemCounts = {};
    filteredData.forEach(item => {
        itemCounts[item.item] = (itemCounts[item.item] || 0) + item.quantity;
    });
    
    const mostPopular = Object.keys(itemCounts).reduce((a, b) => 
        itemCounts[a] > itemCounts[b] ? a : b, '');
    
    // Calculate average daily consumption
    const dates = [...new Set(filteredData.map(item => item.date))];
    const avgDaily = dates.length > 0 ? Math.round(totalItems / dates.length) : 0;
    
    // Update DOM
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('mostPopular').textContent = mostPopular ? getItemDisplayName(mostPopular) : '-';
    document.getElementById('avgDaily').textContent = avgDaily;
}

// Update charts
function updateCharts() {
    // Update consumption distribution chart
    if (charts.consumptionChart) {
        const itemCounts = {};
        filteredData.forEach(item => {
            itemCounts[item.item] = (itemCounts[item.item] || 0) + item.quantity;
        });
        
        const labels = Object.keys(itemCounts);
        const data = Object.values(itemCounts);
        
        charts.consumptionChart.data.labels = labels.map(getItemDisplayName);
        charts.consumptionChart.data.datasets[0].data = data;
        charts.consumptionChart.update();
    }
    
    // Update user activity chart
    if (charts.userChart) {
        const userCounts = {};
        filteredData.forEach(item => {
            userCounts[item.user] = (userCounts[item.user] || 0) + item.quantity;
        });
        
        const labels = Object.keys(userCounts);
        const data = Object.values(userCounts);
        
        charts.userChart.data.labels = labels;
        charts.userChart.data.datasets[0].data = data;
        charts.userChart.update();
    }
}

// Change chart type
function changeChartType(chartId, type, horizontal = false) {
    if (charts[chartId]) {
        charts[chartId].config.type = type;
        if (horizontal && type === 'bar') {
            charts[chartId].options.indexAxis = 'y';
        } else {
            charts[chartId].options.indexAxis = 'x';
        }
        charts[chartId].update();
    }
    
    // Update button states
    const chartCard = document.getElementById(chartId).closest('.chart-card');
    const buttons = chartCard.querySelectorAll('.chart-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Toggle time view
function toggleTimeView() {
    // This would switch between hourly and daily views
    console.log('Toggle time view');
}

// Initialize table
function initializeTable() {
    updateTable();
}

// Update table
function updateTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add rows
    pageData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(item.date)}</td>
            <td>${getItemDisplayName(item.item)}</td>
            <td>${item.quantity}</td>
            <td>${item.user}</td>
            <td>${item.time}</td>
            <td>${item.notes || '-'}</td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="viewEntry('${item.id}')">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update pagination
    updatePagination();
    
    // Update table info
    updateTableInfo();
}

// Update pagination
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredData.length / pageSize);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} 
                onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-ellipsis">...</span>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} 
                onclick="changePage(${currentPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Update table info
function updateTableInfo() {
    const tableInfo = document.getElementById('tableInfo');
    if (!tableInfo) return;
    
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, filteredData.length);
    const total = filteredData.length;
    
    tableInfo.textContent = `Showing ${startIndex} to ${endIndex} of ${total} entries`;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateTable();
    }
}

// Change page size
function changePageSize() {
    pageSize = parseInt(document.getElementById('pageSize').value);
    currentPage = 1;
    updateTable();
}

// Sort table
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    // Update sort indicators
    const headers = document.querySelectorAll('.sortable');
    headers.forEach(header => {
        header.classList.remove('sorted');
        const icon = header.querySelector('i');
        icon.className = 'fas fa-sort';
    });
    
    const currentHeader = event.target.closest('th');
    currentHeader.classList.add('sorted');
    const icon = currentHeader.querySelector('i');
    icon.className = `fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`;
    
    applyFilters();
}

// Filter table
function filterTable() {
    const searchTerm = document.getElementById('tableSearch').value.toLowerCase();
    
    if (!searchTerm) {
        filteredData = [...consumptionData];
    } else {
        filteredData = consumptionData.filter(item => 
            item.item.toLowerCase().includes(searchTerm) ||
            item.user.toLowerCase().includes(searchTerm) ||
            item.notes.toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    updateTable();
}

// Reset filters
function resetFilters() {
    document.getElementById('dateRange').value = 'thisWeek';
    document.getElementById('itemFilter').value = 'all';
    document.getElementById('userFilter').value = 'all';
    document.getElementById('sortBy').value = 'date';
    document.getElementById('tableSearch').value = '';
    
    handleDateRangeChange();
    applyFilters();
}

// Refresh reports
function refreshReports() {
    const refreshBtn = document.getElementById('refreshReportsBtn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
    }
    
    // Simulate refresh
    setTimeout(() => {
        loadSampleData();
        applyFilters();
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            refreshBtn.disabled = false;
        }
        
        showMessage('Reports refreshed successfully!', 'success');
    }, 1500);
}

// Open export modal
function openExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close export modal
function closeExportModal() {
    const modal = document.getElementById('exportModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Execute export
function executeExport() {
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    const includeCharts = document.getElementById('includeCharts').checked;
    const includeSummary = document.getElementById('includeSummary').checked;
    const includeRawData = document.getElementById('includeRawData').checked;
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('show');
    
    // Simulate export
    setTimeout(() => {
        loadingOverlay.classList.remove('show');
        closeExportModal();
        
        // In a real app, this would generate and download the file
        showMessage(`Report exported as ${format.toUpperCase()} successfully!`, 'success');
    }, 2000);
}

// View entry
function viewEntry(entryId) {
    const entry = consumptionData.find(item => item.id === entryId);
    if (entry) {
        showMessage(`Viewing entry: ${getItemDisplayName(entry.item)} - ${entry.quantity} items`, 'info');
    }
}

// Utility functions
function getItemDisplayName(item) {
    const names = {
        'tea-bags': 'Tea Bags',
        'coffee-beans': 'Coffee Beans',
        'instant-coffee': 'Instant Coffee',
        'hot-chocolate': 'Hot Chocolate',
        'biscuits': 'Biscuits',
        'cookies': 'Cookies',
        'chips': 'Chips',
        'nuts': 'Nuts',
        'sugar': 'Sugar',
        'milk': 'Milk',
        'cream': 'Cream',
        'sweetener': 'Sweetener'
    };
    return names[item] || item;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showMessage(message, type = 'info') {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${getMessageIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getMessageColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 5000);
}

function getMessageIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function getMessageColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

function handleKeyboardShortcuts(e) {
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('exportModal');
        if (modal && modal.style.display === 'block') {
            closeExportModal();
        }
    }
    
    // Ctrl+R to refresh
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshReports();
    }
}

// Make functions globally available
window.handleDateRangeChange = handleDateRangeChange;
window.updateCustomRange = updateCustomRange;
window.applyFilters = applyFilters;
window.changeChartType = changeChartType;
window.toggleTimeView = toggleTimeView;
window.sortTable = sortTable;
window.changePage = changePage;
window.changePageSize = changePageSize;
window.filterTable = filterTable;
window.resetFilters = resetFilters;
window.refreshReports = refreshReports;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.executeExport = executeExport;
window.viewEntry = viewEntry;


