let videoPosts = [];
let regex = new RegExp(/.*"(?<url>.*)".*/);

function GetMP4Url(url) {
    let result = regex.exec(url);
    let post = result.groups["url"].lastIndexOf("/");
    return result.groups["url"].substr(0, post) + "/mp4";
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message !== undefined && message.type === "list") {
        // Clear Array
        videoPosts.length = 0;
        let totalVideos = 0;
        // Get Videos URL
        let articleTags = document.querySelectorAll("article.article");
        articleTags.forEach((elem, ai) => {
            let div = elem.querySelector(".linedownloader_tag");
            if (div != null) div.remove();
            div = document.createElement("div");
            div.className = "linedownloader_tag";
            div.innerHTML = "<h1>Post No. " + (ai + 1) + "</h1>";
            elem.prepend(div);
            let type_media = elem.querySelector(".type_media");
            if (type_media != null) {
                let id = type_media.dataset.id
                let medias = elem.querySelectorAll("[class^='media_item']");
                let mediasArray = [];
                medias.forEach((mediaElement, i) => {
                    let span = mediaElement.querySelector("span.img._tl_article_media_viewer");
                    if (span != null) {
                        if (span.dataset.ga === undefined) {
                            mediasArray.push({ num: i + 1, url: GetMP4Url(span.style.backgroundImage) });
                        }
                    }
                    else {
                        let div = mediaElement.querySelector("div.poster"); // First-Element of Article
                        if (div != null) mediasArray.push({ num: i + 1, url: GetMP4Url(div.style.backgroundImage) });
                    }
                })
                totalVideos += mediasArray.length;
                videoPosts.push({ id: id, videos: mediasArray });
            } else {
                elem.style.backgroundColor = "red";
            }

        })
        sendResponse({ type: "list_result", videoPosts: videoPosts, totalArticlesCount: videoPosts.length, totalVideosCount: totalVideos })
    }
    else {
        return true;
    }
    //return true; //asynchronously use sendResponse, add return true; to the onMessage event handler.
});

