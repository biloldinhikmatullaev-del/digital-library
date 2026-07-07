import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { PlusCircle, Trash2, LayoutGrid, ShieldAlert, Edit } from "lucide-react";
import "./Admin.css";

export default function Admin() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [newProduct, setNewProduct] = useState({
    name: "",
    author: "",
    format: "PDF",
    size: "",
    space: "educational",
    category: "books",
    description: "",
    specs: "",
    stock: "100"
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const localData = localStorage.getItem("lumina_custom_products");
      if (localData) {
        try {
          setProducts(JSON.parse(localData));
          setLoading(false);
          return;
        } catch (e) {
          console.error("Error reading custom products from localStorage in Admin", e);
        }
      }

      try {
        const res = await fetch("/.netlify/functions/products");
        if (res.ok) {
          const data = await res.json();
          const merged = [...mockProducts];
          data.forEach((item) => {
            const idx = merged.findIndex((m) => m.id === item.id);
            if (idx > -1) {
              merged[idx] = item;
            } else {
              merged.push(item);
            }
          });
          setProducts(merged);
          localStorage.setItem("lumina_custom_products", JSON.stringify(merged));
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.warn("Using fallback catalog in Admin view");
        setProducts(mockProducts);
        localStorage.setItem("lumina_custom_products", JSON.stringify(mockProducts));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "space") {
        if (value === "educational") updated.category = "books";
        else if (value === "corporate") updated.category = "instructions";
        else if (value === "public") updated.category = "fiction";
        else if (value === "thematic") updated.category = "medicine";
      }
      return updated;
    });
  };

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setNewProduct({
      name: p.name,
      author: p.author || "",
      format: p.format,
      size: p.size || "",
      space: p.space,
      category: p.category,
      description: p.description || "",
      specs: p.specs ? (Array.isArray(p.specs) ? p.specs.join(", ") : p.specs) : "",
      stock: String(p.stock || 100)
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    let updatedList;
    if (editingId) {
      // Edit mode
      updatedList = products.map((p) => {
        if (p.id === editingId) {
          return {
            ...p,
            name: newProduct.name,
            author: newProduct.author || "Кафедра ИТ",
            format: newProduct.format,
            size: newProduct.size || "1.5 MB",
            space: newProduct.space,
            category: newProduct.category,
            description: newProduct.description || "Материал для самостоятельной работы.",
            specs: newProduct.specs ? newProduct.specs.split(",").map(s => s.trim()) : ["Рекомендуется к изучению"]
          };
        }
        return p;
      });
      setProducts(updatedList);
      setMessage(`Материал "${newProduct.name}" успешно обновлен!`);
      setEditingId(null);
    } else {
      // Add mode
      const formattedProduct = {
        id: "b-" + Math.random().toString(36).substring(2, 7),
        name: newProduct.name,
        author: newProduct.author || "Кафедра ИТ",
        format: newProduct.format,
        size: newProduct.size || "1.5 MB",
        space: newProduct.space,
        category: newProduct.category,
        image: newProduct.category === "books" || newProduct.category === "fiction"
          ? "/images/english_book_cover.png"
          : newProduct.category === "audiobooks"
            ? "/images/bulgakov_cover.png"
            : "/images/web_book_cover.png",
        description: newProduct.description || "Материал для самостоятельной работы.",
        specs: newProduct.specs ? newProduct.specs.split(",").map(s => s.trim()) : ["Рекомендуется к изучению"],
        stock: 100,
        rating: 5.0
      };

      updatedList = [formattedProduct, ...products];
      setProducts(updatedList);
      setMessage(`Материал "${formattedProduct.name}" успешно добавлен в базу!`);
    }

    localStorage.setItem("lumina_custom_products", JSON.stringify(updatedList));
    
    // Clear form
    setNewProduct({
      name: "",
      author: "",
      format: "PDF",
      size: "",
      space: "educational",
      category: "books",
      description: "",
      specs: "",
      stock: "100"
    });

    setTimeout(() => setMessage(""), 4000);
  };

  const handleDeleteProduct = (id, name) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("lumina_custom_products", JSON.stringify(updated));
    setMessage(`Материал "${name}" удален из каталога.`);
    setTimeout(() => setMessage(""), 4000);
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "books": return "Книги и учебники";
      case "lectures": return "Лекции";
      case "presentations": return "Презентации";
      case "manuals": return "Методические пособия";
      case "theses": return "Дипломные работы";
      case "dissertations": return "Диссертации";
      case "articles": return "Научные статьи";
      case "journals": return "Научные журналы";
      case "archive": return "Архив выпусков";
      case "tests": return "Тесты";
      case "instructions": return "Инструкции";
      case "regulations": return "Регламенты";
      case "templates": return "Шаблоны документов";
      case "training": return "Обучение персонала";
      case "fiction": return "Художественная литература";
      case "audiobooks": return "Аудиокниги";
      case "ebooks": return "Электронные книги";
      case "periodicals": return "Периодические издания";
      case "medicine": return "Медицина";
      case "law": return "Право";
      case "history": return "История";
      case "programming": return "Программирование";
      case "architecture": return "Архитектура";
      case "art": return "Искусство";
      default: return cat;
    }
  };

  if (!user) {
    return (
      <div className="admin-page container guest-view glass">
        <ShieldAlert size={48} className="guest-icon" />
        <h2>Доступ ограничен</h2>
        <p>Эта страница предназначена только для администраторов.</p>
        <Link to="/auth" className="btn-primary">
          Войти в систему
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-page container page-transition">
      <div className="ambient-glow" style={{ top: "0", left: "0" }}></div>

      <div className="admin-header">
        <h1 className="admin-title">Управление платформой</h1>
        <p className="admin-subtitle">Регистрация материалов библиотеки, тестов, корпоративных регламентов и шаблонов.</p>
      </div>

      {message && <div className="admin-alert glass">{message}</div>}

      <div className="admin-grid">
        {/* Create Product Form */}
        <section className="admin-form-section glass">
          <h3 className="admin-panel-title">
            <PlusCircle size={20} /> {editingId ? "Редактировать ресурс" : "Добавить ресурс"}
          </h3>
          <form className="admin-form" onSubmit={handleAddProduct}>
            <div className="form-group">
              <label htmlFor="name">Название материала</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-field"
                required
                placeholder="e.g. Учебник по теории архитектуры"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Автор / Источник</label>
              <input
                type="text"
                id="author"
                name="author"
                className="input-field"
                required
                placeholder="e.g. проф. Иванов А.М."
                value={newProduct.author}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="format">Формат файла</label>
                <input
                  type="text"
                  id="format"
                  name="format"
                  className="input-field"
                  required
                  placeholder="PDF, DOCX, Тест"
                  value={newProduct.format}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="size">Объем / Размер</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  className="input-field"
                  required
                  placeholder="4.2 MB / 15 стр."
                  value={newProduct.size}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="space">Пространство</label>
              <select
                id="space"
                name="space"
                className="input-field"
                value={newProduct.space}
                onChange={handleInputChange}
                style={{ background: 'var(--bg-dark)' }}
              >
                <option value="educational">🎓 Университетская библиотека</option>
                <option value="corporate">🏢 База знаний</option>
                <option value="public">📖 Публичная библиотека</option>
                <option value="thematic">🔍 Тематическая библиотека</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                name="category"
                className="input-field"
                value={newProduct.category}
                onChange={handleInputChange}
                style={{ background: 'var(--bg-dark)' }}
              >
                {newProduct.space === "educational" && (
                  <>
                    <option value="books">Книги и учебники</option>
                    <option value="lectures">Лекции</option>
                    <option value="presentations">Презентации</option>
                    <option value="manuals">Методические пособия</option>
                    <option value="theses">Дипломные работы</option>
                    <option value="dissertations">Диссертации</option>
                    <option value="articles">Научные статьи</option>
                    <option value="journals">Научные журналы</option>
                    <option value="archive">Архив выпусков</option>
                    <option value="tests">Тесты</option>
                  </>
                )}
                {newProduct.space === "corporate" && (
                  <>
                    <option value="instructions">Инструкции</option>
                    <option value="regulations">Регламенты</option>
                    <option value="templates">Шаблоны документов</option>
                    <option value="training">Обучение персонала</option>
                  </>
                )}
                {newProduct.space === "public" && (
                  <>
                    <option value="fiction">Художественная литература</option>
                    <option value="audiobooks">Аудиокниги</option>
                    <option value="ebooks">Электронные книги</option>
                    <option value="periodicals">Периодические издания</option>
                  </>
                )}
                {newProduct.space === "thematic" && (
                  <>
                    <option value="medicine">Медицина</option>
                    <option value="law">Право</option>
                    <option value="history">История</option>
                    <option value="programming">Программирование</option>
                    <option value="architecture">Архитектура</option>
                    <option value="art">Искусство</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                className="input-field textarea-field"
                placeholder="Краткая аннотация ресурса..."
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="specs">Спецификации (через запятую)</label>
              <input
                type="text"
                id="specs"
                name="specs"
                className="input-field"
                placeholder="Версия 1.0, Доступ после NDA, Обязательно к прочтению"
                value={newProduct.specs}
                onChange={handleInputChange}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary admin-submit-btn" style={{ flex: 1 }}>
                {editingId ? "Сохранить изменения" : "Опубликовать ресурс"}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => {
                    setEditingId(null);
                    setNewProduct({
                      name: "",
                      author: "",
                      format: "PDF",
                      size: "",
                      space: "educational",
                      category: "books",
                      description: "",
                      specs: "",
                      stock: "100"
                    });
                  }}
                  style={{ flex: 1 }}
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Existing Products table simulation */}
        <section className="admin-inventory-section glass">
          <h3 className="admin-panel-title">
            <LayoutGrid size={20} /> Список ресурсов
          </h3>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="inventory-table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Код</th>
                    <th>Название</th>
                    <th>Формат</th>
                    <th>Раздел</th>
                    <th>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="table-id">{p.id}</td>
                      <td className="table-name" style={{ fontSize: '0.85rem' }}>{p.name}</td>
                      <td style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{p.format}</td>
                      <td style={{ fontSize: '0.8rem' }}>{getCategoryLabel(p.category)}</td>
                      <td style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                          className="table-edit-btn"
                          onClick={() => handleEditClick(p)}
                          title="Редактировать ресурс"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--accent-primary)',
                            padding: '6px',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="table-delete-btn"
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          title="Удалить из каталога"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
