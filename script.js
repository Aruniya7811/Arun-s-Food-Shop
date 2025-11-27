let cart = [];
let menuQty = {
    "Normal Dosa": 0, "Onion Dosa": 0, "Special Dosa": 0, "Podi Idli": 0,
    "Normal Idli": 0, "Mini Idli": 0, "Omelette": 0, "Bread Omelette": 0
};

function changeQtyMenu(name, delta) {
    menuQty[name] += delta;
    if (menuQty[name] < 0) menuQty[name] = 0;
    document.getElementById(`qty-${name}`).innerText = menuQty[name];
}

function addToCartFromMenu(name, price) {
    const qty = menuQty[name];
    if (qty <= 0) {
        alert("Please select quantity first (+/-)");
        return;
    }
    const existing = cart.find(i => i.name === name);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ name, price, qty });
    }
    menuQty[name] = 0;
    document.getElementById(`qty-${name}`).innerText = 0;
    renderCart();
}

function changeQty(name, delta) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById('cart-items');
    cartDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `${item.name} 
        <button onclick="changeQty('${item.name}', -1)">-</button> 
        ${item.qty} 
        <button onclick="changeQty('${item.name}', 1)">+</button> = ₹${item.price * item.qty}`;
        cartDiv.appendChild(div);
        total += item.price * item.qty;
    });
    document.getElementById('total').innerText = total;
    document.getElementById('cart-count').innerText = cart.reduce((sum, i) => sum + i.qty, 0);
}

function toggleCart() {
    document.getElementById('cart-panel').classList.toggle('open');
}

function placeOrderWhatsApp() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const type = document.getElementById('address-type').value;
    if (!name || !phone || !address || cart.length === 0) {
        alert("Fill all details & add items to cart!");
        return;
    }
    let orderText = `New Order:\nName: ${name}\nPhone: ${phone}\nAddress: ${address} (${type})\n\nItems:\n`;
    cart.forEach(item => { orderText += `${item.name} x ${item.qty} = ₹${item.price * item.qty}\n`; });
    orderText += `\nTotal: ₹${cart.reduce((sum, item) => sum + item.price * item.qty, 0)}`;
    const encoded = encodeURIComponent(orderText);
    const whatsappNumber = "919597581007";
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
    cart = []; renderCart();
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
}
