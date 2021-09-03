class customSingleHeader extends HTMLElement {

    render() {
        this.innerHTML = 
        `<header>
            <a href=${this.getAttribute("link-src")}><img src=${this.getAttribute("image-src")} id="logo-taskly"></a>
        </header>`
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
      return ["image-src", "link-src"];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  
}

customElements.define("custom-single-header", customSingleHeader);
