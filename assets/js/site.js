(() => {
  "use strict";

  const data = window.PORTFOLIO_DATA || { projects: [], skillSystems: {} };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const pad = (number) => String(number).padStart(2, "0");

  /* Experience cards ------------------------------------------------ */
  const setExperienceDetail = (card, title, detail, sourceButton = null) => {
    const panel = $(".experience-detail", card);
    const titleNode = $(".experience-detail-title", panel);
    const copyNode = $(".experience-detail-copy", panel);
    const isSameOpen =
      !panel.hidden &&
      titleNode.textContent === title &&
      sourceButton?.getAttribute("aria-expanded") === "true";

    $$("[aria-expanded]", card).forEach((button) => button.setAttribute("aria-expanded", "false"));

    if (isSameOpen) {
      panel.hidden = true;
      return;
    }

    titleNode.textContent = title;
    copyNode.textContent = detail;
    panel.hidden = false;

    $$("[data-exp-toggle]", card).forEach((button) => button.setAttribute("aria-expanded", "true"));
  };

  $$("[data-experience]").forEach((card) => {
    $$("[data-exp-toggle]", card).forEach((button) => {
      button.addEventListener("click", () => {
        setExperienceDetail(
          card,
          card.dataset.overviewTitle || "Inside the role",
          card.dataset.overviewDetail || "Add your role details here.",
          button
        );
      });
    });

    $(".experience-detail-close", card)?.addEventListener("click", () => {
      $(".experience-detail", card).hidden = true;
      $$("[aria-expanded]", card).forEach((button) => button.setAttribute("aria-expanded", "false"));
    });
  });

  /* UBC Solar scroll wheel ----------------------------------------- */
  const solarSection = $("#ubc-solar");
  const solarWheel = solarSection ? $(".solar-scroll-wheel", solarSection) : null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let solarScrollFrame = 0;

  const updateSolarWheel = () => {
    solarScrollFrame = 0;
    if (!solarSection || !solarWheel || reduceMotion.matches) return;

    const sectionBounds = solarSection.getBoundingClientRect();
    const scrollRange = window.innerHeight + sectionBounds.height;
    const progress = Math.min(
      1,
      Math.max(0, (window.innerHeight - sectionBounds.top) / scrollRange)
    );
    solarWheel.style.setProperty("--solar-wheel-rotation", `${progress * 540}deg`);
  };

  const requestSolarWheelUpdate = () => {
    if (!solarScrollFrame) solarScrollFrame = requestAnimationFrame(updateSolarWheel);
  };

  if (solarSection && solarWheel && !reduceMotion.matches) {
    updateSolarWheel();
    window.addEventListener("scroll", requestSolarWheelUpdate, { passive: true });
    window.addEventListener("resize", requestSolarWheelUpdate);
  }

  /* Project console ------------------------------------------------- */
  const projectRail = $("#project-rail");
  const projectCounter = $(".project-counter");
  const dialog = $("#project-dialog");
  const modelShell = $("#project-model-shell");
  const modelSection = $(".project-model", dialog);
  const mediaSection = $("#project-media");
  const mediaStage = $("#project-media-stage");
  const mediaCounter = $("#project-media-counter");
  const mediaThumbnails = $("#project-media-thumbnails");
  let currentProjectIndex = 0;
  let currentMediaIndex = 0;
  let activeMedia = [];
  let activeViewerCleanup = null;

  const originMarkup = (origin = {}) => {
    const content = origin.logo
      ? `<img src="${escapeHtml(origin.logo)}" alt="" />`
      : `<span class="dialog-origin-mark" aria-hidden="true">◇</span>`;
    const label = `<span>${escapeHtml(origin.label || "Personal project")}</span>`;

    if (origin.relatedExperienceId) {
      return `<a href="#${escapeHtml(origin.relatedExperienceId)}" class="dialog-origin">${content}${label}</a>`;
    }
    return `<div class="dialog-origin">${content}${label}</div>`;
  };

  const renderProjects = () => {
    if (!projectRail) return;

    if (!data.projects.length) {
      projectRail.innerHTML = `<p class="project-empty">Add your first project in assets/js/portfolio-data.js.</p>`;
      return;
    }

    projectRail.innerHTML = data.projects
      .map(
        (project, index) => `
          <button
            class="project-tile${index === 0 ? " is-current" : ""}"
            type="button"
            data-project-index="${index}"
            aria-label="Open ${escapeHtml(project.title)}"
          >
            <div class="project-tile-image">
              <img src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.coverAlt || "")}" />
              <span class="project-tile-number">${pad(index + 1)}</span>
            </div>
            <div class="project-tile-body">
              <p class="project-tile-meta">${escapeHtml(project.status)}</p>
              <h3>${escapeHtml(project.title)}</h3>
              <p class="project-tile-blurb">${escapeHtml(project.blurb)}</p>
              <span class="project-tile-open">View build story</span>
            </div>
          </button>
        `
      )
      .join("");

    $$(".project-tile", projectRail).forEach((tile) => {
      tile.addEventListener("focus", () => setCurrentProject(Number(tile.dataset.projectIndex), false));
      tile.addEventListener("click", () => openProject(Number(tile.dataset.projectIndex)));
    });

    updateProjectCounter();
  };

  const updateProjectCounter = () => {
    if (projectCounter) {
      projectCounter.textContent = `${pad(currentProjectIndex + 1)} / ${pad(data.projects.length)}`;
    }
    $$(".project-tile", projectRail).forEach((tile, index) => {
      tile.classList.toggle("is-current", index === currentProjectIndex);
    });
  };

  const setCurrentProject = (index, focus = true) => {
    if (!data.projects.length) return;
    currentProjectIndex = (index + data.projects.length) % data.projects.length;
    const tile = $(`[data-project-index="${currentProjectIndex}"]`, projectRail);
    tile?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    if (focus) tile?.focus({ preventScroll: true });
    updateProjectCounter();
  };

  let projectScrollFrame = 0;
  projectRail?.addEventListener("scroll", () => {
    cancelAnimationFrame(projectScrollFrame);
    projectScrollFrame = requestAnimationFrame(() => {
      const railCenter = projectRail.scrollLeft + projectRail.clientWidth / 2;
      const tiles = $$(".project-tile", projectRail);
      const closestIndex = tiles.reduce(
        (closest, tile, index) => {
          const tileCenter = tile.offsetLeft + tile.offsetWidth / 2;
          const distance = Math.abs(railCenter - tileCenter);
          return distance < closest.distance ? { index, distance } : closest;
        },
        { index: currentProjectIndex, distance: Number.POSITIVE_INFINITY }
      ).index;
      if (closestIndex !== currentProjectIndex) {
        currentProjectIndex = closestIndex;
        updateProjectCounter();
      }
    });
  });

  $("#project-prev")?.addEventListener("click", () => setCurrentProject(currentProjectIndex - 1));
  $("#project-next")?.addEventListener("click", () => setCurrentProject(currentProjectIndex + 1));
  projectRail?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setCurrentProject(currentProjectIndex + (event.key === "ArrowRight" ? 1 : -1));
    }
    if ((event.key === "Enter" || event.key === " ") && event.target === projectRail) {
      event.preventDefault();
      openProject(currentProjectIndex);
    }
  });

  const getModelFormat = (model = {}) => {
    const source = model.src || model.label || "";
    const cleanSource = source.split(/[?#]/)[0];
    const extension = cleanSource.includes(".") ? cleanSource.split(".").pop() : "";
    return (extension || "glb").toUpperCase();
  };

  const renderProjectModel = (model = {}) => {
    if (!modelShell || !modelSection) return;
    const hasFile = Boolean(model.src);
    const label = model.label || "project-model.glb";
    const format = getModelFormat(model);
    const caption =
      model.caption || "Add a GLB path in portfolio-data.js to enable the interactive model.";

    if (!hasFile) {
      modelSection.hidden = true;
      modelShell.innerHTML = "";
      return;
    }

    modelSection.hidden = false;
    modelShell.innerHTML = `
      <div class="project-model-toolbar">
        <div class="project-model-file">
          <span class="file-format">${escapeHtml(format)}</span>
          <span>${escapeHtml(label)}</span>
        </div>
        <a class="btn btn-primary" href="${escapeHtml(model.src)}" download>
          Download ${escapeHtml(format)}
        </a>
      </div>
      <div class="project-model-canvas" aria-label="Interactive 3D model of ${escapeHtml(label)}">
        <p class="viewer-status">Loading interactive model…</p>
      </div>
    `;
  };

  const getMediaType = (item = {}) => {
    if (item.type) return item.type.toLowerCase();
    const cleanSource = (item.src || "").split(/[?#]/)[0].toLowerCase();
    if (cleanSource.endsWith(".mp4") || cleanSource.endsWith(".mov") || cleanSource.endsWith(".webm")) {
      return "video";
    }
    if (cleanSource.endsWith(".pdf")) return "document";
    return "image";
  };

  const mediaThumbnailMarkup = (item, index) => {
    const type = getMediaType(item);
    const label = item.label || item.caption || `${type} ${index + 1}`;
    let preview = `<span>${escapeHtml(type === "document" ? "PDF" : type.toUpperCase())}</span>`;

    if (type === "image") {
      preview = `<img src="${escapeHtml(item.src)}" alt="" loading="lazy" />`;
    } else if (type === "video" && item.poster) {
      preview = `
        <img src="${escapeHtml(item.poster)}" alt="" loading="lazy" />
        <span class="media-thumbnail-type">Video</span>
      `;
    }

    return `
      <button
        class="media-thumbnail${index === currentMediaIndex ? " is-active" : ""}"
        type="button"
        data-media-index="${index}"
        aria-label="View ${escapeHtml(label)}"
        aria-current="${index === currentMediaIndex ? "true" : "false"}"
      >
        ${preview}
      </button>
    `;
  };

  const renderActiveMedia = () => {
    if (!mediaStage || !mediaCounter || !mediaThumbnails || !activeMedia.length) return;

    const previousVideo = $("video", mediaStage);
    previousVideo?.pause();

    const item = activeMedia[currentMediaIndex];
    const type = getMediaType(item);
    const caption = item.caption || item.label || "";
    const itemNumber = `${pad(currentMediaIndex + 1)} / ${pad(activeMedia.length)}`;

    if (type === "video") {
      mediaStage.innerHTML = `
        <figure class="project-media-item">
          <div class="project-media-visual project-media-video">
            <video controls playsinline preload="metadata"${item.poster ? ` poster="${escapeHtml(item.poster)}"` : ""}>
              <source src="${escapeHtml(item.src)}" type="${escapeHtml(item.mime || "video/mp4")}" />
              Your browser cannot play this video.
            </video>
          </div>
          <figcaption>
            <span>${itemNumber} · Video</span>
            <p>${escapeHtml(caption)}</p>
          </figcaption>
        </figure>
      `;
    } else if (type === "document") {
      const label = item.label || "Project document";
      mediaStage.innerHTML = `
        <div class="project-media-document">
          <span class="media-document-icon">PDF</span>
          <p class="section-label">${itemNumber} · Technical document</p>
          <h4>${escapeHtml(label)}</h4>
          <p>${escapeHtml(caption)}</p>
          <div class="media-document-actions">
            <a class="btn btn-primary" href="${escapeHtml(item.src)}" target="_blank" rel="noreferrer">Open PDF ↗</a>
            <a class="btn btn-outline" href="${escapeHtml(item.src)}" download>Download</a>
          </div>
        </div>
      `;
    } else {
      mediaStage.innerHTML = `
        <figure class="project-media-item">
          <div class="project-media-visual">
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || caption)}" />
          </div>
          <figcaption>
            <span>${itemNumber} · Image</span>
            <p>${escapeHtml(caption)}</p>
          </figcaption>
        </figure>
      `;
    }

    mediaCounter.textContent = itemNumber;
    mediaThumbnails.innerHTML = activeMedia.map(mediaThumbnailMarkup).join("");
    $$("[data-media-index]", mediaThumbnails).forEach((button) => {
      button.addEventListener("click", () => setActiveMedia(Number(button.dataset.mediaIndex)));
    });
    $(`[data-media-index="${currentMediaIndex}"]`, mediaThumbnails)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  };

  const setActiveMedia = (index) => {
    if (!activeMedia.length) return;
    currentMediaIndex = (index + activeMedia.length) % activeMedia.length;
    renderActiveMedia();
  };

  const renderMediaGallery = (media = []) => {
    if (!mediaSection || !mediaStage || !mediaThumbnails) return;
    activeMedia = media.filter((item) => item?.src);
    currentMediaIndex = 0;
    mediaSection.hidden = activeMedia.length === 0;
    mediaSection.classList.toggle("is-single", activeMedia.length === 1);

    if (!activeMedia.length) {
      mediaStage.innerHTML = "";
      mediaThumbnails.innerHTML = "";
      return;
    }

    renderActiveMedia();
  };

  $(".media-previous", mediaSection)?.addEventListener("click", () => {
    setActiveMedia(currentMediaIndex - 1);
  });
  $(".media-next", mediaSection)?.addEventListener("click", () => {
    setActiveMedia(currentMediaIndex + 1);
  });
  mediaStage?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setActiveMedia(currentMediaIndex + (event.key === "ArrowRight" ? 1 : -1));
  });

  const openProject = (index, updateUrl = true) => {
    const project = data.projects[index];
    if (!project || !dialog) return;
    currentProjectIndex = index;
    updateProjectCounter();

    $("#dialog-origin").innerHTML = originMarkup(project.origin);
    $("#dialog-project-kicker").textContent = project.status || "Project";
    $("#dialog-project-title").textContent = project.title;
    $("#dialog-project-lede").textContent = project.blurb;
    $("#dialog-project-tags").innerHTML = (project.tags || [])
      .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join("");
    $("#dialog-project-story").innerHTML = (project.story || [])
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join("");
    $("#dialog-project-highlights").innerHTML = (project.highlights || [])
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");
    $("#dialog-project-links").innerHTML = (project.links || [])
      .map(
        (link) =>
          `<a class="btn btn-outline" href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)} ↗</a>`
      )
      .join("");

    activeViewerCleanup?.();
    activeViewerCleanup = null;
    renderProjectModel(project.model);
    renderMediaGallery(project.media || []);
    dialog.showModal();
    document.body.classList.add("dialog-open");
    $(".dialog-shell", dialog).scrollTop = 0;
    if (project.model?.src) {
      startModelViewer(project.model);
    }
    if (updateUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("project", project.id);
      window.history.replaceState({}, "", url);
    }

    const originLink = $(".dialog-origin[href]", dialog);
    originLink?.addEventListener(
      "click",
      () => {
        dialog.close();
      },
      { once: true }
    );
  };

  const closeProject = () => {
    if (dialog?.open) dialog.close();
  };

  $(".dialog-close", dialog)?.addEventListener("click", closeProject);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeProject();
  });
  dialog?.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    $("video", mediaStage)?.pause();
    activeViewerCleanup?.();
    activeViewerCleanup = null;
    const url = new URL(window.location.href);
    if (url.searchParams.has("project")) {
      url.searchParams.delete("project");
      window.history.replaceState({}, "", url);
    }
    $(`[data-project-index="${currentProjectIndex}"]`, projectRail)?.focus();
  });

  const startModelViewer = async (model = {}) => {
    const visual = $(".project-model-canvas", modelShell);
    const source = model.src;
    const format = getModelFormat(model);
    if (!visual || !source) return;

    visual.innerHTML = `<p class="viewer-status">Loading interactive model…</p>`;

    try {
      const { mountModelViewer } = await import("./model-viewer.js?v=draco1");
      activeViewerCleanup = await mountModelViewer(visual, source);
    } catch (error) {
      console.error(error);
      visual.innerHTML = `
        <div class="project-model-error">
          <span class="cad-file-icon">${escapeHtml(format)}</span>
          <h4>3D preview unavailable</h4>
          <p>The model could not load here, but the download button remains available above.</p>
        </div>
      `;
    }
  };

  /* Automotive skills explorer ------------------------------------- */
  const systems = data.skillSystems || {};
  const systemKeys = Object.keys(systems);
  const systemSelector = $("#system-selector");

  const renderSystemSelector = () => {
    if (!systemSelector) return;
    systemSelector.innerHTML = systemKeys
      .map(
        (key, index) => `
          <button type="button" data-system="${escapeHtml(key)}" class="${index === 0 ? "is-active" : ""}">
            <span>${escapeHtml(systems[key].index)}</span>${escapeHtml(systems[key].shortTitle)}
          </button>
        `
      )
      .join("");

    $$("[data-system]", systemSelector).forEach((button) => {
      button.addEventListener("click", () => setSkillSystem(button.dataset.system));
    });
  };

  const setSkillSystem = (key) => {
    const system = systems[key];
    if (!system) return;
    const carStage = $(".car-stage");
    if (carStage) carStage.dataset.activeSystem = key;
    $("#system-index").textContent = `System ${system.index}`;
    $("#system-title").textContent = system.title;
    $("#system-copy").textContent = system.copy;
    $("#system-tags").innerHTML = system.skills
      .map(
        (skill, index) =>
          `<span class="tag" style="animation-delay:${index * 25}ms">${escapeHtml(skill)}</span>`
      )
      .join("");

    $$("[data-system]", $(".skills-explorer")).forEach((button) => {
      const isActive = button.dataset.system === key;
      button.classList.toggle("is-active", isActive);
      if (button.classList.contains("car-hotspot")) {
        button.setAttribute("aria-pressed", String(isActive));
      }
    });
  };

  $$(".car-hotspot").forEach((button) => {
    button.addEventListener("click", () => setSkillSystem(button.dataset.system));
  });

  /* Active navigation ----------------------------------------------- */
  const sections = $$("main > section[id]");
  const navLinks = $$(".nav-links a");
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-25% 0px -65%", threshold: [0, 0.1, 0.5] }
    );
    sections.forEach((section) => navObserver.observe(section));
  }

  renderProjects();
  renderSystemSelector();
  if (systemKeys.length) setSkillSystem(systemKeys[0]);

  const requestedProjectId = new URLSearchParams(window.location.search).get("project");
  if (requestedProjectId) {
    const requestedIndex = data.projects.findIndex((project) => project.id === requestedProjectId);
    if (requestedIndex >= 0) openProject(requestedIndex, false);
  }
})();
