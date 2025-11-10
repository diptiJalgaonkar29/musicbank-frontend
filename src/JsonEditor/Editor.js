import React, { useEffect, useState } from "react";
import JsonEditor from "./JsonEditor";
import { Field, Formik } from "formik";
import SelectWrapper from "../branding/componentWrapper/SelectWrapper";
import SonicInputLabel from "../branding/sonicspace/components/InputLabel/SonicInputLabel";
import AsyncService from "../networking/services/AsyncService";
import axios from "axios";
import getSuperBrandId from "../common/utils/getSuperBrandId";
import TextAreaWrapper from "../branding/componentWrapper/TextAreaWrapper";
import ButtonWrapper from "../branding/componentWrapper/ButtonWrapper";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./Editor.css";
import getUpdatedPayload from "./getUpdatedPayload";

const menuItems = [
  { label: "📄 Template", key: "template" },
  { label: "💬 Message", key: "messages" },
  { label: "🎨 Theme", key: "theme" },
  { label: "🧩 Module", key: "modules" },
  { label: "⚙️ Config", key: "config" },
];

const templateOptions = [
  { label: "Message", value: "messages" },
  { label: "Theme", value: "theme" },
  { label: "Module", value: "modules" },
  { label: "Config", value: "config" },
];

const Editor = () => {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const defaultEditor = query.get("editor") || "template";
  const defaultBrand = query.get("brand") || "";

  const [brandOptions, setBrandOptions] = useState([]);
  const [initialTemplate, setInitialTemplate] = useState({});
  const [initialData, setInitialData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [brandId, setBrandId] = useState(defaultBrand);
  const [templateJsonText, setTemplateJsonText] = useState("");
  const [activeEditor, setActiveEditor] = useState(defaultEditor);
  const [formKey, setFormKey] = useState(`${defaultEditor}-form`);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState("");
  const [pathAttributes, setPathAttributes] = useState(null);
  useEffect(() => {
    setTemplateJsonText(JSON.stringify(initialTemplate, null, 2));
  }, [initialTemplate]);

  const getSuperBrandAssets = async () => {
    try {
      const response = await axios.get(
        `/api/metaData/getBrandAssetsByBrandID?metadata=config&type=ss`,
        {
          headers: {
            BrandId: 'SUPERBRAND',
            BrandName: 1,
          },
        }
      );
      if (!response?.data) {
        console.error("No brand asset data received");
        return;
      }
      // console.log("Super Brand Assets Response:", response.data);
      //Save PATH_ATTRIBUTES
      setPathAttributes(response.data.brandData.PATH_ATTRIBUTES || '');
    } catch (error) {
      console.error("Error while fetching super brand assets:", error);
    }
  };

  useEffect(() => {
    getSuperBrandAssets();
  }, []);

  useEffect(() => {
    const fetchBrandOptions = async () => {
      try {
        const response = await AsyncService.loadData(`brand/superBrandData`);
        const fetchedOptions = [
          { label: "Super Brand", value: "SUPERBRAND" },
          ...response.data.map((brand) => ({
            label: brand.brandName,
            value: brand.id,
          })),
        ];
        setBrandOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching brand list:", error);
      }
    };

    fetchBrandOptions();
  }, []);

  useEffect(() => {
    if (defaultBrand && activeEditor !== "template") {
      handleBrandChange({ value: defaultBrand });
    }
  }, [activeEditor]);

  const updateSearchParams = (params) => {
    const search = new URLSearchParams(location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
      else search.delete(key);
    });
    navigate({ search: search.toString() });
  };

  const handleBrandChange = async (selectedOption) => {
    const brandValue = selectedOption?.value;
    if (!brandValue) return;

    try {
      const response = await axios.get(
        `/api/metaData/getBrandAssetsByBrandID?metadata=${activeEditor}&type=${type}`,
        {
          headers: {
            BrandId: brandValue,
            BrandName: getSuperBrandId(),
          },
        }
      );

      if (!response?.data) {
        console.error("No brand asset data received");
        return;
      }

      setInitialTemplate(response.data.template);
      setInitialData(response.data.brandData);
      setUpdatedData(response.data.updatedBrandData || {});
      setBrandId(brandValue);
      setTemplateJsonText(JSON.stringify(response.data.template, null, 2));

      updateSearchParams({ brand: brandValue, editor: activeEditor });
    } catch (err) {
      console.error("Error loading brand assets:", err);
    }
  };

  const SaveTemplateData = async () => {
    try {
      const parsedData = JSON.parse(templateJsonText);
      const key = activeEditor.toUpperCase();
      const template = selectedTemplateType;

      let updatedPayload = getUpdatedPayload(type, template, parsedData);

      const response = await AsyncService.putData(
        `metaData/updateById/${key}?type=${type}`,
        updatedPayload
      );

      alert(
        response?.status === 200
          ? "Data updated successfully"
          : "Failed to update data"
      );
    } catch (err) {
      alert("Invalid JSON format");
      console.error("Error saving JSON:", err);
    }
  };

  return (
    <div
      className="editor_Container"
      style={{ display: "flex", padding: 20, gap: 20 }}
    >
      <div style={{ width: "260px" }}>
        <SonicInputLabel>
          {type === "ss"
            ? "Sonic-Hub"
            : type === "cs"
            ? "Creation-Station"
            : "Admin"}
        </SonicInputLabel>

        {menuItems.map((item) => {
          const isActive = activeEditor === item.key;
          return (
            <div
              key={item.key}
              onClick={() => {
                setActiveEditor(item.key);
                setFormKey(`${item.key}-form`);
                setBrandId("");
                setInitialTemplate({});
                setInitialData({});
                setUpdatedData({});
                setTemplateJsonText("");
                setTemplateLoaded(false);
                updateSearchParams({ editor: item.key, brand: "" });
              }}
              style={{
                width: "100%",
                padding: "15px 20px",
                marginTop: "20px",
                marginBottom: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: isActive ? 700 : 500,
                fontSize: "18px",
                color: isActive ? "var(--color-primary)" : "var(--color-white)",
                background: isActive ? "var(--color-card)" : "transparent",
                boxShadow: isActive
                  ? "0 2px 8px rgba(0, 0, 0, 0.15)"
                  : "0 0 0 transparent",
                transition: "all 0.3s ease",
                boxSizing: "border-box",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#ffffff10";
                  e.currentTarget.style.color = "#ffffffee";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#ffffffcc";
                }
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }}>
        <Formik key={formKey} initialValues={{ Brand: "" }} onSubmit={() => {}}>
          {({ setFieldValue }) => (
            <div className="form-container">
              {["messages", "theme", "modules", "config"].includes(
                activeEditor
              ) && (
                <>
                  <SonicInputLabel
                    htmlFor="Brand"
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      marginBottom: "10px",
                      marginTop: 20,
                    }}
                  >
                    Select Brand to Update{" "}
                    {activeEditor.charAt(0).toUpperCase() +
                      activeEditor.slice(1)}
                  </SonicInputLabel>

                  <Field
                    id="Brand"
                    name="Brand"
                    placeholder="Select Brand"
                    options={brandOptions}
                    style={{ width: "calc(100% - 100px)" }}
                    component={SelectWrapper}
                    onChange={(option) => {
                      setFieldValue("Brand", option);
                      handleBrandChange(option);
                    }}
                    value={
                      brandOptions.find((b) => b.value === brandId) || null
                    }
                  />
                </>
              )}

              {["messages", "theme", "modules", "config"].includes(
                activeEditor
              ) &&
                brandId && (
                  <JsonEditor
                    template={initialTemplate}
                    data={initialData}
                    values={
                      brandId === "SUPERBRAND" ? initialData : updatedData
                    }
                    brandId={brandId}
                    activeEditor={activeEditor}
                    type={type}
                    pathAttr={pathAttributes}
                  />
                )}

              {activeEditor === "template" && (
                <div style={{ marginTop: 20 }}>
                  <SonicInputLabel
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      marginBottom: "10px",
                    }}
                  >
                    Select Template
                  </SonicInputLabel>
                  <Field
                    id="Brand"
                    name="Brand"
                    placeholder="Select Template"
                    options={templateOptions}
                    component={SelectWrapper}
                    onChange={async (option) => {
                      setFieldValue("Brand", option);
                      setTemplateJsonText("");
                      setTemplateLoaded(false);
                      setSelectedTemplateType(option.value);

                      try {
                        const response = await axios.get(
                          `/api/metaData/getBrandAssetsByBrandID?metadata=templates&type=${type}`,
                          {
                            headers: {
                              BrandId: option.value,
                              BrandName: getSuperBrandId(),
                            },
                          }
                        );

                        const templateData = response.data.template;
                        const selectedJson = templateData[option.value];
                        setTemplateJsonText(
                          JSON.stringify(selectedJson, null, 2)
                        );
                        setTemplateLoaded(true);
                      } catch (err) {
                        console.error("Error loading template data:", err);
                      }
                    }}
                  />

                  {templateLoaded && (
                    <>
                      <TextAreaWrapper
                        name="templateJson"
                        rows="25"
                        style={{ width: "88%", marginTop: "20px" }}
                        value={templateJsonText}
                        onChange={(e) => setTemplateJsonText(e.target.value)}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: 20,
                        }}
                      >
                        <ButtonWrapper type="button" onClick={SaveTemplateData}>
                          Submit Template
                        </ButtonWrapper>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Editor;
