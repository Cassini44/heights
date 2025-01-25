



class Dropdown {
  constructor(dropdownID, data) {
    this.dropdownID = dropdownID;
    this.data = data;

    // Select the input and ul elements based on dropdownID
    this.input = document.getElementById(dropdownID);
    this.input.readOnly = true;
    this.input.classList.add('dropdown')
    this.input.insertAdjacentHTML('afterend', '<ul class="dropdown"></ul>');


    this.ul = this.input.nextElementSibling

    // Call the populate method to generate the dropdown items
    this.populate();

    // Set up event listener for handling user selection
    this.addSelectionListener();
  }

  // Populate the dropdown menu with list items
  populate() {
    const fragment = document.createDocumentFragment();
    this.data.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item; // Safely adding text
      fragment.appendChild(li);
    });
    this.ul.appendChild(fragment);
  }

  // Set up event listener for when a user selects an item from the dropdown
  addSelectionListener() {
    this.ul.addEventListener("mousedown", (event) => {
        
      if (event.target.tagName === "LI") {
       
        // Update the input value with the selected item's text
        this.input.value = event.target.textContent;
        document.dispatchEvent(new Event('change'))
        this.input.blur()
       
        this.ul.blur()

        
      }
    });
  }
}