import { useEffect, useState } from "react";
import fetchIndex from "../data/index.jsx";
import {
  API_BEARER_TOKEN,
  getMediaTypeForCategory,
  buildRequestHeaders
} from "../data/apiConfig.jsx";

function parseFieldValue(value) {
  if (!value) {
    return value;
  }

  if (value.startsWith("[") || value.startsWith("{")) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  return value;
}

function usePostResource(category) {
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
            nextValues[key] = previousValues[key] ?? "";
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
  }, [category]);

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

      payload[key] = parseFieldValue(value);
    }

    for (const field of optionalFields) {
      const key = String(field);
      const value = (formValues[key] || "").trim();

      if (value) {
        payload[key] = parseFieldValue(value);
      }
    }

    try {
      setIsSubmitting(true);
      const index = await fetchIndex();
      const mediaType = getMediaTypeForCategory(category);
      const response = await fetch(index[category], {
        method: "POST",
        headers: buildRequestHeaders({
          authToken: API_BEARER_TOKEN,
          accept: mediaType,
          contentType: mediaType
        }),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const serverMessage = await response.text();
        throw new Error(serverMessage || `POST failed with status ${response.status}`);
      }

      setSubmitSuccess("Saved successfully.");
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

