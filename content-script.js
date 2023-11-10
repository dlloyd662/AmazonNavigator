let result = {};
chrome.storage.local.get(
  [
    "bestSellersSortEnable",
    "mostRecentReviewsSortEnable",
    "sortByReviewCountEnable",
    "removeUnreleasedBooksEnable",
    "addStarRatingEnable",
  ],
  (chromeResult) => {
    if (chromeResult) {
      result = chromeResult;
    }
  }
);

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes) {
    for (let key in changes) {
      if (result.hasOwnProperty(key)) {
        result[key] = changes[key].newValue;
      }
    }
  }
});
function sortByBestSellers() {
  let url = window.location.href;
  if (!url.includes("s=") && url.includes("://www.amazon.com/s?")) {
    console.log("updated search sort type");
    url += "&s=exact-aware-popularity-rank";
    window.location.href = url;
  }
}

function sortByTopReviews() {
  let url = window.location.href;
  if (!url.includes("sortBy=") && url.includes("/product-reviews/")) {
    console.log("updated review sort type");
    url += "&sortBy=recent";
    window.location.href = url;
  }
  if (url.includes("/dp/")) {
    const dpSortDropDown = document.getElementById("cm-cr-sort-dropdown");

    const dpSortDropDownRecentOption = document.getElementById(
      "cm-cr-sort-dropdown_1"
    );

    function simulateClick(element) {
      let event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });

      element && element.dispatchEvent(event);
    }
    if (dpSortDropDown.value === "helpful") {
      simulateClick(dpSortDropDown);
      simulateClick(dpSortDropDownRecentOption);
      setTimeout(function () {
        simulateClick(document.getElementById("prodDetails"));
      }, 1000); // 2000 milliseconds = 2 seconds
    }
  }
}

const parentContainer = document.querySelector(
  ".s-search-results.s-result-list"
);
function getResults() {
  let elements = parentContainer.children;
  let elementsArray = Array.from(elements);
  const filteredElements = elementsArray.filter((element) => {
    return element.getAttribute("data-component-type") == "s-search-result";
  });
  return filteredElements;
}

function reorderResults() {
  if (!parentContainer) {
    return;
  }
  function getRatingsCount(result) {
    try {
      const itemLinks = Array.from(
        result.getElementsByClassName("a-link-normal")
      );
      const ratingsLink = itemLinks.filter((link) => {
        return link.hash == "#customerReviews";
      })[0];
      if (ratingsLink) {
        const ratingsSpan = ratingsLink.getElementsByTagName("span")[0];
        const ratingsCount = Number(ratingsSpan.textContent.replace(/,/g, ""));
        return ratingsCount;
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
    }
  }
  function isSorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (getRatingsCount(arr[i]) < getRatingsCount(arr[i + 1])) {
        return false;
      }
    }
    return true;
  }
  function sortByRatings() {
    //Sort by review count. If reviews are equal then sort by id
    let sortedResults = getResults().sort((a, b) => {
      const countA = getRatingsCount(a);
      const countB = getRatingsCount(b);
      if (countA == countB) {
        return (
          a.getAttribute("data-component-id") -
          b.getAttribute("data-component-id")
        );
      }
      return countA - countB;
    });

    if (parentContainer) {
      sortedResults.forEach((sortedResult) => {
        parentContainer.insertBefore(sortedResult, parentContainer.firstChild);
      });
    }
  }

  if (!isSorted(getResults())) {
    sortByRatings();
  }
}

function removeUnusedTitles() {
  getResults().forEach((result) => {
    const spans = Array.from(result.getElementsByTagName("span"));
    spans.forEach((span) => {
      const unreleased = span.textContent
        .toLowerCase()
        .includes("this title will be released".toLowerCase());
      if (unreleased && parentContainer.contains(result)) {
        parentContainer.removeChild(result);
      }
    });
  });
}

function addRatings() {
  getResults().forEach((result) => {
    const spans = Array.from(result.getElementsByTagName("span"));
    const numStarsSpan = spans.filter((span) => {
      return span.innerText.includes("stars");
    })[0];
    numStarsSpan.style.fontWeight = "bold";
    numStarsSpan.style.fontSize = "14px";

    const numStars = numStarsSpan.innerText.split(" ")[0];
    let customRatingSpan = document.createElement("span");
    customRatingSpan.textContent = numStars + " stars ";
    customRatingSpan.className = "customRating";

    const ratingsContainer = numStarsSpan.parentElement;

    if (!ratingsContainer.firstChild.classList.contains("customRating")) {
      ratingsContainer.insertBefore(customRatingSpan, numStarsSpan);
    }
  });
}

function checkForUpdates() {
  let url = window.location.href;
  if (result.addStarRatingEnable) {
    if (url.includes("://www.amazon.com/s?")) {
      addRatings();
    }
  }
  if (url.includes("://www.amazon.com/s?")) {
    if (result.bestSellersSortEnable) {
      sortByBestSellers();
    }
    if (result.sortByReviewCountEnable) {
      reorderResults();
    }
    if (result.removeUnreleasedBooksEnable) {
      removeUnusedTitles();
    }
  }
  if (result.mostRecentReviewsSortEnable) {
    if (url.includes("/product-reviews") || url.includes("/dp/")) {
      sortByTopReviews();
    }
  }
}
setInterval(checkForUpdates, 500);

// const hotkeyCombination = "Escape";

// document.addEventListener("keydown", function (event) {
//   if (event.key === hotkeyCombination) {
//     reorderResults();
//   }
// });
