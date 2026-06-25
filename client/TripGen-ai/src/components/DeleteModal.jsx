const DeleteModal = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-white mb-3">
          Delete Itinerary
        </h2>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete this itinerary?
        </p>

        <div className="flex gap-4 justify-end">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-700 text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteModal;