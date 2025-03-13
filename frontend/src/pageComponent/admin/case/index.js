"use client";

import { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  FormControlLabel,
  // FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Tooltip,
} from "@mui/material";
import DatePicker from "react-datepicker";
import { insertCase, updateCase } from "@/api/caseAPI";
import { getSite } from "@/api/siteAPI";
import MultipleValueTextInput from "react-multivalue-text-input";
import { Dropzone, FileMosaic } from "@files-ui/react";
import { getThrees } from "@/api/threeAPI";
import { CreatePageWrapper } from "../AdminSection";
import { TabButton } from "@/components/Buttons";
import { darkAdd } from "@/assets";
import { Input, SelectBox, TextArea } from "@/components/Inputs";
import LoadingProgress from "@/components/Loading/Loading";
import { useRouter, useSearchParams } from "next/navigation";

const inputInfo = [
  {
    title: "Название",
    name: "name",
    type: "text",
    placeholder: "Введите название",
  },
  {
    title: "Тип кейса",
    name: "blog_type",
    type: "text",
    placeholder: "Частное",
    option: [
      "Частное",
      "Корпоративное",
      "Конференция",
      "Государственное",
      "Спортивное",
      "Концерт",
      "Тур",
    ],
  },
  {
    title: "Место проведения",
    name: "venue",
    type: "text",
    placeholder: "Введите данные места проведения",
  },
  {
    title: "Количество гостей",
    name: "guests",
    type: "text",
    placeholder: "Введите количество гостей",
  },
  {
    title: "Описание(особенности)",
    name: "features",
    type: "text",
    placeholder: "Введите описание",
  },
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
  {
    title: "Город",
    name: "city",
    type: "text",
    placeholder: "Введите город",
  },
  {
    title: "Хедлайнер",
    name: "eventTitle",
    type: "text",
    placeholder: "Введите хедлайнера",
  },
];

const optionsWhatWeDid = [
  "Свет",
  "Звук",
  "Видео",
  "Одежда сцены",
  "3д-визуализация",
  "Репетиционная база",
];

const NewCase = () => {
  const [site, setSite] = useState([]);
  const [dData, setDdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useRouter();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    cities: [],
    name: "",
    blog_type: "Частное",
    startDate: "",
    endDate: "",
    guests: "",
    venue: "",
    features: "",
    site_id: "",
    three_id: "",
    video: {},
    site_type: [],
    images: [],
    eventTitle: "",
    title: "",
    keyword: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [siteData, threeData] = await Promise.all([getSite(), getThrees()]);
      setSite(siteData);
      setDdata(threeData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchParams.size) {
      const initialData = {};
      searchParams.forEach((value, key) => {
        try {
          const parsedValue = JSON.parse(value);
          if (parsedValue !== null) {
            initialData[key] = parsedValue;
          }
        } catch {
          if (value !== null) {
            initialData[key] = value;
          }
        }
      });

      // Parse the startDate and endDate from the search parameters
      const parseRussianDate = (dateString) => {
        const months = {
          января: 0,
          февраля: 1,
          марта: 2,
          апреля: 3,
          мая: 4,
          июня: 5,
          июля: 6,
          августа: 7,
          сентября: 8,
          октября: 9,
          ноября: 10,
          декабря: 11,
        };
        const [day, month, year] = dateString.split(" ");
        return new Date(year, months[month.toLowerCase()], day);
      };

      if (initialData.startDate) {
        const startDate = parseRussianDate(initialData.startDate);
        setSelectedDate(startDate);
      }

      if (initialData.endDate) {
        const endDate = parseRussianDate(initialData.endDate);
        setSelectedEndDate(endDate);
      }

      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [searchParams]);

  const handleAddCity = (item) => {
    setFormData((prev) => ({
      ...prev,
      cities: [...prev.cities, item],
    }));
  };

  const handleDeleteCity = (item) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.filter((city) => city !== item),
    }));
  };

  const handleOneCity = (e) => {
    setFormData((prev) => ({
      ...prev,
      cities: [e.target.value],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleVideoChange = (e) =>
    setFormData((prev) => ({ ...prev, video: e.target.files[0] }));

  const updateFiles = (incomingFiles) => {
    const updatedFiles = incomingFiles.map((file) => {
      if (file instanceof File) {
        return file;
      }
      return file.file;
    });

    setFormData((prev) => ({ ...prev, images: updatedFiles }));
  };

  const handleDateChange = (date, isStartDate) => {
    const formattedDate = date
      .toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(" г.", "");
    isStartDate ? setSelectedDate(date) : setSelectedEndDate(date);
    setFormData((prev) => ({
      ...prev,
      [isStartDate ? "startDate" : "endDate"]: formattedDate,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newFormData = new FormData();
    const appendArray = (key, array) =>
      array.forEach((item) => newFormData.append(key, item));

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (key === "images") {
          value.forEach((file) => newFormData.append("images[]", file));
        } else {
          appendArray(`${key}[]`, value);
        }
      } else {
        newFormData.append(key, value);
      }
    });

    const validations = [
      {
        condition: !newFormData.get("video"),
        message: "Перед отправкой выберите видеофайл.",
      },
      {
        condition: formData.images.length === 0,
        message: "Пожалуйста, загрузите хотя бы одно изображение.",
      },
      {
        condition: formData.cities.length === 0,
        message: "Пожалуйста, выберите хотя бы один город.",
      },
      {
        condition: formData.title.length > 250 || formData.keyword.length > 250,
        message:
          "Длина заголовка и ключевых слов не должна превышать 250 символов.",
      },
      {
        condition: formData.description.length > 500,
        message: "Описание не должно превышать 500 символов.",
      },
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        setAlertMessage(message);
        setAlertOpen(true);
        setLoading(false);
        return;
      }
    }

    try {
      const request = searchParams.size
        ? updateCase(searchParams.get("id"), newFormData)
        : insertCase(newFormData);
      const data = await request;
      if (data?.error) {
        setAlertMessage(
          data.error === 400
            ? "Ошибка: Имя блога уже существует. Пожалуйста, выберите другое имя."
            : data.message
        );
        setAlertOpen(true);
      } else {
        navigate.push("/admin/eventTable");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreatePageWrapper
      title="Введите данные нового кейса события здесь"
      handleSubmit={handleSubmit}
      link="/admin/eventTable"
      content={
        <>
          <TabButton
            icon={darkAdd}
            title="Выбрать видео"
            onChange={handleVideoChange}
          />
          {formData.video.name && (
            <Typography> Выбрать видео: {formData.video.name}</Typography>
          )}

          <Dropzone
            onChange={updateFiles}
            value={formData.images}
            localization="RU-ru"
            label="Выбрать изображения"
            footer={false}
            onClean={() => setFormData((prev) => ({ ...prev, images: [] }))} // Clear images when Dropzone is cleaned
          >
            {formData.images.map((file, index) => (
              <FileMosaic
                key={index}
                {...{
                  name: file.name || `${index + 1}.png`,
                  imageUrl: file, // Directly use the File object
                }}
                preview
                darkMode
                onDelete={() => {
                  const updatedFiles = formData.images.filter(
                    (_, i) => i !== index
                  );
                  setFormData((prev) => ({ ...prev, images: updatedFiles }));
                }}
              />
            ))}
          </Dropzone>

          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {inputInfo[0].title}
            </p>
            <Input
              value={formData[inputInfo[0].name]}
              item={inputInfo[0]}
              handleChange={handleChange}
            />
          </div>
          <div>
            <p className="x16">{inputInfo[1].title}</p>
            <SelectBox
              value={formData[inputInfo[1].name]}
              item={inputInfo[1]}
              handleSelect={handleChange}
            />
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              Город проведения
            </p>
            {formData.blog_type === "Тур" ? (
              <MultipleValueTextInput
                className="InputText x14 alignCenter"
                onItemAdded={handleAddCity}
                onItemDeleted={handleDeleteCity}
                name="city-input"
                placeholder="Введите названия городов, разделяя их ЗАПЯТОЙ или нажимая клавишу ENTER."
                values={formData?.cities}
              />
            ) : (
              <Input
                value={formData[inputInfo[8].name]}
                item={inputInfo[8]}
                handleChange={handleOneCity}
              />
            )}
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {formData.blog_type === "Тур" ? "Хедлайнер" : "Место проведения"}
            </p>
            <Input
              value={formData[inputInfo[2].name]}
              item={
                formData.blog_type === "Тур"
                  ? { ...inputInfo[2], placeholder: "Введите хедлайнера" }
                  : inputInfo[2]
              }
              handleChange={handleChange}
              required={false}
            />
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              Время проведения:
            </p>
            <div className="alignCenter">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => handleDateChange(date, true)}
                dateFormat="yyyy/MM/dd"
                className="datePicker InputText x14 alignCenter"
                required
              />
              &nbsp;~&nbsp;
              <DatePicker
                selected={selectedEndDate}
                onChange={(date) => handleDateChange(date, false)}
                dateFormat="yyyy/MM/dd"
                className="datePicker InputText x14 alignCenter"
                required
              />
            </div>
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {formData.blog_type === "Тур" ? "Общая протяженность" : "Гости"}
            </p>
            <Input
              value={formData[inputInfo[3].name]}
              item={
                formData.blog_type === "Тур"
                  ? {
                      ...inputInfo[3],
                      placeholder: "Введите общую протяженность",
                    }
                  : inputInfo[3]
              }
              handleChange={handleChange}
            />
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {formData.blog_type === "Тур"
                ? "Хедлайнер для фильтрации кейсов"
                : "Хедлайнер"}
            </p>
            <Input
              value={formData[inputInfo[9].name]}
              item={inputInfo[9]}
              handleChange={handleChange}
              required={false}
            />
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {inputInfo[4].title}
            </p>
            <TextArea
              name={inputInfo[4].name}
              value={formData[inputInfo[4].name]}
              onChange={handleChange}
              placeholder={inputInfo[4].placeholder}
            />
          </div>
          <Box sx={{ width: "100%" }}>
            <p className="x16" style={{ marginBottom: "12px" }}>
              Что мы делали
            </p>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={optionsWhatWeDid}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              value={formData?.site_type}
              onChange={(_, newValue) =>
                setFormData((prev) => ({ ...prev, site_type: newValue }))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Выберите соответствующие пункты"
                  className="InputText x14 alignCenter"
                  sx={{ backgroundColor: "white" }}
                />
              )}
            />
          </Box>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {inputInfo[5].title}
            </p>
            <Input
              value={formData[inputInfo[5].name]}
              item={inputInfo[5]}
              handleChange={handleChange}
            />
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {inputInfo[6].title}
            </p>
            <Input
              value={formData[inputInfo[6].name]}
              item={inputInfo[6]}
              handleChange={handleChange}
            />
          </div>
          <div>
            <p className="x16" style={{ marginBottom: "12px" }}>
              {inputInfo[7].title}
            </p>
            <Input
              value={formData[inputInfo[7].name]}
              item={inputInfo[7]}
              handleChange={handleChange}
            />
          </div>
          <Box>
            <FormControl>
              <p className="x16" style={{ marginBottom: "12px" }}>
                Выбор площадки
              </p>
              <RadioGroup
                row
                value={formData.site_id}
                onChange={handleChange}
                name="site_id"
              >
                {site.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item.id}
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: "20px",
                            color: "#CFCFCF",
                          },
                        }}
                      />
                    }
                    label={
                      <div className="alignCenter">
                        <Tooltip
                          title={<span className="tooltip">{item.name}</span>}
                        >
                          <video
                            src={item.video}
                            alt={item.name}
                            style={{ width: 80, height: 80, marginRight: 8 }}
                            controls
                          >
                            Ваш браузер не поддерживает тег видео.
                          </video>
                        </Tooltip>
                      </div>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          <Box>
            <FormControl>
              <p className="x16" style={{ marginBottom: "12px" }}>
                3D визуализация
              </p>
              <RadioGroup
                row
                value={formData.three_id}
                onChange={handleChange}
                name="three_id"
              >
                {dData.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    value={item.id}
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: "20px",
                            color: "#CFCFCF",
                          },
                        }}
                      />
                    }
                    label={
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Tooltip
                          title={<span className="tooltip">{item.title1}</span>}
                        >
                          <video
                            src={item.video}
                            alt={index}
                            style={{ width: 80, height: 80, marginRight: 8 }}
                            controls
                          >
                            Ваш браузер не поддерживает тег видео.
                          </video>
                        </Tooltip>
                      </div>
                    }
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          {loading && <LoadingProgress />}
          <Snackbar
            open={alertOpen}
            autoHideDuration={6000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setAlertOpen(false)}
              severity="primary"
              sx={{ width: "100%" }}
            >
              {alertMessage}
            </Alert>
          </Snackbar>
        </>
      }
    />
  );
};

export default NewCase;
