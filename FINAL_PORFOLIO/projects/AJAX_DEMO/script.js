const button1 = document.getElementById("loadBtn")
const state = document.getElementById("state")
const status1 = document.getElementById("status")
const result = document.getElementById("result")


button1.addEventListener("click", function () {
    
    let ajaxRequest = new XMLHttpRequest()

    state.innerHTML = "readyState: " + ajaxRequest.readyState

    ajaxRequest.onreadystatechange = function () {

        state.innerHTML = "readyStatus:" + ajaxRequest.readyState

        if (ajaxRequest.readyState == 4 && ajaxRequest == 200) {
            
            status1 = "readyState" + ajaxRequest.status + " - " + ajaxRequest.statusText

            result.innerHTML = ajaxRequest.responseText
        }
    }

    ajaxRequest.open("GET","https://jsonplaceholder.typicode.com/users/1", true)

    ajaxRequest.send()
})