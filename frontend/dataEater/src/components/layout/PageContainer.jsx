export default function PageContainer({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-white ${className}`}>
      {children}
    </div>
  );
}