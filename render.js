var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new SpeechRecognition();

function searchFromVoice() {
    recognition.start();

    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        console.log(speechToText);

        document.getElementById("searchbar").value = speechToText;
        search();
    }
}

function search() {
    var searchTerm = document.getElementById("searchbar").value;
    var apigClient = apigClientFactory.newClient();

    var params = {
        "q": searchTerm
    };
    var body = {
        "q": searchTerm
    };

    var additionalParams = {
        queryParams: {
            q: searchTerm
        }
    };
    apigClient.searchGet(params, body, additionalParams)
        .then(function(result) {
            console.log('OK');
            console.log(result)
            showImages(result.data);
        }).catch(function(result) {
            console.log("Not OK");
        });
}

function showImages(res) {
    var newDiv = document.getElementById("images");
    if (typeof(newDiv) != 'undefined' && newDiv != null) {
        while (newDiv.firstChild) {
            newDiv.removeChild(newDiv.firstChild);
        }
    }

    console.log(res);
    console.log(res.length);
    if (res.length == 0) {
        var newContent = document.createTextNode("No image to display");
        newDiv.appendChild(newContent);
    } else {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i]);
            var newDiv = document.getElementById("images");
            var newimg = document.createElement("img");
            newimg.src = res[i];
            newDiv.appendChild(newimg);
        }
    }
}

const realFileBtn = document.getElementById("realfile");

function upload() {
    realFileBtn.click();
}

function previewFile(input) {

    var reader = new FileReader();
    name = input.files[0].name;
    var type = input.files[0].type;
    console.log(name);
    console.log(type);
    fileExt = name.split(".").pop();
    var onlyname = name.replace(/\.[^/.]+$/, "");
    var finalName = onlyname + "_" + Date.now() + "." + fileExt;
    name = finalName;

    reader.onload = function(e) {
        var src = e.target.result;

        var newImage = document.createElement("img");
        newImage.src = src;
        encoded = newImage.outerHTML;
        console.log(encoded);

        last_index_quote = encoded.lastIndexOf('"');
        if (fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'png') {
            encodedStr = encoded.substring(33, last_index_quote);
        } else {
            encodedStr = encoded.substring(32, last_index_quote);
        }
        var apigClient = apigClientFactory.newClient();

        var params = {
            "key": name,
            "bucket": "bucket2-a3",
            "Content-Type": type + ";base64"

        };

        var additionalParams = {
            headers: {
                "Content-Type": type + ";base64"
            }
        };
        console.log(encodedStr);
        apigClient.uploadBucketKeyPut(params, encodedStr, additionalParams)
            .then(function(result) {
                console.log('success OK');
            }).catch(function(result) {
                console.log(result);
            });
    }
    reader.readAsDataURL(input.files[0]);
}