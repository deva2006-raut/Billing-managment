// Sales Management
class SalesManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSalePrice();
    }

    setupEventListeners() {
        const salesForm = document.getElementById('sales-form');
        const saleProductSelect = document.getElementById('sale-product');
        const saleQuantityInput = document.getElementById('sale-quantity');

        salesForm.addEventListener('submit', (e) => this.handleSaleSubmit(e));
        saleProductSelect.addEventListener('change', () => this.updateSalePrice());
        saleQuantityInput.addEventListener('input', () => this.updateSalePrice());
    }

    updateSalePrice() {
        const productId = document.getElementById('sale-product').value;
        const quantity = parseInt(document.getElementById('sale-quantity').value) || 0;
        const products = window.app.getProducts();
        const product = products.find(p => p.id === productId);

        if (product && quantity > 0) {
            const totalPrice = product.price * quantity;
            document.getElementById('sale-price').value = totalPrice.toFixed(2);
        } else {
            document.getElementById('sale-price').value = '';
        }
    }

    handleSaleSubmit(e) {
        e.preventDefault();

        const productId = document.getElementById('sale-product').value;
        const quantity = parseInt(document.getElementById('sale-quantity').value);

        if (!productId || !quantity || quantity <= 0) {
            alert('Please select a product and enter a valid quantity.');
            return;
        }

        const products = window.app.getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) {
            alert('Product not found.');
            return;
        }

        // Check available quantity
        const sales = window.app.getSales();
        const soldQuantity = sales
            .filter(sale => sale.productId === productId)
            .reduce((total, sale) => total + sale.quantity, 0);
        const available = product.quantity - soldQuantity;

        if (quantity > available) {
            alert(`Only ${available} units available for this product.`);
            return;
        }

        // Create sale record
        const sale = {
            id: window.app.generateId(),
            productId,
            productName: product.name,
            quantity,
            unitPrice: product.price,
            totalPrice: product.price * quantity,
            date: new Date().toISOString()
        };

        const allSales = window.app.getSales();
        allSales.push(sale);
        window.app.saveSales(allSales);

        // Reset form
        e.target.reset();
        this.updateSalePrice();

        // Generate bill
        this.generateBill(sale, product);

        alert('Sale completed successfully! Bill generated.');

        // Reload products to update dropdown
        if (window.productsManager) {
            window.productsManager.loadProducts();
        }

        // Update reports
        if (window.reportsManager) {
            window.reportsManager.loadReports();
        }
    }

    generateBill(sale, product) {
        const bill = {
            id: window.app.generateId(),
            saleId: sale.id,
            billNumber: `BILL-${Date.now()}`,
            productName: product.name,
            quantity: sale.quantity,
            unitPrice: sale.unitPrice,
            totalAmount: sale.totalPrice,
            date: sale.date,
            logo: 'DEVA'
        };

        const bills = this.getBills();
        bills.push(bill);
        localStorage.setItem('bills', JSON.stringify(bills));

        // Auto download PDF
        this.downloadBillPDF(bill);

        // Update bills list
        if (window.billsManager) {
            window.billsManager.loadBills();
        }
    }

    getBills() {
        return JSON.parse(localStorage.getItem('bills') || '[]');
    }

    downloadBillPDF(bill) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Logo
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(bill.logo, 105, 30, { align: 'center' });

        // Bill details
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL / INVOICE', 105, 50, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Bill Number: ${bill.billNumber}`, 20, 70);
        doc.text(`Date & Time: ${new Date(bill.date).toLocaleString()}`, 20, 80);

        // Product details
        doc.text('Product Details:', 20, 100);
        doc.text(`Product Name: ${bill.productName}`, 30, 110);
        doc.text(`Quantity: ${bill.quantity}`, 30, 120);
        doc.text(`Unit Price: $${bill.unitPrice.toFixed(2)}`, 30, 130);
        doc.text(`Total Amount: $${bill.totalAmount.toFixed(2)}`, 30, 140);

        // Footer
        doc.setFontSize(10);
        doc.text('Thank you for your business!', 105, 170, { align: 'center' });

        // Download
        doc.save(`bill-${bill.billNumber}.pdf`);
    }
}

// Initialize sales manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.salesManager = new SalesManager();
});
