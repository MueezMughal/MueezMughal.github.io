/*
  ================================================================
  EASY-EDIT PORTFOLIO DATA
  ================================================================

  TO ADD A PROJECT
  1. Copy one complete object inside `projects`.
  2. Give it a unique `id`.
  3. Put images and CAD files in assets/projects/your-project-name/.
  4. Update the paths below. The project rail and detail viewer render
     automatically — no HTML changes are needed.

  GLB MODEL
  Each project has one `model` object. Add the path to your .glb file
  and it will automatically load as an interactive, full-color 3D model
  with a download button. Leave model.src empty when a project does not
  have a 3D model; the entire 3D section will stay hidden.

  MEDIA GALLERY
  Add image, video, or document objects to `media`. The viewer creates
  the gallery, captions, and navigation automatically.

  WORK PROJECTS
  Set origin.type to "work", add the company logo, and point
  relatedExperienceId at the matching experience article in index.html.
*/

window.PORTFOLIO_DATA = {
  projects: [
    {
      id: "servo-press-mechanical",
      status: "Fingerprint Technologies · Precision Machine Design",
      title: "Servo Press V2 — Mechanical System",
      blurb: "Designed and manufactured a precision servo press that held a critical working clearance to 0.001 in (25.4 µm) while supporting assembly, validation, and DFMA.",
      cover: "assets/project-images/Servo_Press_Image.JPG",
      coverAlt: "Completed dual-axis servo press on a workbench",
      origin: {
        type: "work",
        label: "Fingerprint Technologies",
        logo: "assets/fingerprint_technologies_corp_logo.jpg",
        relatedExperienceId: "experience-fingerprint"
      },
      tags: [
        "Machine Design",
        "CAD",
        "Fusion 360 CAM",
        "CNC Machining",
        "GD&T",
        "Feedback Control",
        "DFMA"
      ],
      story: [
        "I designed the mechanical system for a servo press used to assemble and validate precision hardware. The central challenge was maintaining an extremely consistent working clearance while keeping the machine practical to manufacture, assemble, and service.",
        "The press stack was designed around a maximum clearance variation of 0.001 in (25.4 µm). I developed the CNC toolpaths and machining approach needed to keep the working geometry concentric and square, then modified off-the-shelf components where possible to reduce cost without giving up precision.",
        "Distance travelled and pressing force close the feedback loop so the machine can control each operation instead of relying on an open-loop motion command. Beyond assembly, the press became a useful DFMA tool for exposing tolerance, access, and process issues in the production workflow."
      ],
      highlights: [
        "Held a critical working clearance to 0.001 in (25.4 µm)",
        "Created CNC toolpaths for concentric and square press geometry",
        "Modified off-the-shelf components to reduce cost",
        "Closed-loop control using travel and pressing-force feedback",
        "Supported design-for-manufacture and assembly planning"
      ],
      model: {
        label: "Servo_Press_V2.glb",
        src: "assets/.glb/Servo_Press_V2.glb",
        caption: "Interactive full-color model of the Servo Press V2 mechanical assembly."
      },
      media: [
        {
          type: "image",
          src: "assets/project-images/Servo_Press_Image.JPG",
          alt: "Completed dual-axis servo press on a workbench",
          caption: "The completed Servo Press V2 mechanical system."
        },
        {
          type: "video",
          src: "assets/project-images/Videos/Servo_Press_Demo.mp4",
          poster: "assets/project-images/Servo_Press_Image.JPG",
          mime: "video/mp4",
          caption: "The press operating during mechanical and controls validation."
        }
      ],
      links: []
    },
    {
      id: "servo-press-pcb",
      status: "Fingerprint Technologies · Hardware & PCB Design",
      title: "Servo Press V1 — Control PCB",
      blurb: "Designed the mixed-signal control board that coordinates the servo press motors, display, and sensor-feedback system.",
      cover: "assets/project-images/ServoPressPCB.jpg",
      coverAlt: "Assembled Servo Press control PCB",
      origin: {
        type: "work",
        label: "Fingerprint Technologies",
        logo: "assets/fingerprint_technologies_corp_logo.jpg",
        relatedExperienceId: "experience-fingerprint"
      },
      tags: [
        "Hardware Design",
        "PCB",
        "Schematic Capture",
        "Component Selection",
        "Mixed-Signal Layout",
        "Bring-up & Testing"
      ],
      story: [
        "I designed the main control board for the Servo Press machine during my time at Fingerprint Technologies. The board coordinates the stepper motors, a display, and feedback from a range of sensors.",
        "The two largest challenges were harmonizing the power electronics driving high-torque steppers with delicate analog circuitry on the same board, and learning the eCAD and PCB-design workflow under a strict timeline.",
        "A huge thank you to my coworker Cameron Jupp for assisting throughout the design and validation stages. Their support made the board's bring-up and verification a much more manageable task."
      ],
      highlights: [
        "Partitioned motor power and sensitive analog circuitry",
        "Integrated stepper, display, and multi-sensor interfaces",
        "Completed component selection and schematic capture",
        "Developed component placement and PCB layout",
        "Supported board bring-up, debugging, and validation"
      ],
      model: {
        label: "ServoPressV2PCB.glb",
        src: "assets/.glb/ServoPressV2PCB.glb",
        caption: "Interactive full-color GLB model of the Servo Press control PCB."
      },
      media: [
        {
          type: "image",
          src: "assets/project-images/ServoPressPCB.jpg",
          alt: "Assembled Servo Press control PCB",
          caption: "The manufactured Servo Press control board."
        }
      ],
      links: []
    },
    {
      id: "gen3-steering-wheel",
      status: "UBC Solar · Vehicle Dynamics",
      title: "Gen 3 Steering Wheel Redesign",
      blurb: "Redesigned UBC Solar's Gen 3 steering wheel around driver ergonomics, structural validation, electronics integration, and a reusable quick-release interface.",
      cover: "assets/projects/steering-wheel/steering-wheel-cover.jpg",
      coverAlt: "Steering-wheel baseplate, controls PCB, and prototype enclosure components",
      origin: {
        type: "team",
        label: "UBC Solar",
        logo: "assets/brands/ubc-solar-mark.png",
        relatedExperienceId: "ubc-solar"
      },
      tags: [
        "SolidWorks",
        "ANSYS ACP",
        "Composite FEA",
        "6061-T6 Aluminum",
        "PCB Integration",
        "Ergonomics",
        "Design for Manufacturing"
      ],
      story: [
        "I led the mechanical redesign and validation of UBC Solar's Gen 3 steering wheel. The design had to improve driver ergonomics, reduce mass, route the embedded controls PCB cleanly, and remain compatible with the vehicle's quick-release steering interface.",
        "I built the full SolidWorks assembly, compared composite and aluminum concepts through FEA, and used ANSYS ACP to evaluate the composite layup. A weighted design decision ultimately selected a 6061-T6 aluminum baseplate because the team's schedule did not allow enough material testing to confidently validate the composite option.",
        "I also designed a custom flange that allows the hub spline to be welded to a replaceable flange instead of directly to the steering column. This reusable interface reduces rework in future vehicle generations. The design was completed alongside the Power & Signals team to package the PCB, controls, and cable routing."
      ],
      highlights: [
        "Completed the CAD, validation, and manufacturing package",
        "Compared composite and aluminum concepts using FEA",
        "Selected 6061-T6 after schedule and material-test risk review",
        "Designed a reusable welded-flange quick-release interface",
        "Integrated PCB packaging and signal routing with Power & Signals"
      ],
      model: {
        label: "bs2025_str_steering_wheel_assembly.glb",
        src: "assets/.glb/bs2025_str_steering_wheel_assembly.glb",
        caption: "Interactive full-color model of the Gen 3 steering-wheel assembly."
      },
      media: [
        {
          type: "image",
          src: "assets/projects/steering-wheel/steering-wheel-build.jpg",
          alt: "Steering-wheel baseplate, controls PCB, and prototype enclosure components",
          caption: "The aluminum baseplate, controls PCB, and enclosure prototypes during the build."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/aluminum-baseplate-fea.png",
          alt: "Finite-element displacement result for the aluminum steering-wheel baseplate",
          caption: "Static displacement study of the selected 6061-T6 aluminum baseplate."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/ansys-acp.png",
          alt: "ANSYS ACP stress result for the composite steering-wheel concept",
          caption: "ANSYS ACP composite model used to evaluate the alternate layup."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/assembly-cad.png",
          alt: "Side view of the complete steering-wheel CAD assembly",
          caption: "Full steering-wheel assembly showing the PCB, controls, hub, and enclosure stack."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/assembly-build-web.jpg",
          alt: "Aluminum steering-wheel baseplate, PCB, and prototype parts during assembly",
          caption: "Baseplate, electronics, and prototype enclosure parts during assembly."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/flange-cad.png",
          alt: "Detailed CAD model of the reusable steering-column flange",
          caption: "Custom flange interface designed to preserve the steering column across future iterations."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/flange-fea.png",
          alt: "Von Mises stress result for the steering-column flange",
          caption: "Von Mises stress study of the flange and column load path."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/free-body-validation.png",
          alt: "Free-body diagram used to validate steering-wheel fastener loads",
          caption: "Hand calculation and free-body model used to validate the fastener load case."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/rapid-prototype.png",
          alt: "Cardboard and paper-roll prototype of the steering-wheel mechanism",
          caption: "Low-cost physical prototype used to test the mechanism before detailed CAD."
        },
        {
          type: "image",
          src: "assets/projects/steering-wheel/welded-flange-web.jpg",
          alt: "Manufactured spline and flange installed on the steering column",
          caption: "The welded spline and flange assembly installed on the vehicle."
        }
      ],
      links: [
        {
          label: "UBC Solar",
          href: "https://ubcsolar.com/"
        }
      ]
    },
    {
      id: "suncor-esp-diagnostics",
      status: "Suncor Energy · Production Engineering",
      title: "ESP Diagnostics & Solids Analysis",
      blurb: "Built a physics-informed Python diagnostic platform that distinguished snapped-shaft failures from electrical and hydraulic events on legacy SAGD wells.",
      cover: "assets/projects/suncor-esp/snapped-shaft-event.png",
      coverAlt: "Redacted diagnostic plots for a snapped-shaft ESP event",
      origin: {
        type: "work",
        label: "Suncor Energy",
        logo: "assets/suncor-logo.png",
        relatedExperienceId: "experience-suncor"
      },
      tags: [
        "Python",
        "Pandas",
        "NumPy",
        "Plotly",
        "ESP Diagnostics",
        "Signal Analysis",
        "Fluid Mechanics",
        "VFD Systems"
      ],
      story: [
        "At Suncor's Firebag SAGD operation, I developed a data-driven diagnostic platform for electrical submersible pumps. The work began as a solids-related efficiency study and evolved into a classifier for snapped-shaft failures on legacy pads that did not have direct torque sensing.",
        "The tool combined VFD and three-phase motor signals with a first-principles energy balance for ideal hydraulic power. Python pipelines built with Pandas, NumPy, and Plotly processed roughly 45,000 points per well over a 30-day window and more than one million points across a well's operating history.",
        "Hydraulic-to-ideal power ratios and percent-change features made snapped-shaft events distinguishable from deadheading, short circuits, and other failure modes. The result supported immediate classification, avoided unnecessary flush operations and troubleshooting delays, and was estimated to offer $2.5 million in annual savings. Operational names and values in the media are intentionally redacted."
      ],
      highlights: [
        "Built a full pressure, velocity, elevation, and head-loss energy balance",
        "Processed about 45,000 points per well and 1,000,000+ lifetime points",
        "Distinguished snapped shafts from hydraulic and electrical events",
        "Reduced unnecessary troubleshooting and flush operations",
        "Estimated annual savings of $2.5 million"
      ],
      model: {
        label: "",
        src: "",
        caption: ""
      },
      media: [
        {
          type: "image",
          src: "assets/projects/suncor-esp/snapped-shaft-event.png",
          alt: "Redacted diagnostic plots for a snapped-shaft ESP event",
          caption: "Signature of a confirmed snapped-shaft event across the diagnostic channels."
        },
        {
          type: "image",
          src: "assets/projects/suncor-esp/deadheading-event.png",
          alt: "Redacted diagnostic plots for an ESP deadheading event",
          caption: "Deadheading event used to validate separation from a mechanical shaft failure."
        },
        {
          type: "image",
          src: "assets/projects/suncor-esp/short-circuit-event.png",
          alt: "Redacted diagnostic plots for an ESP short-circuit event",
          caption: "Electrical short-circuit signature used as a contrasting failure case."
        },
        {
          type: "document",
          src: "assets/projects/suncor-esp/power-analysis-solids.pdf",
          label: "Power Analysis of Solids in Wells",
          caption: "Technical analysis of hydraulic power, solids behaviour, and well performance."
        },
        {
          type: "document",
          src: "assets/projects/suncor-esp/snapped-shaft-tool-upgrades.pdf",
          label: "Snapped Shaft Tool Upgrades",
          caption: "Development record for the upgraded event-classification workflow."
        }
      ],
      links: []
    }
  ],

  skillSystems: {
    wheels: {
      index: "01",
      title: "Suspension & Wheels",
      shortTitle: "Suspension",
      copy: "Engineering the car from the contact patch upward.",
      skills: [
        "Tire Modelling",
        "Suspension Modelling",
        "Suspension Engineering",
        "Vehicle Dynamics",
        "FEA",
        "CAD"
      ]
    },
    powertrain: {
      index: "02",
      title: "Powertrain & Motor",
      shortTitle: "Powertrain",
      copy: "Turning stored energy into controlled, reliable motion.",
      skills: [
        "Powertrain Layout",
        "Motor Integration",
        "Shaft & Bearing Design",
        "Gearing",
        "Thermal Analysis",
        "GD&T"
      ]
    },
    electrical: {
      index: "03",
      title: "Electrical Systems",
      shortTitle: "Electrical",
      copy: "The sensing, power, and communications nervous system.",
      skills: [
        "PCB Design",
        "KiCad",
        "Microcontrollers",
        "I²C / SPI / UART / CAN",
        "VHDL",
        "Benchtop Testing"
      ]
    },
    controls: {
      index: "04",
      title: "Controls & Software",
      shortTitle: "Controls",
      copy: "Software and logic that make the physical system respond.",
      skills: [
        "C",
        "C++",
        "Python",
        "MATLAB",
        "Embedded Systems",
        "Git"
      ]
    },
    fabrication: {
      index: "05",
      title: "Build & Manufacturing",
      shortTitle: "Manufacturing",
      copy: "Taking a design from CAD to a manufactured part you can validate.",
      skills: [
        "SolidWorks",
        "Fusion 360 CAD & CAM",
        "CNC Machining",
        "Manual Machining",
        "Technical Writing",
        "Cross-functional Teams"
      ]
    }
  }
};
