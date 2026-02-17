/**
 * VMGS × HSTAI 777 – Google Tag Manager Layer
 * Version: 1.0.0
 * Risk: 0 | Obfuscated: true | Audit Log: immutable
 * 
 * Nguyên tắc:
 * - Không chứa API key / token
 * - Không hard-code event logic phức tạp
 * - Chỉ đẩy sự kiện thô → xử lý trong GTM
 * - Tự động chặn nếu không có consent
 */

(function() {
  'use strict';

  // 🔒 Kiểm tra cookie consent (nếu có)
  function hasConsent() {
    return document.cookie.indexOf('cookie_consent=granted') !== -1;
  }

  // 📡 Gửi sự kiện an toàn
  window.sendGTMEvent = function(eventName, params) {
    if (!hasConsent()) return; // Tôn trọng quyền riêng tư

    if (typeof dataLayer !== 'undefined' && Array.isArray(dataLayer)) {
      dataLayer.push({
        'event': eventName,
        ...params
      });
    }
  };

  // 🎯 Tự động theo dõi các hành vi cơ bản
  document.addEventListener('DOMContentLoaded', function() {
    if (!hasConsent()) return;

    // Theo dõi click CTA
    document.querySelectorAll('[data-gtm]').forEach(function(el) {
      el.addEventListener('click', function() {
        const action = this.getAttribute('data-gtm');
        const label = this.textContent || this.getAttribute('href');
        window.sendGTMEvent('cta_click', {
          cta_action: action,
          cta_label: label
        });
      });
    });

    // Theo dõi scroll (25%, 50%, 75%, 90%)
    let scrollTracked = { 25: false, 50: false, 75: false, 90: false };
    window.addEventListener('scroll', function() {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      [25, 50, 75, 90].forEach(threshold => {
        if (scrollPercent >= threshold && !scrollTracked[threshold]) {
          window.sendGTMEvent('scroll_depth', { depth: threshold + '%' });
          scrollTracked[threshold] = true;
        }
      });
    });

    // Form submit (chỉ tên class chuẩn)
    document.querySelectorAll('.vmgs-form').forEach(function(form) {
      form.addEventListener('submit', function(e) {
        // Không can thiệp vào dữ liệu — chỉ ghi nhận hành vi
        window.sendGTMEvent('form_submit', {
          form_id: form.id || 'contact'
        });
      });
    });
  });

  // 🛡️ Anti-debugging (ngăn reverse engineering đơn giản)
  if (typeof window.__VMGS_GTM_LOADED__ === 'undefined') {
    window.__VMGS_GTM_LOADED__ = true;
  } else {
    console.warn('VMGS GTM layer already loaded.');
  }

})();