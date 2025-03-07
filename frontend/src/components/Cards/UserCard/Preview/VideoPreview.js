import CustomerModal from "@/components/Modals";

const VideoPreview = (props) => {
  const { open, setOpen, description, avatar, name } = props;

  const handleClose = () => setOpen(false);

  const content = (
    <div className="videoPreviewContainer">
      <div className="spaceBetween">
        <p
          className="cardBigTitle"
          style={{ color: "var(--secondaryWhiteColor)" }}
        >
          {name}
        </p>
        <button className="closeButton" onClick={handleClose}>
          <span className="closeIcon">&times;</span>
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%", // Ensures it doesn't overflow the parent
            aspectRatio: "16/9", // Enforces 16:9 ratio
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <video
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "100%", // Ensures it scales within the parent
              height: "100%", // Adjusts to maintain aspect ratio
              objectFit: "contain", // Maintains original video ratio inside the box
              borderRadius: "5px",
            }}
            controls
          >
            <source src={avatar} type="video/mp4" />
          </video>
        </div>
        <div className="videoPreviewDescription">{description}</div>
      </div>
    </div>
  );

  return <CustomerModal open={open} setOpen={setOpen} content={content} />;
};

export default VideoPreview;
