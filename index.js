/////////////////////////////////////////////////////////////////////////
// ALL VARIABLES ARE DECLARED HERE

let breweries = []
let selectedState = ""
let breweryTypeFilter = ""
let selectedCityList = []
let breweryDisplayCounter = 0
let listSectionSearch = ""

/////////////////////////////////////////////////////////////////////////
// ALL FUNCTIONS ARE DECLARED HERE

function displayMainPage(){
    createUserInputListener()
    displayMainSection()
}

function createUserInputListener(){
    let stateInputForm = document.querySelector("#select-state-form")
    stateInputForm['select-state'].setAttribute("required","true")

    stateInputForm.addEventListener("submit",function(event){
        event.preventDefault() 
        selectedState =  stateInputForm['select-state'].value
        stateInputForm['select-state'].value = ""
        retrieveDataFromExternalDatabase()

    }) 
}

function retrieveDataFromExternalDatabase(){
    return fetch(`https://api.openbrewerydb.org/breweries?per_page=50&by_state=${selectedState}`)
    .then(function (promise) {
        return promise.json()
    })
    .then(function (data) {
        cleanData(data)
        displayMainSection()
    })
}

function cleanData(data){

    // FILTER BREWERIES BY MICRO, REGIONAL & BREWPUB
    breweries = data.filter(function(brewery){
        return (brewery.brewery_type === "micro" || brewery.brewery_type === "regional" || brewery.brewery_type === "brewpub") 
    })
}

function displayMainSection(){
    let mainSection = document.querySelector("main")
    mainSection.innerHTML = ""
    displayFiltersSection()
    displayListSection()
}

function displayListSection(){
    let mainSection = document.querySelector("main")
    
    // CREATE H1 HEADING
    let listSectionH1 = document.createElement("h1")
    listSectionH1.innerText = "List of breweries"
    mainSection.append(listSectionH1)
    
    // CREATE "SEARCH BAR" HEADER
    let listSectionHeader = document.createElement("header")
    listSectionHeader.setAttribute("id","search-bar")
    mainSection.append(listSectionHeader)

    // CREATE "SEARCH BREWERIES" FORM
    let listSectionForm = document.createElement("form")
    listSectionForm.setAttribute("id","search-breweries-form")
    listSectionForm.setAttribute("autocomplete","off")
    listSectionHeader.append(listSectionForm)

    listSectionForm.addEventListener("submit",(function(event){
        event.preventDefault() 
        listSectionSearch  = listSectionInput.value 
        listSectionInput.value = ""
        displayListOfBreweries()
        
        // CLEAR THE SEARCH STATUS TO PREVENT UNPREDICTABLE RESULTS
        listSectionSearch = ""
    }))
    
    // CREATE "SEARCH BREWERIES" LABEL
    let listSectionLabel = document.createElement("label")
    listSectionLabel.setAttribute("for","search-breweries")
    listSectionForm.append(listSectionLabel)

    // CREATE "SEARCH BREWERIES" H2
    let listSectionH2 = document.createElement("h2")
    listSectionH2.innerText = "Search breweries:"
    listSectionLabel.append(listSectionH2)

    // CREATE "SEARCH BREWERIES" INPUT
    let listSectionInput = document.createElement("input")
    listSectionInput.setAttribute("id","search-breweries")
    listSectionInput.setAttribute("name","search-breweries")
    listSectionInput.setAttribute("type","text")
    listSectionForm.append(listSectionInput)

    // CREATE ARTICLE
    let listSectionArticle = document.createElement("article")
    mainSection.append(listSectionArticle)

    // CREATE "BREWERIES" UNORDERED LIST
    let breweryList = document.createElement("ul")
    breweryList.setAttribute("class","breweries-list")
    listSectionArticle.append(breweryList)

    displayListOfBreweries()
}


// DISPLAYS ALL THE BREWERY DETAILS IN A UNORDERED LIST
function displayListOfBreweries(){
    let breweryUL = document.querySelector("ul")
    breweryUL.innerHTML = "" 
    
    breweryDisplayCounter = 0
    for (const brewery of breweries) 
        displayBrewery(brewery)
}

function displayBrewery(brewery){

    // ARE THERE 10 BREWERIES ALREADY DISPLAYED ON SCREEN?
    if (breweryDisplayCounter === 10) 
        return
    
    // IF BREWERY TYPE IS SELECTED. DOES IT MATCH THE BREWERY?
    if (breweryTypeFilter !== "" && breweryTypeFilter !== brewery.brewery_type) 
        return

    // IF THERE ARE CITIES SELECTED. DO ANY OF THEM MATCH THE BREWERY?
    if (selectedCityList.length !== 0 && selectedCityList.indexOf(brewery.city) === -1) 
        return

    // IF "SEARCH BREWERIES IS NOT EMPTY" AND THE CRITERIA IS NOT PRESENT
    // IN THE NAME OR CITY THEN DO NOT DISPLAY BREWERY
    if (listSectionSearch !== "") 
        if (!brewery.name.toUpperCase().includes(listSectionSearch.toUpperCase()) && !brewery.city.toUpperCase().includes(listSectionSearch.toUpperCase())) 
            return

    // INCREMENT THE DISPLAY BREWERY COUNTER
    breweryDisplayCounter++
    
    // FIND THE BREWERY LIST SECTION ON THE PAGE
    let breweryList = document.querySelector(".breweries-list")
    let breweryLi = document.createElement("li")
    breweryList.append(breweryLi)

    // CREATE H2 FOR NAME
    let breweryLiH2 = document.createElement("h2")
    breweryLiH2.innerText = brewery.name
    breweryLi.append(breweryLiH2)

    // CREATE A DIV FOR "TYPE"
    let breweryLiDiv = document.createElement("div")
    breweryLiDiv.setAttribute("class","type")
    breweryLiDiv.innerText = brewery.brewery_type
    breweryLi.append(breweryLiDiv)
    
    // CREATE A SECTION FOR THE ADDRESS
    let breweryLiSectionAddress = document.createElement("section")
    breweryLiSectionAddress.setAttribute("class","address")
    breweryLi.append(breweryLiSectionAddress)

    // CREATE AN H3 FOR THE ADDRESS
    let breweryLiSectionAddressH3 = document.createElement("h3")
    breweryLiSectionAddressH3.innerText = "Address:"
    breweryLiSectionAddress.append(breweryLiSectionAddressH3)

    // CREATE A P FOR THE FOR STREET
    let breweryLiSectionAddressP = document.createElement("p")
    breweryLiSectionAddressP.innerText = brewery.street
    breweryLiSectionAddress.append(breweryLiSectionAddressP)

    // CREATE P FOR THE ADDRESS2
    let breweryLiSectionAddressP2 = document.createElement("p")
    breweryLiSectionAddress.append(breweryLiSectionAddressP2)
    
    // CREATE A STRONG FOR THE ADDRESS3
    let breweryLiSectionAddressS = document.createElement("strong")
    breweryLiSectionAddressS.innerText = brewery.city + ", " + brewery.postal_code
    breweryLiSectionAddressP2.append(breweryLiSectionAddressS)

    // CREATE A SECTION FOR THE PHONE
    let breweryLiSectionPhone = document.createElement("section")
    breweryLiSectionPhone.setAttribute("class","phone")
    breweryLi.append(breweryLiSectionPhone)

    // CREATE AN H3 FOR THE PHONE
    let breweryLiSectionPhoneH3 = document.createElement("h3")
    breweryLiSectionPhoneH3.innerText = "Phone: "
    breweryLiSectionPhone.append(breweryLiSectionPhoneH3)

    // CREATE A P FOR THE THE PHONE
    let breweryLiSectionPhoneP = document.createElement("p")
    breweryLiSectionPhoneP.innerText = brewery.phone
    breweryLiSectionPhone.append(breweryLiSectionPhoneP)

    // CREATE A SECTION FOR THE URL
    let breweryLiSectionURL = document.createElement("section")
    breweryLiSectionURL.setAttribute("class","link")
    breweryLi.append(breweryLiSectionURL)

    // CREATE AN ANCHOR FOR THE URL
    let breweryLiSectionA = document.createElement("a")
    breweryLiSectionA.setAttribute("href",brewery.website_url)
    breweryLiSectionA.setAttribute("target","_blank")
    breweryLiSectionA.innerText = "Visit Website"
    breweryLiSectionURL.append(breweryLiSectionA)
}

function displayFiltersSection(){
    let mainSection = document.querySelector("main")

    // CREATE FILTERS SECTION
    let filtersSectionAside = document.createElement("aside")
    filtersSectionAside.setAttribute("class","filters-section")
    mainSection.append(filtersSectionAside)
    
    // CREATE "filter-By" H2
    let filtersSectionH2 = document.createElement("h2")
    filtersSectionH2.innerText = "Filter-By:"
    filtersSectionAside.append(filtersSectionH2)

    // CREATE "Filter-by-type-form" FORM
    let filtersSectionForm = document.createElement("form")
    filtersSectionForm.setAttribute("id","filter-by-type-form")
    filtersSectionForm.setAttribute("autocomplete","off")
    filtersSectionAside.append(filtersSectionForm)

    // CREATE "Filter-by-type" LABEL
    let filtersSectionLabel = document.createElement("label")
    filtersSectionLabel.setAttribute("for","filter-by-type")
    filtersSectionForm.append(filtersSectionLabel)

    // CREATE H3
    let filterSectionLabelH3 = document.createElement("h3")
    filterSectionLabelH3.innerText= "Type of Brewery"
    filtersSectionLabel.append(filterSectionLabelH3)

    // CREATE "Filter-by-type" SELECTION MENU
    let filtersSectionSelect = document.createElement("select")
    filtersSectionSelect.setAttribute("name","filter-by-type")
    filtersSectionSelect.setAttribute("id","filter-by-type")
    filtersSectionForm.append(filtersSectionSelect)

    // CREATE SELECTION MENU OPTION "Default"
    let filtersSectionSelectDefault = document.createElement("option")
    filtersSectionSelectDefault.setAttribute("value","")
    filtersSectionSelectDefault.innerText = "Select a type...."
    filtersSectionSelect.append(filtersSectionSelectDefault)
 
    // CREATE SELECTION MENU OPTION "Micro"
    let filtersSectionSelectMicro = document.createElement("option")
    filtersSectionSelectMicro.setAttribute("value","micro")
    filtersSectionSelectMicro.innerText = "Micro"
    filtersSectionSelect.append(filtersSectionSelectMicro)

    // CREATE SELECTION MENU OPTION "Regional"
    let filtersSectionSelectRegional = document.createElement("option")
    filtersSectionSelectRegional.setAttribute("value","regional")
    filtersSectionSelectRegional.innerText = "Regional"
    filtersSectionSelect.append(filtersSectionSelectRegional)

    // CREATE SELECTION MENU OPTIONS "Brewpub"
    let filtersSectionSelectBrewpub = document.createElement("option")
    filtersSectionSelectBrewpub.setAttribute("value","brewpub")
    filtersSectionSelectBrewpub.innerText = "Brewpub"
    filtersSectionSelect.append(filtersSectionSelectBrewpub)

    // LISTEN FOR TYPE OF BREWERY AND RE-DISPLAY THE LIST
    filtersSectionForm.addEventListener("change", function(event){
        breweryTypeFilter = filtersSectionSelect.value
        displayListOfBreweries()
    })

    // CREATE FILTER BY CITY DIV
    let filtersSectionDiv = document.createElement("div")
    filtersSectionDiv.setAttribute("class","filter-by-city-heading")
    filtersSectionAside.append(filtersSectionDiv)

    // CREATE FILTER BY CITY H3
    let filtersSectionDivH3 = document.createElement("h3")
    filtersSectionDivH3.innerText = "Cities"
    filtersSectionDiv.append(filtersSectionDivH3)

    // CREATE CLEAR ALL BUTTON
    let filtersSectionDivButton = document.createElement("button")
    filtersSectionDivButton.setAttribute("class","clear-all-btn")
    filtersSectionDivButton.innerText = "clear all"
    filtersSectionDiv.append(filtersSectionDivButton)

    // EVENT HANDLER TO CLEAR ALL TICKED CITY FILTERS
    filtersSectionDivButton.addEventListener("click",(function(event){
        
        // CLEAR THE SELECTED CITY LIST
        selectedCityList = []
        
        // FIND EVERY CHECKBOX AND UNCHECK THEM
        let checkBoxes = document.querySelectorAll(".checkbox-reset-marker")
        for (const box of checkBoxes)
            box.checked = false 
        displayListOfBreweries()
    }))


    // CREATE FILTER BY CITY FORM
    let filterByCityForm = document.createElement("form")
    filterByCityForm.setAttribute("id","filter-by-city-form")
    filtersSectionAside.append(filterByCityForm)

    // CREATE A FILTER BY CITY SECTIONCHECKBOX FOR EACH ITEM
    createfilterByCitySection()
}

// CREATE A FILTER BY CITY SECTION CHECKBOX FOR EACH ITEM
function createfilterByCitySection(){

    // CREATE A LIST OF CITIES
    let breweryCityList = []
    for (const brewery of breweries) 
           breweryCityList.push(brewery.city)
    
    // REMOVE DUPLICATE CITIES ANMD SORT ALPHABETICALLY 
    let breweryCitySet = new Set (breweryCityList.sort())
    breweryCityList = Array.from(breweryCitySet)

    // CREATE 'CITY' CHECKBOX ITEM
    createCityCheckBoxItems(breweryCityList) 
}

// CREATE 'CITY' CHECKBOX ITEM
function createCityCheckBoxItems(breweryCityList){

    for (const city of breweryCityList) 
        createCityCheckBoxItem(city)
} 

function createCityCheckBoxItem(city){
    let filterByCityForm = document.querySelector("#filter-by-city-form")

    let cityInputCheckBox = document.createElement("input")
    cityInputCheckBox.setAttribute("type","checkbox")
    cityInputCheckBox.setAttribute("name",city)
    cityInputCheckBox.setAttribute("value",city)
    cityInputCheckBox.setAttribute("class","checkbox-reset-marker")
    filterByCityForm.append(cityInputCheckBox)

    let cityInputCheckBoxLabel = document.createElement("label")
    cityInputCheckBoxLabel.setAttribute("for",city)
    cityInputCheckBoxLabel.innerText = city
    filterByCityForm.append(cityInputCheckBoxLabel)

    cityInputCheckBox.addEventListener("change", function(event){

        if (cityInputCheckBox.checked)
            selectedCityList.push(cityInputCheckBox.value)
        else {
            let filteredCityList = selectedCityList.filter(function(city){
            return city !== cityInputCheckBox.value
            })
            selectedCityList = filteredCityList
        }
        displayListOfBreweries()
    })

}


/////////////////////////////////////////////////////////////////////////
// MAIN PROGRAM BEGINES HERE

displayMainPage()


/*///////////////////////////////////////////////////////////////////////
// SCRATCHPAD

    return fetch('https://api.openbrewerydb.org/breweries?by_state=${visitingState}')
    return fetch('https://api.openbrewerydb.org/breweries?per_page=50&by_state=ohio')
        return fetch(`https://api.openbrewerydb.org/breweries?per_page=50&by_state=${selectedState}`)


*/
