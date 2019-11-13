

const getResearchBookmarksKey = (username) => {
  return `deip_${username}_research_bookmarks`;
}

export function getResearchBookmarks(username) {
  let bookmarksStr = localStorage.getItem(getResearchBookmarksKey(username));
  if (bookmarksStr) {
    return bookmarksStr.split(",").map((val, i) => parseInt(val, 10));
  } else {
    return [];
  }
}

export function setResearchBookmarks(username, bookmarks) {
  localStorage.setItem(getResearchBookmarksKey(username), bookmarks.join(","));
}

export function removeResearchBookmarks(username) {
  localStorage.removeItem(getResearchBookmarksKey(username));
}

export function saveResearchBookmark(id, username) {
  let bookmarks = getResearchBookmarks(username);
  bookmarks.push(id);
  setResearchBookmarks(username, bookmarks)
}

export function removeResearchBookmark(id, username) {
  let bookmarks = getResearchBookmarks(username);
  bookmarks = bookmarks.filter(rId => rId != id);
  setResearchBookmarks(username, bookmarks)
}

export function hasResearchBookmark(id, username) {
  let bookmarks = getResearchBookmarks(username);
  return bookmarks.some(rId => rId == id);
}