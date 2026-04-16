// ================================================================
// FoodFlow POS System - Main JavaScript
// ================================================================

// State Management
const state = {
    currentUser: null,
    cart: [],
    selectedPaymentMethod: 'cash',
    menuItems: [],
    inventory: [],
    orders: [],
    sales: [],
    users: [],
    settings: {
        businessName: 'FoodFlow',
        taxRate: 12,
        currency: '₱'
    }
};

// Initialize default menu items
function initializeDefaultData() {
    state.menuItems = [
        // ================= PARES =================
        { id: 1, name: 'Classic Beef Pares', category: 'pares', price: 80, image: 'Menu/Classic beef pares.png', stock: 50, minLevel: 10 },
        { id: 2, name: 'Beef Pares Overload', category: 'pares', price: 120, image: 'Menu/Beef pares Overload.png', stock: 35, minLevel: 10 },
        { id: 3, name: 'Beef Pares Solo', category: 'pares', price: 65, image: 'Menu/Beef Pares solo.png', stock: 40, minLevel: 10 },

        // ================= LUGAW =================
        { id: 4, name: 'Plain Lugaw', category: 'lugaw', price: 30, image: 'Menu/Plain Lugaw.png', stock: 80, minLevel: 15 },
        { id: 5, name: 'Chicken Lugaw', category: 'lugaw', price: 45, image: 'Menu/Chicken Lugaw.png', stock: 70, minLevel: 15 },
        { id: 6, name: 'Beef Lugaw', category: 'lugaw', price: 55, image: 'Menu/Beef Lugaw.png', stock: 60, minLevel: 10 },
        { id: 7, name: 'Special Lugaw', category: 'lugaw', price: 70, image: 'Menu/special Lugaw.png', stock: 50, minLevel: 10 },

        // ================= MAMI =================
        { id: 8, name: 'Beef Pares Mami', category: 'mami', price: 90, image: 'Menu/beef pares mami.png', stock: 40, minLevel: 10 },
        { id: 9, name: 'Special Pares Mami', category: 'mami', price: 110, image: 'Menu/Special Pares Mami.png', stock: 30, minLevel: 8 },

        // ================= RICE MEALS =================
        { id: 10, name: 'Garlic Rice', category: 'rice-meals', price: 20, image: 'Menu/garlic rice.png', stock: 100, minLevel: 20 },
        { id: 11, name: 'Plain Rice', category: 'rice-meals', price: 15, image: 'Menu/plain rice.png', stock: 120, minLevel: 25 },

        // ================= ADD-ONS =================
        { id: 12, name: 'Egg (Fried/Boiled)', category: 'add-ons', price: 15, image: 'Menu/egg.png', stock: 80, minLevel: 20 },
        { id: 13, name: 'Extra Beef', category: 'add-ons', price: 40, image: 'Menu/extra beef.png', stock: 60, minLevel: 15 },
        { id: 14, name: 'Chicharon', category: 'add-ons', price: 15, image: 'Menu/chicharon.png', stock: 70, minLevel: 15 },

        // ================= DRINKS =================
        { id: 15, name: 'Softdrinks', category: 'drinks', price: 25, image: 'Menu/softdrinks.png', stock: 100, minLevel: 20 },
        { id: 16, name: 'Iced Tea', category: 'drinks', price: 20, image: 'Menu/icetea.png', stock: 90, minLevel: 20 },
        { id: 17, name: 'Bottled Water', category: 'drinks', price: 15, image: 'Menu/bottled water.png', stock: 120, minLevel: 25 }
    ];

    state.users = [
        { username: 'user', password: 'pass', role: 'cashier', status: 'active' },
        { username: 'admin', password: 'pass', role: 'admin', status: 'active' },
        { username: 'manager', password: 'pass', role: 'admin', status: 'active' },
        { username: 'staff1', password: 'pass', role: 'cashier', status: 'active' },
        { username: 'staff2', password: 'pass', role: 'cashier', status: 'inactive' }
    ];

    // Add dummy sales data for the last 7 days
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate 3-8 orders per day
        const orderCount = Math.floor(Math.random() * 6) + 3;
        
        for (let j = 0; j < orderCount; j++) {
            const items = [];
            const itemCount = Math.floor(Math.random() * 4) + 1;
            
            for (let k = 0; k < itemCount; k++) {
                const menuItem = state.menuItems[Math.floor(Math.random() * state.menuItems.length)];
                const quantity = Math.floor(Math.random() * 3) + 1;
                items.push({
                    ...menuItem,
                    quantity
                });
            }
            
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * (state.settings.taxRate / 100);
            const total = subtotal + tax;
            
            state.sales.push({
                id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                items,
                subtotal,
                tax,
                total,
                paymentMethod: Math.random() > 0.5 ? 'cash' : 'card',
                timestamp: date,
                status: 'completed'
            });
        }
    }

    localStorage.setItem('foodflowData', JSON.stringify(state));
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('foodflowData');
    if (savedData) {
        const data = JSON.parse(savedData);
        state.menuItems = data.menuItems || state.menuItems;
        state.inventory = data.inventory || [];
        state.orders = data.orders || [];
        state.sales = data.sales || [];
        state.users = data.users || state.users;
        state.settings = data.settings || state.settings;
    } else {
        initializeDefaultData();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('foodflowData', JSON.stringify(state));
}

// ================================================================
// Login System
// ================================================================
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('loginRole').value;

    const user = state.users.find(u => u.username === username && u.password === password && u.role === role);

    if (user) {
        state.currentUser = { username, role };
        loginSuccess();
    } else {
        alert('Invalid credentials!');
    }
});

function loginSuccess() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('mainDashboard').classList.remove('hidden');
    document.getElementById('userRoleBadge').textContent = state.currentUser.role.toUpperCase();
    
    // Restrict menu items based on role
    restrictMenuItemsByRole();
    
    updateMenuItemsDisplay();
    updateInventoryDisplay();
    updateSalesMetrics();
    updateAdminOverview();
    filterMenuItems('all');
    updateClock();
    setInterval(updateClock, 1000);
}

function restrictMenuItemsByRole() {
    const cashierOnly = ['inventory-view', 'dashboard-view', 'admin-view'];
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const allowedRoles = item.dataset.role.split(',');
        
        if (state.currentUser.role === 'cashier') {
            // Cashier can only access POS
            if (item.dataset.view === 'pos-view') {
                item.style.display = 'block';
                item.disabled = false;
            } else {
                item.style.display = 'none';
                item.disabled = true;
            }
        } else if (state.currentUser.role === 'admin') {
            // Admin can access all
            item.style.display = 'block';
            item.disabled = false;
        }
    });
    
    // Show only POS view for Cashier, hide admin-only content
    if (state.currentUser.role === 'cashier') {
        document.getElementById('pos-view').classList.add('active');
    }
}

function logout() {
    state.currentUser = null;
    state.cart = [];
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('mainDashboard').classList.add('hidden');
    document.getElementById('loginForm').reset();
}

document.getElementById('logoutBtn').addEventListener('click', logout);

// ================================================================
// Clock
// ================================================================
function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ================================================================
// Menu Management
// ================================================================
function updateMenuItemsDisplay() {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    state.menuItems.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'menu-item-card';
        itemEl.innerHTML = `
            <div class="menu-item-icon"><img src="${item.image}" alt="${item.name}" class="menu-item-image"></div>
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">${state.settings.currency}${item.price}</div>
        `;
        itemEl.onclick = () => addToCart(item);
        menuGrid.appendChild(itemEl);
    });
}

function filterMenuItems(category) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = '';

    const filtered = category === 'all' ? state.menuItems : state.menuItems.filter(item => item.category === category);

    filtered.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'menu-item-card';
        itemEl.innerHTML = `
            <div class="menu-item-icon"><img src="${item.image}" alt="${item.name}" class="menu-item-image"></div>
            <div class="menu-item-name">${item.name}</div>
            <div class="menu-item-price">${state.settings.currency}${item.price}</div>
        `;
        itemEl.onclick = () => addToCart(item);
        menuGrid.appendChild(itemEl);
    });
}

document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filterMenuItems(e.target.dataset.category);
    });
});

// ================================================================
// Cart Management
// ================================================================
function addToCart(item) {
    if (item.stock <= 0) {
        alert('Out of stock!');
        return;
    }

    const existingItem = state.cart.find(ci => ci.id === item.id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        state.cart.push({ ...item, quantity: 1, specialInstructions: '' });
    }

    updateCartDisplay();
    updateCartTotal();
}

function removeFromCart(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
    updateCartDisplay();
    updateCartTotal();
}

function increaseQuantity(itemId) {
    const item = state.cart.find(item => item.id === itemId);
    if (item) {
        if (item.quantity < item.stock) {
            item.quantity++;
            updateCartDisplay();
            updateCartTotal();
        } else {
            alert('Not enough stock available!');
        }
    }
}

function decreaseQuantity(itemId) {
    const item = state.cart.find(item => item.id === itemId);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
            updateCartDisplay();
            updateCartTotal();
        } else {
            removeFromCart(itemId);
        }
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">No items added</p>';
        return;
    }

    cartItems.innerHTML = state.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name"><img src="${item.image}" alt="${item.name}" class="cart-item-image"> ${item.name}</div>
                <div class="cart-item-controls">
                    <button class="btn-quantity" onclick="decreaseQuantity(${item.id})">−</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="btn-quantity" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <div class="cart-item-price">${state.settings.currency}${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="btn btn-small btn-remove">Remove</button>
        </div>
    `).join('');
}

function updateCartTotal() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * (state.settings.taxRate / 100);
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `${state.settings.currency}${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `${state.settings.currency}${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `${state.settings.currency}${total.toFixed(2)}`;
}

document.getElementById('clearCartBtn').addEventListener('click', () => {
    if (confirm('Clear entire cart?')) {
        state.cart = [];
        updateCartDisplay();
        updateCartTotal();
    }
});

// ================================================================
// Payment Method
// ================================================================
let currentPaymentMethod = 'cash';

document.querySelectorAll('.payment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentPaymentMethod = e.target.dataset.method;
        state.selectedPaymentMethod = currentPaymentMethod;
        
        // Show/hide cash payment section
        const cashSection = document.getElementById('cashPaymentSection');
        if (cashSection) {
            cashSection.style.display = currentPaymentMethod === 'cash' ? 'block' : 'none';
            if (currentPaymentMethod === 'cash') {
                updateChangeAmount();
            }
        }
    });
});

// Handle received amount input for change calculation
const receivedAmountInput = document.getElementById('receivedAmount');
if (receivedAmountInput) {
    receivedAmountInput.addEventListener('input', updateChangeAmount);
}

function updateChangeAmount() {
    const totalText = document.getElementById('total').textContent;
    const total = parseFloat(totalText.replace(/[₱,]/g, '')) || 0;
    const received = parseFloat(document.getElementById('receivedAmount').value) || 0;
    const change = received - total;
    
    const changeElement = document.getElementById('changeAmount');
    if (changeElement) {
        if (change < 0) {
            changeElement.textContent = `₱0.00 (Need ₱${Math.abs(change).toFixed(2)})`;
            changeElement.style.color = '#ff4444';
        } else {
            changeElement.textContent = `₱${change.toFixed(2)}`;
            changeElement.style.color = '#00ffff';
        }
    }
}

function showGcashModal() {
    const totalText = document.getElementById('total').textContent;
    const total = totalText.replace(/[₱,]/g, '');
    document.getElementById('gcashAmount').textContent = `₱${total}`;
    document.getElementById('gcashModal').classList.remove('hidden');
}

function closeGcashModal() {
    document.getElementById('gcashModal').classList.add('hidden');
}

function confirmGcashPayment() {
    closeGcashModal();
    processCheckout('gcash');
}

// ================================================================  
// Checkout
// ================================================================
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (state.cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    // For GCash, show QR modal first
    if (currentPaymentMethod === 'gcash') {
        showGcashModal();
        return;
    }

    processCheckout(currentPaymentMethod);
});

function processCheckout(paymentMethod) {
    // For cash, validate received amount
    if (paymentMethod === 'cash') {
        const totalText = document.getElementById('total').textContent;
        const total = parseFloat(totalText.replace(/[₱,]/g, '')) || 0;
        const received = parseFloat(document.getElementById('receivedAmount').value) || 0;
        
        if (received < total) {
            alert('Insufficient amount received! Please enter an amount equal to or greater than the total.');
            return;
        }
    }

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * (state.settings.taxRate / 100);
    const total = subtotal + tax;

    const order = {
        id: 'ORD-' + Date.now(),
        items: [...state.cart],
        subtotal,
        tax,
        total,
        paymentMethod: paymentMethod,
        timestamp: new Date(),
        status: 'completed'
    };

    // Deduct from inventory
    state.cart.forEach(item => {
        const menuItem = state.menuItems.find(m => m.id === item.id);
        if (menuItem) {
            menuItem.stock -= item.quantity;
        }
    });

    // Add to orders and sales
    state.orders.push(order);
    state.sales.push(order);

    saveData();
    generateReceipt(order);
    
    state.cart = [];
    updateCartDisplay();
    updateCartTotal();
    updateMenuItemsDisplay();
    updateSalesMetrics();
    
    // Reset received amount
    const receivedAmountInput = document.getElementById('receivedAmount');
    if (receivedAmountInput) {
        receivedAmountInput.value = '';
    }
    updateChangeAmount();
}

function generateReceipt(order) {
    let receiptContent = `
╔════════════════════════════════╗
║       ${state.settings.businessName.padEnd(29)}║
║        ORDER RECEIPT            ║
╚════════════════════════════════╝

Order ID: ${order.id}
Date: ${order.timestamp.toLocaleString()}
Payment: ${order.paymentMethod.toUpperCase()}

────────────────────────────────
ITEMS:
────────────────────────────────
${order.items.map(item => `${item.name.padEnd(20)} ${item.quantity}x ${state.settings.currency}${item.price}`).join('\n')}

────────────────────────────────
Subtotal: ${state.settings.currency}${order.subtotal.toFixed(2)}
Tax (${state.settings.taxRate}%): ${state.settings.currency}${order.tax.toFixed(2)}
────────────────────────────────
TOTAL: ${state.settings.currency}${order.total.toFixed(2)}
════════════════════════════════
`;

    // Add payment details for cash payments
    if (order.paymentMethod === 'cash') {
        const receivedAmountInput = document.getElementById('receivedAmount');
        const receivedAmount = receivedAmountInput ? parseFloat(receivedAmountInput.value) || 0 : 0;
        const change = receivedAmount - order.total;
        
        receiptContent += `
PAID THROUGH: CASH
AMOUNT RECEIVED: ${state.settings.currency}${receivedAmount.toFixed(2)}
CHANGE: ${state.settings.currency}${Math.max(0, change).toFixed(2)}
════════════════════════════════
`;
    }

    receiptContent += `
Thank you for your order!
    `;

    document.getElementById('receiptContent').textContent = receiptContent;
    document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.add('hidden');
}

function printReceipt() {
    window.print();
}



// ================================================================
// Inventory Management
// ================================================================
function updateInventoryDisplay() {
    const inventoryBody = document.getElementById('inventoryBody');
    
    inventoryBody.innerHTML = state.menuItems.map(item => {
        let statusClass = 'status-ok';
        let statusText = 'In Stock';

        if (item.stock === 0) {
            statusClass = 'status-critical';
            statusText = 'Out of Stock';
        } else if (item.stock <= item.minLevel) {
            statusClass = 'status-low';
            statusText = 'Low Stock';
        }

        return `
            <tr>
                <td><img src="${item.image}" alt="${item.name}" class="inventory-item-image"> ${item.name}</td>
                <td>${item.category}</td>
                <td>${item.stock}</td>
                <td>${item.minLevel}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td><button class="btn btn-small" onclick="editInventory(${item.id})">Edit</button></td>
            </tr>
        `;
    }).join('');
}

function showRestockModal() {
    // Cashier can restock, but only in inventory view
    if (state.currentUser.role === 'cashier' || state.currentUser.role === 'admin') {
        document.getElementById('restockModal').classList.remove('hidden');
        const select = document.getElementById('restockItem');
        select.innerHTML = '<option value="">Select Item</option>' + 
            state.menuItems.map(item => `<option value="${item.id}">${item.name}</option>`).join('');
    } else {
        alert('Access denied');
    }
}

function closeRestockModal() {
    document.getElementById('restockModal').classList.add('hidden');
}

function saveRestock() {
    const itemId = parseInt(document.getElementById('restockItem').value);
    const qty = parseInt(document.getElementById('restockQty').value);

    if (!itemId || !qty) {
        alert('Please select an item and quantity');
        return;
    }

    const item = state.menuItems.find(m => m.id === itemId);
    if (item) {
        item.stock += qty;
        saveData();
        updateInventoryDisplay();
        closeRestockModal();
        document.getElementById('restockQty').value = '';
        alert('Stock updated!');
    }
}

// ================================================================
// Navigation & View Switching
// ================================================================
document.querySelectorAll('.menu-item').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!state.currentUser) return;

        const roles = btn.dataset.role.split(',');
        const userRole = state.currentUser.role.trim();
        
        // Check if current user's role is allowed
        const isAllowed = roles.some(role => role.trim() === userRole);
        
        if (!isAllowed) {
            alert('Access denied - Insufficient permissions');
            return;
        }

        const viewId = btn.dataset.view;
        
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        
        // Show the selected view
        const selectedView = document.getElementById(viewId);
        if (selectedView) {
            selectedView.classList.remove('hidden');
            selectedView.classList.add('active');
        }
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        btn.classList.add('active');

        // Refresh data for specific views
        if (viewId === 'dashboard-view') {
            updateSalesMetrics();
        } else if (viewId === 'inventory-view') {
            updateInventoryDisplay();
        } else if (viewId === 'admin-view') {
            updateAdminOverview();
            renderMenuManagement();
            renderUserManagement();
        }
    });
});

// ================================================================
// Sales Metrics & Analytics
// ================================================================
function updateSalesMetrics() {
    const totalRevenue = state.sales.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = state.sales.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const itemCounts = {};
    state.sales.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
    });

    const bestSeller = Object.keys(itemCounts).length > 0 
        ? Object.keys(itemCounts).reduce((a, b) => itemCounts[a] > itemCounts[b] ? a : b)
        : '-';

    document.getElementById('totalRevenue').textContent = `${state.settings.currency}${totalRevenue.toFixed(2)}`;
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('avgOrderValue').textContent = `${state.settings.currency}${avgOrderValue.toFixed(2)}`;
    document.getElementById('bestSeller').textContent = bestSeller;

    // Update charts
    createCharts();
}

function createCharts() {
    // Daily sales chart
    const ctx1 = document.getElementById('salesChart');
    if (ctx1 && ctx1.chart) {
        ctx1.chart.destroy();
    }

    const dailyData = [0, 0, 0, 0, 0, 0, 0];
    state.sales.forEach(order => {
        const day = order.timestamp.getDay();
        dailyData[day] += order.total;
    });

    if (ctx1) {
        ctx1.chart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Sales',
                    data: dailyData,
                    borderColor: '#00FFFF',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(138, 43, 226, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(138, 43, 226, 0.1)' }
                    }
                }
            }
        });
    }

    // Top items chart
    const ctx2 = document.getElementById('topItemsChart');
    if (ctx2 && ctx2.chart) {
        ctx2.chart.destroy();
    }

    // Calculate item sales data
    const itemCounts = {};
    state.sales.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
    });

    // Get top 5 items
    const topItems = Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const itemLabels = topItems.map(item => item[0]);
    const itemData = topItems.map(item => item[1]);

    // Add dummy data if we don't have enough items
    const dummyItems = [
        { name: 'Classic Beef Pares', count: 45 },
        { name: 'Beef Lugaw', count: 38 },
        { name: 'Garlic Rice', count: 32 },
        { name: 'Softdrinks', count: 28 },
        { name: 'Special Lugaw', count: 25 }
    ];

    if (topItems.length === 0) {
        itemLabels.push(...dummyItems.map(item => item.name));
        itemData.push(...dummyItems.map(item => item.count));
    }

    if (ctx2) {
        ctx2.chart = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: itemLabels,
                datasets: [{
                    label: 'Units Sold',
                    data: itemData,
                    backgroundColor: [
                        'rgba(138, 43, 226, 0.8)',
                        'rgba(0, 255, 255, 0.8)',
                        'rgba(255, 0, 127, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(138, 43, 226, 1)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(255, 0, 127, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(138, 43, 226, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af', maxRotation: 45, minRotation: 0 },
                        grid: { color: 'rgba(138, 43, 226, 0.1)' }
                    }
                }
            }
        });
    }
}

function exportPDF() {
    if (state.currentUser.role !== 'admin') {
        alert('Access denied - Admin only');
        return;
    }
    alert('PDF export would be generated here with full sales report');
}

function exportCSV() {
    if (state.currentUser.role !== 'admin') {
        alert('Access denied - Admin only');
        return;
    }
    let csv = 'Order ID,Date,Total,Items\n';
    state.sales.forEach(order => {
        const items = order.items.map(i => i.name).join('|');
        csv += `${order.id},${order.timestamp},${order.total},${items}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_report.csv';
    a.click();
}

// ================================================================
// Admin Functions
// ================================================================
function showAddMenuModal() {
    if (state.currentUser.role !== 'admin') {
        alert('Access denied - Admin only');
        return;
    }
    document.getElementById('addMenuModal').classList.remove('hidden');
}

function closeAddMenuModal() {
    document.getElementById('addMenuModal').classList.add('hidden');
    document.getElementById('menuForm').reset();
}

function checkAdminAccess() {
    if (state.currentUser.role !== 'admin') {
        alert('Access denied - Admin only');
        return false;
    }
    return true;
}

document.getElementById('menuForm').addEventListener('submit', (e) => {
    if (!checkAdminAccess()) {
        e.preventDefault();
        return;
    }
    e.preventDefault();
    
    const name = document.getElementById('itemName').value;
    const category = document.getElementById('itemCategory').value;
    const price = parseFloat(document.getElementById('itemPrice').value);
    const stock = parseInt(document.getElementById('itemStock').value);

    const newItem = {
        id: Math.max(...state.menuItems.map(m => m.id), 0) + 1,
        name,
        category,
        price,
        stock,
        emoji: '🍔',
        minLevel: 10
    };

    state.menuItems.push(newItem);
    saveData();
    updateMenuItemsDisplay();
    closeAddMenuModal();
});

function showAddUserModal() {
    if (state.currentUser.role !== 'admin') {
        alert('Access denied - Admin only');
        return;
    }
    document.getElementById('addUserModal').classList.remove('hidden');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.add('hidden');
    document.getElementById('userForm').reset();
}

document.getElementById('userForm').addEventListener('submit', (e) => {
    if (!checkAdminAccess()) {
        e.preventDefault();
        return;
    }
    e.preventDefault();
    
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newUserRole').value;

    state.users.push({ username, password, role, status: 'active' });
    saveData();
    closeAddUserModal();
    alert('User added successfully!');
});

document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = e.target.dataset.tab;
        switchMenu(tabName);
    });
});

function saveSettings() {
    if (state.currentUser.role !== 'admin') {
        alert('Access denied - Admin only');
        return;
    }
    state.settings.businessName = document.getElementById('businessName').value || state.settings.businessName;
    state.settings.taxRate = parseFloat(document.getElementById('taxRate').value) || 12;
    state.settings.currency = document.getElementById('currency').value || '₱';
    saveData();
    alert('Settings saved!');
}

// ================================================================
// Admin Prototype Functions
// ================================================================

// Switch admin menu tab
function switchMenu(tabName = 'admin-overview') {
    if (state.currentUser.role !== 'admin') {
        alert('Access denied - Admin only');
        return;
    }
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.add('hidden'));
    
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    document.getElementById(tabName)?.classList.remove('hidden');
    
    // Refresh data when switching tabs
    if (tabName === 'menu-management') {
        renderMenuManagement();
    } else if (tabName === 'user-management') {
        renderUserManagement();
    } else if (tabName === 'reports') {
        renderInventoryReport();
    }
}

// Render menu management tab
function renderMenuManagement() {
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    state.menuItems.forEach(item => {
        const status = item.stock <= item.minLevel ? '⚠️ Low' : '✅ OK';
        const statusClass = item.stock <= item.minLevel ? 'status-low' : 'status-ok';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" class="inventory-item-image"> ${item.name}</td>
            <td>${item.category}</td>
            <td>${state.settings.currency}${item.price}</td>
            <td>${item.stock}</td>
            <td>${item.minLevel}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-small" onclick="editMenuItem(${item.id})">✏️ Edit</button>
                <button class="btn btn-small" onclick="deleteMenuItem(${item.id})">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render user management tab
function renderUserManagement() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    state.users.forEach((user, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td><span class="role-badge">${user.role}</span></td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>${user.lastLogin || 'Never'}</td>
            <td>
                <button class="btn btn-small" onclick="editUser(${idx})">✏️ Edit</button>
                <button class="btn btn-small" onclick="deleteUser(${idx})">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter menu table
function filterMenuTable() {
    const searchBox = document.getElementById('menuSearchBox')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const tbody = document.getElementById('menuTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    state.menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchBox);
        const matchesCategory = !categoryFilter || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    }).forEach(item => {
        const status = item.stock <= item.minLevel ? '⚠️ Low' : '✅ OK';
        const statusClass = item.stock <= item.minLevel ? 'status-low' : 'status-ok';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" class="inventory-item-image"> ${item.name}</td>
            <td>${item.category}</td>
            <td>${state.settings.currency}${item.price}</td>
            <td>${item.stock}</td>
            <td>${item.minLevel}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-small" onclick="editMenuItem(${item.id})">✏️ Edit</button>
                <button class="btn btn-small" onclick="deleteMenuItem(${item.id})">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter user table
function filterUserTable() {
    const searchBox = document.getElementById('userSearchBox')?.value.toLowerCase() || '';
    const roleFilter = document.getElementById('roleFilter')?.value || '';
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    state.users.filter((user, idx) => {
        const matchesSearch = user.username.toLowerCase().includes(searchBox);
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    }).forEach((user, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td><span class="role-badge">${user.role}</span></td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>${user.lastLogin || 'Never'}</td>
            <td>
                <button class="btn btn-small" onclick="editUser(${idx})">✏️ Edit</button>
                <button class="btn btn-small" onclick="deleteUser(${idx})">🗑️ Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Edit menu item
function editMenuItem(id) {
    const item = state.menuItems.find(i => i.id === id);
    if (!item) return;
    
    const newPrice = prompt('Enter new price:', item.price);
    if (newPrice !== null) {
        item.price = parseFloat(newPrice);
        const newStock = prompt('Enter new stock:', item.stock);
        if (newStock !== null) {
            item.stock = parseInt(newStock);
            saveData();
            renderMenuManagement();
            alert('Item updated!');
        }
    }
}

// Delete menu item
function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        state.menuItems = state.menuItems.filter(i => i.id !== id);
        saveData();
        renderMenuManagement();
        alert('Item deleted!');
    }
}

// Edit user
function editUser(idx) {
    const user = state.users[idx];
    const newRole = prompt('Enter new role (cashier/admin):', user.role);
    if (newRole !== null && (newRole === 'cashier' || newRole === 'admin')) {
        user.role = newRole;
        saveData();
        renderUserManagement();
        alert('User updated!');
    }
}

// Delete user
function deleteUser(idx) {
    if (confirm('Are you sure you want to delete this user?')) {
        state.users.splice(idx, 1);
        saveData();
        renderUserManagement();
        alert('User deleted!');
    }
}

// Render inventory report
function renderInventoryReport() {
    const tbody = document.getElementById('inventoryReportBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    state.menuItems.forEach(item => {
        const status = item.stock <= item.minLevel ? '⚠️ Low Stock' : '✅ OK';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${item.image}" alt="${item.name}" class="inventory-item-image"> ${item.name}</td>
            <td>${item.stock}</td>
            <td>${item.minLevel}</td>
            <td>${status}</td>
        `;
        tbody.appendChild(row);
    });
}

// Refresh admin data
function refreshAdminData() {
    loadData();
    updateAdminOverview();
    renderMenuManagement();
    renderUserManagement();
    alert('Admin data refreshed!');
}

// Update admin overview
function updateAdminOverview() {
    try {
        // Update stats
        const lowStockCount = state.menuItems.filter(i => i.stock <= i.minLevel).length;
        const elem1 = document.getElementById('totalUsers');
        const elem2 = document.getElementById('totalMenuItems');
        const elem3 = document.getElementById('lowStockCount');
        const elem4 = document.getElementById('lastUpdate');
        
        if (elem1) elem1.textContent = state.users.length;
        if (elem2) elem2.textContent = state.menuItems.length;
        if (elem3) elem3.textContent = lowStockCount;
        if (elem4) elem4.textContent = new Date().toLocaleTimeString();
        
        // Update summary
        const elem5 = document.getElementById('summaryBusinessName');
        const elem6 = document.getElementById('summaryTaxRate');
        const elem7 = document.getElementById('summaryCurrency');
        const elem8 = document.getElementById('summaryTotalSales');
        
        if (elem5) elem5.textContent = state.settings.businessName;
        if (elem6) elem6.textContent = state.settings.taxRate + '%';
        if (elem7) elem7.textContent = state.settings.currency;
        
        const totalSales = state.sales.reduce((sum, sale) => sum + sale.total, 0);
        if (elem8) elem8.textContent = state.settings.currency + totalSales.toFixed(2);
        
        // Update users online
        const elem9 = document.getElementById('usersOnline');
        if (elem9) elem9.textContent = '1 Active';
    } catch (e) {
        // Silently fail if elements don't exist yet
    }
}

// Export all data
function exportAllData() {
    alert('Export feature coming soon! This will export menu items, users, and sales data.');
}

// Backup system
function backupSystem() {
    const backup = {
        timestamp: new Date().toISOString(),
        data: state
    };
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `foodflow_backup_${new Date().getTime()}.json`;
    link.click();
    alert('System backup created!');
}

// Generate report
function generateReport(format) {
    alert(`Report generation (${format}) coming soon!`);
}

// Reset all data
function resetAllData() {
    if (confirm('⚠️ This will delete ALL data! Are you sure?')) {
        state.menuItems = [];
        state.users = [];
        state.sales = [];
        state.orders = [];
        state.cart = [];
        saveData();
        initializeDefaultData();
        updateAdminOverview();
        alert('All data has been reset!');
    }
}

// Reset system
function resetSystem() {
    if (confirm('⚠️ This will reset the entire system! Are you sure?')) {
        localStorage.removeItem('foodflowData');
        location.reload();
    }
}

// ================================================================
// Initialize App
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Clear localStorage to ensure fresh data with correct image paths
    localStorage.removeItem('foodflowData');
    
    loadData();
    document.getElementById('businessName').value = state.settings.businessName;
    document.getElementById('taxRate').value = state.settings.taxRate;
    document.getElementById('currency').value = state.settings.currency;
    updateAdminOverview();
});

console.log('FoodFlow POS System initialized successfully!');
