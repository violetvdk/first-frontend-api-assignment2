const API_BEARER_TOKEN = "1057f541ab54d5ff5b5db4eb43afd538";
const API_MEDIA_TYPE = "application/vnd.audiobooks+json";

function getMediaTypeForCategory(category) {
  const supportedCategories = ["audiobooks", "users", "reviews", "genres", "positions"];
  return supportedCategories.includes(category) ? API_MEDIA_TYPE : "application/json";
}

function buildRequestHeaders({ authToken, accept, contentType, ifMatch } = {}) {
  const headers = {};

  if (accept) {
    headers.Accept = accept;
  }

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  if (ifMatch) {
    headers["If-Match"] = ifMatch;
  }

  return headers;
}

function buildDeleteRequestInfo() {
  return {
    authToken: API_BEARER_TOKEN,
    accept: API_MEDIA_TYPE,
    ifMatch: "auto"
  };
}

export {
  API_BEARER_TOKEN,
  API_MEDIA_TYPE,
  getMediaTypeForCategory,
  buildRequestHeaders,
  buildDeleteRequestInfo
};

