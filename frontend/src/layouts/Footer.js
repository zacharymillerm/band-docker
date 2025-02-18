"use client";

import { footerTopLink } from "../constant/group";
import {
  darkTelegram,
  darkVK,
  footerLogo,
  whiteMail,
  whitePhone,
} from "@/assets";
import {
  CircleButton,
  DefaultButton,
  ScrollSpyButton,
} from "../components/Buttons";
import { useRouter } from "next/navigation";
import { ToEmail, ToPhone } from "../components/ToText";
import Image from "next/image";
import Link from "next/link";

const FooterTop = () => (
  <div className="footerTop">
    <div className="footerTopLeft">
      <Link href="/">
        <Image className="bigFooterLogo" alt="bigFooterLogo" src={footerLogo} />
      </Link>
    </div>
    <div className="footerTopRight">
      <div>
        {footerTopLink.map((item, index) => (
          <Link key={index} href={item.url} className="footerTopLink">
            {item.title}
          </Link>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }} className="socialBtn footerButtons">
        <ScrollSpyButton
          to="contactSection"
          content={
            <div className="requestBtn1">
              <DefaultButton title="ОСТАВИТЬ ЗАЯВКУ" />
            </div>
          }
        />
        <a href="https://t.me/zavodshow" rel="noreferrer" target="_blank">
          <CircleButton icon={darkTelegram} alt="darkTelegram" />
        </a>
        <a href="https://vk.com/zavodshow" rel="noreferrer" target="_blank">
          <CircleButton icon={darkVK} alt="darkVK" />
        </a>
      </div>
    </div>
  </div>
);

const FooterMiddle = () => {
  const navigate = useRouter();

  const goContactus = () => {
    let section = document.getElementById("contactSection");
    if (!section) {
      navigate.push("/contact");
      setTimeout(() => {
        section = document.getElementById("contactSection");
        if (section) {
          const sectionY =
            section.getBoundingClientRect().top + window.pageYOffset - 200;
          window.scrollTo({ top: sectionY, behavior: "smooth" });
        }
      }, 500);
    } else {
      const sectionY =
        section.getBoundingClientRect().top + window.pageYOffset - 200;
      window.scrollTo({ top: sectionY, behavior: "smooth" });
    }
  };

  return (
    <div className="footerMiddle">
      <div className="footerMiddleLeft">
        <DefaultButton onClick={() => goContactus()} title="ОСТАВИТЬ ЗАЯВКУ" />
      </div>
      <div className="footerMiddleRight">
        <div className="middleOne box1">
          <Link href="/services/showdevelopment" className="middleTitle">
            РАЗРАБОТКА ШОУ
          </Link>
          <Link href="/services/visualization" className="middleTitle">
            3D-визуализация
          </Link>
          <Link href="/services/rehearsal" className="middleLink">
            Репетиционная база
          </Link>
        </div>
        <div className="middleOne box2">
          <Link href="/production/event" className="middleTitle">
            ПРОДАКШН
          </Link>
          <Link href="/production/event" className="middleLink">
            События
          </Link>
          <Link href="/production/tourconcert" className="middleLink">
            Концерты и туры
          </Link>
        </div>
        <div className="middleOne box3">
          <Link href="/technical/light" className="middleTitle">
            ТЕХНИЧЕСКИЕ УСЛУГИ
          </Link>
          <div>
            <Link
              href="/technical/light"
              className="middleLink"
              style={{ marginRight: "28px" }}
            >
              Свет
            </Link>
            <Link href="/technical/videopage" className="middleLink">
              Видео
            </Link>
          </div>
          <div>
            <Link
              href="/technical/sound"
              className="middleLink"
              style={{ marginRight: "28px" }}
            >
              Звук
            </Link>
            <Link href="/technical/stageclothes" className="middleLink">
              Одежда сцены
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const FooterBottom = () => {
  const navigate = useRouter();
  const goPlantShowSection = () => {
    navigate.push("/");
    setTimeout(() => {
      const section = document.getElementById("blogSection");
      if (section) {
        const sectionY =
          section.getBoundingClientRect().top + window.pageYOffset - 200;
        window.scrollTo({ top: sectionY, behavior: "smooth" });
      }
    }, 500);
  };
  return (
    <div className="footerBottom">
        <div
        className="footerBottomContact"
          style={{
            display: "grid",
            gap: "8px",
            color: `var(--secondaryWhiteColor)`,
          }}
        >
          <p className="x18 alignCenter" style={{ gap: "12px" }}>
            <Image src={whiteMail} alt="icon" />
            <ToEmail email="pr@zavodshow.ru" />
          </p>
          <p className="x18 alignCenter" style={{ gap: "12px" }}>
            <Image src={whitePhone} alt="icon" />
            <ToPhone phoneNumber="+7 495 720 12-82" />
          </p>
        </div>
      <div className="footerBottomAddress">
          Москва, г. Реутов, ул. Победы, 20
          <br />
          Пн-Сб: 10-19 МСК
      </div>
      <div className="footerBottomLink" style={{ marginBottom: "20px" }}>
        <span onClick={goPlantShowSection}>
          © ЗАВОД ШОУ
        </span>
        {/* <a target="_blank" rel="noreferrer" href="https://linkedin.com">© ЗАВОД ШОУ</a> */}
        <Link href="/policy">
          Политика конфиденциальности
        </Link>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://lard.digital"
        >
          Разработка сайта
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://drive.google.com/file/d/1GBdaQc7jWGSIvKF_bxRxT2gECSaikiZi/view"
        >
          СОУТ
        </a>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="wrapper" style={{ paddingTop: 0 }}>
      <div className="footerImg">
        <div className="footerWrapper">
          <FooterTop />
          <FooterMiddle />
          <hr />
          <FooterBottom />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
