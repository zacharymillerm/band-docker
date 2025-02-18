import { downloadIcon } from "@/assets";
import { DownloadButton } from "@/components/Buttons";
import { ChichaBox } from "@/components/ChichaBox";
import { PDFText } from "@/components/Titles";
import { handleDownload } from "@/constant/defaultLink";
// import "@/styles/pages/services/visualization.css";

const WorkProcess = ({ arrowWidth, title1, title2, data, url, fileName }) => {
  const WorkProcessBtn = () => (
    <div className="alignCenter downloadBtnWrap" style={{ marginTop: "12px" }}>
      <DownloadButton
        icon={downloadIcon}
        title="Скачать пример документации"
        onClick={() => handleDownload(url, fileName)}
      />
      <PDFText />
    </div>
  );

  const ProcessListObject = ({ item, index }) => (
    <div className="processItem verticalBorder" style={{ position: "relative", paddingBottom: "20px" }}>
      <div className="alignCenter" style={{ gap: "20px" }}>
        <h3 className="processListTitle" style={{ margin: 0 }}>{item.title}</h3>
        {index !== 2 && (
          <div className="alignCenter arrowShow">
            <hr className="ArrowLine" style={{ width: arrowWidth }} />
            <div className="ArrowRect"></div>
          </div>
        )}
      </div>
      {item.content.map((title, index) =>
        title !== "button" ? (
          <p
            key={index}
            className="cardDescription"
            style={{ color: `var(--primaryBgColor)` }}
          >
            {title}
          </p>
        ) : (
          <WorkProcessBtn key={index} />
        )
      )}
    </div>
  );

  const content = (
    <div>
      <h2
        className="sectionTitle"
        style={{
          color: `var(--primaryBgColor)`,
          width: "90%",
          marginBottom: "10px",
        }}
      >
        {title1}
      </h2>
      <h2
        className="sectionTitle"
        style={{
          color: `var(--secondaryWhiteHover)`,
          width: "90%",
          marginBottom: "30px",
        }}
      >
        {title2}
      </h2>
      <div className="flexWrapBetween workProcessSquare">
        {data?.map((item, index) => (
          <ProcessListObject key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );

  return <ChichaBox content={content} />;
};

export default WorkProcess;
