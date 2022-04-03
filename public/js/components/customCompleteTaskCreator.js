class customCompleteTaskCreator extends HTMLElement {

    render() {
      this.innerHTML = 
        `<section id="form-outer-container">
            <section id="form-inner-container">
                <div id="header">
                    <h1>Your opinion</h1>
                </div>
                <div id="user-input-panel">
                    <input placeholder="What's on your mind ?" class="user-added-input"></input>
                    <button class="add-item-btn"><i class="fas fa-plus"></i></button>
                </div>
            </section>
        </section>
        `      
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

customElements.define("custom-complete-task-creator", customCompleteTaskCreator);
