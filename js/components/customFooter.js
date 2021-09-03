class customFooter extends HTMLElement {

    render() {

        this.innerHTML = 
        `<footer>
            <div class="footer-dashboard">
            </div>
        </footer>`

        let footerRoot = document.getElementsByClassName("footer-dashboard")[0];
        
        for(let item of footerData) {
            let paraItem = document.createElement("p");
            paraItem.innerHTML = item;
            footerRoot.appendChild(paraItem);
        }

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
      return [];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  
}

customElements.define("custom-footer", customFooter);
