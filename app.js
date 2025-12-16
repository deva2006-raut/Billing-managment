// Main Application Logic
class App {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.updateDashboard();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item[data-page]');
        const pageTitle = document.getElementById('page-title');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.showPage(page);

                // Update active nav item
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update page title
                const titles = {
                    'dashboard': 'Dashboard',
                    'products': 'Products',
                    'add-product': 'Add Product',
                    'sales': 'Sales',
                    'bills': 'Bills / Invoices',
                    'reports': 'Reports',
                    'profile': 'Profile'
                };
                pageTitle.textContent = titles[page] || 'Dashboard';
            });
        });
    }

    showPage(pageId) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

        // Show selected page
        const page = document.getElementById(`${pageId}-page`);
        if (page) {
            page.classList.add('active');
        }
    }

    updateDashboard() {
        const products = this.getProducts();
        const sales = this.getSales();

        // Calculate metrics
        const totalProducts = products.length;
        const soldQuantities = {};

        // Calculate sold quantities
        sales.forEach(sale => {
            if (!soldQuantities[sale.productId]) {
                soldQuantities[sale.productId] = 0;
            }
            soldQuantities[sale.productId] += sale.quantity;
        });

        let totalSoldProducts = 0;
        let availableProducts = 0;
        let totalStockValue = 0;
        let totalSalesAmount = 0;

        products.forEach(product => {
            const sold = soldQuantities[product.id] || 0;
            availableProducts += Math.max(0, product.quantity - sold);
            totalSoldProducts += sold;
            totalStockValue += product.price * product.quantity;
        });

        sales.forEach(sale => {
            const product = products.find(p => p.id === sale.productId);
            if (product) {
                totalSalesAmount += product.price * sale.quantity;
            }
        });

        // Update dashboard cards
        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('available-products').textContent = availableProducts;
        document.getElementById('sold-products').textContent = totalSoldProducts;
        document.getElementById('total-stock-value').textContent = `$${totalStockValue.toFixed(2)}`;
        document.getElementById('total-sales-amount').textContent = `$${totalSalesAmount.toFixed(2)}`;
    }

    getProducts() {
        return JSON.parse(localStorage.getItem('products') || '[]');
    }

    saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
        this.updateDashboard();
    }

    getSales() {
        return JSON.parse(localStorage.getItem('sales') || '[]');
    }

    saveSales(sales) {
        localStorage.setItem('sales', JSON.stringify(sales));
        this.updateDashboard();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
