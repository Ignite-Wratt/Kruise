/* Kruise theme JS — AJAX cart, icons, PDP gallery */
(function () {
  var cfg = window.KRUISE || {};

  function icons() { if (window.lucide) window.lucide.createIcons(); }
  document.addEventListener('DOMContentLoaded', icons);
  document.addEventListener('shopify:section:load', icons);

  function setCount(n) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; });
  }

  function refreshCart() {
    fetch(cfg.cartUrl + '.js', { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (c) { setCount(c.item_count); })
      .catch(function () {});
  }

  function flash(btn, text) {
    var old = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', old);
    btn.textContent = text;
    btn.disabled = true;
    setTimeout(function () { btn.textContent = old; btn.disabled = false; }, 1100);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    var id = btn.getAttribute('data-variant-id');
    if (!id) return;
    e.preventDefault();
    var form = btn.closest('form');
    var qtyEl = form ? form.querySelector('[name="quantity"]') : null;
    var selEl = form ? form.querySelector('[name="id"]') : null;
    if (selEl && selEl.value) id = selEl.value;
    fetch(cfg.addUrl + '.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ items: [{ id: Number(id), quantity: qtyEl ? Number(qtyEl.value) || 1 : 1 }] })
    })
      .then(function (r) { return r.json(); })
      .then(function () { flash(btn, 'Added!'); refreshCart(); })
      .catch(function () { window.location.href = cfg.cartUrl; });
  });

  /* PDP: variant select -> price + button id */
  document.addEventListener('change', function (e) {
    var sel = e.target.closest('[data-variant-select]');
    if (!sel) return;
    var opt = sel.options[sel.selectedIndex];
    var root = sel.closest('[data-product-root]');
    if (!root) return;
    var price = root.querySelector('[data-price]');
    if (price && opt.dataset.price) price.textContent = opt.dataset.price;
    var add = root.querySelector('[data-add-to-cart]');
    if (add) {
      add.setAttribute('data-variant-id', opt.value);
      var sold = opt.dataset.available === 'false';
      add.disabled = sold;
      add.textContent = sold ? 'Sold out' : 'Add to cart';
    }
  });

  /* PDP thumbnails */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-thumb]');
    if (!t) return;
    var root = t.closest('[data-product-root]');
    var main = root && root.querySelector('[data-main-image]');
    if (main) { main.src = t.getAttribute('data-full'); main.srcset = ''; }
  });

  refreshCart();
})();
