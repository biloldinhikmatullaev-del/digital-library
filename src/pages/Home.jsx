import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Sparkles, BookOpen, FileText, Monitor, Bookmark, CheckSquare, GraduationCap, ClipboardList, Shield, Award, Headphones, Newspaper, Code, Cpu, Database, Heart, Scale, Compass, Building, Palette } from "lucide-react";
import { mockProducts } from "../data/mockProducts";
import "./Home.css";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSpace, setActiveSpace] = useState("educational");

  useEffect(() => {
    const fetchProducts = async () => {
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
          const featured = [
            merged.find(p => p.id === "b_eng"),
            merged.find(p => p.id === "b_rus"),
            merged.find(p => p.id === "b_math"),
            merged.find(p => p.id === "b_chio"),
            merged.find(p => p.id === "b_hist"),
            merged.find(p => p.id === "b_bio"),
            merged.find(p => p.id === "lit_quiz_1"),
            merged.find(p => p.id === "b1"),
            merged.find(p => p.id === "a1")
          ].filter(Boolean);
          setFeaturedProducts(featured.length > 0 ? featured : merged.slice(0, 6));
        } else {
          throw new Error("API error");
        }
      } catch (err) {
        console.warn("Failed fetching from Netlify API, using fallback library list...", err);
        const featured = [
          mockProducts.find(p => p.id === "b_eng"),
          mockProducts.find(p => p.id === "b_rus"),
          mockProducts.find(p => p.id === "b_math"),
          mockProducts.find(p => p.id === "b_chio"),
          mockProducts.find(p => p.id === "b_hist"),
          mockProducts.find(p => p.id === "b_bio"),
          mockProducts.find(p => p.id === "lit_quiz_1"),
          mockProducts.find(p => p.id === "b1"),
          mockProducts.find(p => p.id === "a1")
        ].filter(Boolean);
        setFeaturedProducts(featured.length > 0 ? featured : mockProducts.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const educationalCategories = [
    { name: "Книги и учебники", icon: <BookOpen size={24} />, slug: "books", color: "var(--accent-primary)" },
    { name: "Лекции", icon: <FileText size={24} />, slug: "lectures", color: "var(--accent-secondary)" },
    { name: "Презентации", icon: <Monitor size={24} />, slug: "presentations", color: "#38bdf8" },
    { name: "Методические пособия", icon: <Bookmark size={24} />, slug: "manuals", color: "#a855f7" },
    { name: "Дипломные работы", icon: <GraduationCap size={24} />, slug: "theses", color: "#ec4899" },
    { name: "Научные статьи", icon: <FileText size={24} />, slug: "articles", color: "#06b6d4" },
    { name: "Научные журналы", icon: <Newspaper size={24} />, slug: "journals", color: "#14b8a6" },
    { name: "Архив выпусков", icon: <Database size={24} />, slug: "archive", color: "#6366f1" },
    { name: "Тесты", icon: <CheckSquare size={24} />, slug: "tests", color: "#facc15" }
  ];

  const corporateCategories = [
    { name: "Инструкции", icon: <ClipboardList size={24} />, slug: "instructions", color: "var(--accent-primary)" },
    { name: "Регламенты", icon: <Shield size={24} />, slug: "regulations", color: "var(--accent-secondary)" },
    { name: "Шаблоны документов", icon: <FileText size={24} />, slug: "templates", color: "#38bdf8" },
    { name: "Обучение персонала", icon: <Award size={24} />, slug: "training", color: "#facc15" }
  ];

  const publicCategories = [
    { name: "Художественная литература", icon: <BookOpen size={24} />, slug: "fiction", color: "var(--accent-primary)" },
    { name: "Аудиокниги", icon: <Headphones size={24} />, slug: "audiobooks", color: "var(--accent-secondary)" },
    { name: "Электронные книги", icon: <BookOpen size={24} />, slug: "ebooks", color: "#38bdf8" },
    { name: "Периодические издания", icon: <Newspaper size={24} />, slug: "periodicals", color: "#facc15" }
  ];

  const thematicCategories = [
    { name: "Медицина", icon: <Heart size={24} />, slug: "medicine", color: "#ef4444" },
    { name: "Право", icon: <Scale size={24} />, slug: "law", color: "#3b82f6" },
    { name: "История", icon: <Compass size={24} />, slug: "history", color: "#f59e0b" },
    { name: "Программирование", icon: <Code size={24} />, slug: "programming", color: "var(--accent-primary)" },
    { name: "Архитектура", icon: <Building size={24} />, slug: "architecture", color: "#10b981" },
    { name: "Искусство", icon: <Palette size={24} />, slug: "art", color: "#ec4899" }
  ];

  const getCurrentCategories = () => {
    switch (activeSpace) {
      case "educational": return educationalCategories;
      case "corporate": return corporateCategories;
      case "public": return publicCategories;
      case "thematic": return thematicCategories;
      default: return educationalCategories;
    }
  };

  const currentCategories = getCurrentCategories();

  return (
    <div className="home-page page-transition">
      <div className="ambient-glow" style={{ top: "-100px", right: "-100px" }}></div>
      <div className="ambient-glow-2" style={{ top: "300px", left: "-200px" }}></div>

      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Интеллектуальная база знаний</span>
          </div>
          <h1 className="hero-title" style={{ fontSize: '3.4rem' }}>
            Все библиотеки <br />
            <span className="gradient-text">на одной платформе</span>
          </h1>
          <p className="hero-desc">
            Универсальный портал электронных библиотек. Изучайте академические материалы и пишите диссертации, используйте корпоративные инструкции компании, читайте художественную литературу и слушайте аудиокниги, или проходите готовые тематические курсы обучения.
          </p>
          <div className="hero-actions" style={{ flexWrap: 'wrap', gap: '12px' }}>
            <Link to="/catalog?space=educational" className="btn-primary">
              Университетская
            </Link>
            <Link to="/catalog?space=corporate" className="btn-secondary">
              База знаний
            </Link>
            <Link to="/catalog?space=public" className="btn-secondary" style={{ borderColor: 'var(--accent-primary)' }}>
              Публичная
            </Link>
            <Link to="/catalog?space=thematic" className="btn-secondary" style={{ borderColor: 'var(--accent-secondary)' }}>
              Тематическая
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card glass">
            <div className="hero-card-glow"></div>
            <img src="/images/bulgakov_cover.png" alt="Аудиокнига Булгаков" className="hero-image" />
            <div className="hero-card-details">
              <span className="badge-category" style={{ background: 'var(--accent-secondary)', color: 'var(--text-primary)' }}>Аудиокнига</span>
              <h3>Мастер и Маргарита</h3>
              <p>М. А. Булгаков • 14.5 часов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Selector & Categories Grid */}
      <section className="categories container">
        <div className="section-header">
          <h2 className="section-title">Разделы и Категории</h2>
          <p className="section-subtitle">Переключайтесь между четырьмя специализированными библиотечными пространствами.</p>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap', gap: '8px' }}>
            <div className="auth-tabs glass" style={{ width: 'auto', display: 'flex', padding: '4px', flexWrap: 'wrap', justifyContent: 'center', gap: '4px' }}>
              <button
                className={`auth-tab-btn ${activeSpace === "educational" ? "active" : ""}`}
                onClick={() => setActiveSpace("educational")}
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                🎓 Университетская
              </button>
              <button
                className={`auth-tab-btn ${activeSpace === "corporate" ? "active" : ""}`}
                onClick={() => setActiveSpace("corporate")}
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                🏢 База знаний
              </button>
              <button
                className={`auth-tab-btn ${activeSpace === "public" ? "active" : ""}`}
                onClick={() => setActiveSpace("public")}
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                📖 Публичная
              </button>
              <button
                className={`auth-tab-btn ${activeSpace === "thematic" ? "active" : ""}`}
                onClick={() => setActiveSpace("thematic")}
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
              >
                🔍 Тематическая
              </button>
            </div>
          </div>
        </div>

        <div className="categories-grid" style={{ gridTemplateColumns: activeSpace === "educational" ? 'repeat(3, 1fr)' : activeSpace === "corporate" || activeSpace === "public" ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }}>
          {currentCategories.map((cat, i) => (
            <Link
              key={i}
              to={`/catalog?space=${activeSpace}&category=${cat.slug}`}
              className="category-card glass-interactive"
              style={{ "--accent-card": cat.color }}
            >
              <div className="category-icon-wrapper" style={{ color: cat.color }}>
                {cat.icon}
              </div>
              <h3 className="category-name" style={{ fontSize: '1rem', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.name}
              </h3>
              <span className="category-explore">
                Открыть каталог <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products / New Arrivals */}
      <section className="featured container">
        <div className="section-header">
          <h2 className="section-title">Популярные ресурсы</h2>
          <p className="section-subtitle">Востребованные учебники, статьи и аудиокниги на портале.</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promos */}
      <section className="promos container">
        <div className="promo-card glass-interactive style-purple">
          <div className="promo-details">
            <span className="promo-label">Популярная подборка</span>
            <h2>Трек по Программированию</h2>
            <p>Кураторская образовательная траектория по Computer Science: учебники по алгоритмам, лекции по Node.js, веб-технологиям и интерактивные тесты.</p>
            <Link to="/product/tprog1" className="btn-primary">
              Изучить сборник
            </Link>
          </div>
          <div className="promo-image-wrapper">
            <img src="/images/web_book_cover.png" alt="Programming Study Promo" />
          </div>
        </div>
      </section>
    </div>
  );
}
