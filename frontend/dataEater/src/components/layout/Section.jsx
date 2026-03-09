export default function Section({ 
  title, 
  description,
  action,
  children,
  className = "",
  noPadding = false
}) {
  return (
    <section className={className}>
      {(title || description || action) && (
        <div className={`${noPadding ? '' : 'px-8 lg:px-12'} py-6 border-b border-gray-200`}>
          <div className="flex items-start justify-between">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
            </div>
            {action && <div>{action}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'px-8 lg:px-12 py-8'}>
        {children}
      </div>
    </section>
  );
}