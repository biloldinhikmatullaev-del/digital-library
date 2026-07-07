import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Search, SlidersHorizontal, RefreshCw } from "lucide-react";
import { mockProducts } from "../data/mockProducts";
import "./Catalog.css";

const getPlotKeywords = (product) => {
  if (product.plotKeywords) return product.plotKeywords;
  
  const fallbackMap = {
    "f1": ["старуха", "убийство", "топор", "процентщица", "петербург", "совесть", "наказание", "раскольников", "грех", "муки", "соня мармеладова", "следователь"],
    "a1": ["кот бегемот", "дьявол", "воланд", "москва", "мастер", "маргарита", "психбольница", "ершалаим", "пилат", "рукописи не горят", "любовь", "ведьма"],
    "e1": ["внимание", "соцсети", "телефон", "уведомления", "гаджеты", "зависимость", "интернет", "цифровой", "фокус", "минимализм"],
    "pe1": ["техника", "наука", "космос", "роботы", "физика", "изобретения", "технологии", "механика", "журнал"],
    "b_eng": ["английский", "грамматика", "словарь", "разговорный", "учеба", "язык", "эванс", "учебник"],
    "b_rus": ["русский", "язык", "морфология", "синтаксис", "словообразование", "филология", "грамматика", "учебник"],
    "b_math": ["предел", "интеграл", "производная", "функция", "математика", "числа", "теорема", "анализ", "фихтенгольц", "учебник"],
    "b_chio": ["общество", "социология", "политология", "философия", "право", "человек", "боголюбов", "учебник"],
    "b_hist": ["русь", "князь", "владимир", "крещение", "царь", "война", "сражение", "древняя", "история", "учебник"],
    "b_bio": ["клетка", "днк", "генетика", "мендель", "органоиды", "ядро", "эволюция", "жизнь", "биология", "учебник"],
    "b1": ["программирование", "код", "сайт", "фронтенд", "разработка", "веб", "react", "html", "javascript", "css", "учебник"],
    "lit_quiz_1": ["викторина", "квиз", "вопросы", "классика", "русская", "достоевский", "булгаков", "пушкин", "толстой", "раскольников", "бегемот"],
    "lit_quiz_2": ["викторина", "квиз", "вопросы", "зарубежная", "шекспир", "оруэлл", "гюго", "мелвилл", "гамлет", "1984", "моби дик"]
  };
  
  return fallbackMap[product.id] || [];
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [plotSearchActive, setPlotSearchActive] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState("educational");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // Read URL query parameters on load
  const spaceParam = searchParams.get("space");
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      const localData = localStorage.getItem("lumina_custom_products");
      if (localData) {
        try {
          setProducts(JSON.parse(localData));
          setLoading(false);
          return;
        } catch (e) {
          console.error("Error reading custom products from localStorage", e);
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
        } else {
          throw new Error("Failed to load products");
        }
      } catch (err) {
        console.warn("Failed fetching from Netlify, loading fallback mock catalog...", err);
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update space and category states from URL params
  useEffect(() => {
    if (spaceParam) {
      setSelectedSpace(spaceParam);
    } else {
      setSelectedSpace("educational");
    }

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory("all");
    }
  }, [spaceParam, categoryParam]);

  // Apply filters, search and sorting
  useEffect(() => {
    let result = [...products];

    // Space filter (only apply if not searching to allow global discovery)
    if (searchQuery.trim() === "") {
      result = result.filter((product) => product.space === selectedSpace);
    }

    // Search query filter
    if (searchQuery.trim() !== "") {
      if (plotSearchActive) {
        const cleanWords = searchQuery.toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
          .split(/\s+/)
          .filter(word => word.length > 2 && !["про", "как", "под", "для", "над", "без", "при", "это", "том", "что", "помню", "сюжет", "книга", "книгу", "описание"].includes(word));
        
        if (cleanWords.length > 0) {
          result = result.map(product => {
            let score = 0;
            const keywords = getPlotKeywords(product);
            const name = product.name.toLowerCase();
            const desc = product.description.toLowerCase();
            
            cleanWords.forEach(word => {
              // 1. Keyword match (high score)
              if (keywords.some(kw => kw.toLowerCase().includes(word) || word.includes(kw.toLowerCase()))) {
                score += 10;
              }
              // 2. Title match (medium score)
              if (name.includes(word)) {
                score += 5;
              }
              // 3. Description match (low score)
              if (desc.includes(word)) {
                score += 3;
              }
            });
            
            // Calculate a matching percentage
            const matchPercent = Math.min(100, Math.round((score / (cleanWords.length * 10)) * 100));
            return { ...product, plotScore: score, plotMatchPercent: matchPercent };
          });
          
          // Filter out items with no matching words
          result = result.filter(product => product.plotScore > 0);
          
          // Sort by plotScore descending
          result.sort((a, b) => b.plotScore - a.plotScore);
        }
      } else {
        result = result.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.author && product.author.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory);
    }

    // Format filter
    if (selectedFormat !== "all") {
      result = result.filter((product) => product.format.toLowerCase().includes(selectedFormat.toLowerCase()));
    }

    // Sorting (skip if sorted by plotScore)
    if (!plotSearchActive || searchQuery.trim() === "") {
      if (sortBy === "name-asc") {
        result.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "name-desc") {
        result.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortBy === "rating") {
        result.sort((a, b) => b.rating - a.rating);
      }
    }

    setFilteredProducts(result);
  }, [products, selectedSpace, searchQuery, selectedCategory, selectedFormat, sortBy, plotSearchActive]);

  const handleSpaceChange = (space) => {
    setSelectedSpace(space);
    setSelectedCategory("all");
    
    searchParams.set("space", space);
    searchParams.delete("category");
    setSearchParams(searchParams);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPlotSearchActive(false);
    setSelectedCategory("all");
    setSelectedFormat("all");
    setSortBy("default");

    const activeSpace = searchParams.get("space") || "educational";
    setSearchParams({ space: activeSpace });
  };

  // 4 Spaces Category configurations
  const educationalCategories = [
    { key: "all", label: "Все разделы" },
    { key: "books", label: "Книги и учебники" },
    { key: "lectures", label: "Лекции" },
    { key: "presentations", label: "Презентации" },
    { key: "manuals", label: "Методические пособия" },
    { key: "theses", label: "Дипломные работы" },
    { key: "dissertations", label: "Диссертации" },
    { key: "articles", label: "Научные статьи" },
    { key: "journals", label: "Научные журналы" },
    { key: "archive", label: "Архив выпусков" },
    { key: "tests", label: "Тесты" }
  ];

  const corporateCategories = [
    { key: "all", label: "Все разделы" },
    { key: "instructions", label: "Инструкции" },
    { key: "regulations", label: "Регламенты" },
    { key: "templates", label: "Шаблоны документов" },
    { key: "training", label: "Обучение персонала" }
  ];

  const publicCategories = [
    { key: "all", label: "Все разделы" },
    { key: "fiction", label: "Художественная литература" },
    { key: "audiobooks", label: "Аудиокниги" },
    { key: "ebooks", label: "Электронные книги" },
    { key: "periodicals", label: "Периодические издания" },
    { key: "quizzes", label: "Литературные викторины" }
  ];

  const thematicCategories = [
    { key: "all", label: "Все сборники" },
    { key: "medicine", label: "Медицина" },
    { key: "law", label: "Право" },
    { key: "history", label: "История" },
    { key: "programming", label: "Программирование" },
    { key: "architecture", label: "Архитектура" },
    { key: "art", label: "Искусство" }
  ];

  const getCategories = () => {
    switch (selectedSpace) {
      case "educational": return educationalCategories;
      case "corporate": return corporateCategories;
      case "public": return publicCategories;
      case "thematic": return thematicCategories;
      default: return educationalCategories;
    }
  };

  const categories = getCategories();

  const formats = [
    { key: "all", label: "Все форматы" },
    { key: "pdf", label: "PDF" },
    { key: "docx", label: "DOCX" },
    { key: "pptx", label: "PPTX" },
    { key: "mp3", label: "MP3" },
    { key: "тест", label: "Тесты" }
  ];

  return (
    <div className="catalog-page container page-transition">
      <div className="ambient-glow" style={{ top: "100px", left: "10%" }}></div>

      <div className="catalog-header">
        <h1 className="catalog-title">
          {selectedSpace === "educational" ? "Университетская библиотека" :
           selectedSpace === "corporate" ? "Корпоративная база знаний" :
           selectedSpace === "public" ? "Публичная библиотека" : "Тематическая библиотека"}
        </h1>
        <p className="catalog-subtitle">Доступ к электронным материалам, аудиокнигам и учебным траекториям.</p>
      </div>

      <div className="catalog-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar glass">
          <div className="sidebar-section">
            <h3 className="section-heading">
              <SlidersHorizontal size={18} /> Фильтры
            </h3>
          </div>

          {/* Space switcher */}
          <div className="sidebar-section">
            <label className="filter-label">Библиотека</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className={`category-filter-btn ${selectedSpace === "educational" ? "active" : ""}`}
                onClick={() => handleSpaceChange("educational")}
              >
                🎓 Университетская
              </button>
              <button
                className={`category-filter-btn ${selectedSpace === "corporate" ? "active" : ""}`}
                onClick={() => handleSpaceChange("corporate")}
              >
                🏢 База знаний
              </button>
              <button
                className={`category-filter-btn ${selectedSpace === "public" ? "active" : ""}`}
                onClick={() => handleSpaceChange("public")}
              >
                📖 Публичная
              </button>
              <button
                className={`category-filter-btn ${selectedSpace === "thematic" ? "active" : ""}`}
                onClick={() => handleSpaceChange("thematic")}
              >
                🔍 Тематическая
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="sidebar-section">
            <label className="filter-label">Поиск</label>
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder={plotSearchActive ? "Опишите сюжет (например, кот бегемот)..." : "Поиск по каталогу..."}
                className="input-field search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="plot-search-toggle-container" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="plotSearchActive"
                checked={plotSearchActive}
                onChange={(e) => {
                  setPlotSearchActive(e.target.checked);
                  if (e.target.checked) {
                    setSelectedCategory("all");
                  }
                }}
                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-primary)' }}
              />
              <label htmlFor="plotSearchActive" style={{ fontSize: '0.85rem', color: plotSearchActive ? 'var(--accent-primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, userSelect: 'none', transition: 'color 0.2s' }}>
                🔍 Помню только сюжет
              </label>
            </div>
          </div>

          {/* Categories list (depends on space) */}
          <div className="sidebar-section">
            <label className="filter-label">Категории</label>
            <div className="categories-list">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  className={`category-filter-btn ${selectedCategory === cat.key ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Format Filter */}
          <div className="sidebar-section">
            <label className="filter-label">Формат</label>
            <div className="categories-list">
              {formats.map((fmt) => (
                <button
                  key={fmt.key}
                  className={`category-filter-btn ${selectedFormat === fmt.key ? "active" : ""}`}
                  onClick={() => setSelectedFormat(fmt.key)}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button className="btn-secondary reset-btn" onClick={handleResetFilters}>
            <RefreshCw size={16} /> Сбросить фильтры
          </button>
        </aside>

        {/* Catalog Main Panel */}
        <main className="catalog-main">
          {/* Sorting Header */}
          <div className="catalog-sorting-bar glass">
            <div className="results-count">
              Найдено ресурсов: <span>{filteredProducts.length}</span>
            </div>
            <div className="sort-selector-wrapper">
              <label htmlFor="sort-select">Сортировка</label>
              <select
                id="sort-select"
                className="input-field sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">По умолчанию</option>
                <option value="name-asc">Название (А-Я)</option>
                <option value="name-desc">Название (Я-А)</option>
                <option value="rating">По оценке</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loader"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-results glass">
              <h3>Раздел пуст</h3>
              <p>Попробуйте скорректировать запрос или сбросить фильтры.</p>
              <button className="btn-primary" onClick={handleResetFilters}>
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <div className="catalog-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
