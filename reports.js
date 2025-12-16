// Reports Management
class ReportsManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadReports();
    }

    loadReports() {
        this.updateReportCards();
        this.loadSalesReport();
    }

    updateReportCards() {
        const products = window.app.getProducts();
        const sales = window.app.getSales();

        // Total products added
        document.getElementById('report-total-products').textContent = products.length;

        // Total products sold
        const totalSold = sales.reduce((total, sale) => total + sale.quantity, 0);
        document.getElementById('report-total-sold').textContent = totalSold;

        // Total revenue
        const totalRevenue = sales.reduce((total, sale) => total + sale.totalPrice, 0);
        document.getElementById('report-total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
    }

    loadSalesReport() {
        const sales = window.app.getSales();
        const tbody = document.getElementById('sales-report-tbody');

        tbody.innerHTML = '';

        if (sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">No sales data available.</td></tr>';
            return;
        }

        // Group sales by date
        const salesByDate = {};
        sales.forEach(sale => {
            const date = new Date(sale.date).toLocaleDateString();
            if (!salesByDate[date]) {
                salesByDate[date] = [];
            }
            salesByDate[date].push(sale);
        });

        // Sort dates descending
        const sortedDates = Object.keys(salesByDate).sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach(date => {
            const daySales = salesByDate[date];

            daySales.forEach(sale => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${date}</td>
                    <td>${sale.productName}</td>
                    <td>${sale.quantity}</td>
                    <td>$${sale.totalPrice.toFixed(2)}</td>
                `;
                tbody.appendChild(row);
            });
        });
    }
}

// Initialize reports manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.reportsManager = new ReportsManager();
});
