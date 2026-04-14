import { useEffect, useState } from "react";
import "../../../App.css";
import fetchIndex from "../../../data/index.jsx";
import Fields from "./Fields.jsx";

const API_BEARER_TOKEN = "1057f541ab54d5ff5b5db4eb43afd538";

const CONTENT_TYPES_BY_CATEGORY = {
  audiobooks: "application/vnd.audiobooks+json",
  users: "application/vnd.users+json",
  reviews: "application/vnd.reviews+json",
  genres: "application/vnd.genres+json",
  positions: "application/vnd.positions+json"
};

function getMediaTypeForCategory(category) {
  return CONTENT_TYPES_BY_CATEGORY[category] || "application/json";
}

function PostScreen({ category, onClose }) {
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
        const response = await fetch(index[category]);
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
      } catch (err) {
        setLoadError(err.message || "Could not load fields");
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
      payload[key] = value;
    }

    for (const field of optionalFields) {
      const key = String(field);
      const value = (formValues[key] || "").trim();
      if (value) {
        payload[key] = value;
      }
    }

    const token = API_BEARER_TOKEN;
    if (!token) {
      setSubmitError("Missing API bearer token.");
      return;
    }

    try {
      setIsSubmitting(true);
      const index = await fetchIndex();
      const mediaType = getMediaTypeForCategory(category);
      const response = await fetch(index[category], {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: mediaType,
          "Content-Type": mediaType
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const serverMessage = await response.text();
        throw new Error(serverMessage || `POST failed with status ${response.status}`);
      }

      setSubmitSuccess("Saved successfully.");
    } catch (err) {
      setSubmitError(err.message || "Could not submit this form");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="post-screen" role="dialog" aria-modal="true">
      <div className="post-screen-card">
        <h4>Fill in the fields below! (* are required)</h4>
        {isLoading && <p className="post-message">Loading fields...</p>}
        {loadError && <p className="post-message post-error">{loadError}</p>}
        {submitError && <p className="post-message post-error">{submitError}</p>}
        {submitSuccess && <p className="post-message post-success">{submitSuccess}</p>}

        {!isLoading && !loadError && (
          <form onSubmit={handleSubmit}>
            <Fields
              requiredFields={requiredFields}
              optionalFields={optionalFields}
              values={formValues}
              onFieldChange={handleFieldChange}
            />
            <div className="post-actions">
              <button className="myButton" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Submit"}
              </button>
              <button className="myButton" type="button" onClick={onClose}>Close</button>
            </div>
          </form>
        )}

        {loadError && (
          <div className="post-actions">
            <button className="myButton" type="button" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostScreen;