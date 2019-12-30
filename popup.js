function PostMessage(message, response_callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message,
            response => response_callback(response));
    });
}

function Exists(fileName, callback) {
    storageRootEntry.getFile(fileName, {create : false}, function() {
        callback(true);
    }, function() {
        callback(false);
    });
}

let videoPosts = [];

listAllVideos.onclick = function () {
    videoPosts.length = 0;
    PostMessage({ type: "list" }, response => {
        if (response !== undefined && response.type === "list_result") {
            document.querySelector("#available-video-count").innerHTML = "Total Video: " + response.totalVideosCount;
            document.querySelector("#available-articles-count").innerHTML = "Total Post: " + response.totalArticlesCount;
            videoPosts = response.videoPosts;
            //document.querySelector("#all-urls").innerHTML = response.videos.join("\r\n");
        }
    })
};

download.onclick = function () {
    let target = document.querySelector("#target-folder").value;
    videoPosts.forEach(videoPost=>{
        videoPost.videos.forEach(video=>{
            chrome.downloads.download({
                url:video.url,
                filename: "clips/"+target+"/"+videoPost.id+"_"+video.num+".mp4" // Optional
              });
        })
    })
};

