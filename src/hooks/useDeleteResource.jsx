import { useState } from "react";
import { API_MEDIA_TYPE, API_BEARER_TOKEN, buildRequestHeaders } from "../data/apiConfig.jsx";

function useDeleteResource({ resourceUrl, requestInfo, payloadInfo, onDeleted, onError }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function getETag() {
    const response = await fetch(resourceUrl, {
      method: "GET",
      headers: buildRequestHeaders({
        authToken: requestInfo?.authToken || API_BEARER_TOKEN,
        accept: requestInfo?.accept || API_MEDIA_TYPE
      })
    });

    if (!response.ok) {
      throw new Error(`Could not fetch ETag (status ${response.status})`);
    }

    const etag = response.headers.get("ETag");
    if (!etag) {
      throw new Error("No ETag header in response");
    }

    return etag;
  }

  async function handleDelete() {
    if (!resourceUrl || isDeleting) {
      return;
    }

    setIsDeleting(true);
    try {
      const etag = await getETag();
      const response = await fetch(resourceUrl, {
        method: "DELETE",
        headers: buildRequestHeaders({
          authToken: requestInfo?.authToken || API_BEARER_TOKEN,
          accept: requestInfo?.accept || API_MEDIA_TYPE,
          ifMatch: requestInfo?.ifMatch === "auto" ? etag : (requestInfo?.ifMatch || etag)
        })
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `DELETE failed with status ${response.status}`);
      }

      onDeleted?.(payloadInfo ?? { url: resourceUrl });
    } catch (error) {
      onError?.(error.message || "Could not delete resource.");
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    isDeleting,
    handleDelete
  };
}

export default useDeleteResource;

