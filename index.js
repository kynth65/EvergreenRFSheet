document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  // View Management
  const views = {
    login: document.getElementById("loginView"),
    form: document.getElementById("formView"),
  };

  // Debug check if elements are found
  console.log("Views found:", {
    login: !!views.login,
    form: !!views.form,
  });

  function showView(viewName) {
    console.log("Attempting to show view:", viewName);
    // First hide all views
    Object.values(views).forEach((view) => {
      if (view) {
        view.style.display = "none";
        view.classList.remove("active");
        console.log("Hidden view");
      }
    });
    // Then show the selected view
    if (views[viewName]) {
      views[viewName].style.display = "block";
      views[viewName].classList.add("active");
      console.log("Shown view:", viewName);
    } else {
      console.error("View not found:", viewName);
    }
  }

  // Login Form Logic
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");
    console.log("Form submitted");

    // For demo purposes, the password is "EVERGREEN"
    if (password === "EVERGREEN") {
      console.log("Password correct");
      localStorage.setItem("isAuthenticated", "true");
      showView("form");
    } else {
      console.log("Password incorrect");
      error.textContent = "Incorrect password. Please try again.";
      error.classList.remove("hidden");
      document.getElementById("password").value = "";
    }
  });

  // Handle checkbox behavior for occupant type
  const occupantTypeCheckboxes = document.querySelectorAll(
    'input[name="occupantType"]'
  );
  occupantTypeCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // If this checkbox is checked, uncheck the others
      if (this.checked) {
        occupantTypeCheckboxes.forEach((cb) => {
          if (cb !== this) {
            cb.checked = false;
          }
        });
      }
    });
  });

  // Handle checkbox behavior for spouse salutation
  const spouseSalutationCheckboxes = document.querySelectorAll(
    'input[name="spouseSalutation"]'
  );
  spouseSalutationCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // If this checkbox is checked, uncheck the others
      if (this.checked) {
        spouseSalutationCheckboxes.forEach((cb) => {
          if (cb !== this) {
            cb.checked = false;
          }
        });
      }
    });
  });

  // Handle checkbox behavior for parking included
  const parkingIncludedCheckboxes = document.querySelectorAll(
    'input[name="parkingIncluded"]'
  );
  parkingIncludedCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      // If this checkbox is checked, uncheck the others
      if (this.checked) {
        parkingIncludedCheckboxes.forEach((cb) => {
          if (cb !== this) {
            cb.checked = false;
          }
        });
      }
    });
  });

  // Reset form
  document.getElementById("resetForm").addEventListener("click", function () {
    document.getElementById("residentForm").reset();
  });

  // Generate PDF
  document.getElementById("downloadPDF").addEventListener("click", function () {
    // Create a copy of the form to modify for PDF generation
    const printArea = document.getElementById("printArea").cloneNode(true);

    // Fix layout issues before generating PDF
    printArea.style.width = "100%";
    printArea.style.maxWidth = "215mm"; // A4 width
    printArea.style.margin = "0";
    printArea.style.padding = "0";

    // Apply special styling for PDF output
    printArea.style.fontSize = "10px";
    printArea.style.lineHeight = "1.2";

    // Reduce space between sections
    const sections = printArea.querySelectorAll(".section");
    sections.forEach((section) => {
      section.style.marginBottom = "2px";
    });

    // Adjust the height of table rows
    const tableRows = printArea.querySelectorAll("tr");
    tableRows.forEach((row) => {
      // Skip header rows
      if (!row.querySelector("th")) {
        row.style.height = "18px";
      }
    });

    // Make compact tables for PDF
    const tables = printArea.querySelectorAll("table");
    tables.forEach((table) => {
      table.style.fontSize = "10px";
      table.style.marginBottom = "3px";
      table.style.width = "100%";
    });

    // Make authorization text more compact
    const compactTexts = printArea.querySelectorAll(".compact-text");
    compactTexts.forEach((text) => {
      text.style.fontSize = "8px";
      text.style.lineHeight = "1.1";
      text.style.marginBottom = "2px";
      text.style.marginRight = "10px";
      text.style.paddingBottom = "0";
    });

    // Make section titles more compact
    const sectionTitles = printArea.querySelectorAll(".section-title");
    sectionTitles.forEach((title) => {
      title.style.padding = "2px 3px";
      title.style.fontSize = "10px";
      title.style.marginBottom = "2px";
      title.style.marginTop = "0";
    });

    // Replace all input fields with spans containing their values
    const inputs = printArea.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        const span = document.createElement("span");
        span.innerHTML = input.checked ? "☑" : "☐";
        input.parentNode.replaceChild(span, input);
      } else {
        const span = document.createElement("span");
        span.style.fontSize = "10px";
        // Use shorter underlines to save space
        span.textContent = input.value || "______";
        input.parentNode.replaceChild(span, input);
      }
    });

    // Adjust the signature area
    const signatureSection = printArea.querySelector(".signature-section");
    if (signatureSection) {
      signatureSection.style.marginTop = "5px";

      const signatureLines = signatureSection.querySelectorAll(
        ".signature-line, .date-line"
      );
      signatureLines.forEach((line) => {
        line.style.height = "15px";
      });
    }

    // Generate PDF with proper settings
    const opt = {
      margin: [2, 2, 2, 2], // Margins - top, right, bottom, left in mm (increased right margin)
      filename: "EVERGREEN_RESIDENT_INFORMATION.pdf",
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 1.1,
        letterRendering: true,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: false,
      },
      pagebreak: { avoid: ["tr", "td", ".section-title", "table"] },
    };

    html2pdf().from(printArea).set(opt).save();
  });

  html2pdf().from(printArea).set(opt).save();
});

// Initialize the app
function initialize() {
  console.log("Initializing app");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  console.log("Is authenticated:", isAuthenticated);

  // Generate dynamic reference number based on date and time
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const referenceNumber = `Form-F-${year}${month}${day}-${hours}${minutes}${seconds}`;
  document.getElementById("referenceNumber").textContent = referenceNumber;

  if (isAuthenticated === "true") {
    showView("form");
  } else {
    showView("login");
  }
}

// Start the app
initialize();
