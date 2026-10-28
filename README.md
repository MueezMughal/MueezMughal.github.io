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

## Edit the work roadmap

Co-op stops remain in [`index.html`](index.html), ordered from Suncor to Zipline.
Each `.roadmap-stop` contains its company logo, dates, and a short hidden overview.
Select a logo to open the overview beside it; select it again, use the close
button, click outside, or press Escape to dismiss it. Only one overview is open
at a time. Upcoming roles have an `.experience-status` label.

Keep each stop's `id` stable so project origin links continue to work. To add a
stop, copy a list item, give its stop, toggle, detail, and title unique IDs, and
update `aria-controls` and `aria-labelledby` to match. Also update the desktop
`repeat(4, ...)` grid and road endpoints in the stylesheet for the new stop count.

Company marks are stored locally. The Tesla mark comes from
[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Tesla_T_symbol.svg);
the Zipline mark comes from [Zipline's homepage](https://www.flyzipline.com/).

## Local preview

The main site can be opened directly in a browser. For the interactive GLB
viewer, use a small local web server so the browser is allowed to load model
files. For example, if Python is installed:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.
