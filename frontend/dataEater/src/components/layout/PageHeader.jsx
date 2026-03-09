export default function PageHeader({ 
  title, 
  subtitle, 
  badge,
  action,
  backLink 
}) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="px-8 lg:px-12 py-8">
        {backLink && (
          <div className="mb-4">{backLink}</div>
        )}
        {badge && (
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            {badge}
          </div>
        )}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-gray-900 tracking-tight mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 max-w-2xl">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      </div>
    </div>
  );
}