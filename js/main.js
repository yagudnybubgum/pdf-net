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

  dropzone?.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    fileInput.click();
  });

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
    const mobileLabel = document.querySelector('.hero-flow__btn-label--mobile');
    const countLabel = `${files.length} file${files.length > 1 ? 's' : ''} selected`;

    if (title) {
      title.textContent = countLabel;
      title.title = names;
    }

    if (mobileLabel) {
      mobileLabel.textContent = countLabel;
      mobileLabel.title = names;
    }
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
    const isMobileFlow = window.matchMedia('(max-width: 768px)').matches;

    if (reduceMotion || !hasGsap || !dropzone || !files.length || !toolsContainer || !editor || !result || !resultIcon || !resultLabel || !pageRing || !ringPath || !signature || !signaturePath) {
      return;
    }

    const SIGNATURE_PATHS = {
      contract: 'M 2 20 C 2 11, 10 5, 18 11 C 24 16, 21 22, 14 20 C 9 18, 11 12, 20 9 C 30 6, 38 10, 40 17 C 42 24, 36 23, 32 18 C 28 13, 34 8, 44 9 C 54 10, 60 16, 62 14 C 66 10, 72 12, 76 18 C 80 24, 74 25, 70 20 L 74 20 C 80 14, 88 13, 92 18 C 95 22, 91 24, 87 21',
      submission: 'M 4 18 C 4 10, 14 8, 18 14 C 22 20, 14 22, 10 18 C 8 16, 12 11, 22 10 C 34 8, 44 13, 48 17 C 52 21, 46 23, 40 19 C 46 17, 52 12, 54 11 C 60 8, 68 10, 70 15 C 72 20, 66 22, 61 19 C 54 22, 46 23, 42 24 L 90 24',
      final: 'M 6 22 L 6 11 C 6 11, 16 9, 20 14 C 24 19, 18 21, 14 19 L 28 22 L 28 13 L 40 22 L 28 17 L 38 17 L 46 20 C 54 16, 66 14, 78 11 C 86 9, 92 14, 93 19',
    };

    const SIG_DASH = 100;
    const SIGNATURE_ROTATION = -7;

    function resetSignatureDash() {
      gsap.killTweensOf(signaturePath);
      gsap.set(signaturePath, {
        strokeDasharray: SIG_DASH,
        strokeDashoffset: SIG_DASH,
        opacity: 0,
      });
    }

    function hideSignaturePath() {
      gsap.set(signaturePath, {
        strokeDasharray: SIG_DASH,
        strokeDashoffset: SIG_DASH,
        opacity: 0,
      });
    }

    function setSignaturePath(pathKey) {
      const d = SIGNATURE_PATHS[pathKey];
      if (!d) return;

      signaturePath.setAttribute('d', d);
      signaturePath.setAttribute('pathLength', '100');
      resetSignatureDash();
      gsap.set(signature, {
        opacity: 1,
        rotation: SIGNATURE_ROTATION,
        transformOrigin: '50% 50%',
      });
    }

    setSignaturePath('contract');

    const icons = {
      pdf: 'assets/icons/pdf.svg',
      docx: 'assets/icons/docx.svg',
      jpeg: 'assets/icons/jpeg.svg',
      xlsx: 'assets/icons/xlsx.svg',
      csv: 'assets/icons/csv.svg',
    };

    const scenarios = [
      {
        inputIcons: ['pdf'],
        resultIcon: 'pdf',
        resultLabel: 'signed.pdf',
        tools: ['Sign', 'Annotate', 'Save'],
        showSignature: true,
        signaturePath: 'contract',
      },
      {
        inputIcons: ['pdf', 'pdf', 'pdf'],
        resultIcon: 'pdf',
        resultLabel: 'submission.pdf',
        tools: ['Merge', 'Rearrange', 'Sign'],
        showSignature: true,
        signaturePath: 'submission',
      },
      {
        inputIcons: ['pdf'],
        resultIcon: 'pdf',
        resultLabel: 'final.pdf',
        tools: ['Edit', 'Annotate', 'Sign'],
        showSignature: true,
        signaturePath: 'final',
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

    function runSignatureAnimation() {
      gsap.killTweensOf(signaturePath);
      gsap.set(signaturePath, {
        opacity: 1,
        strokeDasharray: SIG_DASH,
        strokeDashoffset: SIG_DASH,
      });

      gsap.timeline({ defaults: { ease: 'power2.inOut' } })
        .to(signaturePath, {
          strokeDashoffset: 0,
          duration: 1.05,
        })
        .to(signaturePath, {
          strokeDashoffset: -SIG_DASH,
          duration: 1.05,
          onComplete: hideSignaturePath,
        }, '+=0.05');
    }

    function resetSignature() {
      resetSignatureDash();
      gsap.set(signature, {
        opacity: 1,
        rotation: SIGNATURE_ROTATION,
        transformOrigin: '50% 50%',
      });
    }

    function setupScene(scene) {
      resultIcon.src = icons[scene.resultIcon];
      resultLabel.textContent = scene.resultLabel;

      if (scene.signaturePath) {
        setSignaturePath(scene.signaturePath);
      } else {
        resetSignature();
      }

      files.forEach((file) => {
        file.style.display = 'none';
      });

      if (isMobileFlow) return;

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
      const startGap = isMerge ? 96 : 0;
      const fileStarts = activeFiles.map((_, index) => ({
        x: -430 - index * 126,
        y: (index - (activeFiles.length - 1) / 2) * startGap,
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
          rotation: 0,
          xPercent: -50,
          yPercent: -50,
          autoAlpha: 0,
          scale: 0.94,
        }, 0)
        .set(result, { autoAlpha: 0, x: 260, xPercent: -50, yPercent: -50, scale: 0.88, rotation: 2 }, 0)
        .set(signature, { opacity: 1, rotation: SIGNATURE_ROTATION }, 0)
        .set(signaturePath, {
          strokeDasharray: SIG_DASH,
          strokeDashoffset: SIG_DASH,
        }, 0)
        .to(activeFiles, {
          autoAlpha: 1,
          scale: 1,
          stagger: 0.12,
          duration: 0.5,
        }, 0.08)
        .to(activeFiles, {
          x: 0,
          y: isMerge ? (index) => (index - (activeFiles.length - 1) / 2) * 12 : 0,
          scale: isMerge ? 0.51 : 0.45,
          duration: 1.35,
          stagger: 0.1,
          ease: 'power3.inOut',
        }, flyInStart)
        .to(activeFiles, {
          x: 0,
          y: 0,
          scale: 0.28,
          autoAlpha: 0,
          duration: 0.48,
          stagger: 0.06,
          ease: 'power2.in',
        }, actionsStart);

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
        .call(runSignatureAnimation, null, processStart)
        .to(result, {
          autoAlpha: 1,
          x: 420,
          scale: 1,
          rotation: 0,
          duration: 1.15,
          ease: 'power3.out',
        }, actionsStart + 0.95)
        .to(result, {
          autoAlpha: 0,
          x: 600,
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
          resetSignatureDash();
        }, processStart + 3.32 + HIGHLIGHT_MS);

      return tl;
    }

    function buildMobileSceneTimeline(scene) {
      const processStart = 0.2;
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.set(pageRing, { opacity: 0 }, 0)
        .set(ringPath, { strokeDasharray: 100, strokeDashoffset: 100 }, 0)
        .set(signature, { opacity: 1, rotation: SIGNATURE_ROTATION }, 0)
        .set(signaturePath, {
          strokeDasharray: SIG_DASH,
          strokeDashoffset: SIG_DASH,
        }, 0);

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
        .call(runSignatureAnimation, null, processStart);

      tl.add(() => {
          gsap.set(pageRing, { opacity: 0 });
          gsap.set(ringPath, { strokeDasharray: 100, strokeDashoffset: 100 });
          if (magicGradient) {
            gsap.set(magicGradient, { attr: { x1: 0, y1: 0, x2: 100, y2: 100 } });
          }
          resetSignatureDash();
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
      master.add(
        isMobileFlow ? buildMobileSceneTimeline(scenario) : buildSceneTimeline(scenario),
        '>',
      );
    });
  }

  function gsapSafeArray(selector) {
    return typeof window.gsap === 'undefined' ? [] : gsap.utils.toArray(selector);
  }
})();
