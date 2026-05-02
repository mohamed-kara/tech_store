document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // GLOBAL STATE — localStorage Simulation
    // ==========================================
    let cart    = JSON.parse(localStorage.getItem('mexus_cart'))    || [];
    let users   = JSON.parse(localStorage.getItem('mexus_users'))   || [];
    let orders  = JSON.parse(localStorage.getItem('mexus_orders'))  || [];
    let session = JSON.parse(localStorage.getItem('mexus_session')) || null;

    // --- Seed default admin account ---
    if (!users.find(u => u.username === 'admin')) {
        users.push({ id: 1, username: 'admin', password: 'admin123', role: 'admin', blocked: false });
        localStorage.setItem('mexus_users', JSON.stringify(users));
    }

    // --- Seed default products ---
    let products = JSON.parse(localStorage.getItem('mexus_products'));
    if (!products || products.length === 0) {
        products = [
            { 
                id: 1, name: 'iPhone 15 Pro', brand: 'Apple', category: 'smartphone', price: 999, qty: 12, 
                image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
                variants: [
                    { color: 'Black Titanium', storage: '128GB', stock: 5 },
                    { color: 'Black Titanium', storage: '256GB', stock: 3 },
                    { color: 'Natural Titanium', storage: '128GB', stock: 4 }
                ],
                specs: 'A17 Pro chip, Titanium design, 48MP camera, 6.1" display.'
            },
            { 
                id: 2, name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'smartphone', price: 1299, qty: 10, 
                image: 'https://images.unsplash.com/photo-1707726695019-c97f31b3aaf1?auto=format&fit=crop&w=800&q=80',
                variants: [
                    { color: 'Titanium Black', storage: '256GB', stock: 6 },
                    { color: 'Titanium Gray', storage: '256GB', stock: 4 }
                ],
                specs: 'Snapdragon 8 Gen 3, AI features, 6.8" AMOLED, 200MP camera.'
            },
            { 
                id: 3, name: 'MacBook Pro 14"', brand: 'Apple', category: 'laptop', price: 1999, qty: 8, 
                image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
                variants: [
                    { color: 'Space Black', storage: '512GB SSD', stock: 5 },
                    { color: 'Silver', storage: '512GB SSD', stock: 3 }
                ],
                specs: 'M3 Pro chip, 18GB RAM, 14" Liquid Retina XDR display.'
            },
            { 
                id: 4, name: 'Sony PlayStation 5', brand: 'Sony', category: 'gaming', price: 499, qty: 15, 
                image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80',
                variants: [
                    { color: 'Original White', storage: '825GB SSD', stock: 10 },
                    { color: 'Midnight Black', storage: '825GB SSD', stock: 5 }
                ],
                specs: 'Ultra-high speed SSD, Ray tracing, 4K-TV gaming, HDR technology.'
            },
            { 
                id: 5, name: 'iPad Pro 12.9" (M2)', brand: 'Apple', category: 'tablet', price: 1099, qty: 7, 
                image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
                variants: [
                    { color: 'Space Gray', storage: '128GB', stock: 4 },
                    { color: 'Silver', storage: '256GB', stock: 3 }
                ],
                specs: 'M2 chip, Liquid Retina XDR display, ProRes video, Wi-Fi 6E.'
            },
            { 
                id: 6, name: 'LG UltraGear 27"', brand: 'LG', category: 'monitor', price: 399, qty: 9, 
                image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
                variants: [
                    { color: 'Black', storage: '27 inch 144Hz', stock: 6 },
                    { color: 'Black', storage: '27 inch 165Hz', stock: 3 }
                ],
                specs: 'IPS 1ms GTG, QHD resolution, NVIDIA G-SYNC compatible.'
            },
            { 
                id: 7, name: 'Logitech G Pro X Superlight', brand: 'Logitech', category: 'accessory', price: 149, qty: 20, 
                image: 'https://images.unsplash.com/photo-1615663248517-463f602ecfb7?auto=format&fit=crop&w=800&q=80',
                variants: [
                    { color: 'Black', storage: 'Standard', stock: 12 },
                    { color: 'White', storage: 'Standard', stock: 8 }
                ],
                specs: 'Under 63g, LIGHTSPEED wireless, HERO 25K sensor, Zero-additive PTFE feet.'
            }
        ];
        localStorage.setItem('mexus_products', JSON.stringify(products));
    }

    // --- Save helpers ---
    const saveCart     = () => localStorage.setItem('mexus_cart',     JSON.stringify(cart));
    const saveUsers    = () => localStorage.setItem('mexus_users',    JSON.stringify(users));
    const saveOrders   = () => localStorage.setItem('mexus_orders',   JSON.stringify(orders));
    const saveProducts = () => localStorage.setItem('mexus_products', JSON.stringify(products));
    const saveSession  = (u) => { session = u; localStorage.setItem('mexus_session', JSON.stringify(u)); };
    const clearSession = ()  => { session = null; localStorage.removeItem('mexus_session'); };

    // --- Update nav cart counter ---
    function updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) badge.textContent = cart.reduce((s, i) => s + i.quantity, 0);
    }
    updateCartBadge();

    // --- Update nav user link ---
    function updateNavUser() {
        const loginLink   = document.getElementById('nav-login');
        const profileLink = document.getElementById('nav-profile');
        const logoutLink  = document.getElementById('nav-logout');
        if (session) {
            if (loginLink)   loginLink.style.display   = 'none';
            if (profileLink) profileLink.style.display = 'inline';
            if (logoutLink)  logoutLink.style.display  = 'inline';
        } else {
            if (loginLink)   loginLink.style.display   = 'inline';
            if (profileLink) profileLink.style.display = 'none';
            if (logoutLink)  logoutLink.style.display  = 'none';
        }
    }
    updateNavUser();

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu   = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });
    }

    // --- Logout ---
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearSession();
            window.location.href = 'index.html';
        });
    }

    // --- Add to Cart helper ---
    function addToCart(id, title, price, quantity, image, variant = 'Standard') {
        const qtyToAdd = parseInt(quantity) || 1;
        const existing = cart.find(i => i.id === id && i.variant === variant);
        
        const prod = products.find(p => p.id === id);
        let stockLimit = prod ? (prod.qty ?? 0) : 0;
        
        if (prod && prod.variants && prod.variants.length > 0) {
            const vObj = prod.variants.find(v => {
                const parts = [];
                if (v.color) parts.push(v.color);
                if (v.storage) parts.push(v.storage);
                return (parts.join(' | ') || 'Standard') === variant;
            });
            if (vObj) stockLimit = vObj.stock;
        }

        const currentQty = existing ? existing.quantity : 0;
        if (currentQty + qtyToAdd > stockLimit) {
            alert(`Only ${stockLimit} items available in stock`);
            return;
        }

        if (existing) {
            existing.quantity += qtyToAdd;
        } else {
            cart.push({ id, title, price, quantity: qtyToAdd, image, variant });
        }
        saveCart();
        updateCartBadge();
        showToast(`${qtyToAdd}× ${title} added to cart!`);
    }

    // --- Toast notification ---
    function showToast(msg) {
        let t = document.getElementById('mexus-toast');
        if (!t) {
            t = document.createElement('div');
            t.id = 'mexus-toast';
            Object.assign(t.style, {
                position:'fixed', bottom:'30px', right:'30px', background:'#00B8D9',
                color:'#fff', padding:'14px 24px', borderRadius:'8px', fontWeight:'600',
                zIndex:'9999', fontSize:'0.95rem', boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
                transition:'opacity 0.4s', opacity:'0'
            });
            document.body.appendChild(t);
        }
        t.textContent = msg;
        t.style.opacity = '1';
        clearTimeout(t._timer);
        t._timer = setTimeout(() => { t.style.opacity = '0'; }, 3000);
    }

    // ==========================================
    // PAGE: LOGIN (login.html)
    // ==========================================
    const loginPage = document.querySelector('.login-page');
    if (loginPage) {
        // redirect if already logged in
        if (session) {
            window.location.href = session.role === 'admin' ? 'dashboard.html' : 'index.html';
            return;
        }

        const tabLogin  = document.getElementById('tab-login');
        const tabSignup = document.getElementById('tab-signup');
        const formLogin = document.getElementById('form-login');
        const formSignup = document.getElementById('form-signup');

        // Set initial active class
        if (tabLogin) tabLogin.classList.add('active');

        if (tabLogin && tabSignup) {
            tabLogin.addEventListener('click', () => {
                tabLogin.classList.add('active');
                tabSignup.classList.remove('active');
                formLogin.style.display = 'flex';
                formSignup.style.display = 'none';
            });
            tabSignup.addEventListener('click', () => {
                tabSignup.classList.add('active');
                tabLogin.classList.remove('active');
                formSignup.style.display = 'flex';
                formLogin.style.display = 'none';
            });
        }

        // Login submit
        const loginBtn = document.getElementById('login-submit');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                const u = document.getElementById('login-username').value.trim();
                const p = document.getElementById('login-password').value;
                const r = document.getElementById('login-role') ? document.getElementById('login-role').value : null;

                if (!u || !p) { showError('login-error', 'Please enter username and password.'); return; }
                
                const found = users.find(usr => usr.username === u && usr.password === p);
                
                if (!found) { 
                    showError('login-error', 'Invalid credentials.'); 
                    return; 
                }

                // If user is just a client, but tries to log in as admin, block them.
                // (If an admin tries to log in as client, we skip this check and allow it).
                if (found.role === 'client' && r === 'admin') {
                    showError('login-error', `Access Denied. You do not have Administrator privileges.`);
                    return;
                }

                if (found.blocked) { showError('login-error', 'This account has been blocked.'); return; }
                
                saveSession(found);
                
                // Route them based on the dropdown they selected, not just their root account type
                window.location.href = r === 'admin' ? 'dashboard.html' : 'index.html';
            });
        }

        // Signup submit
        const signupBtn = document.getElementById('signup-submit');
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                signupBtn.classList.add('btn-active');
                setTimeout(() => signupBtn.classList.remove('btn-active'), 500);

                const u = document.getElementById('signup-username').value.trim();
                const p = document.getElementById('signup-password').value;
                const e = document.getElementById('signup-email').value.trim();

                if (!u || !p || !e) { showError('signup-error', 'Please fill all fields.'); return; }
                
                const beforeAt = e.split('@')[0];
                if (!e.endsWith('@gmail.com') || !/[a-zA-Z]/.test(beforeAt) || !/[0-9]/.test(beforeAt)) {
                    showError('signup-error', 'Email must be a Gmail and contain letters & numbers.');
                    return;
                }
                
                if (p.length < 4) {
                    showError('signup-error', 'Password must be at least 4 characters.');
                    return;
                }

                if (users.find(usr => usr.username === u)) { showError('signup-error', 'Username taken.'); return; }
                const newUser = { id: Date.now(), username: u, password: p, email: e, role: 'client', blocked: false };
                users.push(newUser);
                saveUsers();
                saveSession(newUser);
                window.location.href = 'index.html';
            });
        }

        function showError(elId, msg) {
            const el = document.getElementById(elId);
            if (el) { el.textContent = msg; el.style.display = 'block'; }
        }
    }

    // ==========================================
    // PAGE: HOME (index.html)
    // ==========================================
    const shopSection = document.getElementById('shop');
    if (shopSection) {
        const grid         = document.getElementById('products-grid');
        const sortSelect   = document.getElementById('sort-select');
        const priceSlider  = document.querySelector('.price-slider');
        const priceLabel   = document.querySelector('.price-label');
        const applyBtn     = document.getElementById('apply-filters');
        const searchInput  = document.getElementById('search-input');
        const brandFilterSelect = document.getElementById('brand-filter');
        const categoryFilterSelect = document.getElementById('category-filter');

        function renderBrands() {
            if (!brandFilterSelect) return;
            const uniqueBrands = [...new Set(products.map(p => p.brand).filter(b => b))].sort();
            brandFilterSelect.innerHTML = '<option value="">All Brands</option>';
            uniqueBrands.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b;
                opt.textContent = b;
                brandFilterSelect.appendChild(opt);
            });
        }
        renderBrands();

        if (brandFilterSelect) {
            brandFilterSelect.addEventListener('change', () => {
                renderProducts(getFilteredProducts());
            });
        }
        if (categoryFilterSelect) {
            categoryFilterSelect.addEventListener('change', () => {
                renderProducts(getFilteredProducts());
            });
        }

        function renderProducts(list) {
            if (!grid) return;
            grid.innerHTML = '';
            if (list.length === 0) {
                grid.innerHTML = '<p style="padding:20px;grid-column:1/-1;">No products match your filters.</p>';
                return;
            }

            // Apply Sorting
            const sortVal = sortSelect ? sortSelect.value : 'newest';
            const sortedList = [...list];
            if (sortVal === 'price-asc') {
                sortedList.sort((a, b) => a.price - b.price);
            } else if (sortVal === 'price-desc') {
                sortedList.sort((a, b) => b.price - a.price);
            } else if (sortVal === 'newest') {
                sortedList.reverse();
            }

            sortedList.forEach(p => {
                let totalStock = p.qty ?? 0;
                if (p.variants && p.variants.length > 0) {
                    totalStock = p.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0);
                }

                grid.innerHTML += `
                <div class="product-card" data-id="${p.id}">
                    <a href="product.html?id=${p.id}">
                        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/500x300?text=No+Image'">
                    </a>
                    <div class="product-info">
                        <h3>${p.name}</h3>
                        <p class="price">$${p.price.toFixed(2)}</p>
                        <p style="font-size:0.85rem;color:var(--text-light);margin-bottom:8px;">${p.brand} · ${capitalize(p.category)}</p>
                        <button class="btn btn-block quick-add" data-id="${p.id}" ${totalStock <= 0 ? 'disabled style="background:#ccc;"' : ''}>
                            ${totalStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>`;
            });

            grid.querySelectorAll('.quick-add').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.disabled) return;
                    const pid = parseInt(btn.dataset.id);
                    const prod = products.find(x => x.id === pid);
                    
                    if (prod) {
                        let stock = prod.qty ?? 0;
                        if (prod.variants && prod.variants.length > 0) {
                            stock = prod.variants.reduce((acc, v) => acc + (v.stock ?? 0), 0);
                        }

                        if (stock <= 0) {
                            showToast('Out of Stock!');
                            return;
                        }

                        // Simply Add generic for index quick add.
                        const activeVariant = prod.variants && prod.variants.length > 0 ? (prod.variants[0].color + ' | ' + prod.variants[0].storage) : 'Standard';
                        addToCart(prod.id, prod.name, prod.price, 1, prod.image, activeVariant);
                    }
                });
            });
        }

        function getFilteredProducts() {
            const maxPrice = priceSlider ? parseFloat(priceSlider.value) : 99999;
            const activeCategory = categoryFilterSelect ? categoryFilterSelect.value : '';
            const activeBrand = brandFilterSelect ? brandFilterSelect.value : '';

            const searchVal = searchInput ? searchInput.value.toLowerCase() : '';

            return products.filter(p => {
                const priceOk    = p.price <= maxPrice;
                const categoryOk = !activeCategory || p.category === activeCategory;
                const brandOk    = !activeBrand || p.brand === activeBrand;
                const searchOk   = !searchVal || p.name.toLowerCase().includes(searchVal);
                return priceOk && categoryOk && brandOk && searchOk;
            });
        }

        renderProducts(products);

        if (priceSlider && priceLabel) {
            priceSlider.addEventListener('input', () => {
                priceLabel.textContent = `Up to $${priceSlider.value}`;
            });
        }

        if (applyBtn) {
            applyBtn.addEventListener('click', () => renderProducts(getFilteredProducts()));
        }
        if (searchInput) {
            searchInput.addEventListener('input', () => renderProducts(getFilteredProducts()));
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', () => renderProducts(getFilteredProducts()));
        }
    }

    // ==========================================
    // PAGE: PRODUCT DETAIL (product.html)
    // ==========================================
    const productPage = document.querySelector('.product-page');
    if (productPage) {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));
        const prod = products.find(p => p.id === productId);

        if (!prod) {
            productPage.innerHTML = '<p style="padding:60px;text-align:center;">Product not found. <a href="index.html">Go back</a></p>';
        } else {
            document.title = prod.name + ' - Mexus Tech';
            document.querySelector('.product-title').textContent = prod.name;
            document.querySelector('.product-price-large').textContent = `$${prod.price.toFixed(2)}`;

            // Description
            const descEl = document.getElementById('dynamic-desc');
            if (descEl) descEl.textContent = prod.description || '';

            // Specs
            const specsList = document.getElementById('dynamic-specs-list');
            if (specsList) {
                specsList.innerHTML = '';
                if (prod.specs) {
                    const specsArr = prod.specs.split(/,|\n/).filter(s => s.trim());
                    specsArr.forEach(spec => {
                        specsList.innerHTML += `<li>${spec.trim()}</li>`;
                    });
                }
            }

            // Initial Stock & Dynamic Update Function (Matrix-Based)
            const availabilityEl = document.querySelector('.product-availability');
            const qtyInput       = document.querySelector('.quantity-input');
            
            function updateDynamicStock() {
                const activeColorBtn   = document.querySelector('#color-options-container .option-btn.active');
                const activeStorageBtn = document.querySelector('#storage-options-container .option-btn.active');
                const addBtn           = document.querySelector('.purchase-action .btn');

                let selColor = null;
                let selStorage = null;
                
                const hasColors = prod.variants && prod.variants.some(v => v.color);
                const hasStorages = prod.variants && prod.variants.some(v => v.storage);

                if (hasColors && !activeColorBtn) {
                    if (availabilityEl) availabilityEl.innerHTML = `Status: <span style="color:var(--text-light);">Select color</span>`;
                    if (addBtn) { addBtn.disabled = true; addBtn.textContent = 'Select Options'; addBtn.style.background = '#ccc'; }
                    return;
                }
                if (hasSto>>
                    rages && !activeStorageBtn) {
                    if (availabilityEl) availabilityEl.innerHTML = `Status: <span style="color:var(--text-light);">Select storage</span>`;
                    if (addBtn) { addBtn.disabled = true; addBtn.textContent = 'Select Options'; addBtn.style.background = '#ccc'; }
                    return;
                }

                if (activeColorBtn) selColor = activeColorBtn.textContent;
                if (activeStorageBtn) selStorage = activeStorageBtn.textContent;

                let stock = 0;
                
                if (prod.variants && prod.variants.length > 0) {
                    const variant = prod.variants.find(v => {
                        const cMatch = hasColors ? v.color === selColor : true;
                        const sMatch = hasStorages ? v.storage === selStorage : true;
                        return cMatch && sMatch;
                    });
                    
                    if (variant) stock = variant.stock || 0;
                    else stock = -1; // Not available combination
                } else {
                    stock = prod.qty || 0;
                }

                if (stock === -1) {
                    if (availabilityEl) availabilityEl.innerHTML = `Status: <span style="color:red;">Not Available</span>`;
                    if (addBtn) { addBtn.disabled = true; addBtn.textContent = 'Not Available'; addBtn.style.background = '#ccc'; }
                } else {
                    if (availabilityEl) {
                        availabilityEl.innerHTML = stock > 0
                            ? `Status: <span class="in-stock">In Stock (${stock} available)</span>`
                            : `Status: <span style="color:red;font-weight:700;">Out of Stock</span>`;
                    }

                    if (addBtn) {
                        if (stock <= 0) {
                            addBtn.disabled = true;
                            addBtn.textContent = 'Out of Stock';
                            addBtn.style.background = '#ccc';
                        } else {
                            addBtn.disabled = false;
                            addBtn.textContent = 'Add to Cart';
                            addBtn.style.background = '';
                        }
                    }
                    if (qtyInput) {
                        qtyInput.max = stock;
                        if (parseInt(qtyInput.value) > stock) qtyInput.value = stock;
                    }
                }
            }

            // Sync unavailable combinations (Bonus)
            function syncOptionAvailability() {
                const activeColorBtn = document.querySelector('#color-options-container .option-btn.active');
                if (!activeColorBtn || !prod.variants) return;

                const hasColors = prod.variants.some(v => v.color);
                if (!hasColors) return;

                const selColor = activeColorBtn.textContent;
                const storageBtns = document.querySelectorAll('#storage-options-container .option-btn');
                
                storageBtns.forEach(btn => {
                    const storName = btn.textContent;
                    // Check if this storage exists for this color with stock > 0
                    const exists = prod.variants.some(v => v.color === selColor && v.storage === storName && v.stock > 0);
                    
                    if (!exists) {
                        btn.style.opacity = '0.4';
                        btn.title = 'Not available in this color';
                    } else {
                        btn.style.opacity = '1';
                        btn.title = '';
                    }
                });
            }

            const breadcrumb = document.querySelector('.breadcrumb');
            if (breadcrumb) breadcrumb.innerHTML = `<a href="index.html">Home</a> / <a href="index.html#shop">Shop</a> / <span>${prod.name}</span>`;

            // Main Image
            const mainImg = document.querySelector('.main-image img');
            if (mainImg) {
                mainImg.src = prod.image;
                mainImg.alt = prod.name;
            }

            // Thumbnails
            const dynamicThumbs = document.getElementById('dynamic-thumbnails');
            if (dynamicThumbs) {
                dynamicThumbs.innerHTML = '';
                const imagesToRender = (prod.variants && prod.variants.length > 0) 
                    ? [...new Set(prod.variants.map(v => v.image))] // Unique images
                    : [prod.image];

                imagesToRender.forEach((imgSrc, idx) => {
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = 'Angle ' + (idx + 1);
                    if (idx === 0) img.className = 'active-thumb';
                    
                    img.addEventListener('click', function () {
                        dynamicThumbs.querySelectorAll('img').forEach(t => t.classList.remove('active-thumb'));
                        this.classList.add('active-thumb');
                        if (mainImg) mainImg.src = this.src;

                        // Sync color buttons if this image belongs to a color
                        const colorBtns = document.querySelectorAll('#color-options-container .option-btn');
                        colorBtns.forEach(btn => {
                            if (btn.dataset.img === this.src) {
                                colorBtns.forEach(s => s.classList.remove('active'));
                                btn.classList.add('active');
                                syncOptionAvailability();
                                updateDynamicStock();
                            }
                        });
                    });
                    dynamicThumbs.appendChild(img);
                });
            }

            // Render Unique Colors
            const colorGroup = document.getElementById('color-selection-group');
            const colorContainer = document.getElementById('color-options-container');
            if (colorGroup && colorContainer && prod.variants && prod.variants.length > 0) {
                const uniqueColors = [...new Set(prod.variants.map(v => v.color).filter(c => c))];
                
                if (uniqueColors.length > 0) {
                    colorGroup.style.display = 'block';
                    colorContainer.innerHTML = '';
                    uniqueColors.forEach((col, idx) => {
                        const img = prod.variants.find(v => v.color === col)?.image || prod.image;
                        colorContainer.innerHTML += `<button class="option-btn ${idx===0 ? 'active':''}" data-img="${img}">${col}</button>`;
                    });

                    if (mainImg && prod.variants[0]?.image) { mainImg.src = prod.variants[0].image; }

                    colorContainer.querySelectorAll('.option-btn').forEach(btn => {
                        btn.addEventListener('click', function () {
                            colorContainer.querySelectorAll('.option-btn').forEach(s => s.classList.remove('active'));
                            this.classList.add('active');
                            
                            if (mainImg && this.dataset.img) {
                                mainImg.src = this.dataset.img;
                                if (dynamicThumbs) {
                                    dynamicThumbs.querySelectorAll('img').forEach(t => {
                                        t.classList.remove('active-thumb');
                                        if (t.src === this.dataset.img) t.classList.add('active-thumb');
                                    });
                                }
                            }
                            syncOptionAvailability();
                            updateDynamicStock();
                        });
                    });
                } else {
                    colorGroup.style.display = 'none';
                }
            } else if (colorGroup) {
                colorGroup.style.display = 'none';
            }

            // Render Unique Storages
            const storageGroup = document.getElementById('storage-selection-group');
            const storageContainer = document.getElementById('storage-options-container');
            if (storageGroup && storageContainer && prod.variants && prod.variants.length > 0) {
                const uniqueStorages = [...new Set(prod.variants.map(v => v.storage).filter(s => s))];
                
                if (uniqueStorages.length > 0) {
                    storageGroup.style.display = 'block';
                    storageContainer.innerHTML = '';
                    uniqueStorages.forEach((stor, idx) => {
                        storageContainer.innerHTML += `<button class="option-btn ${idx===0 ? 'active':''}">${stor}</button>`;
                    });

                    storageContainer.querySelectorAll('.option-btn').forEach(btn => {
                        btn.addEventListener('click', function () {
                            storageContainer.querySelectorAll('.option-btn').forEach(s => s.classList.remove('active'));
                            this.classList.add('active');
                            updateDynamicStock();
                        });
                    });
                } else {
                    storageGroup.style.display = 'none';
                }
            } else if (storageGroup) {
                storageGroup.style.display = 'none';
            }
            
            // Initial call
            syncOptionAvailability();
            updateDynamicStock();

            // Add to cart
            const addBtn  = document.querySelector('.purchase-action .btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => {
                    let qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
                    
                    const activeColor = document.querySelector('#color-options-container .option-btn.active');
                    const activeStorage = document.querySelector('#storage-options-container .option-btn.active');
                    
                    const hasColors = prod.variants && prod.variants.some(v => v.color);
                    const hasStorages = prod.variants && prod.variants.some(v => v.storage);

                    const parts = [];
                    if (activeColor && hasColors) parts.push(activeColor.textContent);
                    if (activeStorage && hasStorages) parts.push(activeStorage.textContent);
                    const variant = parts.join(' | ') || 'Standard';

                    let stock = prod.qty || 0;
                    if (prod.variants && prod.variants.length > 0) {
                        const vObj = prod.variants.find(v => {
                            const cMatch = hasColors && activeColor ? v.color === activeColor.textContent : true;
                            const sMatch = hasStorages && activeStorage ? v.storage === activeStorage.textContent : true;
                            return cMatch && sMatch;
                        });
                        stock = vObj ? vObj.stock : 0;
                    }
                    
                    if (qty > stock) {
                        showToast(`Only ${stock} items available!`);
                        if (qtyInput) qtyInput.value = stock;
                        return;
                    }
                    
                    const existingInCart = cart.find(i => i.id === prod.id && i.variant === variant);
                    const currentCartQty = existingInCart ? existingInCart.quantity : 0;
                    
                    if (currentCartQty + qty > stock) {
                        showToast(`You already have ${currentCartQty} in cart. Max stock is ${stock}.`);
                        return;
                    }

                    addToCart(prod.id, prod.name, prod.price, qty, prod.image, variant);
                });
            }
        }
    }

    // ==========================================
    // PAGE: CART (cart.html)
    // ==========================================
    const cartContainer = document.querySelector('.cart-items-container');
    if (cartContainer) {

        function renderCart() {
            cartContainer.innerHTML = '';
            if (cart.length === 0) {
                cartContainer.innerHTML = `<div style="padding:40px;text-align:center;">
                    <p style="font-size:1.2rem;color:var(--text-light);">Your cart is empty.</p>
                    <a href="index.html#shop" class="btn" style="margin-top:20px;">Browse Products</a>
                </div>`;
                updateCartTotals();
                return;
            }
            cart.forEach((item, index) => {
                cartContainer.innerHTML += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.image}" alt="${item.title}" onerror="this.src='https://placehold.co/100x100?text=?'">
                    <div class="cart-item-info">
                        <h3>${item.title}</h3>
                        <p class="cart-item-variant">${item.variant}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <input type="number" value="${item.quantity}" min="1" class="qty-input">
                    </div>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <button class="remove-btn" title="Remove">✕</button>
                </div>`;
            });
            attachCartListeners();
            updateCartTotals();
            updateCartBadge();
        }

        function updateCartTotals() {
            const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
            const tax      = subtotal * 0.08;
            const total    = subtotal + tax;
            const rows = document.querySelectorAll('.summary-row span:nth-child(2)');
            if (rows[0]) rows[0].textContent = `$${subtotal.toFixed(2)}`;
            if (rows[2]) rows[2].textContent = `$${tax.toFixed(2)}`;
            const totalEl = document.querySelector('.summary-total span:nth-child(2)');
            if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
        }

        function attachCartListeners() {
            document.querySelectorAll('.qty-input').forEach(input => {
                input.addEventListener('change', e => {
                    const idx = parseInt(e.target.closest('.cart-item').dataset.index);
                    const item = cart[idx];
                    const prod = products.find(p => p.id === item.id);
                    let stock = 0;
                    
                    if (prod) {
                        if (prod.variants && prod.variants.length > 0) {
                            const vObj = prod.variants.find(v => {
                                const parts = [];
                                if (v.color) parts.push(v.color);
                                if (v.storage) parts.push(v.storage);
                                return (parts.join(' | ') || 'Standard') === item.variant;
                            });
                            if (vObj) stock = vObj.stock;
                        } else {
                            stock = prod.qty || 0;
                        }
                    }

                    let newQty = parseInt(e.target.value);
                    if (newQty < 1) newQty = 1;

                    if (stock !== undefined && newQty > stock) {
                        showToast(`Only ${stock} items left in stock for ${item.title}`);
                        newQty = stock;
                    }
                    
                    e.target.value = newQty;
                    cart[idx].quantity = newQty;
                    saveCart();
                    updateCartBadge();
                    updateCartTotals(); // Refresh tax/total and summary amounts
                });
            });
            document.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', e => {
                    const idx = parseInt(e.target.closest('.cart-item').dataset.index);
                    cart.splice(idx, 1);
                    saveCart();
                    renderCart();
                });
            });
        }

        renderCart();
    }

    // ==========================================
    // PAGE: CHECKOUT (checkout.html)
    // ==========================================
    const checkoutForms = document.querySelector('.checkout-forms');
    if (checkoutForms) {

        // Populate order summary dynamically
        const checkoutItemsEl = document.getElementById('checkout-items');
        if (checkoutItemsEl) {
            checkoutItemsEl.innerHTML = '';
            cart.forEach(item => {
                checkoutItemsEl.innerHTML += `
                <div class="checkout-mini-item">
                    <span>${item.quantity}× ${item.title}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>`;
            });
            const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
            const tax = subtotal * 0.08;
            const rows = document.querySelectorAll('.summary-row span:nth-child(2)');
            if (rows[0]) rows[0].textContent = `$${subtotal.toFixed(2)}`;
            if (rows[2]) rows[2].textContent = `$${tax.toFixed(2)}`;
            const totalEl = document.querySelector('.summary-total span:nth-child(2)');
            if (totalEl) totalEl.textContent = `$${(subtotal + tax).toFixed(2)}`;
        }

        // Payment method toggle
        const paySelects = document.querySelectorAll('input[name="payment"]');
        const cardFields = document.getElementById('card-fields');
        const cardInputs = cardFields ? cardFields.querySelectorAll('input') : [];
        
        paySelects.forEach(radio => {
            radio.addEventListener('change', () => {
                if (cardFields) {
                    if (radio.value === 'card') {
                        cardFields.style.display = 'block';
                        cardInputs.forEach(inp => inp.setAttribute('required', 'required'));
                    } else {
                        cardFields.style.display = 'none';
                        cardInputs.forEach(inp => {
                            inp.removeAttribute('required');
                            inp.style.border = ''; // clear error borders
                        });
                    }
                }
            });
        });

        const placeOrderBtn = document.querySelector('.order-summary-box .btn-block');
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener('click', () => {
                if (cart.length === 0) {
                    alert('Your cart is empty!');
                    window.location.href = 'index.html';
                    return;
                }

                for (let item of cart) {
                    const prod = products.find(p => p.id === item.id);
                    if (!prod) { alert(`Product ${item.title} no longer exists.`); return; }
                    let stock = 0;
                    if (prod.variants && prod.variants.length > 0) {
                        const vObj = prod.variants.find(v => {
                            const parts = [];
                            if (v.color) parts.push(v.color);
                            if (v.storage) parts.push(v.storage);
                            return (parts.join(' | ') || 'Standard') === item.variant;
                        });
                        if (vObj) stock = vObj.stock;
                    } else {
                        stock = prod.qty || 0;
                    }
                    if (item.quantity > stock) {
                        alert(`Only ${stock} items left in stock for ${item.title} (${item.variant}).`);
                        return;
                    }
                }

                const required = checkoutForms.querySelectorAll('input[required]');
                let valid = true;
                required.forEach(input => {
                    if (!input.value.trim()) {
                        valid = false;
                        input.style.border = '2px solid #ef4444';
                    } else {
                        input.style.border = '';
                    }
                });
                if (!valid) { alert('Please fill all required fields for your selected payment method.'); return; }

                const firstName = document.getElementById('first-name')?.value || 'Guest';
                const lastName  = document.getElementById('last-name')?.value  || '';
                const email     = document.getElementById('email-address')?.value || '';
                const payMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';

                const order = {
                    id: 'ORD-' + Date.now(),
                    customer: `${firstName} ${lastName}`.trim(),
                    accountName: session ? session.username : 'Guest',
                    email,
                    payMethod,
                    items: [...cart],
                    total: +(cart.reduce((s, i) => s + i.price * i.quantity, 0) * 1.08).toFixed(2),
                    status: 'In Progress',
                    date: new Date().toLocaleDateString()
                };
                orders.push(order);
                saveOrders();

                // Deduct stock
                cart.forEach(item => {
                    const prod = products.find(p => p.id === item.id);
                    if (prod) {
                        if (prod.variants && prod.variants.length > 0) {
                            const vObj = prod.variants.find(v => {
                                const parts = [];
                                if (v.color) parts.push(v.color);
                                if (v.storage) parts.push(v.storage);
                                return (parts.join(' | ') || 'Standard') === item.variant;
                            });
                            if (vObj) vObj.stock -= item.quantity;
                        }
                        
                        prod.qty -= item.quantity;
                        if (prod.qty < 0) prod.qty = 0;
                    }
                });
                saveProducts();
                cart = [];
                saveCart();
                updateCartBadge();
                window.location.href = 'order-confirm.html?id=' + order.id;
            });
        }

        const requiredInputs = checkoutForms.querySelectorAll('input[required]');
        requiredInputs.forEach(input => {
            input.addEventListener('input', () => { if (input.value.trim()) input.style.border = ''; });
        });
    }

    // ==========================================
    // PAGE: ORDER CONFIRM (order-confirm.html)
    // ==========================================
    const confirmPage = document.getElementById('confirm-page');
    if (confirmPage) {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('id');
        const order = orders.find(o => o.id === orderId);
        if (order) {
            document.getElementById('confirm-id').textContent        = order.id;
            document.getElementById('confirm-customer').textContent  = order.customer;
            document.getElementById('confirm-total').textContent     = `$${order.total}`;
            document.getElementById('confirm-payment').textContent   = order.payMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card';
            const itemsList = document.getElementById('confirm-items');
            order.items.forEach(i => {
                itemsList.innerHTML += `<li>${i.quantity}× ${i.title} — $${(i.price * i.quantity).toFixed(2)}</li>`;
            });
        }
    }

    // ==========================================
    // PAGE: PROFILE (profile.html)
    // ==========================================
    const profilePage = document.getElementById('profile-page');
    if (profilePage) {
        if (!session) { window.location.href = 'login.html'; return; }
        document.getElementById('profile-username').textContent = session.username;
        document.getElementById('profile-email').textContent    = session.email || 'N/A';
        document.getElementById('profile-role').textContent     = capitalize(session.role);

        // Pre-fill edit fields
        const editUsername = document.getElementById('edit-username');
        const editEmail   = document.getElementById('edit-email');
        const editPass    = document.getElementById('edit-password');
        const editPassC   = document.getElementById('edit-password-confirm');
        const profileMsg  = document.getElementById('profile-msg');
        if (editUsername) editUsername.value = session.username;
        if (editEmail)   editEmail.value   = session.email || '';

        function showProfileMsg(msg, success) {
            if (!profileMsg) return;
            profileMsg.textContent = msg;
            profileMsg.style.display = 'block';
            profileMsg.style.background = success ? '#d1fae5' : '#fee2e2';
            profileMsg.style.color = success ? '#065f46' : '#991b1b';
            setTimeout(() => { profileMsg.style.display = 'none'; }, 4000);
        }

        const saveBtn = document.getElementById('save-profile-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const newUsername = editUsername.value.trim();
                const newEmail   = editEmail.value.trim();
                const newPass    = editPass.value;
                const newPassC   = editPassC.value;

                if (!newUsername || !newEmail) {
                    showProfileMsg('Username and Email are required.', false);
                    return;
                }

                // Check username uniqueness (exclude self)
                const taken = users.find(u => u.username === newUsername && u.id !== session.id);
                if (taken) {
                    showProfileMsg('That username is already taken.', false);
                    return;
                }

                // Password validation
                if (newPass) {
                    if (newPass.length < 4) {
                        showProfileMsg('Password must be at least 4 characters.', false);
                        return;
                    }
                    if (newPass !== newPassC) {
                        showProfileMsg('Passwords do not match.', false);
                        return;
                    }
                }

                // Apply changes
                const userIdx = users.findIndex(u => u.id === session.id);
                if (userIdx > -1) {
                    users[userIdx].username = newUsername;
                    users[userIdx].email    = newEmail;
                    if (newPass) users[userIdx].password = newPass;
                    saveUsers();

                    // Update session
                    session.username = newUsername;
                    session.email    = newEmail;
                    if (newPass) session.password = newPass;
                    saveSession(session);

                    // Update display
                    document.getElementById('profile-username').textContent = newUsername;
                    document.getElementById('profile-email').textContent    = newEmail;
                    editPass.value = '';
                    editPassC.value = '';
                    showProfileMsg('Profile updated successfully!', true);
                }
            });
        }

        // Order History
        const userOrders = orders.filter(o => o.accountName === session.username || o.email === session.email);
        const ordersList = document.getElementById('profile-orders');
        if (ordersList) {
            if (userOrders.length === 0) {
                ordersList.innerHTML = '<p style="color:var(--text-light); padding:10px 0;">You have no orders yet. <a href="index.html#shop" style="color:var(--primary);">Start shopping!</a></p>';
            } else {
                [...userOrders].reverse().forEach(o => {
                    const statusColor = o.status === 'Delivered' ? '#10b981' : o.status === 'Cancelled' ? '#ef4444' : '#f59e0b';
                    ordersList.innerHTML += `
                    <div style="background:var(--bg); padding:20px; border-radius:10px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                        <div>
                            <strong style="color:var(--primary);">${o.id}</strong>
                            <span style="color:var(--text-light); margin-left:10px;">${o.date}</span>
                        </div>
                        <div>
                            <span style="background:${statusColor}; color:#fff; padding:4px 12px; border-radius:20px; font-size:0.85rem; font-weight:600;">${o.status}</span>
                        </div>
                        <div>
                            <strong>$${o.total}</strong>
                            <span style="color:var(--text-light); margin-left:5px;">(${o.items ? o.items.length : 0} items)</span>
                        </div>
                    </div>`;
                });
            }
        }
    }

    // ==========================================
    // ADMIN — Guard: Admin-only pages
    // ==========================================
    const adminLayout = document.querySelector('.admin-layout');
    if (adminLayout) {
        if (!session || session.role !== 'admin') {
            alert('Access denied. Please login as admin.');
            window.location.href = 'login.html';
            return;
        }
        const logoutAdminBtn = document.getElementById('admin-logout');
        if (logoutAdminBtn) {
            logoutAdminBtn.addEventListener('click', e => {
                e.preventDefault();
                clearSession();
                window.location.href = 'login.html';
            });
        }
    }

    // ==========================================
    // ADMIN PAGE: DASHBOARD (dashboard.html)
    // ==========================================
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage) {
        products = JSON.parse(localStorage.getItem('mexus_products')) || [];
        document.getElementById('stat-products').textContent = products.length;
        document.getElementById('stat-orders').textContent   = orders.length;
        document.getElementById('stat-users').textContent    = users.filter(u => u.role === 'client').length;
        document.getElementById('stat-revenue').textContent  = '$' + orders.reduce((s, o) => s + o.total, 0).toFixed(2);

        // Recent orders table
        const recentOrdersTbody = document.getElementById('recent-orders-body');
        if (recentOrdersTbody) {
            const recent = [...orders].reverse().slice(0, 5);
            if (recent.length === 0) {
                recentOrdersTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:20px;color:var(--text-light);">No orders yet.</td></tr>';
            } else {
                recent.forEach(o => {
                    recentOrdersTbody.innerHTML += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.customer}</td>
                        <td><span class="status ${o.status === 'Delivered' ? 'delivered' : 'in-progress'}">${o.status}</span></td>
                        <td>$${o.total}</td>
                    </tr>`;
                });
            }
        }

        // Search
        const dashSearch = document.getElementById('dash-search');
        if (dashSearch) {
            dashSearch.addEventListener('input', () => {
                const q = dashSearch.value.toLowerCase();
                const rows = recentOrdersTbody ? recentOrdersTbody.querySelectorAll('tr') : [];
                rows.forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });
        }
    }

    // ==========================================
    // ADMIN PAGE: PRODUCT MANAGEMENT (products.html)
    // ==========================================
    const adminProductsPage = document.getElementById('admin-products-page');
    if (adminProductsPage) {
        const nameIn    = document.getElementById('prod-name');
        const brandIn   = document.getElementById('prod-brand');
        const priceIn   = document.getElementById('prod-price');
        const catIn     = document.getElementById('prod-category');
        const descIn    = document.getElementById('prod-desc');
        const specsIn   = document.getElementById('prod-specs');
        const addBtn    = document.getElementById('prod-add-btn');
        const tbody     = document.getElementById('products-tbody');
        const editIdEl  = document.getElementById('edit-product-id');
        const formTitle = document.getElementById('prod-form-title');
        const cancelEdit = document.getElementById('cancel-edit');

        function computeTotalQty(p) {
            if (p.variants && p.variants.length > 0) {
                return p.variants.reduce((s, v) => s + (parseInt(v.stock) ?? 0), 0);
            }
            return p.qty ?? 0;
        }

        function renderAdminProducts() {
            products = JSON.parse(localStorage.getItem('mexus_products')) || [];
            tbody.innerHTML = '';
            if (products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;">No products.</td></tr>';
                return;
            }
            products.forEach(p => {
                const totalStock = computeTotalQty(p);
                tbody.innerHTML += `
                <tr>
                    <td><img src="${p.image}" style="width:50px;height:40px;object-fit:cover;border-radius:4px;" onerror="this.src='https://placehold.co/50x40?text=?'"></td>
                    <td>${p.name}</td>
                    <td>${p.brand}</td>
                    <td>$${p.price}</td>
                    <td>${capitalize(p.category)}</td>
                    <td>${totalStock}</td>
                    <td>
                        <button class="btn edit-prod-btn" data-id="${p.id}" style="padding:6px 12px;font-size:0.85rem;">Edit</button>
                        <button class="btn btn-danger del-prod-btn" data-id="${p.id}" style="padding:6px 12px;font-size:0.85rem;margin-left:5px;">Delete</button>
                    </td>
                </tr>`;
            });
            tbody.querySelectorAll('.del-prod-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!confirm('Delete this product?')) return;
                    const pid = parseInt(btn.dataset.id);
                    products = products.filter(p => p.id !== pid);
                    saveProducts();
                    renderAdminProducts();
                });
            });
            tbody.querySelectorAll('.edit-prod-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const pid = parseInt(btn.dataset.id);
                    const p = products.find(pr => pr.id === pid);
                    if (!p) return;
                    nameIn.value  = p.name;
                    brandIn.value = p.brand;
                    priceIn.value = p.price;
                    catIn.value   = p.category;
                    descIn.value  = p.description || '';
                    specsIn.value = p.specs || '';

                    const varContainer = document.getElementById('variants-container');
                    if (varContainer) {
                        varContainer.innerHTML = '';
                        if (p.variants && p.variants.length > 0) {
                            p.variants.forEach(v => varContainer.appendChild(createVariantRow(v.color, v.storage, v.image, '', v.stock || 0)));
                        } else {
                            varContainer.appendChild(createVariantRow('', '', '', '', 0));
                        }
                    }

                    editIdEl.value = p.id;
                    addBtn.textContent = 'Update Product';
                    if (formTitle) formTitle.textContent = 'Edit Product';
                    if (cancelEdit) cancelEdit.style.display = 'inline-block';
                });
            });
        }

        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => {
                nameIn.value = brandIn.value = priceIn.value = specsIn.value = descIn.value = '';
                editIdEl.value = '';
                const varContainer = document.getElementById('variants-container');
                if (varContainer) { varContainer.innerHTML = ''; varContainer.appendChild(createVariantRow('', '', '', '', 0)); }
                addBtn.textContent = 'Add Product';
                if (formTitle) formTitle.textContent = 'Add New Product';
                cancelEdit.style.display = 'none';
            });
        }

        // --- Create matrix variant row ---
        function createVariantRow(colorVal, storVal, urlVal, fileB64, qtyVal) {
            const div = document.createElement('div');
            div.className = 'variant-row';
            div.innerHTML = `
                <input type="text" class="var-color" placeholder="Color" value="${colorVal || ''}">
                <input type="text" class="var-storage" placeholder="Storage" value="${storVal || ''}">
                <input type="number" class="var-qty" placeholder="Stock" min="1" value="${qtyVal > 0 ? qtyVal : 1}">
                <input type="text" class="var-img-url" placeholder="Image URL" value="${urlVal || ''}">
                <input type="file" class="var-img-file" accept="image/*">
                <button type="button" class="btn btn-danger remove-var-btn" style="padding: 10px; font-size:1rem; height:45px;">✕</button>
            `;
            if (fileB64) div.querySelector('.var-img-file').dataset.b64 = fileB64;
            return div;
        }

        // Variant buttons
        const addVarBtn = document.getElementById('add-variant-btn');
        const variantsContainer = document.getElementById('variants-container');
        if (addVarBtn && variantsContainer) {
            addVarBtn.addEventListener('click', () => {
                variantsContainer.appendChild(createVariantRow('', '', '', '', 0));
            });
            variantsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-var-btn')) {
                    if (variantsContainer.children.length > 1) {
                        e.target.closest('.variant-row').remove();
                    }
                }
            });
            variantsContainer.addEventListener('change', (e) => {
                if (e.target.classList.contains('var-img-file')) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => { e.target.dataset.b64 = ev.target.result; };
                        reader.readAsDataURL(file);
                    }
                }
            });
        }

        // Storage rows section removed as we use matrix now

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const name  = nameIn.value.trim();
                const brand = brandIn.value.trim();
                const price = parseFloat(priceIn.value);
                const cat   = catIn.value;
                const description = descIn.value.trim();
                const specs = specsIn.value.trim();
                
                // Collect matrix variants
                const matrixVariants = [];
                let globalStock = 0;
                if (variantsContainer) {
                    variantsContainer.querySelectorAll('.variant-row').forEach(row => {
                        const col = row.querySelector('.var-color').value.trim();
                        const stor = row.querySelector('.var-storage').value.trim();
                        const stk = parseInt(row.querySelector('.var-qty').value) ?? 0;
                        const url = row.querySelector('.var-img-url').value.trim();
                        const b64 = row.querySelector('.var-img-file') && row.querySelector('.var-img-file').dataset.b64 ? row.querySelector('.var-img-file').dataset.b64 : '';
                        const finalImg = b64 || url || '';
                        
                        if (col || stor) {
                            matrixVariants.push({ 
                                color: col, 
                                storage: stor, 
                                stock: stk, 
                                image: finalImg || 'https://placehold.co/500x300?text=No+Image' 
                            });
                        } else {
                            globalStock += stk;
                        }
                    });
                }

                const mainImg = matrixVariants.length > 0 && matrixVariants[0].image ? matrixVariants[0].image : 'https://placehold.co/500x300?text=No+Image';
                const totalStock = matrixVariants.length > 0 ? matrixVariants.reduce((s, v) => s + v.stock, 0) : globalStock;

                if (!name || !brand || isNaN(price) || price <= 0) { alert('Please fill required fields (Name, Brand, Price). Price must be greater than 0.'); return; }
                if (totalStock <= 0) { alert('Stock must be greater than 0. Please enter a valid stock quantity.'); return; }

                const existId = parseInt(editIdEl.value);
                if (existId) {
                    const idx = products.findIndex(p => p.id === existId);
                    if (idx > -1) products[idx] = { id: existId, name, brand, category: cat, price, qty: totalStock, image: mainImg, variants: matrixVariants, description, specs };
                } else {
                    products.push({ id: Date.now(), name, brand, category: cat, price, qty: totalStock, image: mainImg, variants: matrixVariants, description, specs });
                }
                saveProducts();
                renderAdminProducts();
                nameIn.value = brandIn.value = priceIn.value = specsIn.value = descIn.value = '';
                editIdEl.value = '';
                if (variantsContainer) { variantsContainer.innerHTML = ''; variantsContainer.appendChild(createVariantRow('', '', '', '', 0)); }
                addBtn.textContent = 'Add Product';
                if (formTitle) formTitle.textContent = 'Add New Product';
                if (cancelEdit) cancelEdit.style.display = 'none';
            });
        }

        // Search filter
        const prodSearch = document.getElementById('product-search');
        if (prodSearch) {
            prodSearch.addEventListener('input', () => {
                const q = prodSearch.value.toLowerCase();
                const rows = tbody.querySelectorAll('tr');
                rows.forEach(row => { row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none'; });
            });
        }

        renderAdminProducts();
    }

    // ==========================================
    // ADMIN PAGE: ORDER MANAGEMENT (orders.html)
    // ==========================================
    const adminOrdersPage = document.getElementById('admin-orders-page');
    if (adminOrdersPage) {
        const tbody = document.getElementById('orders-tbody');

        function renderAdminOrders() {
            orders = JSON.parse(localStorage.getItem('mexus_orders')) || [];
            tbody.innerHTML = '';
            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-light);">No orders yet.</td></tr>';
                return;
            }
            [...orders].reverse().forEach(o => {
                tbody.innerHTML += `
                <tr data-id="${o.id}">
                    <td>${o.id}</td>
                    <td>${o.customer} <br><small style="color:var(--text-light);">Acc: ${o.accountName || 'Guest'}</small></td>
                    <td>${o.date}</td>
                    <td>$${o.total}</td>
                    <td><span class="status ${o.status === 'Delivered' ? 'delivered' : 'in-progress'}">${o.status}</span></td>
                    <td>
                        <select class="order-status-select" data-id="${o.id}" style="padding:6px;border-radius:6px;border:1px solid #ccc;">
                            <option value="In Progress" ${o.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Delivered"   ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="Cancelled"   ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <button class="btn update-order-btn" data-id="${o.id}" style="padding:5px 10px;font-size:0.8rem;margin-left:5px;">Save</button>
                    </td>
                </tr>`;
            });

            tbody.querySelectorAll('.update-order-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const oid = btn.dataset.id;
                    const sel = tbody.querySelector(`.order-status-select[data-id="${oid}"]`);
                    const order = orders.find(o => o.id === oid);
                    if (order && sel) {
                        order.status = sel.value;
                        saveOrders();
                        renderAdminOrders();
                        showToast('Order status updated!');
                    }
                });
            });
        }

        // Export
        const exportBtn = document.getElementById('export-orders');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                let csv = 'ID,Customer,Date,Total,Status\n';
                orders.forEach(o => { csv += `${o.id},${o.customer},${o.date},$${o.total},${o.status}\n`; });
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'mexus_orders.csv';
                a.click();
            });
        }

        // Search
        const orderSearch = document.getElementById('order-search');
        if (orderSearch) {
            orderSearch.addEventListener('input', () => {
                const q = orderSearch.value.toLowerCase();
                tbody.querySelectorAll('tr').forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });
        }

        renderAdminOrders();
    }

    // ==========================================
    // ADMIN PAGE: USER MANAGEMENT (users.html)
    // ==========================================
    const adminUsersPage = document.getElementById('admin-users-page');
    if (adminUsersPage) {
        const tbody = document.getElementById('users-tbody');

        function renderAdminUsers() {
            users = JSON.parse(localStorage.getItem('mexus_users')) || [];
            tbody.innerHTML = '';
            users.forEach(u => {
                tbody.innerHTML += `
                <tr data-id="${u.id}">
                    <td>${u.username}</td>
                    <td>${u.email || 'N/A'}</td>
                    <td><span style="color:${u.role==='admin'?'var(--primary)':'inherit'};font-weight:600;">${capitalize(u.role)}</span></td>
                    <td><span style="color:${u.blocked?'#ef4444':'#10b981'};font-weight:600;">${u.blocked ? 'Blocked' : 'Active'}</span></td>
                    <td>
                        <button class="btn role-btn" data-id="${u.id}" style="padding:5px 10px;font-size:0.8rem;">Toggle Role</button>
                        <button class="btn ${u.blocked ? '' : 'btn-danger'} block-btn" data-id="${u.id}" style="padding:5px 10px;font-size:0.8rem;margin-left:5px;">
                            ${u.blocked ? 'Unblock' : 'Block'}
                        </button>
                        ${u.role !== 'admin' ? `<button class="btn btn-danger del-user-btn" data-id="${u.id}" style="padding:5px 10px;font-size:0.8rem;margin-left:5px;">Delete</button>` : ''}
                    </td>
                </tr>`;
            });

            // Toggle role
            tbody.querySelectorAll('.role-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const uid = parseInt(btn.dataset.id);
                    const user = users.find(u => u.id === uid);
                    if (user && user.username !== 'admin') {
                        user.role = user.role === 'admin' ? 'client' : 'admin';
                        saveUsers();
                        renderAdminUsers();
                    }
                });
            });

            // Block/Unblock
            tbody.querySelectorAll('.block-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const uid = parseInt(btn.dataset.id);
                    const user = users.find(u => u.id === uid);
                    if (user && user.username !== 'admin') {
                        user.blocked = !user.blocked;
                        saveUsers();
                        renderAdminUsers();
                    }
                });
            });

            // Delete
            tbody.querySelectorAll('.del-user-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (!confirm('Delete this user?')) return;
                    const uid = parseInt(btn.dataset.id);
                    users = users.filter(u => u.id !== uid);
                    saveUsers();
                    renderAdminUsers();
                });
            });
        }

        // Search
        const userSearch = document.getElementById('user-search');
        if (userSearch) {
            userSearch.addEventListener('input', () => {
                const q = userSearch.value.toLowerCase();
                tbody.querySelectorAll('tr').forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
                });
            });
        }

        renderAdminUsers();
    }

    // ==========================================
    // UTILITY
    // ==========================================
    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ==========================================
    // GLOBAL REAL-TIME CROSS-TAB SYNC
    // ==========================================
    window.addEventListener('storage', (e) => {
        if (e.key === 'mexus_products') {
            products = JSON.parse(e.newValue) || [];
            if (document.getElementById('products-grid')) {
                const searchInput = document.getElementById('search-input');
                const brandFilterSelect = document.getElementById('brand-filter');
                const categoryFilterSelect = document.getElementById('category-filter');
                const grid = document.getElementById('products-grid');
                grid.innerHTML = '';
                // Since this might not cleanly invoke getFilteredProducts closure variables outside, we just reload the page for safety on clients
                window.location.reload(); 
            } else if (document.querySelector('.product-title')) {
                // Product page
                window.location.reload();
            } else if (document.getElementById('admin-products-page')) {
                if (typeof renderAdminProducts === 'function') renderAdminProducts();
            }
        }
        if (e.key === 'mexus_cart') {
            cart = JSON.parse(e.newValue) || [];
            updateCartBadge();
            const cartContainer = document.querySelector('.cart-items-container');
            // Hard reload for complex views
            if (cartContainer || document.querySelector('.checkout-forms')) {
                 window.location.reload();
            }
        }
    });

});