class customSingleHeader extends HTMLElement {

    render() {
      this.innerHTML = 
      `<header>
      </header>`

      let headerRef = document.querySelector("header");
      if(headerData.items.logo != null) {
        let link = document.createElement("a");
        link.href = headerData.items.logo.link.linkSrc
        let image = document.createElement("img");
        image.src = headerData.items.logo.image.imgSrc
        image.style.cssText = headerData.items.logo.image.styles
        link.appendChild(image);

        headerRef.appendChild(link);
      }

      if(headerData.items.navLinks != null) {
        
        let navContainer = document.createElement("div");
        navContainer.classList.add("nav-links-container");
        headerRef.appendChild(navContainer);
        for(let link of headerData.items.navLinks.links) {
          
          let linkDiv = document.createElement("div");
          linkDiv.classList.add("home-nav-links");
          let aLink = document.createElement("a");
          let linkText = document.createTextNode(link.text)
          aLink.appendChild(linkText);
          if(link.src != undefined) {
            aLink.href = link.src;
          }
          
          if(link.styles != null) {
            aLink.style.cssText = link.styles;
          }

          linkDiv.appendChild(aLink)
          navContainer.appendChild(linkDiv);
        }
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
      return ["image-src", "link-src"];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  
}

customElements.define("custom-single-header", customSingleHeader);
