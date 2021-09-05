class customLandingIntroSection extends HTMLElement {

    render() {

        // basic skeleton 
        this.innerHTML = 
        `
        <section id="taskly-intro-container">
            <div class="taskly-intro-para">
            </div>
            <div class="taskly-intro-pic">
                <img src="">
            </div>
        </section>
        `
        
        // load data from data files and render styles 

        let introSectionContainer = document.querySelectorAll("#taskly-intro-container")[`${this.getAttribute("item-section-id")}`];
        if(introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.container != undefined) {
            introSectionContainer.style.cssText = introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.container; 
        }
        let introSectionPara = document.getElementsByClassName("taskly-intro-para")[`${this.getAttribute("item-section-id")}`];
        
        for(let item of introSectionParaData[`${this.getAttribute("item-section-id")}`].items) {
            let paraItem = document.createElement("p");
            paraItem.innerHTML = item;
            introSectionPara.appendChild(paraItem);
        }

        let introSectionPic = document.getElementsByClassName("taskly-intro-pic")[`${this.getAttribute("item-section-id")}`];
        introSectionPic.children[0].src = introSectionParaData[`${this.getAttribute("item-section-id")}`].src

        if(introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.pic != undefined) {
            introSectionPic.children[0].style.cssText = introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.pic;
        }

        if(introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.para != undefined) {
            introSectionPara.style.cssText = introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.para 
        }

        for(let paraId in introSectionPara.children) {
            if(introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.innerPara != undefined && introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.innerPara[paraId] != undefined) {
                introSectionPara.children[paraId].style.cssText = introSectionParaData[`${this.getAttribute("item-section-id")}`].styles.innerPara[paraId];
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
      return ["item-section-id", "reverse"];
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this.render();
    }
  
}

customElements.define("custom-landing-intro-section", customLandingIntroSection);
