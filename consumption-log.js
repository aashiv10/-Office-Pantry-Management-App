// Consumption Log JavaScript - Office Pantry Management System

// Global variables
let consumptionEntries = [];
let currentEntryMode = 'daily';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the consumption log
    initializeConsumptionLog();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial data
    loadInitialData();
    
    console.log('Consumption Log loaded successfully!');
});

// Initialize consumption log
function initializeConsumptionLog() {
    // Set default date to today
    setToday();
    
    // Set default time to current time
    setCurrentTime();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Load sample data
    loadSampleEntries();
}

// Set up event listeners
function setupEventListeners() {
    // Form submission
    const form = document.getElementById('consumptionForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
    
    // Entry mode toggle
    const modeInputs = document.querySelectorAll('input[name="entryMode"]');
    modeInputs.forEach(input => {
        input.addEventListener('change', handleModeChange);
    });
    
    // Form validation on input
    const inputs = document.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Quantity input validation
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', validateQuantity);
        quantityInput.addEventListener('keydown', handleQuantityKeydown);
    }
    
    // Item selection change
    const itemSelect = document.getElementById('itemSelect');
    if (itemSelect) {
        itemSelect.addEventListener('change', handleItemSelection);
    }
    
    // Entries filter
    const entriesFilter = document.getElementById('entriesFilter');
    if (entriesFilter) {
        entriesFilter.addEventListener('change', filterEntries);
    }
    
    // Bulk entry modal
    const bulkEntryBtn = document.getElementById('bulkEntryBtn');
    if (bulkEntryBtn) {
        bulkEntryBtn.addEventListener('click', openBulkModal);
    }
    
    // View history button
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', viewHistory);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle form submission
function handleFormSubmission(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showMessage('Please fix the errors before submitting.', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const entry = {
        id: generateId(),
        item: formData.get('item'),
        quantity: parseInt(formData.get('quantity')),
        date: formData.get('consumptionDate'),
        time: formData.get('time') || getCurrentTimeString(),
        consumedBy: formData.get('consumedBy') || 'Unknown',
        notes: formData.get('notes') || '',
        mode: currentEntryMode,
        timestamp: new Date().toISOString()
    };
    
    // Add to entries
    consumptionEntries.unshift(entry);
    
    // Update display
    updateEntriesDisplay();
    updateQuickStats();
    
    // Show success message
    showMessage(`Successfully logged ${entry.quantity} ${getItemDisplayName(entry.item)}`, 'success');
    
    // Clear form
    clearForm();
    
    // Log to console (in real app, this would be sent to server)
    console.log('New consumption entry:', entry);
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Validate required fields
    const requiredFields = ['itemSelect', 'quantity', 'consumptionDate'];
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showFieldError(fieldId, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate quantity
    const quantity = document.getElementById('quantity').value;
    if (quantity && (isNaN(quantity) || quantity < 1 || quantity > 999)) {
        showFieldError('quantity', 'Quantity must be between 1 and 999');
        isValid = false;
    }
    
    // Validate date
    const date = document.getElementById('consumptionDate').value;
    if (date) {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        if (selectedDate > today) {
            showFieldError('consumptionDate', 'Date cannot be in the future');
            isValid = false;
        }
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const fieldId = field.id;
    
    // Clear previous errors
    clearFieldError(e);
    
    // Validate based on field type
    switch(fieldId) {
        case 'quantity':
            validateQuantity();
            break;
        case 'consumptionDate':
            validateDate(field);
            break;
        case 'itemSelect':
            if (!field.value) {
                showFieldError(fieldId, 'Please select an item');
            }
            break;
    }
}

// Validate quantity
function validateQuantity() {
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput.value;
    
    if (!quantity) {
        showFieldError('quantity', 'Quantity is required');
        return false;
    }
    
    if (isNaN(quantity) || quantity < 1) {
        showFieldError('quantity', 'Quantity must be at least 1');
        return false;
    }
    
    if (quantity > 999) {
        showFieldError('quantity', 'Quantity cannot exceed 999');
        return false;
    }
    
    return true;
}

// Validate date
function validateDate(dateField) {
    const date = dateField.value;
    
    if (!date) {
        showFieldError('consumptionDate', 'Date is required');
        return false;
    }
    
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
        showFieldError('consumptionDate', 'Date cannot be in the future');
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    const fieldId = field.id;
    const errorElement = document.getElementById(fieldId + 'Error');
    
    field.classList.remove('error');
    
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Initialize form validation
function initializeFormValidation() {
    // Add real-time validation
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('input', function() {
            const value = this.value;
            if (value && (isNaN(value) || value < 1 || value > 999)) {
                this.setCustomValidity('Quantity must be between 1 and 999');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Handle mode change
function handleModeChange(e) {
    currentEntryMode = e.target.value;
    
    // Update form behavior based on mode
    if (currentEntryMode === 'daily') {
        // Daily mode - allow multiple entries per day
        console.log('Switched to daily mode');
    } else {
        // Per-visit mode - track individual visits
        console.log('Switched to per-visit mode');
    }
}

// Handle item selection
function handleItemSelection(e) {
    const selectedItem = e.target.value;
    
    // Update quantity placeholder based on item
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const placeholders = {
            'tea-bags': 'Enter number of tea bags',
            'coffee-beans': 'Enter grams of coffee beans',
            'biscuits': 'Enter number of biscuits',
            'cookies': 'Enter number of cookies'
        };
        
        quantityInput.placeholder = placeholders[selectedItem] || 'Enter quantity';
    }
}

// Handle quantity keydown
function handleQuantityKeydown(e) {
    // Allow: backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}

// Adjust quantity
function adjustQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    let currentValue = parseInt(quantityInput.value) || 0;
    let newValue = currentValue + delta;
    
    // Ensure value is within bounds
    newValue = Math.max(1, Math.min(999, newValue));
    
    quantityInput.value = newValue;
    
    // Trigger validation
    validateQuantity();
}

// Set today's date
function setToday() {
    const dateInput = document.getElementById('consumptionDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}

// Set current time
function setCurrentTime() {
    const timeInput = document.getElementById('time');
    if (timeInput) {
        const now = new Date();
        const timeString = now.toTimeString().slice(0, 5);
        timeInput.value = timeString;
    }
}

// Get current time string
function getCurrentTimeString() {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
}

// Clear form
function clearForm() {
    const form = document.getElementById('consumptionForm');
    if (form) {
        form.reset();
        setToday();
        setCurrentTime();
        
        // Clear all error states
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.classList.remove('show');
        });
        
        const errorFields = document.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }
}

// Load initial data
function loadInitialData() {
    // Load sample entries
    loadSampleEntries();
    
    // Update quick stats
    updateQuickStats();
}

// Load sample entries
function loadSampleEntries() {
    const sampleEntries = [
        {
            id: '1',
            item: 'tea-bags',
            quantity: 3,
            date: new Date().toISOString().split('T')[0],
            time: '09:30',
            consumedBy: 'John Doe',
            notes: 'Morning tea break',
            mode: 'daily',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '2',
            item: 'coffee-beans',
            quantity: 2,
            date: new Date().toISOString().split('T')[0],
            time: '10:15',
            consumedBy: 'Jane Smith',
            notes: '',
            mode: 'daily',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '3',
            item: 'biscuits',
            quantity: 5,
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            time: '14:20',
            consumedBy: 'Mike Johnson',
            notes: 'Afternoon snack',
            mode: 'daily',
            timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    consumptionEntries = sampleEntries;
    updateEntriesDisplay();
}

// Update entries display
function updateEntriesDisplay() {
    const entriesList = document.getElementById('entriesList');
    if (!entriesList) return;
    
    // Get filter value
    const filter = document.getElementById('entriesFilter').value;
    
    // Filter entries
    let filteredEntries = consumptionEntries;
    if (filter !== 'all') {
        filteredEntries = consumptionEntries.filter(entry => entry.item === filter);
    }
    
    // Clear existing entries
    entriesList.innerHTML = '';
    
    // Add entries
    filteredEntries.forEach(entry => {
        const entryElement = createEntryElement(entry);
        entriesList.appendChild(entryElement);
    });
    
    // Show empty state if no entries
    if (filteredEntries.length === 0) {
        entriesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <p>No entries found</p>
            </div>
        `;
    }
}

// Create entry element
function createEntryElement(entry) {
    const entryDiv = document.createElement('div');
    entryDiv.className = 'entry-item';
    entryDiv.innerHTML = `
        <div class="entry-icon">
            <i class="fas ${getItemIcon(entry.item)}"></i>
        </div>
        <div class="entry-content">
            <h4>${getItemDisplayName(entry.item)}</h4>
            <div class="entry-details">
                <span><i class="fas fa-hashtag"></i> ${entry.quantity}</span>
                <span><i class="fas fa-user"></i> ${entry.consumedBy}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(entry.date)}</span>
                <span><i class="fas fa-clock"></i> ${entry.time}</span>
            </div>
            ${entry.notes ? `<p class="entry-notes">${entry.notes}</p>` : ''}
        </div>
        <div class="entry-actions">
            <button class="entry-action" onclick="editEntry('${entry.id}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="entry-action delete" onclick="deleteEntry('${entry.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return entryDiv;
}

// Get item icon
function getItemIcon(item) {
    const icons = {
        'tea-bags': 'fa-coffee',
        'coffee-beans': 'fa-coffee',
        'instant-coffee': 'fa-coffee',
        'hot-chocolate': 'fa-coffee',
        'biscuits': 'fa-cookie-bite',
        'cookies': 'fa-cookie-bite',
        'chips': 'fa-cookie-bite',
        'nuts': 'fa-cookie-bite',
        'sugar': 'fa-cube',
        'milk': 'fa-tint',
        'cream': 'fa-tint',
        'sweetener': 'fa-cube'
    };
    return icons[item] || 'fa-box';
}

// Get item display name
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Filter entries
function filterEntries() {
    updateEntriesDisplay();
}

// Refresh entries
function refreshEntries() {
    // In a real app, this would fetch from server
    updateEntriesDisplay();
    showMessage('Entries refreshed', 'info');
}

// Update quick stats
function updateQuickStats() {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Today's consumption
    const todayEntries = consumptionEntries.filter(entry => entry.date === today);
    const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.quantity, 0);
    document.getElementById('todayConsumption').textContent = todayTotal;
    
    // This week's consumption
    const weekEntries = consumptionEntries.filter(entry => entry.date >= weekAgo);
    const weekTotal = weekEntries.reduce((sum, entry) => sum + entry.quantity, 0);
    document.getElementById('weekConsumption').textContent = weekTotal;
    
    // Most popular item this week
    const itemCounts = {};
    weekEntries.forEach(entry => {
        itemCounts[entry.item] = (itemCounts[entry.item] || 0) + entry.quantity;
    });
    
    const mostPopular = Object.keys(itemCounts).reduce((a, b) => 
        itemCounts[a] > itemCounts[b] ? a : b, '');
    document.getElementById('mostPopular').textContent = 
        mostPopular ? getItemDisplayName(mostPopular) : '-';
    
    // Active users this week
    const activeUsers = new Set(weekEntries.map(entry => entry.consumedBy));
    document.getElementById('activeUsers').textContent = activeUsers.size;
}

// Edit entry
function editEntry(entryId) {
    const entry = consumptionEntries.find(e => e.id === entryId);
    if (!entry) return;
    
    // Populate form with entry data
    document.getElementById('itemSelect').value = entry.item;
    document.getElementById('quantity').value = entry.quantity;
    document.getElementById('consumptionDate').value = entry.date;
    document.getElementById('time').value = entry.time;
    document.getElementById('consumedBy').value = entry.consumedBy;
    document.getElementById('notes').value = entry.notes;
    
    // Remove from entries list
    consumptionEntries = consumptionEntries.filter(e => e.id !== entryId);
    updateEntriesDisplay();
    updateQuickStats();
    
    showMessage('Entry loaded for editing', 'info');
}

// Delete entry
function deleteEntry(entryId) {
    if (confirm('Are you sure you want to delete this entry?')) {
        consumptionEntries = consumptionEntries.filter(e => e.id !== entryId);
        updateEntriesDisplay();
        updateQuickStats();
        showMessage('Entry deleted successfully', 'success');
    }
}

// View history
function viewHistory() {
    showMessage('History view would open here', 'info');
    // In a real app, this would navigate to a history page
}

// Open bulk entry modal
function openBulkModal() {
    const modal = document.getElementById('bulkEntryModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close bulk entry modal
function closeBulkModal() {
    const modal = document.getElementById('bulkEntryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Add bulk row
function addBulkRow() {
    const bulkForm = document.querySelector('.bulk-form');
    const newRow = document.createElement('div');
    newRow.className = 'bulk-row';
    newRow.innerHTML = `
        <select class="bulk-select">
            <option value="">Select Item</option>
            <option value="tea-bags">Tea Bags</option>
            <option value="coffee-beans">Coffee Beans</option>
            <option value="biscuits">Biscuits</option>
            <option value="cookies">Cookies</option>
        </select>
        <input type="number" class="bulk-input" placeholder="Qty" min="1">
        <button class="btn btn-sm btn-danger" onclick="removeBulkRow(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    bulkForm.appendChild(newRow);
}

// Remove bulk row
function removeBulkRow(button) {
    button.closest('.bulk-row').remove();
}

// Submit bulk entry
function submitBulkEntry() {
    const bulkRows = document.querySelectorAll('.bulk-row');
    const entries = [];
    
    bulkRows.forEach(row => {
        const select = row.querySelector('.bulk-select');
        const input = row.querySelector('.bulk-input');
        
        if (select.value && input.value) {
            entries.push({
                id: generateId(),
                item: select.value,
                quantity: parseInt(input.value),
                date: new Date().toISOString().split('T')[0],
                time: getCurrentTimeString(),
                consumedBy: 'Bulk Entry',
                notes: 'Bulk entry',
                mode: currentEntryMode,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    if (entries.length === 0) {
        showMessage('Please add at least one entry', 'error');
        return;
    }
    
    // Add entries
    consumptionEntries.unshift(...entries);
    updateEntriesDisplay();
    updateQuickStats();
    
    showMessage(`Successfully added ${entries.length} entries`, 'success');
    closeBulkModal();
    
    // Clear bulk form
    const bulkForm = document.querySelector('.bulk-form');
    bulkForm.innerHTML = `
        <div class="bulk-row">
            <select class="bulk-select">
                <option value="">Select Item</option>
                <option value="tea-bags">Tea Bags</option>
                <option value="coffee-beans">Coffee Beans</option>
                <option value="biscuits">Biscuits</option>
            </select>
            <input type="number" class="bulk-input" placeholder="Qty" min="1">
            <button class="btn btn-sm btn-danger" onclick="removeBulkRow(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl+Enter to submit form
    if (e.ctrlKey && e.key === 'Enter') {
        const form = document.getElementById('consumptionForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('bulkEntryModal');
        if (modal && modal.style.display === 'block') {
            closeBulkModal();
        }
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show message
function showMessage(message, type = 'info') {
    const container = document.getElementById('messageContainer');
    if (!container) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `
        <i class="fas ${getMessageIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(messageDiv);
    
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

// Get message icon
function getMessageIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Make functions globally available
window.adjustQuantity = adjustQuantity;
window.setToday = setToday;
window.setCurrentTime = setCurrentTime;
window.clearForm = clearForm;
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;
window.viewHistory = viewHistory;
window.openBulkModal = openBulkModal;
window.closeBulkModal = closeBulkModal;
window.addBulkRow = addBulkRow;
window.removeBulkRow = removeBulkRow;
window.submitBulkEntry = submitBulkEntry;


