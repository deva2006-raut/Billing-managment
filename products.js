// Products Management
class ProductsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
    }

    setupEventListeners() {
        const addProductForm = document.getElementById('add-product-form');
        addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
    }

    handleAddProduct(e) {
        e.preventDefault();

        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const quantity = parseInt(document.getElementById('product-quantity').value);
        const description = document.getElementById('product-description').value;

        const product = {
            id: window.app.generateId(),
            name,
            price,
            quantity,
            description,
            createdAt: new Date().toISOString()
        };

        const products = window.app.getProducts();
        products.push(product);
        window.app.saveProducts(products);

        // Reset form
        e.target.reset();

        // Show success message
        alert('Product added successfully!');

        // Switch to products page
        window.app.showPage('products');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-item[data-page="products"]').classList.add('active');
        document.getElementById('page-title').textContent = 'Products';

        // Reload products list
        this.loadProducts();
    }

    loadProducts() {
        const products = window.app.getProducts();
        const tbody = document.getElementById('products-tbody');
        const saleProductSelect = document.getElementById('sale-product');

        tbody.innerHTML = '';
        saleProductSelect.innerHTML = '<option value="">Choose a product...</option>';

        products.forEach(product => {
            // Add to products table
            const row = this.createProductRow(product);
            tbody.appendChild(row);

            // Add to sales dropdown (only available products)
            const sales = window.app.getSales();
            const soldQuantity = sales
                .filter(sale => sale.productId === product.id)
                .reduce((total, sale) => total + sale.quantity, 0);
            const available = product.quantity - soldQuantity;

            if (available > 0) {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (Available: ${available}) - $${product.price}`;
                saleProductSelect.appendChild(option);
            }
        });
    }

    createProductRow(product) {
        const row = document.createElement('tr');

        // Calculate available quantity
        const sales = window.app.getSales();
        const soldQuantity = sales
            .filter(sale => sale.productId === product.id)
            .reduce((total, sale) => total + sale.quantity, 0);
        const available = product.quantity - soldQuantity;

        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${available} / ${product.quantity}</td>
            <td>$${(product.price * product.quantity).toFixed(2)}</td>
            <td>
                <button class="btn-action" onclick="window.productsManager.editProduct('${product.id}')">Edit</button>
                <button class="btn-action btn-danger" onclick="window.productsManager.deleteProduct('${product.id}')">Delete</button>
            </td>
        `;

        return row;
    }

    editProduct(productId) {
        const products = window.app.getProducts();
        const product = products.find(p => p.id === productId);

        if (!product) return;

        // Populate form with product data
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-description').value = product.description;

        // Change form to edit mode
        const form = document.getElementById('add-product-form');
        const button = form.querySelector('button');
        button.textContent = 'Update Product';

        // Store product ID for update
        form.dataset.editId = productId;

        // Switch to add product page
        window.app.showPage('add-product');
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-item[data-page="add-product"]').classList.add('active');
        document.getElementById('page-title').textContent = 'Edit Product';
    }

    deleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        const products = window.app.getProducts();
        const filteredProducts = products.filter(p => p.id !== productId);
        window.app.saveProducts(filteredProducts);

        this.loadProducts();
        alert('Product deleted successfully!');
    }
}

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productsManager = new ProductsManager();
});
