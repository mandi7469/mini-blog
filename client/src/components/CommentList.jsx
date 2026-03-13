// Component for displaying a list of comments on a blog post, allowing users to view and manage their comments, including the ability to delete
// their own comments, while showing a loading state when a comment is being deleted and handling any errors that may occur during the deletion process
function CommentList({ comments, currentUser, onDelete, deleteLoadingId }) {
  if (comments.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <div className="mt-4">
      <h4 className="mb-3">Comments</h4>

      <div className="list-group">
        {comments.map((comment) => {
          const isOwner = currentUser?._id === comment.author?._id;

          return (
            <div key={comment._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <p className="mb-1">{comment.body}</p>
                  <small className="text-muted">
                    By {comment.author?.username}
                  </small>
                </div>

                {isOwner && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(comment._id)}
                    disabled={deleteLoadingId === comment._id}
                  >
                    {deleteLoadingId === comment._id ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommentList;
