import { useEffect, useState } from "react";
import { RentalCostCard, RentalCostDocCard } from "@/components/Cards";
import { ChichaBox } from "@/components/ChichaBox";
import { getRental } from "@/api/rentalAPI";

const rentalDocumentInfo = [
  {
    text: "3D-макеты сцены",
    url: "/documents/Репетиционная база.pdf",
    download: "Репетиционная база.pdf",
    size: "PDF 0.9 Мб",
  },
  {
    text: "Тех. райдер площадки",
    url: "/documents/Оборудование ДК МИР.docx",
    download: "Оборудование ДК МИР.docx",
    size: "DOC 1.9 Мб",
  },
  {
    text: "Архив фото",
    url: "https://t.me/zavodshowbase",
    download: "",
    size: "t.me/zavodshowbase",
  },
];

const RentalCost = () => {
  const [rental, setRental] = useState([]);

  useEffect(() => {
    getRental().then((data) => {
      data && setRental(data);
    });
  }, []);

  const RentalDocument = ({ documentFile }) => (
    <div className="flexWrapBetween">
      {rentalDocumentInfo.map((item, index) => (
        <RentalCostDocCard key={index} item={item} />
      ))}
    </div>
  );

  const content = (
    <section id="rentalCost">
      <h2
        className="sectionTitle"
        style={{ color: `var(--primaryBgColor)`, width: "90%" }}
      >
        Стоимость аренды базы
      </h2>
      <div className="rentalBody">
        <div className="rentalLeft">
          <RentalCostCard cost={rental[0]?.cost} />
          <div className="chichaShow">
            <RentalDocument documentFile={rental[0]?.files} />
          </div>
        </div>
        <div className="rentalRight">
          <div className="rentalRightTextSquare">
            <p
              className="cardTitle"
              style={{ marginBottom: "clamp(20px, 3vw, 35px)" }}
            >
              За отдельную плату может быть установлен любой технический сетап
              и предоставлены специалисты по свету, звуку и видео
            </p>
            <p className="cardDescription" style={{ marginBottom: "15px" }}>
              *Компании, осуществляющие техническое обеспечение репетиции
              обязаны иметь сотрудников с соответствующей квалификацией
              по электробезопасности, охране труда и пожарной безопасности.
            </p>
            <p className="cardDescription">
              Документы, подтверждающие квалификацию ответственных сотрудников
              должны быть предоставлены за 1 (одни) сутки до начала репетиции.
              В противном случае компании-подрядчику может быть отказано
              в доступе на площадку
            </p>
          </div>
          <div className="chichaHidden">
            <RentalDocument />
          </div>
        </div>
      </div>
    </section>
  );

  return <ChichaBox content={content} />;
};

export default RentalCost;
