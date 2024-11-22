class InventorySystem {
  constructor() {
    this.locations = [
      { name: 'ICT Unit', password: '1234' },
      { name: 'A&HR', password: '1234' },
      { name: 'Public Affairs Unit', password: '1234' }
    ];
    this.currentLocation = null;
    this.inventory = [
      {
        id: 'ICIT0001',
        name: 'Dell Laptop',
        category: 'IT Equipment',
        price: 350000,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ICIT0002',
        name: 'HP Printer',
        category: 'IT Equipment',
        price: 150000,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ICFU0001',
        name: 'Executive Chair',
        category: 'Furniture',
        price: 45000,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ICFU0002',
        name: 'Filing Cabinet',
        category: 'Furniture',
        price: 60000,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ICST0001',
        name: 'Paper Ream',
        category: 'Stationery',
        price: 3000,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ICST0002',
        name: 'Stapler Set',
        category: 'Stationery',
        price: 1500,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ICEQ0001',
        name: 'Projector',
        category: 'Special Equipment',
        price: 200000,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'ICEQ0002',
        name: 'Scanner',
        category: 'Special Equipment',
        price: 70000,
        originalLocation: 'ICT Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'AHIT0001',
        name: 'Desktop Computer',
        category: 'IT Equipment',
        price: 400000,
        originalLocation: 'A&HR',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'AHFU0001',
        name: 'Office Desk',
        category: 'Furniture',
        price: 80000,
        originalLocation: 'A&HR',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'AHST0001',
        name: 'File Folders',
        category: 'Stationery',
        price: 2000,
        originalLocation: 'A&HR',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'AHEQ0001',
        name: 'Paper Shredder',
        category: 'Special Equipment',
        price: 150000,
        originalLocation: 'A&HR',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'PAIT0001',
        name: 'Laptop',
        category: 'IT Equipment',
        price: 300000,
        originalLocation: 'Public Affairs Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'PAFU0001',
        name: 'Conference Table',
        category: 'Furniture',
        price: 120000,
        originalLocation: 'Public Affairs Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'PAST0001',
        name: 'Notepads',
        category: 'Stationery',
        price: 1000,
        originalLocation: 'Public Affairs Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'PAEQ0001',
        name: 'Digital Camera',
        category: 'Special Equipment',
        price: 250000,
        originalLocation: 'Public Affairs Unit',
        status: 'active',
        dateAdded: '2024-01-01T00:00:00.000Z',
        lastUpdated: new Date().toISOString()
      }
    ];
    this.deletedItems = []; // Add this new property to track deleted items
    this.auditLog = [];
    this.selectedItemId = null;
    this.lendingHistory = [];
    this.currentReport = null;
    this.itemHistory = {
      additions: [],
      damages: []
    };
    this.inactivityTimeout = null;
    this.inactivityDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    this.init();
  }

  init() {
    document.getElementById('current-location').textContent = 'Not Selected';
    this.showLocationModal();
    this.setupEventListeners();
    document.addEventListener('mousemove', () => this.resetInactivityTimer());
    document.addEventListener('keypress', () => this.resetInactivityTimer());
    document.addEventListener('click', () => this.resetInactivityTimer());
    window.addEventListener('beforeunload', () => this.handleTabClose());
  }

  showLocationModal() {
    const select = document.getElementById('location-select');
    select.innerHTML = '<option value="">Select Location</option>';
    this.locations.forEach(loc => {
      const option = document.createElement('option');
      option.value = loc.name;
      option.textContent = loc.name;
      select.appendChild(option);
    });
    document.getElementById('locationModal').style.display = 'flex';
  }

  showPasswordRecovery() {
    const select = document.getElementById('recovery-location');
    select.innerHTML = '<option value="">Select Location</option>';
    this.locations.forEach(loc => {
      const option = document.createElement('option');
      option.value = loc.name;
      option.textContent = loc.name;
      select.appendChild(option);
    });
    
    this.closeModal('locationModal');
    document.getElementById('passwordRecoveryModal').style.display = 'flex';
  }

  validateLocation(event) {
    if (event) {
        event.preventDefault(); // Prevent default form submission
    }
    
    const locationSelect = document.getElementById('location-select');
    const passwordInput = document.getElementById('location-password');
    const locationGroup = locationSelect.parentElement;
    const passwordGroup = passwordInput.parentElement;
    let isValid = true;

    // Reset previous validation states
    locationGroup.classList.remove('error');
    passwordGroup.classList.remove('error');

    // Validate location selection
    if (!locationSelect.value) {
        locationGroup.classList.add('error');
        isValid = false;
    }

    // Validate password
    if (!passwordInput.value) {
        passwordGroup.classList.add('error');
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    const location = this.locations.find(l => l.name === locationSelect.value);
    if (location && location.password === passwordInput.value) {
        this.currentLocation = locationSelect.value;
        document.getElementById('current-location').textContent = locationSelect.value;
        this.closeModal('locationModal');
        this.updateUI();
        this.logActivity(`Accessed location: ${locationSelect.value}`);
        this.resetInactivityTimer();
    } else {
        passwordGroup.classList.add('error');
        passwordGroup.querySelector('.validation-message').textContent = 'Invalid password';
    }
  }

  recoverPassword() {
    const recoveryPassword = document.getElementById('recovery-ict-password').value;
    const locationName = document.getElementById('recovery-location').value;
    const newPassword = document.getElementById('new-recovery-password').value;
    const confirmPassword = document.getElementById('confirm-recovery-password').value;
    
    if (recoveryPassword !== '5678') {
        alert('Invalid password');
        return;
    }

    if (!locationName) {
        alert('Please select a location');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const location = this.locations.find(l => l.name === locationName);
    if (location) {
        location.password = newPassword;
        this.logActivity(`Password reset for location: ${locationName}`);
        alert('Password has been reset successfully');
        this.closeModal('passwordRecoveryModal');
        this.showLocationModal();
    }
  }

  resetInactivityTimer() {
    if (!this.currentLocation) return; // Don't start timer if not logged in

    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.autoLogout('inactivity');
    }, this.inactivityDuration);
  }

  handleTabClose() {
    if (this.currentLocation) {
      this.logActivity('User session ended - browser closed');
      this.logout(true); // Force logout without confirmation
    }
  }

  autoLogout(reason) {
    if (this.currentLocation) {
      this.logActivity(`Auto logout due to ${reason}`);
      this.logout(true); // Force logout without confirmation
      alert(`You have been logged out due to ${reason}`);
    }
  }

  showNewLocationForm() {
    const ictPassword = prompt('Please enter password to create new location:');
    
    if (ictPassword !== '5678') {
      alert('Invalid password');
      return;
    }
    
    this.closeModal('locationModal');
    document.getElementById('newLocationModal').style.display = 'flex';
  }

  createNewLocation() {
    const name = document.getElementById('new-location-name').value;
    const password = document.getElementById('new-location-password').value;
    const confirmPassword = document.getElementById('confirm-location-password').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (this.locations.some(l => l.name === name)) {
      alert('Location already exists');
      return;
    }

    this.locations.push({ name, password });
    document.getElementById('new-location-name').value = '';
    document.getElementById('new-location-password').value = '';
    document.getElementById('confirm-location-password').value = '';
    this.closeModal('newLocationModal');
    this.showLocationModal();
    this.logActivity(`Created new location: ${name}`);
  }

  setupEventListeners() {
    document.getElementById('asset-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.addItem();
    });
  }

  addItem() {
    const itemName = document.getElementById('asset-name').value;
    const category = document.getElementById('category').value;
    const quantity = parseInt(document.getElementById('asset-quantity').value) || 1;
    const price = parseFloat(document.getElementById('asset-price').value);
    
    // Generate location code
    const locationCodes = {
      'ICT Unit': 'IC',
      'A&HR': 'AH',
      'Public Affairs Unit': 'PA'
    };
    const locationCode = locationCodes[this.currentLocation];
    
    // Generate category code
    const categoryCodes = {
      'IT Equipment': 'IT',
      'Furniture': 'FU',
      'Stationery': 'ST',
      'Special Equipment': 'EQ'
    };
    const categoryCode = categoryCodes[category];
    
    // Find all EVER USED items for this location and category
    const prefix = locationCode + categoryCode;
    
    // Get all numbers ever used
    const existingNumbers = new Set();
    
    // Check current inventory
    this.inventory
      .filter(item => item.id.startsWith(prefix))
      .forEach(item => existingNumbers.add(parseInt(item.id.slice(-4))));
    
    // Check audit log for deleted items
    this.auditLog
      .filter(log => log.includes('Deleted item:') && log.includes(prefix))
      .forEach(log => {
        const match = log.match(new RegExp(prefix + '(\\d{4})'));
        if (match) {
          existingNumbers.add(parseInt(match[1]));
        }
      });
    
    // Find the next available number
    let nextNumber = 1;
    const addedItems = [];
    
    // Add items based on quantity
    for (let i = 0; i < quantity; i++) {
      // Find next available number
      while (existingNumbers.has(nextNumber)) {
        nextNumber++;
      }
      
      // Generate new ID
      const itemId = prefix + nextNumber.toString().padStart(4, '0');
      existingNumbers.add(nextNumber); // Add to set so next item gets next number
      
      const item = {
        id: itemId,
        name: itemName,
        category: category,
        price: price,
        originalLocation: this.currentLocation,
        status: 'active',
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      this.inventory.push(item);
      addedItems.push(item);
      
      // Add to additions history
      this.itemHistory.additions.push({
        ...item,
        addedDate: new Date().toISOString()
      });

      nextNumber++; // Increment for next item
    }
    
    // Sort inventory by ID
    this.inventory.sort((a, b) => a.id.localeCompare(b.id));

    // Log the activity with quantity information
    if (quantity === 1) {
      this.logActivity(`Added new item: ${addedItems[0].id} - ${itemName}`);
    } else {
      const itemIds = addedItems.map(item => item.id).join(', ');
      this.logActivity(`Added ${quantity} new items: ${itemIds} - ${itemName}`);
    }

    this.updateUI();
    this.resetForm();
  }

  logActivity(message) {
    const timestamp = new Date().toISOString();
    this.auditLog.unshift(`[${timestamp}] ${message} - location: ${this.currentLocation}`);
    this.updateAuditLog();
  }

  updateUI() {
    const selectedCategory = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('item-search').value.toLowerCase();
    this.updateInventoryTable(selectedCategory, searchTerm);
    this.updateAuditLog();
  }

  updateAuditLog() {
    this.filterActivityLog();
  }

  filterActivityLog() {
    const startDate = document.getElementById('activity-start-date').value;
    const endDate = document.getElementById('activity-end-date').value;
    
    const auditLogElement = document.getElementById('audit-log');
    if (!this.currentLocation) {
      auditLogElement.innerHTML = '<div>Login required to view activity log</div>';
      return;
    }

    let filteredLogs = this.auditLog.filter(entry => 
      entry.includes(`location: ${this.currentLocation}`) || 
      entry.includes(`Accessed location: ${this.currentLocation}`)
    );

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59); // Include full end date

      filteredLogs = filteredLogs.filter(entry => {
        const logDate = new Date(entry.match(/\[(.*?)\]/)[1]);
        return logDate >= start && logDate <= end;
      });
    }

    auditLogElement.innerHTML = filteredLogs
      .map(entry => `<div>${entry}</div>`)
      .join('');
  }

  updateInventoryTable(categoryFilter = 'all', searchTerm = '') {
    const tbody = document.getElementById('inventory-body');
    const tableHeader = document.querySelector('#inventory-table thead tr');
    tbody.innerHTML = '';

    tableHeader.innerHTML = `
      <th>Item ID</th>
      <th>Name</th>
      ${categoryFilter === 'all' ? '<th>Category</th>' : ''}
      <th>Purchase Price (₦)</th>
      <th>Status</th>
      <th>Date Added</th>
      <th>Last Updated</th>
      <th>Actions</th>
    `;

    this.inventory
      .filter(item => item.originalLocation === this.currentLocation)
      .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
      .filter(item => 
        item.id.toLowerCase().includes(searchTerm) || 
        item.name.toLowerCase().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm)
      )
      .forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.name}</td>
          ${categoryFilter === 'all' ? `<td>${item.category}</td>` : ''}
          <td>${item.price.toLocaleString()}</td>
          <td><span class="status-badge status-${item.status}">${item.status}${item.lentTo ? ` to ${item.lentTo}` : ''}</span></td>
          <td>${new Date(item.dateAdded).toLocaleDateString()}</td>
          <td>${new Date(item.lastUpdated).toLocaleDateString()}</td>
          <td class="action-buttons">
            <button onclick="inventorySystem.toggleItemStatus('${item.id}')">${item.status === 'active' ? 'Mark Damaged' : 'Mark Active'}</button>
            <button onclick="inventorySystem.showLendModal('${item.id}')">Lend Out</button>
            <button onclick="inventorySystem.deleteItem('${item.id}')">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });
  }

  filterByCategory() {
    const selectedCategory = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('item-search').value.toLowerCase();
    this.updateInventoryTable(selectedCategory, searchTerm);
  }

  searchItems() {
    const selectedCategory = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('item-search').value.toLowerCase();
    this.updateInventoryTable(selectedCategory, searchTerm);
  }

  toggleItemStatus(itemId) {
    const item = this.inventory.find(i => i.id === itemId);
    if (item) {
        const previousStatus = item.status;
        item.status = item.status === 'active' ? 'inactive' : 'active';

        if (previousStatus === 'active' && item.status === 'inactive') {
            this.itemHistory.damages.push({
                ...item,
                damageDate: new Date().toISOString()
            });
        }

        if (item.status === 'active') {
            delete item.lentTo;
        }
        item.lastUpdated = new Date().toISOString();
        this.logActivity(`Changed status of item ${itemId} to ${item.status}`);
        
        const selectedCategory = document.getElementById('category-filter').value;
        const searchTerm = document.getElementById('item-search').value.toLowerCase();
        this.updateInventoryTable(selectedCategory, searchTerm);
        this.updateAuditLog();
    }
  }

  showLendModal(itemId) {
    this.selectedItemId = itemId;
    const modal = document.getElementById('lendModal');
    
    const officeSelect = document.getElementById('lend-office');
    officeSelect.innerHTML = '<option value="">Select Location</option>';
    
    this.locations
      .filter(loc => loc.name !== this.currentLocation)
      .forEach(loc => {
        const option = document.createElement('option');
        option.value = loc.name;
        option.textContent = loc.name;
        officeSelect.appendChild(option);
      });
    
    modal.style.display = 'flex';
  }

  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'newLocationModal' || modalId === 'passwordRecoveryModal' || !this.currentLocation) {
      this.showLocationModal();
    }
  }

  confirmLend() {
    const lendOffice = document.getElementById('lend-office').value;
    const item = this.inventory.find(i => i.id === this.selectedItemId);
    if (item) {
        item.status = 'lent';
        item.lentTo = lendOffice;
        item.lastUpdated = new Date().toISOString();

        // Add to lending history with original location
        this.lendingHistory.push({
          itemId: item.id,
          itemName: item.name,
          category: item.category,
          originalLocation: item.originalLocation,
          lentTo: lendOffice,
          lentDate: new Date().toISOString()
        });

        this.logActivity(`Item ${item.id} lent to ${lendOffice}`);
        
        const selectedCategory = document.getElementById('category-filter').value;
        const searchTerm = document.getElementById('item-search').value.toLowerCase();
        this.updateInventoryTable(selectedCategory, searchTerm);
        this.updateAuditLog();
    }
    this.closeModal('lendModal');
    document.getElementById('lend-office').value = '';
  }

  deleteItem(itemId) {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    const password = prompt('Please enter password to confirm deletion:');
    const location = this.locations.find(l => l.name === this.currentLocation);
    
    if (!location || password !== location.password) {
      alert('Invalid password. Deletion cancelled.');
      return;
    }

    const index = this.inventory.findIndex(i => i.id === itemId);
    if (index !== -1) {
      const item = this.inventory[index];
      this.inventory.splice(index, 1);
      
      // Add deletion record with both add and delete dates
      this.deletedItems.push({
        ...item,
        deleteDate: new Date().toISOString()
      });
      
      this.logActivity(`Deleted item: ${item.id} - ${item.name}`);
      
      const selectedCategory = document.getElementById('category-filter').value;
      const searchTerm = document.getElementById('item-search').value.toLowerCase();
      this.updateInventoryTable(selectedCategory, searchTerm);
      this.updateAuditLog();
    }
  }

  generateReport() {
    const emailInput = document.getElementById('report-email');
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    const statusDiv = document.getElementById('report-status');

    if (!startDate || !endDate) {
      statusDiv.innerHTML = '<p style="color: red;">Please select both start and end dates.</p>';
      return;
    }

    if (!emailInput.value) {
      statusDiv.innerHTML = '<p style="color: red;">Please enter an email address.</p>';
      return;
    }

    const report = this.generateReportData();
    this.showReportPreview(report, emailInput.value);
  }

  generateReportData() {
    const startDate = new Date(document.getElementById('report-start-date').value);
    const endDate = new Date(document.getElementById('report-end-date').value);
    endDate.setHours(23, 59, 59); // Include full end date
    
    const locationInventory = this.inventory.filter(i => i.originalLocation === this.currentLocation);
    
    // Calculate items at period start
    const itemsAddedAfterStart = this.itemHistory.additions.filter(item => 
      item.originalLocation === this.currentLocation &&
      new Date(item.addedDate) > startDate
    ).length;

    const deletedItemsAfterStart = this.deletedItems
      .filter(item => 
        item.originalLocation === this.currentLocation &&
        new Date(item.deleteDate) > startDate
      ).length;

    const itemsAtStart = locationInventory.length - itemsAddedAfterStart + deletedItemsAfterStart;

    // Calculate statistics for the period
    const periodAdditions = this.itemHistory.additions.filter(item => 
      item.originalLocation === this.currentLocation &&
      new Date(item.addedDate) >= startDate &&
      new Date(item.addedDate) <= endDate
    );

    const periodDamages = this.itemHistory.damages.filter(damage => 
      new Date(damage.damageDate) >= startDate &&
      new Date(damage.damageDate) <= endDate
    );

    const periodLending = this.lendingHistory.filter(lend => 
      new Date(lend.lentDate) >= startDate &&
      new Date(lend.lentDate) <= endDate
    );
    
    const deletionsInPeriod = this.deletedItems
      .filter(item => 
        item.originalLocation === this.currentLocation &&
        new Date(item.deleteDate) >= startDate &&
        new Date(item.deleteDate) <= endDate
      ).length;

    // Current status counts
    const active = locationInventory.filter(i => i.status === 'active').length;
    const damaged = locationInventory.filter(i => i.status === 'inactive').length;
    const lent = locationInventory.filter(i => i.status === 'lent').length;

    return {
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      itemsAtStart,
      total: locationInventory.length + deletionsInPeriod,
      deletionsInPeriod,
      newItemsInPeriod: periodAdditions.length,
      damagesInPeriod: periodDamages.length,
      lendsInPeriod: periodLending.length,
      active,
      damaged,
      lent,
      fullInventory: locationInventory
    };
  }

  showReportPreview(report, email) {
    const previewContent = document.getElementById('report-preview-content');
    
    const startDate = new Date(document.getElementById('report-start-date').value);
    const endDate = new Date(document.getElementById('report-end-date').value);
    endDate.setHours(23, 59, 59);

    // Get new items in period
    const newItems = this.itemHistory.additions.filter(item => 
      item.originalLocation === this.currentLocation &&
      new Date(item.addedDate) >= startDate &&
      new Date(item.addedDate) <= endDate
    );

    // Get damaged items in period
    const damages = this.itemHistory.damages.filter(damage => 
      damage.originalLocation === this.currentLocation &&
      new Date(damage.damageDate) >= startDate &&
      new Date(damage.damageDate) <= endDate
    );

    // Get lending activity in period
    const lending = this.lendingHistory.filter(lend => 
      lend.originalLocation === this.currentLocation &&
      new Date(lend.lentDate) >= startDate &&
      new Date(lend.lentDate) <= endDate
    );

    // Get deleted items in period
    const deletedItemsInPeriod = this.deletedItems.filter(item => 
      item.originalLocation === this.currentLocation &&
      new Date(item.deleteDate) >= startDate &&
      new Date(item.deleteDate) <= endDate
    );

    // New Items Details section
    const newItemsTable = newItems.length > 0 ? `
      <h3>New Items Added During Period</h3>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Purchase Price (₦)</th>
            <th>Date Added</th>
          </tr>
        </thead>
        <tbody>
          ${newItems.map(record => `
            <tr>
              <td>${record.id}</td>
              <td>${record.name}</td>
              <td>${record.category}</td>
              <td>${record.price.toLocaleString()}</td>
              <td>${new Date(record.addedDate).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<h3>No New Items Added During Period</h3>';

    // Damaged Items Details section
    const damagedItemsTable = damages.length > 0 ? `
      <h3>Items Damaged During Period</h3>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Date Damaged</th>
          </tr>
        </thead>
        <tbody>
          ${damages.map(record => `
            <tr>
              <td>${record.id}</td>
              <td>${record.name}</td>
              <td>${record.category}</td>
              <td>${new Date(record.damageDate).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<h3>No Items Damaged During Period</h3>';

    // Lending Activity section
    const lendingDetailsTable = lending.length > 0 ? `
      <h3>Lending Activity During Period</h3>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Lent To</th>
            <th>Date Lent</th>
          </tr>
        </thead>
        <tbody>
          ${lending.map(record => `
            <tr>
              <td>${record.itemId}</td>
              <td>${record.itemName}</td>
              <td>${record.category}</td>
              <td>${record.lentTo}</td>
              <td>${new Date(record.lentDate).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<h3>No Lending Activity During Period</h3>';

    // Deleted Items Details section
    const deletedItemsTable = deletedItemsInPeriod.length > 0 ? `
      <h3>Items Deleted During Period</h3>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Name</th>
            <th>Category</th>
            <th>Purchase Price (₦)</th>
            <th>Date Added</th>
            <th>Date Deleted</th>
          </tr>
        </thead>
        <tbody>
          ${deletedItemsInPeriod.map(record => `
            <tr>
              <td>${record.id}</td>
              <td>${record.name}</td>
              <td>${record.category}</td>
              <td>${record.price.toLocaleString()}</td>
              <td>${new Date(record.dateAdded).toLocaleDateString()}</td>
              <td>${new Date(record.deleteDate).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : '<h3>No Items Deleted During Period</h3>';

    previewContent.innerHTML = `
      <h3>Inventory Summary for ${report.period}</h3>
      <div class="stat-group">
        <div class="stat-item">
          <div class="stat-value">${report.itemsAtStart}</div>
          <div class="stat-label">Items at Period Start</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.fullInventory.length}</div>
          <div class="stat-label">Current Total Items</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.total}</div>
          <div class="stat-label">Total Items in Period</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.newItemsInPeriod}</div>
          <div class="stat-label">New Items In Period</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.deletionsInPeriod}</div>
          <div class="stat-label">Items Deleted In Period</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.damagesInPeriod}</div>
          <div class="stat-label">Items Damaged In Period</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.lendsInPeriod}</div>
          <div class="stat-label">Items Lent In Period</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.active}</div>
          <div class="stat-label">Currently Active Items</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.damaged}</div>
          <div class="stat-label">Currently Damaged</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${report.lent}</div>
          <div class="stat-label">Currently Lent</div>
        </div>
      </div>
      ${newItemsTable}
      ${damagedItemsTable}
      ${lendingDetailsTable}
      ${deletedItemsTable}
      <h3>Full Inventory</h3>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Purchase Price (₦)</th>
            <th>Status</th>
            <th>Date Added</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          ${report.fullInventory.map(item => `
            <tr>
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.category}</td>
              <td>${item.price.toLocaleString()}</td>
              <td><span class="status-badge status-${item.status}">${item.status}${item.lentTo ? ` to ${item.lentTo}` : ''}</span></td>
              <td>${new Date(item.dateAdded).toLocaleDateString()}</td>
              <td>${new Date(item.lastUpdated).toLocaleDateString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    this.currentReport = {data: report, email: email};
    document.getElementById('reportPreviewModal').style.display = 'flex';
  }

  sendReport() {
    if (!this.currentReport) return;

    const statusDiv = document.getElementById('report-status');
    statusDiv.innerHTML = '<p style="color: #28a745;">Sending report...</p>';

    this.closeModal('reportPreviewModal');

    setTimeout(() => {
      statusDiv.innerHTML = `
        <p style="color: #28a745;">
          ✓ Report for ${this.currentReport.data.period} has been sent to ${this.currentReport.email}
        </p>
      `;
      document.getElementById('report-email').value = '';
      this.logActivity(`Monthly report for ${this.currentReport.data.period} sent to ${this.currentReport.email}`);
      this.currentReport = null;
    }, 1500);
  }

  resetForm() {
    document.getElementById('asset-form').reset();
  }

  logout(force = false) {
    if (force || confirm('Are you sure you want to log out?')) {
      clearTimeout(this.inactivityTimeout);
      if (!force) { // Only log manual logout if not forced
        this.logActivity('Manual logout from location');
      }
      this.currentLocation = null;
      this.updateUI();
      this.showLocationModal();
      document.getElementById('location-password').value = '';
      document.getElementById('current-location').textContent = 'Not Selected';
    }
  }
}

// Initialize the system
const inventorySystem = new InventorySystem();