// Bills Management
class BillsManager {
    constructor() {
        this.init();
    }

    init() {
        this.loadBills();
    }

    loadBills() {
        const bills = this.getBills();
        const billsList = document.getElementById('bills-list');

        billsList.innerHTML = '';

        if (bills.length === 0) {
            billsList.innerHTML = '<p>No bills found.</p>';
            return;
        }

        bills.forEach(bill => {
            const billItem = this.createBillItem(bill);
            billsList.appendChild(billItem);
        });
    }

    createBillItem(bill) {
        const item = document.createElement('div');
        item.className = 'bill-item';

        item.innerHTML = `
            <div class="bill-info">
                <h4>${bill.productName}</h4>
                <p>Bill #${bill.billNumber}</p>
                <p>Date: ${new Date(bill.date).toLocaleString()}</p>
                <p>Amount: $${bill.totalAmount.toFixed(2)}</p>
            </div>
            <button class="btn-primary" onclick="window.billsManager.downloadBill('${bill.id}')">
                Download PDF
            </button>
        `;

        return item;
    }

    downloadBill(billId) {
        const bills = this.getBills();
        const bill = bills.find(b => b.id === billId);

        if (!bill) {
            alert('Bill not found.');
            return;
        }

        this.generateBillPDF(bill);
    }

    generateBillPDF(bill) {
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

    getBills() {
        return JSON.parse(localStorage.getItem('bills') || '[]');
    }
}

// Initialize bills manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.billsManager = new BillsManager();
});
