class customFooter extends HTMLElement {

    render() {

        this.innerHTML = 
        `<footer class="page-footer custom-footer opioner-backend">
          <div class="row-one-footer">
          </div>
          <div class="row-second-footer">
          </div>
          <hr class="rule-break-horizontal">
          <div class="row-third-footer">
          </div>
          <div class="row-copyright-footer">
          </div>
        </footer>`

        let footerRootOne = document.querySelector(".row-one-footer");
        let footerRootTwo = document.querySelector(".row-second-footer");
        let footerRootThree = document.querySelector(".row-third-footer");
        let footerCopyright = document.querySelector(".row-copyright-footer");

        let paraItemOne = document.createElement("p");
        paraItemOne.innerHTML = footerData["paraItems"][0]
        paraItemOne.setAttribute('id', 'subscription-text')
        footerRootOne.appendChild(paraItemOne)

        let secondRowDiv = document.createElement("div")
        footerRootTwo.appendChild(secondRowDiv)
        let secondRowParaOne = document.createElement("p")
        secondRowParaOne.setAttribute("id", "footer-subtitle-header-one")
        secondRowParaOne.innerHTML = footerData["footerSubtitleItems"][0]["title"]
        secondRowDiv.appendChild(secondRowParaOne)

        for(let item of footerData["footerSubtitleItems"][0]["items"]) {
          let tempParaForSecondRow = document.createElement("p")
          tempParaForSecondRow.classList.add("footer-subtitle-list-parent")
          let tempParaForSecondRowLink = document.createElement("a")
          tempParaForSecondRowLink.classList.add("footer-subtitle-list")
          tempParaForSecondRowLink.innerHTML = item 
          tempParaForSecondRow.appendChild(tempParaForSecondRowLink)

          secondRowDiv.appendChild(tempParaForSecondRow)
        }

        let thirdRowDiv = document.createElement("div")
        footerRootTwo.appendChild(thirdRowDiv)
        let thirdRowParaOne = document.createElement("p")
        thirdRowParaOne.setAttribute("id", "footer-subtitle-header-one")
        thirdRowParaOne.innerHTML = footerData["footerSubtitleItems"][1]["title"]
        thirdRowDiv.appendChild(thirdRowParaOne)

        for(let item of footerData["footerSubtitleItems"][1]["items"]) {
          let tempParaForThirdRow = document.createElement("p")
          tempParaForThirdRow.classList.add("footer-subtitle-list-parent")
          let tempParaForThirdRowLink = document.createElement("a")
          tempParaForThirdRowLink.classList.add("footer-subtitle-list")
          tempParaForThirdRowLink.setAttribute('href', item["link"])
          tempParaForThirdRowLink.innerHTML = item["item"] 
          tempParaForThirdRow.appendChild(tempParaForThirdRowLink)

          thirdRowDiv.appendChild(tempParaForThirdRow)
        }
        
        for(let item of footerData["cta"]) {
          let fourthRowDiv = document.createElement("div")
          let fourthRowDivLink = document.createElement("a")
          fourthRowDivLink.classList.add(item["customClass"])
          fourthRowDivLink.setAttribute("href", item["link"])
          fourthRowDivLink.innerHTML = item["title"]
          fourthRowDiv.appendChild(fourthRowDivLink)

          footerRootThree.appendChild(fourthRowDiv)
        }
        
        let paraItemCopyright = document.createElement("p");
        paraItemCopyright.innerHTML = footerData["paraItems"][1]
        paraItemCopyright.setAttribute('id', 'subscription-text')
        footerRootOne.appendChild(paraItemCopyright)
        footerCopyright.appendChild(paraItemCopyright)

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
