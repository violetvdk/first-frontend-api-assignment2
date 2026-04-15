import { useEffect, useState } from "react";
import fetchIndex from "../data/index.jsx";
import {
  API_BEARER_TOKEN,
  getMediaTypeForCategory,
  buildRequestHeaders
} from "../data/apiConfig.jsx";

function parseFieldValue(value) {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  if (typeof value === "string" && (value.startsWith("[") || value.startsWith("{"))) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
}

function usePostResource(category, mode = "POST", initialData = null, onSuccess) {
  const [requiredFields, setRequiredFields] = useState([]);
  const [optionalFields, setOptionalFields] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategoryInfo() {
      setIsLoading(true);
      setLoadError("");
      try {
        const index = await fetchIndex();
        const response = await fetch(index[category], {
          headers: buildRequestHeaders({
            accept: getMediaTypeForCategory(category)
          })
        });

        if (!response.ok) {
          throw new Error(`API call failed with status ${response.status}`);
        }

        const info = await response.json();
        const req = info.requiredFields || [];
        const opt = info.optionalFields || [];
        setRequiredFields(req);
        setOptionalFields(opt);
        setFormValues((previousValues) => {
          const nextValues = {};
          [...req, ...opt].forEach((field) => {
            const key = String(field);
            if (initialData && initialData[key] !== undefined) {
              nextValues[key] = initialData[key] !== undefined && initialData[key] !== null ? String(initialData[key]) : "";
            } else {
              nextValues[key] = previousValues[key] ?? "";
            }
          });
          return nextValues;
        });
      } catch (error) {
        setLoadError(error.message || "Could not load fields");
      } finally {
        setIsLoading(false);
      }
    }

    loadCategoryInfo();
  }, [category, initialData]);

  function handleFieldChange(name, value) {
    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    const payload = {};

    for (const field of requiredFields) {
      const key = String(field);
      const value = (formValues[key] || "").trim();

      if (!value) {
        setSubmitError(`Please fill in required field: ${key}`);
        return;
      }
    }

    for (const field of [...requiredFields, ...optionalFields]) {
      const key = String(field);
      const value = (formValues[key] || "").trim();
      const original = initialData?.[key] !== undefined && initialData?.[key] !== null ? String(initialData[key]) : "";

      if (mode === "PATCH") {
        if (!(value === "" && original === "") && value !== original) {
          payload[key] = parseFieldValue(value);
        }
      } else {
        if (value !== "") {
          payload[key] = parseFieldValue(value);
        }
      }
    }

    if (mode === "PATCH" && Object.keys(payload).length === 0) {
      setSubmitSuccess("Nothing changed.");
      return;
    }

    try {
      setIsSubmitting(true);
      const index = await fetchIndex();
      const mediaType = getMediaTypeForCategory(category);
      const isUpdate = mode === "PUT" || mode === "PATCH";
      if (isUpdate && !initialData?.url) {
        throw new Error("Missing resource URL for update");
      }
      const url = isUpdate ? initialData.url : index[category];
      const headers = buildRequestHeaders({
        authToken: API_BEARER_TOKEN,
        accept: mediaType,
        contentType: mediaType
      });
      if (isUpdate && initialData?.etag) {
        headers["If-Match"] = initialData.etag;
      }
      const response = await fetch(url, {
        method: mode,
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const serverMessage = await response.text();
        throw new Error(serverMessage || `${mode} failed with status ${response.status}`);
      }

      let result;
      try {
        result = await response.json();
      } catch {
        result = null;
      }
      if (!result) {
        result = {
          ...payload,
          url: initialData?.url,
          etag: initialData?.etag
        };
      }

      const successMessage = mode === "POST" ? "Saved successfully." : mode === "PATCH" ? "Patched successfully." : "Updated successfully.";

      setSubmitSuccess(successMessage);

      if (onSuccess) onSuccess(result);

    } catch (error) {
      setSubmitError(error.message || "Could not submit this form");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    requiredFields,
    optionalFields,
    formValues,
    isLoading,
    loadError,
    submitError,
    submitSuccess,
    isSubmitting,
    handleFieldChange,
    handleSubmit
  };
}

export default usePostResource;