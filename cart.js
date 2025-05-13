let cart = [];
let cartCount = 0;

function addToCart(productId) {
    const productCard = document.getElementById(`product${productId}`);
    const productName = productCard.querySelector('h3').textContent;
    const productImage = productCard.querySelector('img').src;
    const quantityInput = productCard.querySelector('input[type="number"]');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    const priceText = productCard.querySelector('.discounted-price').textContent.replace('$', '').replace(',', '');
    const price = parseInt(priceText);

    if (quantity <= 0) {
        alert("Por favor, selecciona una cantidad válida.");
        return;
    }

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ id: productId, name: productName, image: productImage, quantity, price });
    }

    cartCount += quantity;
    updateCart();
    updateCartCounter();
}

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        const subtotal = item.quantity * item.price;
        total += subtotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div>
                    <span><strong>${item.name}</strong></span>
                    <span>Cantidad: ${item.quantity}</span>
                    <span>Subtotal: $${subtotal.toLocaleString()}</span>
                </div>
            </div>
            <button class="remove-button" onclick="removeFromCart(${index})">Eliminar</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    document.getElementById('cart-total').textContent = `Total: $${total.toLocaleString()}`;
}

function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    cartCounter.textContent = `Carrito: ${cartCount}`;
}

function removeFromCart(index) {
    const removedProduct = cart[index];
    cartCount -= removedProduct.quantity;
    cart.splice(index, 1);
    updateCart();
    updateCartCounter();
}

function sendCartToWhatsApp() {
    if (cart.length === 0) {
        alert("El carrito está vacío. Agrega productos antes de enviar el pedido.");
        return;
    }

    let message = "¡Hola! Quiero realizar un pedido:\n\n";
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.quantity * item.price;
        total += subtotal;
        message += `${item.name}\nCantidad: ${item.quantity}\nSubtotal: $${subtotal.toLocaleString()}\n\n`;
    });

    message += `Total: $${total.toLocaleString()}\n\n`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "+541164722908";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
}