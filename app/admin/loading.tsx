export default function AdminLoading() {
  return (
    <div className="admin-loading" aria-label="Loading admin dashboard">
      <div className="admin-loading-bar short" />
      <div className="admin-loading-bar medium" />

      <div className="admin-loading-card">
        <div className="admin-loading-bar short" />
        <div className="admin-loading-bar long" />
        <div className="admin-loading-bar long" />
        <div className="admin-loading-bar long" />
      </div>

      <div className="admin-loading-card">
        <div className="admin-loading-bar short" />
        <div className="admin-loading-bar long" />
        <div className="admin-loading-bar long" />
      </div>
    </div>
  );
}
