"use client";

import { useState } from "react";
import {
  Autocomplete,
  Box,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { insertSite, updateSite } from "@/api/siteAPI";
import { CreatePageWrapper } from "../AdminSection";
import { Input, SelectBox } from "@/components/Inputs";
import { TabButton } from "@/components/Buttons";
import { darkAdd } from "@/assets";
import LoadingProgress from "@/components/Loading/Loading";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const CustomSlider = styled(Slider)({
  color: "#1976d2",
  margin: 0,
  "& .MuiSlider-thumb": {
    backgroundColor: "#FFFFFF",
  },
  "& .MuiSlider-rail": {
    color: "var(--secondaryWhiteColor)",
    opacity: "1",
  },
  "& .MuiSlider-track": {
    color: "#FFFFFF",
    border: "none",
  },
});

const marks = [
  { value: 0, capacity: 0, label: "0" },
  { value: 1, capacity: 30, label: "30" },
  { value: 2, capacity: 50, label: "50" },
  { value: 3, capacity: 100, label: "100" },
  { value: 4, capacity: 150, label: "150" },
  { value: 5, capacity: 200, label: "200" },
  { value: 6, capacity: 300, label: "300" },
  { value: 7, capacity: 500, label: "500" },
  { value: 8, capacity: 700, label: "700" },
  { value: 9, capacity: 1000, label: "1000+" },
];

const inputinfo = [
  {
    title: "Название площадки",
    name: "name",
    type: "text",
    placeholder: "Название",
  },
  {
    title: "ТИП ПЛОЩАДКИ",
    name: "site_type",
    placeholder: "ТИП",
    option: [
      "Рестораны",
      "Конференц-залы",
      "Загородные площадки",
      "Концертные залы",
      "Дом культуры",
      "Клуб",
      "Лофт",
    ],
  },
  {
    title: "Ссылка на страницу площадки",
    name: "link_page",
    type: "text",
    placeholder: "Ссылка на площадку",
  },
  {
    title: "ГОРОД",
    name: "cities",
    type: "text",
    placeholder: "ГОРОД",
  },
  {
    title: "АДРЕС",
    name: "address",
    type: "text",
    placeholder: "АДРЕС",
  },
  // {
  //   title: "ТИП КЕЙСА",
  //   name: "blog_type",
  //   placeholder: "ВХОДНАЯ ТИП",
  //   option: [
  //     "Частное",
  //     "Корпоративное",
  //     "Конференция",
  //     "Государственное",
  //     "Спортивное",
  //     "Концерт",
  //     "Тур",
  //   ],
  // },
  {
    title: "Meta Title",
    name: "title",
    type: "text",
    placeholder:
      "Заголовок страницы для поисковых систем. Рекомендуется не более 250 символов.",
  },
  {
    title: "Meta Keyword",
    name: "keyword",
    type: "text",
    placeholder: "Список ключевых слов через запятую для поисковых систем.",
  },
  {
    title: "Meta Description",
    name: "description",
    type: "text",
    placeholder:
      "Краткое описание страницы для поисковых систем. Рекомендуется не более 250 символов.",
  },
];

const tagCurrencies = [
  "Свет",
  "Звук",
  "Видео",
  "3Д",
  "Одежда сцены",
  "Репетиционная база",
];

const typeEquipment = ["Парковка", "Гримёрные комнаты", "Проекторы и экраны"];

const NewSite = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const navigate = useRouter();

  const getInitialData = () => {
    if (!searchParams.size) return null;

    let data = {};
    searchParams.forEach((value, key) => {
      try {
        data[key] = JSON.parse(value);
      } catch {
        data[key] = value;
      }
    });
    return data;
  };

  const Data = getInitialData();

  const [formData, setFormData] = useState({
    name: Data?.name || "",
    site_type: Data?.site_type || [],
    capacity: Data?.capacity || "",
    address: Data?.address || "",
    link_page: Data?.link_page || "",
    tags: Data?.tags || [],
    siteTags: Data?.siteTags || [],
    equipment_type: Data?.equipment_type || [],
    queue: Data?.queue || 0,
    cities: Data?.cities?.[0] || "",
    title: Data?.title || "",
    keyword: Data?.keyword || "",
    description: Data?.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "capacity" ? marks[value].capacity : value,
    });
  };

  const handleVideoChange = (e) => {
    setFormData({ ...formData, video: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let newFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => newFormData.append(`${key}[]`, item));
      } else if (key === "video") {
        newFormData.append(key, formData[key]);
      } else {
        newFormData.append(key, formData[key]);
      }
    });

    const request = Data
      ? updateSite(Data?.id, newFormData)
      : insertSite(newFormData);

    request
      .then((data) => {
        if (data && data.error) {
          console.log(data.error);
        } else {
          navigate.push("/admin/sitesTable");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const [siteTags, setSiteTags] = useState([]);
  const [editingTag, setEditingTag] = useState({ name: "", capacity: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddTag = () => {
    if (editingIndex !== null) {
      const updatedTags = siteTags.map((tag, index) =>
        index === editingIndex ? editingTag : tag
      );
      setSiteTags(updatedTags);
      setEditingIndex(null);
    } else {
      if (editingTag.name && editingTag.capacity) {
        setSiteTags([...siteTags, editingTag]);
      }
    }
    setEditingTag({ name: "", capacity: "" });
  };

  const handleEditTag = (index) => {
    const tagToEdit = siteTags[index];
    setEditingTag(tagToEdit);
    setEditingIndex(index);
  };

  const handleDeleteTag = (index) => {
    const updatedTags = siteTags.filter((_, i) => i !== index);
    setSiteTags(updatedTags);
  };

  return (
    <CreatePageWrapper
      title="Введите данные новой площадки здесь"
      handleSubmit={handleSubmit}
      link="/admin/sitesTable"
      content={
        <>
          <TabButton
            icon={darkAdd}
            title="Выбрать видео"
            onChange={handleVideoChange}
          />
          {formData.video && (
            <Typography> Выбрать видео: {formData.video.name}</Typography>
          )}

          {inputinfo.map((item, index) => (
            <div key={index}>
              <Typography className="x16" style={{ marginBottom: "12px" }}>
                {item.title}
              </Typography>
              {item.name === "site_type" ? (
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={item.option}
                  getOptionLabel={(option) => option}
                  filterSelectedOptions
                  value={formData.site_type}
                  onChange={(event, newValue) => {
                    setFormData({ ...formData, site_type: newValue });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Выберите тип площадки"
                      className="InputText x14 alignCenter"
                      sx={{ backgroundColor: "white" }}
                    />
                  )}
                />
              ) : (
                <Input
                  value={formData[item.name]}
                  item={item}
                  handleChange={handleChange}
                />
              )}
            </div>
          ))}

          <Box sx={{ width: "100%" }}>
            <Typography variant="x16" style={{ textTransform: "uppercase", marginBottom: "12px" }}>
              Разделы, где будет отображена площадка
            </Typography>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={tagCurrencies}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              value={formData.tags}
              onChange={(event, newValue) => {
                setFormData({ ...formData, tags: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Нажмите, чтобы добавить"
                  className="InputText x14 alignCenter"
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
          </Box>

          <div style={{ paddingBottom: "30px", width: "100%" }}>
            <div
              className="spaceBetween"
              style={{ color: "white", marginBottom: "10px" }}
            >
              <p style={{ textTransform: "uppercase" }}>Вместимость</p>
            </div>
            <CustomSlider
              aria-label="Restricted values"
              valueLabelDisplay="auto"
              name="capacity"
              step={null}
              marks={marks}
              min={0}
              max={9}
              onChange={handleChange}
              value={
                formData.capacity
                  ? marks.findIndex(
                      (mark) => mark.capacity === formData.capacity
                    )
                  : 0
              }
            />
            <div className="spaceBetween slideNumber">
              {marks.map((item, index) => (
                <p key={index}>{item.label}</p>
              ))}
            </div>
          </div>

          <Box sx={{ width: "100%" }}>
            <Typography style={{ textTransform: "uppercase" }}>
              Виды оснащения
            </Typography>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={typeEquipment}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              value={formData.equipment_type}
              onChange={(event, newValue) => {
                setFormData({ ...formData, equipment_type: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Нажмите, чтобы добавить"
                  className="InputText x14 alignCenter"
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
          </Box>

          <div>
            <h2>Теги вместимости</h2>
            <div className="spaceAround X16" style={{ marginBottom: "16px" }}>
              <input
                className="InputText x16 alignCenter"
                style={{ marginRight: "12px", width: "50%" }}
                type="text"
                placeholder="Название тега"
                value={editingTag.name}
                onChange={(e) =>
                  setEditingTag({ ...editingTag, name: e.target.value })
                }
              />
              <input
                className="InputText x16 alignCenter"
                style={{ marginLeft: "12px", width: "50%" }}
                type="number"
                placeholder="Вместимость"
                value={editingTag.capacity}
                onChange={(e) =>
                  setEditingTag({ ...editingTag, capacity: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              className="defaultButton"
              onClick={handleAddTag}
              style={{ marginBottom: "12px" }}
            >
              {editingIndex !== null ? "Сохранить изменения" : "Добавить тег"}
            </button>
            {siteTags.length > 0 ? (
              <ul className="x14" style={{ marginBottom: "12px" }}>
                {siteTags.map((tag, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      margin: "8px 0",
                    }}
                  >
                    <input
                      className="InputText x16 alignCenter"
                      style={{ marginRight: "12px", width: "50%" }}
                      type="text"
                      value={tag.name}
                      readOnly
                    />
                    <input
                      className="InputText x16 alignCenter"
                      style={{ marginLeft: "12px", width: "50%" }}
                      type="number"
                      value={tag.capacity}
                      readOnly
                    />
                    <button
                      type="button"
                      className="defaultButton"
                      onClick={() => handleEditTag(index)}
                      style={{ marginLeft: "8px" }}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTag(index)}
                      style={{ marginLeft: "8px" }}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="x16">Теги сайта пока не добавлены.</p>
            )}
          </div>

          {loading && <LoadingProgress />}
        </>
      }
    />
  );
};

export default NewSite;
