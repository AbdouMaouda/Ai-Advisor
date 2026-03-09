export default function Panel({ 
  title,
  children,
  className = "",
  variant = "default" // default, dark, bordered
}) {
  const variants = {
    default: "bg-gray-50 border border-gray-200",
    dark: "bg-gray-900 text-white border border-gray-800",
    bordered: "bg-white border border-gray-200"
  };

  return (
    <div className={`rounded-lg overflow-hidden ${variants[variant]} ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}