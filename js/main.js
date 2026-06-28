(function () {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('file-input');
  const chooseBtn = document.getElementById('choose-file');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  // ── Dropdowns ──
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

  // ── Mobile menu ──
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

  // ── Dropzone ──
  chooseBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  dropzone?.addEventListener('click', () => fileInput.click());

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
    if (!files.length) return;
    const names = [...files].map((f) => f.name).join(', ');
    const title = document.querySelector('[data-upload-title]');
    title.textContent = `${files.length} file${files.length > 1 ? 's' : ''} selected`;
    title.title = names;
  }

  // ── Hero animation ──
  initHeroFlow();

  function initHeroFlow() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = typeof window.gsap !== 'undefined';
    const files = gsapSafeArray('[data-flow-file]');
    const toolsContainer = document.querySelector('[data-flow-tools]');
    const editor = document.querySelector('[data-flow-editor]');
    const result = document.querySelector('[data-flow-result]');
    const resultIcon = result?.querySelector('img');
    const resultLabel = document.querySelector('[data-flow-result-label]');
    const signature = document.querySelector('[data-flow-signature]');
    const signaturePath = document.querySelector('[data-flow-signature-path]');
    const pageRing = document.querySelector('[data-flow-page-ring]');
    const ringPath = document.querySelector('[data-flow-page-ring-path]');
    const magicGradient = document.querySelector('#hero-magic-gradient');

    if (reduceMotion || !hasGsap || !dropzone || !files.length || !toolsContainer || !editor || !result || !resultIcon || !resultLabel || !pageRing || !ringPath || !signature || !signaturePath) {
      return;
    }

    const signatureLength = signaturePath.getTotalLength();
    gsap.set(signaturePath, {
      strokeDasharray: signatureLength,
      strokeDashoffset: signatureLength,
    });
    gsap.set(signature, { opacity: 0 });

    const icons = {
      pdf: 'assets/icons/pdf.svg',
      docx: 'assets/icons/docx.svg',
      jpeg: 'assets/icons/jpeg.svg',
      xlsx: 'assets/icons/xlsx.svg',
      csv: 'assets/icons/csv.svg',
    };

    const scenarios = [
      {
        inputIcons: ['pdf', 'pdf', 'pdf'],
        resultIcon: 'pdf',
        resultLabel: 'merged.pdf',
        tools: ['Merge', 'Rearrange', 'Export'],
        showSignature: false,
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'docx',
        resultLabel: 'document.docx',
        tools: ['To Word', 'Save', 'Export'],
        showSignature: false,
      },
      {
        inputIcons: ['docx'],
        resultIcon: 'pdf',
        resultLabel: 'converted.pdf',
        tools: ['To PDF', 'Save', 'Export'],
        showSignature: false,
      },
      {
        inputIcons: ['jpeg', 'jpeg'],
        resultIcon: 'pdf',
        resultLabel: 'photos.pdf',
        tools: ['From JPG', 'Rearrange', 'Merge'],
        showSignature: false,
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'pdf',
        resultLabel: 'signed.pdf',
        tools: ['Sign', 'Annotate', 'Save'],
        showSignature: true,
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'pdf',
        resultLabel: 'compressed.pdf',
        tools: ['Compress', 'Save', 'Export'],
        showSignature: false,
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'pdf',
        resultLabel: 'split-pages.pdf',
        tools: ['Split', 'Rotate', 'Export'],
        showSignature: false,
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'xlsx',
        resultLabel: 'data.xlsx',
        tools: ['To Excel', 'Edit', 'Export'],
        showSignature: false,
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'pdf',
        resultLabel: 'protected.pdf',
        tools: ['Protect', 'Save', 'Export'],
        showSignature: false,
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'pdf',
        resultLabel: 'final.pdf',
        tools: ['Unlock', 'Edit', 'Sign'],
        showSignature: true,
      },
    ];

    const ALL_ACTIONS = [
      'Merge', 'Split', 'Rearrange', 'Rotate',
      'Sign', 'Annotate', 'Edit', 'Save',
      'To Word', 'To PDF', 'To Excel', 'From JPG',
      'Compress', 'Protect', 'Unlock', 'Export',
    ];

    renderAllActions(toolsContainer, ALL_ACTIONS);

    const HIGHLIGHT_MS = 0.42;
    const LABEL_MUTED = 'rgba(25, 25, 24, 0.26)';
    const LABEL_ACTIVE = '#191918';

    function getToolElement(label) {
      return toolsContainer.querySelector(`[data-tool-label="${label}"]`);
    }

    function resetAllToolHighlights() {
      gsapSafeArray('[data-flow-tool]').forEach((tool) => {
        const mark = tool.querySelector('.hero-flow__tool-mark');
        const labelEl = tool.querySelector('.hero-flow__tool-label');

        tool.classList.remove('is-highlighted', 'is-highlight-exiting');
        gsap.killTweensOf([mark, labelEl].filter(Boolean));

        if (mark) {
          gsap.set(mark, { scaleX: 0, transformOrigin: '0% 50%' });
        }

        if (labelEl) {
          gsap.set(labelEl, { color: LABEL_MUTED });
        }
      });
    }

    function highlightToolIn(toolLabel) {
      const tool = getToolElement(toolLabel);
      const mark = tool?.querySelector('.hero-flow__tool-mark');
      const labelEl = tool?.querySelector('.hero-flow__tool-label');
      if (!tool || !mark || !labelEl) return;

      tool.classList.add('is-highlighted');
      tool.classList.remove('is-highlight-exiting');
      gsap.killTweensOf([mark, labelEl]);

      gsap.fromTo(mark,
        { scaleX: 0, transformOrigin: '0% 50%' },
        { scaleX: 1, duration: HIGHLIGHT_MS, ease: 'power2.out', overwrite: 'auto' },
      );
      gsap.to(labelEl, { color: LABEL_ACTIVE, duration: 0.2, overwrite: 'auto' });
    }

    function highlightToolsOut(toolLabels) {
      toolLabels.forEach((toolLabel) => {
        const tool = getToolElement(toolLabel);
        const mark = tool?.querySelector('.hero-flow__tool-mark');
        const labelEl = tool?.querySelector('.hero-flow__tool-label');
        if (!tool || !mark || !labelEl) return;

        tool.classList.remove('is-highlighted');
        tool.classList.add('is-highlight-exiting');
        gsap.killTweensOf([mark, labelEl]);

        gsap.set(mark, { scaleX: 1, transformOrigin: '100% 50%' });
        gsap.to(mark, {
          scaleX: 0,
          duration: HIGHLIGHT_MS,
          ease: 'power2.inOut',
          overwrite: 'auto',
          onComplete: () => {
            tool.classList.remove('is-highlight-exiting');
            gsap.set(mark, { scaleX: 0, transformOrigin: '0% 50%' });
          },
        });
        gsap.to(labelEl, {
          color: LABEL_MUTED,
          duration: 0.15,
          delay: 0.28,
          overwrite: 'auto',
        });
      });
    }

    function addToolHighlightsToTimeline(tl, scene, processStart) {
      const exitTime = processStart + 3.32;

      tl.call(resetAllToolHighlights, null, 0);

      scene.tools.forEach((toolLabel, index) => {
        const at = processStart + 0.28 + index * 0.32;
        tl.call(() => highlightToolIn(toolLabel), null, at);
      });

      tl.call(() => highlightToolsOut(scene.tools), null, exitTime);
      tl.to({}, { duration: HIGHLIGHT_MS, ease: 'none' }, exitTime);
    }

    function setupScene(scene) {
      resultIcon.src = icons[scene.resultIcon];
      resultLabel.textContent = scene.resultLabel;

      gsap.set(signature, { opacity: 0 });
      gsap.set(signaturePath, { strokeDashoffset: signatureLength });

      files.forEach((file, index) => {
        const iconName = scene.inputIcons[index];
        const img = file.querySelector('img');

        if (iconName && img) {
          img.src = icons[iconName];
          file.style.display = 'flex';
        } else {
          file.style.display = 'none';
        }
      });
    }

    function buildSceneTimeline(scene) {
      const activeFiles = files.slice(0, scene.inputIcons.length);
      const isMerge = scene.inputIcons.length > 1;
      const startGap = isMerge ? 64 : 0;
      const fileStarts = activeFiles.map((_, index) => ({
        x: -430 - index * 84,
        y: (index - (activeFiles.length - 1) / 2) * startGap,
        rotation: [-9, 7, -5, 8][index] || 0,
      }));

      const flyInStart = 0.5;
      const flyInDuration = 1.35;
      const flyInStagger = 0.1;
      const flyInEnd = flyInStart + flyInDuration + (activeFiles.length - 1) * flyInStagger;
      const actionsStart = flyInEnd;
      const processStart = actionsStart - 0.5;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.set(pageRing, { opacity: 0 }, 0)
        .set(ringPath, { strokeDasharray: 100, strokeDashoffset: 100 }, 0)
        .set(activeFiles, {
          x: (index) => fileStarts[index].x,
          y: (index) => fileStarts[index].y,
          rotation: (index) => fileStarts[index].rotation,
          xPercent: -50,
          yPercent: -50,
          autoAlpha: 0,
          scale: 0.94,
        }, 0)
        .set(editor, { scale: 1, xPercent: -50, yPercent: -50 }, 0)
        .set(result, { autoAlpha: 0, x: 175, xPercent: -50, yPercent: -50, scale: 0.88, rotation: 2 }, 0)
        .set(signature, { opacity: 0 }, 0)
        .set(signaturePath, { strokeDashoffset: signatureLength }, 0)
        .to(activeFiles, {
          autoAlpha: 1,
          scale: 1,
          stagger: 0.12,
          duration: 0.5,
        }, 0.08)
        .to(activeFiles, {
          x: 0,
          y: isMerge ? (index) => (index - (activeFiles.length - 1) / 2) * 12 : 0,
          rotation: isMerge ? (index) => [-4, 0, 4][index] || 0 : 0,
          scale: isMerge ? 0.76 : 0.68,
          duration: 1.35,
          stagger: 0.1,
          ease: 'power3.inOut',
        }, flyInStart)
        .to(activeFiles, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 0.42,
          autoAlpha: 0,
          duration: 0.48,
          stagger: 0.06,
          ease: 'power2.in',
        }, actionsStart);

      if (scene.showSignature) {
        tl.to(signature, { opacity: 1, duration: 0.12 }, processStart)
          .to(signaturePath, {
            strokeDashoffset: 0,
            duration: 1.15,
            ease: 'power2.inOut',
          }, processStart);
      }

      addToolHighlightsToTimeline(tl, scene, processStart);

      tl.to(pageRing, { opacity: 1, duration: 0.15 }, processStart)
        .to(ringPath, {
          strokeDashoffset: 0,
          duration: 0.7,
          ease: 'power2.inOut',
        }, processStart)
        .to(magicGradient, {
          attr: { x1: 100, y1: 0, x2: 0, y2: 100 },
          duration: 0.7,
          ease: 'none',
        }, processStart)
        .to(ringPath, {
          strokeDashoffset: -100,
          duration: 0.7,
          ease: 'power2.inOut',
        }, processStart + 0.75)
        .to(magicGradient, {
          attr: { x1: 0, y1: 0, x2: 100, y2: 100 },
          duration: 0.7,
          ease: 'none',
        }, processStart + 0.75)
        .to(pageRing, { opacity: 0, duration: 0.12 }, processStart + 1.48)
        .to(result, {
          autoAlpha: 1,
          x: 310,
          scale: 1,
          rotation: 0,
          duration: 1.15,
          ease: 'power3.out',
        }, actionsStart + 0.95)
        .to(result, {
          autoAlpha: 0,
          x: 470,
          scale: 0.92,
          duration: 0.6,
          ease: 'power2.in',
        }, actionsStart + 2.2)
        .add(() => {
          gsap.set(pageRing, { opacity: 0 });
          gsap.set(ringPath, { strokeDasharray: 100, strokeDashoffset: 100 });
          if (magicGradient) {
            gsap.set(magicGradient, { attr: { x1: 0, y1: 0, x2: 100, y2: 100 } });
          }
          gsap.set(signature, { opacity: 0 });
          gsap.set(signaturePath, { strokeDashoffset: signatureLength });
        }, processStart + 3.32 + HIGHLIGHT_MS);

      return tl;
    }

    function renderAllActions(container, actions) {
      container.innerHTML = actions
        .map((tool, index) => {
          const sep = index < actions.length - 1
            ? '<span class="hero-flow__tools-sep">, </span>'
            : '';
          return `<span data-flow-tool data-tool-label="${tool}"><span class="hero-flow__tool-text"><span class="hero-flow__tool-mark" aria-hidden="true"></span><span class="hero-flow__tool-label">${tool}</span></span></span>${sep}`;
        })
        .join('');
    }

    const master = gsap.timeline({
      repeat: -1,
      repeatDelay: 0,
      defaults: { ease: 'power2.out' },
    });

    scenarios.forEach((scenario) => {
      master.add(() => setupScene(scenario));
      master.add(buildSceneTimeline(scenario), '>');
    });
  }

  function gsapSafeArray(selector) {
    return typeof window.gsap === 'undefined' ? [] : gsap.utils.toArray(selector);
  }
})();
