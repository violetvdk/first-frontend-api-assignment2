import useDeleteResource from "../../hooks/useDeleteResource.jsx";

function DeleteButton({
  resourceUrl,
  requestInfo,
  payloadInfo,
  onDeleted,
  onError,
  className = "post-btn post-btn-secondary",
  label = "Delete",
  busyLabel = "Deleting..."
}) {
  const { isDeleting, handleDelete } = useDeleteResource({
    resourceUrl,
    requestInfo,
    payloadInfo,
    onDeleted,
    onError
  });

  return (
    <button
      className={className}
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      {isDeleting ? busyLabel : label}
    </button>
  );
}

export default DeleteButton;
