import "./Skeleton.css";

function Skeleton({ width = "100%", height = "20px", borderRadius = "8px" }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius }}></div>
  );
}

export function TableSkeleton() {
  return (
    <div className="table-skeleton">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <Skeleton width="30px" height="16px" />
          <div className="skeleton-coin">
            <Skeleton width="28px" height="28px" borderRadius="50%" />
            <div>
              <Skeleton width="80px" height="14px" />
              <Skeleton width="40px" height="12px" />
            </div>
          </div>
          <Skeleton width="70px" height="16px" />
          <Skeleton width="50px" height="16px" />
          <Skeleton width="90px" height="16px" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
