(function () {
  const dropzone = document.getElementById('hero-b-dropzone');
  const fileInput = document.getElementById('hero-b-file-input');
  const chooseBtn = document.getElementById('hero-b-choose');
  const dropTitle = document.querySelector('[data-hero-b-upload-title]');

  chooseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput?.click();
  });

  dropzone?.addEventListener('click', () => fileInput?.click());

  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('is-dragover');
  });

  dropzone?.addEventListener('dragleave', (e) => {
    if (!dropzone.contains(e.relatedTarget)) {
      dropzone.classList.remove('is-dragover');
    }
  });

  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    handleFiles(e.dataTransfer.files);
  });

  fileInput?.addEventListener('change', () => {
    handleFiles(fileInput.files);
  });

  function handleFiles(files) {
    if (!files.length || !dropTitle) return;
    const count = `${files.length} file${files.length > 1 ? 's' : ''} selected`;
    dropTitle.textContent = count;
    dropTitle.title = [...files].map((f) => f.name).join(', ');
  }

  initStackAnimation();

  function initStackAnimation() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = typeof window.gsap !== 'undefined';
    const cards = [...document.querySelectorAll('[data-hero-b-card]')];

    if (!cards.length) return;

    const SLOTS = [
      { x: 0, y: 0, z: 0, scale: 1, zIndex: 30 },
      { x: 34, y: -39, z: -18, scale: 0.93, zIndex: 20 },
      { x: 68, y: -78, z: -36, scale: 0.86, zIndex: 10 },
    ];

    const SIG_DASH = 100;
    const order = cards.map((_, i) => i);

    function getSignaturePath(card) {
      return card.querySelector('[data-hero-b-card-signature]');
    }

    function resetSignature(card) {
      const path = getSignaturePath(card);
      if (!path) return;
      card.classList.remove('is-signed');
      gsap.killTweensOf(path);
      gsap.set(path, { strokeDashoffset: SIG_DASH, opacity: 0 });
    }

    function applySlot(cardIndex, slotIndex, immediate) {
      const card = cards[cardIndex];
      const slot = SLOTS[slotIndex];

      gsap.to(card, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        scale: slot.scale,
        rotateY: 0,
        rotateX: 0,
        rotateZ: 0,
        transformOrigin: '50% 50%',
        duration: immediate ? 0 : 0.62,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });

      card.style.zIndex = String(slot.zIndex);
    }

    function layoutFromOrder(immediate) {
      order.forEach((cardIndex, slotIndex) => {
        applySlot(cardIndex, slotIndex, immediate);
      });
    }

    cards.forEach((card) => {
      gsap.set(card, {
        transformOrigin: '50% 50%',
        force3D: true,
        rotateY: 0,
        rotateX: 0,
        rotateZ: 0,
        opacity: 1,
      });
      resetSignature(card);
    });

    layoutFromOrder(true);

    if (reduceMotion || !hasGsap) {
      const frontCard = cards[order[0]];
      const path = getSignaturePath(frontCard);
      if (path) {
        frontCard.classList.add('is-signed');
        path.style.strokeDashoffset = '0';
        path.style.opacity = '1';
      }
      return;
    }

    function playCycle(isFirst) {
      const [front, middle, back] = order;
      const frontCard = cards[front];
      const sigPath = getSignaturePath(frontCard);

      gsap.timeline({
        delay: isFirst ? 0 : 0.35,
        onComplete: () => playCycle(false),
      })
        .set(sigPath, { strokeDashoffset: SIG_DASH, opacity: 1 })
        .to(sigPath, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: 'power1.inOut',
        })
        .call(() => frontCard.classList.add('is-signed'))
        .to({}, { duration: 0.35 })
        // Slide-back — all cards shift to their next slot
        .to(cards[front], {
          x: SLOTS[2].x,
          y: SLOTS[2].y,
          z: SLOTS[2].z,
          scale: SLOTS[2].scale,
          duration: 0.62,
          ease: 'power2.inOut',
        })
        .to(cards[middle], {
          x: SLOTS[0].x,
          y: SLOTS[0].y,
          z: SLOTS[0].z,
          scale: SLOTS[0].scale,
          duration: 0.62,
          ease: 'power2.inOut',
        }, '<')
        .to(cards[back], {
          x: SLOTS[1].x,
          y: SLOTS[1].y,
          z: SLOTS[1].z,
          scale: SLOTS[1].scale,
          duration: 0.62,
          ease: 'power2.inOut',
        }, '<')
        .call(() => {
          resetSignature(cards[front]);
          gsap.set(cards[front], {
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            opacity: 1,
            transformOrigin: '50% 50%',
          });
          order.push(order.shift());
          cards[order[0]].style.zIndex = String(SLOTS[0].zIndex);
          cards[order[1]].style.zIndex = String(SLOTS[1].zIndex);
          cards[order[2]].style.zIndex = String(SLOTS[2].zIndex);
        });
    }

    playCycle(true);
  }

  // Header interactions
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  document.querySelectorAll('.header__dropdown').forEach((dropdown) => {
    const trigger = dropdown.querySelector('.header__dropdown-trigger, .header__lang-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('is-open');
      document.querySelectorAll('.header__dropdown.is-open').forEach((d) => {
        if (d !== dropdown) closeDropdown(d);
      });
      isOpen ? closeDropdown(dropdown) : openDropdown(dropdown);
    });
  });

  function openDropdown(el) {
    el.classList.add('is-open');
    const trigger = el.querySelector('.header__dropdown-trigger, .header__lang-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown(el) {
    el.classList.remove('is-open');
    const trigger = el.querySelector('.header__dropdown-trigger, .header__lang-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  document.addEventListener('click', () => {
    document.querySelectorAll('.header__dropdown.is-open').forEach(closeDropdown);
  });

  burger?.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('menu-open', isOpen);
  });

  document.querySelectorAll('.mobile-menu__accordion').forEach((btn) => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.mobile-menu__group');
      const isOpen = group.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
})();
