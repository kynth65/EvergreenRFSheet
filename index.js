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
    printArea.style.maxWidth = "210mm"; // A4 width
    printArea.style.margin = "0";
    printArea.style.padding = "0";

    // Apply special styling for PDF output based on Avida Towers style
    printArea.style.fontSize = "9px";
    printArea.style.lineHeight = "1.2";
    printArea.style.fontFamily = "Arial, sans-serif";
    printArea.style.border = "1px solid #000";

    // Add border around the whole form
    printArea.style.borderWidth = "1px";
    printArea.style.borderStyle = "solid";
    printArea.style.borderColor = "#000";
    printArea.style.boxSizing = "border-box";

    // Reduce space between sections
    const sections = printArea.querySelectorAll(".section");
    sections.forEach((section) => {
      section.style.marginBottom = "0";
      section.style.paddingBottom = "0";
    });

    // Adjust the height of table rows to be compact like Avida's form
    const tableRows = printArea.querySelectorAll("tr");
    tableRows.forEach((row) => {
      // Make all rows compact
      row.style.height = "24px";
    });

    // Make all tables use fixed layout with proper borders
    const tables = printArea.querySelectorAll("table");
    tables.forEach((table) => {
      table.style.fontSize = "9px";
      table.style.marginBottom = "0";
      table.style.width = "100%";
      table.style.tableLayout = "fixed";
      table.style.borderCollapse = "collapse";
      table.style.border = "1px solid #000";
    });

    // Fix all table cells to have proper borders and padding like Avida form
    const tableCells = printArea.querySelectorAll("td, th");
    tableCells.forEach((cell) => {
      cell.style.padding = "2px 4px";
      cell.style.border = "1px solid #000";
      cell.style.fontSize = "9px";
      cell.style.verticalAlign = "middle";
    });

    // Apply equal width to label cells and data cells (50/50)
    const labelCells = printArea.querySelectorAll(".label-cell");
    labelCells.forEach((cell) => {
      cell.style.width = "50%";
      cell.style.fontWeight = "normal"; // Remove bold from labels
      
      // If there's a data cell next to this label, make it 50% too
      if (cell.nextElementSibling && !cell.nextElementSibling.classList.contains("label-cell")) {
        cell.nextElementSibling.style.width = "50%";
      }
    });

    // Fix SPOUSE'S DATA section using standard DOM methods
    const sectionTitles = printArea.querySelectorAll(".section-title");
    let spouseSection = null;
    
    // Find the spouse section by title text content
    for (let i = 0; i < sectionTitles.length; i++) {
      if (sectionTitles[i].textContent.includes("SPOUSE")) {
        spouseSection = sectionTitles[i].parentElement;
        break;
      }
    }
    
    if (spouseSection) {
      // Get the table within the spouse section
      const spouseTable = spouseSection.querySelector("table");
      
      if (spouseTable) {
        // Fix Mr/Mrs checkboxes visibility
        const mrCheckbox = spouseTable.querySelector('#mr');
        const mrsCheckbox = spouseTable.querySelector('#mrs');
        
        if (mrCheckbox && mrCheckbox.parentElement) {
          mrCheckbox.parentElement.style.display = "inline-block";
          mrCheckbox.parentElement.style.visibility = "visible";
        }
        
        if (mrsCheckbox && mrsCheckbox.parentElement) {
          mrsCheckbox.parentElement.style.display = "inline-block";
          mrsCheckbox.parentElement.style.visibility = "visible";
        }
        
        // Find all cells with birthdate or profession to fix them
        const spouseCells = spouseTable.querySelectorAll('td');
        
        spouseCells.forEach(cell => {
          // Fix any birthdate cell that contains profession text
          if (cell.textContent.includes("Birthdate") && cell.textContent.includes("Profession")) {
            cell.textContent = "Birthdate (mm/dd/yy):";
          }
          
          // Make sure every cell in spouse table is visible
          cell.style.display = "table-cell";
          cell.style.visibility = "visible";
        });
        
        // Find all checkboxes in the spouse section and ensure they're visible
        const spouseCheckboxes = spouseTable.querySelectorAll('input[type="checkbox"]');
        spouseCheckboxes.forEach(checkbox => {
          checkbox.style.display = "inline-block";
          checkbox.style.visibility = "visible";
          
          if (checkbox.parentElement) {
            checkbox.parentElement.style.display = "inline-block";
            checkbox.parentElement.style.visibility = "visible";
          }
        });
      }
    }

    // Make section titles match Avida's style
    sectionTitles.forEach((title) => {
      title.style.padding = "2px 4px";
      title.style.fontSize = "9px";
      title.style.marginBottom = "0";
      title.style.marginTop = "0";
      title.style.textAlign = "center";
      title.style.backgroundColor = "#f0f0f0";
      title.style.fontWeight = "bold";
      title.style.border = "1px solid #000";
    });

    // Make authorization text more compact
    const compactTexts = printArea.querySelectorAll(".compact-text");
    compactTexts.forEach((text) => {
      text.style.fontSize = "8px";
      text.style.lineHeight = "1.1";
      text.style.marginBottom = "0";
      text.style.marginTop = "0";
      text.style.textAlign = "justify";
    });

    // Fix signature section to match Avida's style
    const signatureSection = printArea.querySelector(".signature-section");
    if (signatureSection) {
      signatureSection.style.marginTop = "0";
      
      const signatureTable = signatureSection.querySelector("table");
      if (signatureTable) {
        signatureTable.style.marginBottom = "0";
        signatureTable.style.borderCollapse = "collapse";
      }

      const signatureLines = signatureSection.querySelectorAll(
        ".signature-line, .date-line"
      );
      signatureLines.forEach((line) => {
        line.style.height = "15px";
        line.style.borderBottom = "1px solid #000";
      });
      
      // Make distribution text smaller
      const distributionText = signatureSection.querySelector(".distribution");
      if (distributionText) {
        distributionText.style.fontSize = "8px";
        distributionText.style.textAlign = "center";
        distributionText.style.marginTop = "2px";
      }
    }

    // Replace all input fields with spans (NO underlines like Avida form)
    const inputs = printArea.querySelectorAll("input");
    inputs.forEach((input) => {
      if (input.type === "checkbox") {
        const span = document.createElement("span");
        span.innerHTML = input.checked ? "☑" : "☐";
        input.parentNode.replaceChild(span, input);
      } else {
        const span = document.createElement("span");
        span.style.fontSize = "9px";
        span.style.width = "100%";
        span.style.display = "inline-block";
        // Use the value or leave blank (no underlines like Avida form)
        span.textContent = input.value || " ";
        input.parentNode.replaceChild(span, input);
      }
    });

    // Generate PDF with settings that match Avida's style
    const opt = {
      margin: [5, 5, 5, 5], // Margins similar to Avida form
      filename: "EVERGREEN_RESIDENT_INFORMATION.pdf",
      image: { type: "jpeg", quality: 0.98 }, // High quality for clear text
      html2canvas: {
        scale: 2, // Higher scale for better quality
        letterRendering: true,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
      // Force single page
      pagebreak: { mode: ['avoid-all'] },
    };

    html2pdf().from(printArea).set(opt).save();
  });
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