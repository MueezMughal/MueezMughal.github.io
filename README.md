# Mueez Mughal — Portfolio

A lightweight static portfolio hosted with GitHub Pages. The site uses plain HTML,
CSS, and JavaScript, so there is no build step.

## Add, edit, or remove a project

All project content is in
[`assets/js/portfolio-data.js`](assets/js/portfolio-data.js). Copy an existing
project object, give it a unique `id`, and update its text and file paths. Delete
an object to remove its project from the site.

Put project assets in a folder such as:

```text
assets/
└── projects/
    └── suspension-upright/
        ├── cover.jpg
        └── upright.glb
```

Each project can have one interactive GLB model. GLB preserves the colors and
materials exported from your CAD or PCB software:

```js
model: {
  label: "upright.glb",
  src: "assets/projects/suspension-upright/upright.glb",
  caption: "Suspension upright ready to rotate, zoom, and download."
}
```

The model loads automatically when the project opens. Visitors can drag to
rotate it, scroll to zoom, and download the same GLB using the button above the
viewer. The `cover` image remains separate and is used only on the project card.
If a project has no 3D model, leave `model.src` empty and the complete 3D section
will remain hidden.

### Add a media gallery

The optional `media` list accepts images, web videos, and PDF documents. The
project dialog builds the gallery and its navigation automatically:

```js
media: [
  {
    type: "image",
    src: "assets/projects/example/test-result.jpg",
    alt: "Test fixture during validation",
    caption: "Validation setup at the final design load."
  },
  {
    type: "video",
    src: "assets/projects/example/demo.mp4",
    poster: "assets/projects/example/cover.jpg",
    mime: "video/mp4",
    caption: "The mechanism completing a full cycle."
  },
  {
    type: "document",
    src: "assets/projects/example/report.pdf",
    label: "Design report",
    caption: "Calculations, simulation, and test results."
  }
]
```

Use an H.264 MP4 for the broadest browser support. A project with one media item
shows it without thumbnail controls; multiple items become a scrollable gallery.

To relate a project to co-op work, use an origin like:

```js
origin: {
  type: "work",
  label: "Suncor Energy",
  logo: "assets/suncor-logo.png",
  relatedExperienceId: "experience-suncor"
}
```

The logo in the project detail view will then link back to that co-op entry.

## Edit co-op details

Co-op roles remain in [`index.html`](index.html). The company logo and
**Explore role** button open the role detail panel. Skills are plain `.tag`
elements that can be added or removed without any JavaScript.

## Edit the automotive skills map

The clickable car system content is in the `skillSystems` section of
[`assets/js/portfolio-data.js`](assets/js/portfolio-data.js). Edit the title,
description, or `skills` list; the diagram and selector update automatically.

## Local preview

The main site can be opened directly in a browser. For the interactive GLB
viewer, use a small local web server so the browser is allowed to load model
files. For example, if Python is installed:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.
