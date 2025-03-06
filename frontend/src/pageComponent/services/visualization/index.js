"use client";

import WorkProcess from "./WorkProcess";
import SwiperSection from "@/components/Swiper/Swiper";
import ExampleCase from "./ExampleCase";
import { heroSectionInfo, workProcessInfo } from "@/constant/group";
import ContactSection from "@/pageComponent/home/ContactSection";
import BlogSection from "@/pageComponent/home/BlogSection";
import { BigVideoBox } from "@/components/Boxes";
import { visualization3d } from "@/assets";
import useScrollToTop from "@/hooks/useScrollToTop";
import HeroSample from "@/components/HeroSample/HeroSample";

const VisualizationPage = () => {
  useScrollToTop();
  return (
    <div className="wrapper visualization">
      <div className="container ">
        <HeroSample heroSectionInfo={heroSectionInfo[0]} />
        <BigVideoBox
          item={{
            title: "Cцена",
            subTitle:
              "Смоделируем несколько вариантов оформления сцены и выберем наиболее подходящий под требования",
            src: visualization3d,
          }}
            isButtonVisible = {false}
        />
        <WorkProcess
          title1="3D-визуализация"
          title2="Наш процесс работы"
          data={workProcessInfo}
          fileName="Работа с 3D-визуализацией.docx"
          url="/documents/Работа с 3D-визуализацией.docx"
          sizeStr="DOC 35 Kб"
        />
        <ExampleCase />
      </div>
      <SwiperSection displayType="3D" />
      <div className="container ">
        <ContactSection title="Заказать расчёт 3D" />
        <BlogSection />
      </div>
    </div>
  );
};

export default VisualizationPage;
