const Notification = ({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-md flex justify-between items-center animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="font-bold text-xl">
        &times;
      </button>
    </div>
  );
};

export default Notification;