document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    [
      "removeUnreleasedBooksEnable",
      "bestSellersSortEnable",
      "mostRecentReviewsSortEnable",
      "sortByReviewCountEnable",
      "addStarRatingEnable",
    ],
    (result) => {
      document.getElementById("removeUnreleasedBooksToggle").checked =
        result.removeUnreleasedBooksEnable || false;
      document.getElementById("sortByReviewCountToggle").checked =
        result.sortByReviewCountEnable || false;
      document.getElementById("mostRecentReviewsSortToggle").checked =
        result.mostRecentReviewsSortEnable || false;
      document.getElementById("bestSellersSortToggle").checked =
        result.bestSellersSortEnable || false;
      document.getElementById("addStarRatingToggle").checked =
        result.addStarRatingEnable || false;
    }
  );
});

document.getElementById("saveButton").addEventListener("click", () => {
  const isRemoveUnreleasedBooksEnabled = document.getElementById(
    "removeUnreleasedBooksToggle"
  ).checked;
  const isSortByReviewCountEnabled = document.getElementById(
    "sortByReviewCountToggle"
  ).checked;
  const isMostRecentReviewsSortEnabled = document.getElementById(
    "mostRecentReviewsSortToggle"
  ).checked;
  const isBestSellersSortEnabled = document.getElementById(
    "bestSellersSortToggle"
  ).checked;
  const isAddStarRatingEnabled = document.getElementById(
    "addStarRatingToggle"
  ).checked;

  chrome.storage.local.set(
    {
      removeUnreleasedBooksEnable: isRemoveUnreleasedBooksEnabled,
    },
    () => {}
  );
  chrome.storage.local.set(
    {
      sortByReviewCountEnable: isSortByReviewCountEnabled,
    },
    () => {}
  );
  chrome.storage.local.set(
    {
      mostRecentReviewsSortEnable: isMostRecentReviewsSortEnabled,
    },
    () => {}
  );
  chrome.storage.local.set(
    {
      bestSellersSortEnable: isBestSellersSortEnabled,
    },
    () => {}
  );
  chrome.storage.local.set(
    {
      addStarRatingEnable: isAddStarRatingEnabled,
    },
    () => {}
  );
});
