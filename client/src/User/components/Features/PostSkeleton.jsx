import "../../styles/features/PostSkeleton.css";

export default function PostSkeleton({ cards }) {
  return Array(cards)
    .fill(0)
    .map((item, index) => (
      // <SkeletonTheme baseColor="#0cbfdf45" highlightColor="#c8fdff4e">
      <div className="post-skeleton" key={index}>
        <div className="post-author-skeleton">
          <div
            className="skeleton"
            style={{
              height: "60px",
              width: "60px",
              borderRadius: "50%",
              position: "absolute",
              top: "-1.25rem",
              left: "-1.25rem",
            }}
          ></div>
          <div
            className="skeleton"
            style={{ height: "2rem", width: "100%" }}
          ></div>
          {/* 
          <div style={{ display: "flex", flexDirection: "column" }}> */}
          {/* <div
            className="skeleton"
            style={{ height: "3rem", width: "100%" }}
          ></div>
          <div
            className="skeleton"
            style={{ height: "3rem", width: "100%" }}
          ></div> */}
          {/* </div> */}

          {/* <Skeleton height={"0.7rem"} count={3} /> */}
        </div>
        <div
          className="skeleton"
          style={{ height: "1rem", width: "100%", margin: "1rem 0" }}
        ></div>
        <div
          className="skeleton"
          style={{ height: "1rem", width: "100%" }}
        ></div>
        <div className="post-interaction-skeleton">
          <div
            className="skeleton"
            style={{ height: "1rem", width: "100%" }}
          ></div>
        </div>
      </div>
    ));
}
