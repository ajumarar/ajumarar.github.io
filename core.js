const itemsPerPage = 10;
 let currentPages = 1
 let numberOfPages = 0
 let yourList = [];
 let url = 'http://universities.hipolabs.com/search'
 
 //Search
 var typingTimer;                //timer identifier
 var doneTypingInterval = 1000;  //time in ms, 5 seconds for example
 var inputUniversities = document.getElementById('universities')
 var countries = document.getElementById('country')
 
 //on keyup, start the countdown
 function keyupFunction() {
     clearTimeout(typingTimer);
     typingTimer = setTimeout(searchLoad, doneTypingInterval);
 }
 
 //on keydown, clear the countdown
 function keydownFunction() {
     clearTimeout(typingTimer);
 }
 
 function initialLoad() {
     fetch(url, {
         method: 'GET'
     }).then((output) => {
         output.json().then((results) => {
             yourList = results;
             numberOfPages = getNumberOfPages(yourList);
             document.getElementById("currentPage").innerText = "Page 1 of " + numberOfPages
             document.getElementById("items").innerText = "10 items per page"
             document.getElementById("prevButton").disabled = true
             createtable(yourList, "DynamicTable", currentPages)
         })
     }).catch(() => console.error('Error While Fetching Data'))
 }
 
 function searchLoad() {
     yourList = []
     let localUrl = url
     localUrl = url + '?'
     var country = ''
     var name = ''
     if (inputUniversities.value) {
         name = 'name='+inputUniversities.value
     } else {
         name = ''
     }
     if(countries.value.toLowerCase() !== 'none' ){
         country = 'country='+countries.value
     } else {
         country = ''
     }
     if(name && country) {
         localUrl = localUrl+name+'&'+country
     } else if(name) {
         localUrl = localUrl + name
     } else if(country){
         localUrl = localUrl + country
     } else {
         localUrl = url
     }
     fetch(localUrl, {
         method: 'GET'
     }).then((output) => {
         output.json().then((results) => {
             yourList = results;
             numberOfPages = getNumberOfPages(yourList);
             document.getElementById("currentPage").innerText = "Page 1 of " + numberOfPages
             document.getElementById("items").innerText = "10 items per page"
             document.getElementById("prevButton").disabled = true
             createtable(yourList, "DynamicTable", currentPages)
         })
     }).catch(() => console.error('Error While Fetching Data'))
 }
 
 function getNumberOfPages(list) {
     const length = list.length
     return Math.ceil(length / itemsPerPage)
 }
 
 function createtable(list, id, currentPage) {
     if(list.length > 0){
         let headers = Object.keys(list[0])
         let table = '<table><thead><tr>'
         headers.forEach((header, index) => {
             if (header === 'domains') {
                 header = 'Name'
             } else if (header === 'alpha_two_code') {
                 header = 'Country Code'
             } else if (header === 'web_pages') {
                 header = 'Website'
             } else if (header === 'country') {
                 header = 'Country'
             }
 
             index !== 3 && index !== 5 ? table = table + `<th>${header}</th>` : ''
         })
         table = table + `</tr></thead>`;
         table = table + `<tbody>`;
         list.forEach((data, index1) => {
             if (index1 >= (currentPage - 1) * 10 && index1 < (currentPage * 10)) {
                 table = table + `<tr>`
                 headers.forEach((header, index) => {
                     index !== 3 && index !== 5 ? table = table + `<td>${data[header]}</td>` : '';
                 })
                 table = table + `</tr>`
             }
         });
         table = table + `</tbody></table>`
         let DynamicTable = document.getElementById(id)
         DynamicTable.innerHTML = table;
     } else {
         DynamicTable.innerText = 'No Data Available'
     }
 
 }
 
 function buttonAction(action) {
     if (action === 'prev') {
         document.getElementById("nextButton").disabled = false
         currentPages -= 1;
         currentPages === 1 ? document.getElementById("prevButton").disabled = true : document.getElementById("prevButton").disabled = false;
         currentPages === 1 ? '' : createtable(yourList, "DynamicTable", currentPages)
     } else {
         document.getElementById("prevButton").disabled = false
         currentPages += 1;
         currentPages === numberOfPages ? document.getElementById("nextButton").disabled = true : document.getElementById("nextButton").disabled = false;
         currentPages === numberOfPages ? '' : createtable(yourList, "DynamicTable", currentPages)
     }
     document.getElementById("currentPage").innerText = "Page " + currentPages + " of " + numberOfPages
     createtable(yourList, "DynamicTable", currentPages);
 }
 
 initialLoad();
 
 /* table = table + `<td class="${header}">${data[header]}</td>`; */