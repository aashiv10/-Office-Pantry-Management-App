// Vendor Dashboard JavaScript - Office Pantry Management System

// Global variables
let products = [];
let filteredProducts = [];
let updateLogs = [];
let currentProduct = null;
let pendingAction = null;
let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize vendor dashboard
    initializeVendorDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load sample data
    loadSampleData();
    
    // Initialize charts
    initializeCharts();
    
    // Update displays
    updateAllDisplays();
    
    console.log('Vendor Dashboard loaded successfully!');
});

// Initialize vendor dashboard
function initializeVendorDashboard() {
    // Set up initial state
    setupInitialState();
    
    // Initialize update logs
    initializeUpdateLogs();
}

// Set up event listeners
function setupEventListeners() {
    // Refresh button
    const refreshBtn = document.getElementById('refreshDataBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
    
    // Bulk update button
    const bulkUpdateBtn = document.getElementById('bulkUpdateBtn');
    if (bulkUpdateBtn) {
        bulkUpdateBtn.addEventListener('click', openBulkPricingModal);
    }
    
    // Price update form
    const priceForm = document.getElementById('priceUpdateForm');
    if (priceForm) {
        priceForm.addEventListener('submit', handlePriceUpdate);
    }
    
    // New price input
    const newPriceInput = document.getElementById('newPrice');
    if (newPriceInput) {
        newPriceInput.addEventListener('input', updatePricePreview);
    }
    
    // Bulk update method change
    const updateMethods = document.querySelectorAll('input[name="updateMethod"]');
    updateMethods.forEach(method => {
        method.addEventListener('change', handleUpdateMethodChange);
    });
    
    // Bulk update value input
    const bulkUpdateValue = document.getElementById('bulkUpdateValue');
    if (bulkUpdateValue) {
        bulkUpdateValue.addEventListener('input', updateBulkPreview);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Load sample data
function loadSampleData() {
    // Sample products data
    products = [
        {
            id: '1',
            name: 'Tea Bags',
            category: 'beverages',
            currentPrice: 2.50,
            costPrice: 1.80,
            stock: 45,
            status: 'active',
            icon: 'fa-coffee'
        },
        {
            id: '2',
            name: 'Coffee Beans',
            category: 'beverages',
            currentPrice: 4.25,
            costPrice: 3.20,
            stock: 23,
            status: 'active',
            icon: 'fa-coffee'
        },
        {
            id: '3',
            name: 'Biscuits',
            category: 'snacks',
            currentPrice: 3.75,
            costPrice: 2.50,
            stock: 67,
            status: 'active',
            icon: 'fa-cookie-bite'
        },
        {
            id: '4',
            name: 'Cookies',
            category: 'snacks',
            currentPrice: 4.50,
            costPrice: 3.00,
            stock: 12,
            status: 'low-stock',
            icon: 'fa-cookie-bite'
        },
        {
            id: '5',
            name: 'Sugar',
            category: 'other',
            currentPrice: 1.25,
            costPrice: 0.80,
            stock: 89,
            status: 'active',
            icon: 'fa-cube'
        },
        {
            id: '6',
            name: 'Milk',
            category: 'other',
            currentPrice: 2.00,
            costPrice: 1.40,
            stock: 5,
            status: 'low-stock',
            icon: 'fa-tint'
        },
        {
            id: '7',
            name: 'Instant Coffee',
            category: 'beverages',
            currentPrice: 3.00,
            costPrice: 2.20,
            stock: 34,
            status: 'active',
            icon: 'fa-coffee'
        },
        {
            id: '8',
            name: 'Chips',
            category: 'snacks',
            currentPrice: 2.75,
            costPrice: 1.90,
            stock: 0,
            status: 'inactive',
            icon: 'fa-cookie-bite'
        }
    ];
    
    filteredProducts = [...products];
}

// Initialize charts
function initializeCharts() {
    // Sales Performance Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        charts.salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [180, 220, 195, 245, 280, 210, 265],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
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
                                return 'Sales: $' + context.parsed.y;
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
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Top Products Chart
    const topProductsCtx = document.getElementById('topProductsChart');
    if (topProductsCtx) {
        charts.topProductsChart = new Chart(topProductsCtx, {
            type: 'bar',
            data: {
                labels: ['Tea Bags', 'Coffee Beans', 'Biscuits', 'Cookies', 'Sugar'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [125, 98, 87, 76, 45],
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
                                return 'Sales: $' + context.parsed.y;
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
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Update all displays
function updateAllDisplays() {
    updateProductsTable();
    updateSalesOverview();
    updateUpdateLogs();
}

// Update products table
function updateProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        const margin = ((product.currentPrice - product.costPrice) / product.currentPrice * 100).toFixed(1);
        const marginClass = margin >= 0 ? 'positive' : 'negative';
        const stockClass = product.stock === 0 ? 'critical' : product.stock < 20 ? 'low' : '';
        
        row.innerHTML = `
            <td>
                <div class="product-info">
                    <div class="product-icon">
                        <i class="fas ${product.icon}"></i>
                    </div>
                    <div class="product-details">
                        <h4>${product.name}</h4>
                        <p>${product.category}</p>
                    </div>
                </div>
            </td>
            <td>${product.category}</td>
            <td class="price-cell">$${product.currentPrice.toFixed(2)}</td>
            <td class="price-cell">$${product.costPrice.toFixed(2)}</td>
            <td class="margin-cell ${marginClass}">${margin}%</td>
            <td class="stock-cell ${stockClass}">${product.stock}</td>
            <td>
                <span class="status-badge ${product.status}">${product.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn primary" onclick="openPriceModal('${product.id}')" title="Update Price">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn" onclick="viewProductDetails('${product.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Update sales overview
function updateSalesOverview() {
    // Calculate sales metrics
    const todaySales = 245.50;
    const weekSales = 1847.25;
    const itemsSold = 127;
    const profitMargin = 23.5;
    
    // Update DOM
    document.getElementById('todaySales').textContent = `$${todaySales.toFixed(2)}`;
    document.getElementById('weekSales').textContent = `$${weekSales.toFixed(2)}`;
    document.getElementById('itemsSold').textContent = itemsSold;
    document.getElementById('profitMargin').textContent = `${profitMargin}%`;
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        const matchesSearch = searchTerm === '' || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesStatus && matchesSearch;
    });
    
    updateProductsTable();
}

// Open price update modal
function openPriceModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    // Populate modal
    document.getElementById('productIcon').className = `fas ${product.icon}`;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productCategory').textContent = product.category;
    document.getElementById('currentPrice').textContent = `$${product.currentPrice.toFixed(2)}`;
    document.getElementById('newPrice').value = product.currentPrice.toFixed(2);
    document.getElementById('oldPriceDisplay').textContent = `$${product.currentPrice.toFixed(2)}`;
    
    // Update preview
    updatePricePreview();
    
    // Show modal
    const modal = document.getElementById('priceUpdateModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close price modal
function closePriceModal() {
    const modal = document.getElementById('priceUpdateModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentProduct = null;
}

// Update price preview
function updatePricePreview() {
    if (!currentProduct) return;
    
    const newPrice = parseFloat(document.getElementById('newPrice').value) || 0;
    const oldPrice = currentProduct.currentPrice;
    const change = newPrice - oldPrice;
    const changePercent = oldPrice > 0 ? ((change / oldPrice) * 100).toFixed(1) : 0;
    
    document.getElementById('newPriceDisplay').textContent = `$${newPrice.toFixed(2)}`;
    document.getElementById('priceChangeDisplay').textContent = 
        `$${change.toFixed(2)} (${changePercent}%)`;
    
    // Update change color
    const changeElement = document.getElementById('priceChangeDisplay');
    if (change > 0) {
        changeElement.style.color = '#10b981';
    } else if (change < 0) {
        changeElement.style.color = '#ef4444';
    } else {
        changeElement.style.color = '#6b7280';
    }
}

// Handle price update
function handlePriceUpdate(e) {
    e.preventDefault();
    
    if (!currentProduct) return;
    
    const newPrice = parseFloat(document.getElementById('newPrice').value);
    const reason = document.getElementById('priceReason').value;
    const notes = document.getElementById('priceNotes').value;
    
    if (!reason) {
        showMessage('Please select a reason for the price change.', 'error');
        return;
    }
    
    // Show confirmation
    showPriceUpdateConfirmation(currentProduct, newPrice, reason, notes);
}

// Show price update confirmation
function showPriceUpdateConfirmation(product, newPrice, reason, notes) {
    const oldPrice = product.currentPrice;
    const change = newPrice - oldPrice;
    const changePercent = oldPrice > 0 ? ((change / oldPrice) * 100).toFixed(1) : 0;
    
    document.getElementById('confirmationTitle').textContent = 'Confirm Price Update';
    document.getElementById('confirmationMessage').textContent = 
        `Are you sure you want to update the price for ${product.name}?`;
    
    document.getElementById('confirmationDetails').innerHTML = `
        <div style="margin-top: 1rem;">
            <p><strong>Current Price:</strong> $${oldPrice.toFixed(2)}</p>
            <p><strong>New Price:</strong> $${newPrice.toFixed(2)}</p>
            <p><strong>Change:</strong> $${change.toFixed(2)} (${changePercent}%)</p>
            <p><strong>Reason:</strong> ${reason}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        </div>
    `;
    
    pendingAction = {
        type: 'priceUpdate',
        product: product,
        newPrice: newPrice,
        reason: reason,
        notes: notes
    };
    
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Confirm price update
function confirmPriceUpdate() {
    if (!pendingAction || pendingAction.type !== 'priceUpdate') return;
    
    const { product, newPrice, reason, notes } = pendingAction;
    const oldPrice = product.currentPrice;
    
    // Update product
    product.currentPrice = newPrice;
    
    // Add to update log
    addUpdateLog({
        type: 'price_update',
        productId: product.id,
        productName: product.name,
        oldPrice: oldPrice,
        newPrice: newPrice,
        reason: reason,
        notes: notes,
        timestamp: new Date().toISOString()
    });
    
    // Update displays
    updateProductsTable();
    updateUpdateLogs();
    
    // Close modals
    closePriceModal();
    closeConfirmationModal();
    
    // Show success message
    showMessage(`Price updated successfully for ${product.name}`, 'success');
    
    // Clear pending action
    pendingAction = null;
}

// Open bulk pricing modal
function openBulkPricingModal() {
    const modal = document.getElementById('bulkPricingModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Reset form
    document.getElementById('bulkUpdateValue').value = '';
    document.querySelector('input[name="updateMethod"][value="percentage"]').checked = true;
    document.getElementById('bulkUpdateSuffix').textContent = '%';
    
    // Clear preview
    updateBulkPreview();
}

// Close bulk pricing modal
function closeBulkPricingModal() {
    const modal = document.getElementById('bulkPricingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle update method change
function handleUpdateMethodChange() {
    const method = document.querySelector('input[name="updateMethod"]:checked').value;
    const suffix = document.getElementById('bulkUpdateSuffix');
    
    switch(method) {
        case 'percentage':
            suffix.textContent = '%';
            break;
        case 'fixed':
            suffix.textContent = '$';
            break;
        case 'set':
            suffix.textContent = '$';
            break;
    }
    
    updateBulkPreview();
}

// Update bulk preview
function updateBulkPreview() {
    const method = document.querySelector('input[name="updateMethod"]:checked').value;
    const value = parseFloat(document.getElementById('bulkUpdateValue').value) || 0;
    const previewBody = document.getElementById('bulkPreviewBody');
    
    if (!value) {
        previewBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6b7280;">Enter a value to see preview</td></tr>';
        return;
    }
    
    // Get selected products
    const selectedProducts = getSelectedProducts();
    
    previewBody.innerHTML = '';
    
    selectedProducts.forEach(product => {
        let newPrice = product.currentPrice;
        
        switch(method) {
            case 'percentage':
                newPrice = product.currentPrice * (1 + value / 100);
                break;
            case 'fixed':
                newPrice = product.currentPrice + value;
                break;
            case 'set':
                newPrice = value;
                break;
        }
        
        newPrice = Math.max(0, newPrice); // Ensure non-negative price
        
        const change = newPrice - product.currentPrice;
        const changePercent = product.currentPrice > 0 ? ((change / product.currentPrice) * 100).toFixed(1) : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.currentPrice.toFixed(2)}</td>
            <td>$${newPrice.toFixed(2)}</td>
            <td style="color: ${change >= 0 ? '#10b981' : '#ef4444'}">
                $${change.toFixed(2)} (${changePercent}%)
            </td>
        `;
        previewBody.appendChild(row);
    });
}

// Get selected products
function getSelectedProducts() {
    const selectAll = document.getElementById('selectAllProducts').checked;
    const selectBeverages = document.getElementById('selectBeverages').checked;
    const selectSnacks = document.getElementById('selectSnacks').checked;
    const selectOther = document.getElementById('selectOther').checked;
    
    if (selectAll) {
        return products.filter(p => p.status === 'active');
    }
    
    let selected = [];
    if (selectBeverages) selected = selected.concat(products.filter(p => p.category === 'beverages' && p.status === 'active'));
    if (selectSnacks) selected = selected.concat(products.filter(p => p.category === 'snacks' && p.status === 'active'));
    if (selectOther) selected = selected.concat(products.filter(p => p.category === 'other' && p.status === 'active'));
    
    return selected;
}

// Toggle all products
function toggleAllProducts() {
    const selectAll = document.getElementById('selectAllProducts').checked;
    const checkboxes = ['selectBeverages', 'selectSnacks', 'selectOther'];
    
    checkboxes.forEach(id => {
        document.getElementById(id).checked = selectAll;
    });
    
    updateBulkPreview();
}

// Confirm bulk update
function confirmBulkUpdate() {
    const method = document.querySelector('input[name="updateMethod"]:checked').value;
    const value = parseFloat(document.getElementById('bulkUpdateValue').value) || 0;
    
    if (!value) {
        showMessage('Please enter a valid value for the update.', 'error');
        return;
    }
    
    const selectedProducts = getSelectedProducts();
    
    if (selectedProducts.length === 0) {
        showMessage('Please select at least one product category.', 'error');
        return;
    }
    
    // Show confirmation
    showBulkUpdateConfirmation(selectedProducts, method, value);
}

// Show bulk update confirmation
function showBulkUpdateConfirmation(products, method, value) {
    document.getElementById('confirmationTitle').textContent = 'Confirm Bulk Price Update';
    document.getElementById('confirmationMessage').textContent = 
        `Are you sure you want to update prices for ${products.length} products?`;
    
    let details = `<div style="margin-top: 1rem;"><p><strong>Update Method:</strong> ${method}</p><p><strong>Value:</strong> ${value}</p><p><strong>Products to update:</strong></p><ul>`;
    
    products.slice(0, 5).forEach(product => {
        details += `<li>${product.name}</li>`;
    });
    
    if (products.length > 5) {
        details += `<li>... and ${products.length - 5} more</li>`;
    }
    
    details += '</ul></div>';
    
    document.getElementById('confirmationDetails').innerHTML = details;
    
    pendingAction = {
        type: 'bulkUpdate',
        products: products,
        method: method,
        value: value
    };
    
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Execute confirmed action
function executeConfirmedAction() {
    if (!pendingAction) return;
    
    if (pendingAction.type === 'priceUpdate') {
        confirmPriceUpdate();
    } else if (pendingAction.type === 'bulkUpdate') {
        executeBulkUpdate();
    }
}

// Execute bulk update
function executeBulkUpdate() {
    if (!pendingAction || pendingAction.type !== 'bulkUpdate') return;
    
    const { products, method, value } = pendingAction;
    
    products.forEach(product => {
        const oldPrice = product.currentPrice;
        let newPrice = oldPrice;
        
        switch(method) {
            case 'percentage':
                newPrice = oldPrice * (1 + value / 100);
                break;
            case 'fixed':
                newPrice = oldPrice + value;
                break;
            case 'set':
                newPrice = value;
                break;
        }
        
        newPrice = Math.max(0, newPrice);
        
        // Update product
        product.currentPrice = newPrice;
        
        // Add to update log
        addUpdateLog({
            type: 'bulk_price_update',
            productId: product.id,
            productName: product.name,
            oldPrice: oldPrice,
            newPrice: newPrice,
            method: method,
            value: value,
            timestamp: new Date().toISOString()
        });
    });
    
    // Update displays
    updateProductsTable();
    updateUpdateLogs();
    
    // Close modals
    closeBulkPricingModal();
    closeConfirmationModal();
    
    // Show success message
    showMessage(`Successfully updated prices for ${products.length} products`, 'success');
    
    // Clear pending action
    pendingAction = null;
}

// Close confirmation modal
function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    pendingAction = null;
}

// Initialize update logs
function initializeUpdateLogs() {
    // Sample update logs
    updateLogs = [
        {
            id: '1',
            type: 'price_update',
            productId: '1',
            productName: 'Tea Bags',
            oldPrice: 2.25,
            newPrice: 2.50,
            reason: 'cost-increase',
            notes: 'Supplier cost increased by 8%',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '2',
            type: 'price_update',
            productId: '3',
            productName: 'Biscuits',
            oldPrice: 3.50,
            newPrice: 3.75,
            reason: 'market-adjustment',
            notes: 'Market price adjustment',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
            id: '3',
            type: 'bulk_price_update',
            productId: '2',
            productName: 'Coffee Beans',
            oldPrice: 4.00,
            newPrice: 4.25,
            reason: 'bulk_update',
            method: 'percentage',
            value: 6.25,
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
    ];
}

// Add update log
function addUpdateLog(logEntry) {
    logEntry.id = Date.now().toString();
    updateLogs.unshift(logEntry);
}

// Update update logs display
function updateUpdateLogs() {
    const updatesList = document.getElementById('updatesList');
    if (!updatesList) return;
    
    updatesList.innerHTML = '';
    
    updateLogs.slice(0, 10).forEach(log => {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        
        const change = log.newPrice - log.oldPrice;
        const changePercent = log.oldPrice > 0 ? ((change / log.oldPrice) * 100).toFixed(1) : 0;
        
        updateItem.innerHTML = `
            <div class="update-icon">
                <i class="fas fa-edit"></i>
            </div>
            <div class="update-content">
                <h4>${log.productName} Price Updated</h4>
                <div class="update-details">
                    <span>$${log.oldPrice.toFixed(2)} → $${log.newPrice.toFixed(2)}</span>
                    <span>(${change >= 0 ? '+' : ''}${changePercent}%)</span>
                    <span>• ${getReasonText(log.reason)}</span>
                </div>
            </div>
            <div class="update-time">
                ${formatTimeAgo(log.timestamp)}
            </div>
        `;
        
        updatesList.appendChild(updateItem);
    });
}

// Get reason text
function getReasonText(reason) {
    const reasons = {
        'cost-increase': 'Cost Increase',
        'market-adjustment': 'Market Adjustment',
        'promotion': 'Promotion',
        'competitor-analysis': 'Competitor Analysis',
        'bulk_update': 'Bulk Update',
        'other': 'Other'
    };
    return reasons[reason] || reason;
}

// Format time ago
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
}

// Update sales chart
function updateSalesChart() {
    const period = document.getElementById('salesPeriod').value;
    // In a real app, this would fetch data based on the period
    console.log('Updating sales chart for period:', period);
}

// Toggle top products view
function toggleTopProductsView() {
    // Toggle between different chart types
    console.log('Toggle top products view');
}

// View product details
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showMessage(`Viewing details for ${product.name}`, 'info');
    }
}

// Export pricing
function exportPricing() {
    showMessage('Exporting pricing data...', 'info');
    // In a real app, this would generate and download the file
}

// Clear update log
function clearUpdateLog() {
    if (confirm('Are you sure you want to clear the update log?')) {
        updateLogs = [];
        updateUpdateLogs();
        showMessage('Update log cleared', 'success');
    }
}

// Export update log
function exportUpdateLog() {
    showMessage('Exporting update log...', 'info');
    // In a real app, this would generate and download the file
}

// Refresh data
function refreshData() {
    const refreshBtn = document.getElementById('refreshDataBtn');
    if (refreshBtn) {
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
    }
    
    // Simulate refresh
    setTimeout(() => {
        loadSampleData();
        updateAllDisplays();
        
        if (refreshBtn) {
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            refreshBtn.disabled = false;
        }
        
        showMessage('Data refreshed successfully!', 'success');
    }, 1500);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Escape to close modals
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Ctrl+R to refresh
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        refreshData();
    }
}

// Show message
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

// Get message color
function getMessageColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Make functions globally available
window.filterProducts = filterProducts;
window.openPriceModal = openPriceModal;
window.closePriceModal = closePriceModal;
window.updatePricePreview = updatePricePreview;
window.confirmPriceUpdate = confirmPriceUpdate;
window.openBulkPricingModal = openBulkPricingModal;
window.closeBulkPricingModal = closeBulkPricingModal;
window.handleUpdateMethodChange = handleUpdateMethodChange;
window.updateBulkPreview = updateBulkPreview;
window.toggleAllProducts = toggleAllProducts;
window.confirmBulkUpdate = confirmBulkUpdate;
window.executeConfirmedAction = executeConfirmedAction;
window.closeConfirmationModal = closeConfirmationModal;
window.updateSalesChart = updateSalesChart;
window.toggleTopProductsView = toggleTopProductsView;
window.viewProductDetails = viewProductDetails;
window.exportPricing = exportPricing;
window.clearUpdateLog = clearUpdateLog;
window.exportUpdateLog = exportUpdateLog;
window.refreshData = refreshData;


