class customEditableTaskCreator extends HTMLElement {

    render() {
      this.innerHTML = 
        `<section id="form-outer-container">
            <section id="form-inner-container">
                <div id="user-input-panel">
                    <input placeholder="What's on your mind ?" class="user-added-input"></input>
                    <button class="add-item-public-btn"><i class="fas fa-plus"></i></button>
                </div>
            </section>
        </section>
        `
        // set the customstyle 
        document.getElementById("form-outer-container").style.margin = "2rem auto";
        document.getElementById("user-input-panel").style.paddingTop = "20px";
    
    }

    connectedCallback() {
      if (!this.rendered) {
        this.render();
        this.rendered = true;
      }
    }
  
    disconnectedCallback() {
    }
  
    static get observedAttributes() {
      return [""];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  
}

customElements.define("custom-editable-task-creator", customEditableTaskCreator);
