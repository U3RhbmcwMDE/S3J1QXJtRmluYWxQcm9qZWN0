const API_URL = "https://6799ffea747b09cdcccd4f8a.mockapi.io/iliketoeatbruhhhhhhh";
let currentPage = 1;
const itemsPerPage = 6;
async function fetchProducts(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${itemsPerPage}`);
        const products = await response.json();
        
        let html = "";
        products.forEach(product => {
            html += `
                <div class="card bg-white p-4 shadow-lg rounded-lg">
                    <img src="${product.image}" class="w-full h-40 object-cover mb-3 rounded">
                    <h2 class="text-lg font-bold">${product.name}</h2>
                    <p class="text-gray-600">💰 ราคา: ${product.price} บาท</p>
                    <p class="text-gray-600">📦 คงเหลือ: ${product.stock} ชิ้น</p>
                    
                    <button onclick="editProduct(${product.id}, '${product.name}', ${product.price}, ${product.stock}, '${product.image}')" 
                            class="btn btn-warning mt-3">
                        <i class="fas fa-edit"></i> แก้ไข
                    </button>

                    <button onclick="deleteProduct(${product.id})" class="btn btn-error mt-3">
                        <i class="fas fa-trash"></i> ลบ
                    </button>
                </div>
            `;
        });

        document.getElementById("productList").innerHTML = html;
        document.getElementById("pageInfo").textContent = `หน้า ${page}`;
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

document.getElementById("addProductForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const image = document.getElementById("image").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, stock, image })
    });

    fetchProducts(currentPage);
    this.reset();
});
async function editProduct(id, name, price, stock, image) {
    const newName = prompt("ชื่อสินค้า:", name);
    const newPrice = prompt("ราคา:", price);
    const newStock = prompt("จำนวนคงเหลือ:", stock);
    const newImage = prompt("URL รูปภาพ:", image);

    if (newName && newPrice && newStock && newImage) {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName, price: newPrice, stock: newStock, image: newImage })
        });

        fetchProducts(currentPage);
    }
}
async function deleteProduct(id) {
    if (confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchProducts(currentPage);
    }
}
async function searchProducts() {
    const query = document.getElementById("searchBox").value.toLowerCase();
    const response = await fetch(API_URL);
    const products = await response.json();

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query)
    );

    let html = "";
    filteredProducts.forEach(product => {
        html += `
            <div class="card bg-white p-4 shadow-lg rounded-lg">
                <img src="${product.image}" class="w-full h-40 object-cover mb-3 rounded">
                <h2 class="text-lg font-bold">${product.name}</h2>
                <p class="text-gray-600">💰 ราคา: ${product.price} บาท</p>
                <p class="text-gray-600">📦 คงเหลือ: ${product.stock} ชิ้น</p>
            </div>
        `;
    });

    document.getElementById("productList").innerHTML = html;
}
function nextPage() {
    currentPage++;
    fetchProducts(currentPage);
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchProducts(currentPage);
    }
}
fetchProducts()
