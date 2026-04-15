import "../../../App.css";
import Fields from "./Fields.jsx";
import usePostResource from "../../../hooks/usePostResource.jsx";

function PostScreen({ category, onClose, mode = "POST", initialData = null, onSuccess }) {
  const {
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
  } = usePostResource(category, mode, initialData, onSuccess);

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
              <button className="post-btn post-btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "PUT" ? "Update" : mode === "PATCH" ? "Patch" : "Submit"}
              </button>
              <button className="post-btn post-btn-secondary" type="button" onClick={onClose}>Close</button>
            </div>
          </form>
        )}

        {loadError && (
          <div className="post-actions">
            <button className="post-btn post-btn-secondary" type="button" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostScreen;