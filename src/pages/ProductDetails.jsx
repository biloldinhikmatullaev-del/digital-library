import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Star, ShoppingCart, ArrowLeft, FileText, CheckCircle, Award, RefreshCw, HelpCircle, FileDown, Play, Pause, RotateCcw, RotateCw, BookOpen, ZoomIn, ZoomOut, Sun, Moon, X, Palette, Send } from "lucide-react";
import { mockProducts } from "../data/mockProducts";
import "./ProductDetails.css";

const getBookPages = (prod) => {
  if (!prod) return [];
  
  if (prod.id === "b_eng") {
    return [
      {
        title: "Глава 1: Английский язык для ВУЗов",
        subtitle: "Unit 1: Travel & Communication",
        content: (
          <>
            <h2>Unit 1: Global Connections</h2>
            <p>Welcome to English B2 Course. This textbook is designed to expand your grammatical and lexical proficiency. In this unit, we will cover vocabulary relating to international business, travels, and digital communications.</p>
            <blockquote>"Language is the road map of a culture. It tells you where its people come from and where they are going." — Rita Mae Brown</blockquote>
            <p><b>Grammar Focus: Present Perfect vs. Past Simple</b></p>
            <p>Use the Present Perfect to connect the past and present (e.g., 'I have visited London twice'). Use the Past Simple for finished actions in the past with specific time expressions (e.g., 'I visited London in 2024').</p>
          </>
        )
      },
      {
        title: "Глава 2: Практические упражнения",
        subtitle: "Grammar & Vocabulary Practice",
        content: (
          <>
            <h2>Exercise 1: Vocabulary Match</h2>
            <p>Match the words on the left with their definitions on the right:</p>
            <p>1. <b>Itinerary</b> — a detailed plan for a journey, list of destinations.</p>
            <p>2. <b>Ambiguity</b> — the quality of being open to more than one interpretation.</p>
            <p>3. <b>Fluency</b> — the ability to speak or write a foreign language easily and accurately.</p>
            <p><b>Reading Passage:</b> 'The Rise of Global English'. English has become the undisputed global lingua franca. Today, more than 1.5 billion people speak English worldwide, but only a fraction are native speakers...</p>
          </>
        )
      },
      {
        title: "Глава 3: Аудирование и обсуждение",
        subtitle: "Speaking & Debate Corner",
        content: (
          <>
            <h2>Discussion & Speaking</h2>
            <p>Answer the following questions with your study group:</p>
            <p>- How does learning a second language change the neurological structure of the brain?</p>
            <p>- Do you think digital translation tools (like AI translators) will eventually make language learning obsolete?</p>
            <p><b>Writing Assignment:</b> Write a short essay (200 words) discussing the benefits and drawbacks of English as a global language. Support your opinion with relevant examples.</p>
          </>
        )
      }
    ];
  }
  
  if (prod.id === "b_rus") {
    return [
      {
        title: "Раздел 1: Теория современного русского языка",
        subtitle: "Введение в языкознание",
        content: (
          <>
            <h2>Введение в морфологию русского языка</h2>
            <p>Русский язык принадлежит к восточнославянской группе индоевропейской языковой семьи. Это флективный язык с развитой системой склонений и спряжений. В данном курсе мы изучим его грамматический строй и словообразовательные модели.</p>
            <blockquote>«Русский язык в умелых руках и в опытных устах — красив, певуч, выразителен, гибок, послушен, ловок и вместителен». — А. И. Куприн</blockquote>
            <p><b>Морфемика:</b> Каждое знаменательное слово состоит из морфем — минимальных значимых частей слова. К ним относятся: корень (выражает основное лексическое значение), приставка, суффикс и окончание.</p>
          </>
        )
      },
      {
        title: "Раздел 2: Синтаксис и пунктуация",
        subtitle: "Строение предложений",
        content: (
          <>
            <h2>Синтаксис простого предложения</h2>
            <p>Простое предложение выражает законченную мысль и имеет одну грамматическую основу, состоящую из главных членов — подлежащего и сказуемого. Второстепенные члены (определение, дополнение, обстоятельство) поясняют главные.</p>
            <p><b>Сложные синтаксические конструкции:</b> Сложные предложения делятся на сложносочиненные (связанные сочинительными союзами), сложноподчиненные (связанные подчинительными союзами и союзными словами) и бессоюзные.</p>
          </>
        )
      },
      {
        title: "Раздел 3: Практический практикум",
        subtitle: "Упражнения и разборы",
        content: (
          <>
            <h2>Практическое задание</h2>
            <p>Выполните синтаксический разбор следующего предложения:</p>
            <p><i>«Книги, которые вы читаете в юности, определяют всю вашу последующую жизнь, расширяя кругозор и формируя ценностные ориентиры».</i></p>
            <p>1. Определите вид связи в предложении.</p>
            <p>2. Укажите грамматические основы.</p>
            <p>3. Объясните расстановку знаков препинания (запятые при причастном и деепричастном оборотах).</p>
          </>
        )
      }
    ];
  }

  if (prod.id === "b_math") {
    return [
      {
        title: "Глава 1: Теория пределов",
        subtitle: "Введение в математический анализ",
        content: (
          <>
            <h2>Определение предела последовательности</h2>
            <p>Пусть дана числовая последовательность. Число L называется пределом последовательности, если для любого ε &gt; 0 существует номер N(ε), такой что для всех n &gt; N выполняется неравенство:</p>
            <blockquote>|a_n - L| &lt; ε</blockquote>
            <p><b>Второй замечательный предел:</b> Один из фундаментальных результатов математического анализа, определяющий число e (число Эйлера):</p>
            <pre>{"\\lim_{n \\to \\infty} (1 + 1/n)^n = e \\approx 2.71828"}</pre>
          </>
        )
      },
      {
        title: "Глава 2: Дифференциальное исчисление",
        subtitle: "Производная функции",
        content: (
          <>
            <h2>Понятие производной</h2>
            <p>Производной функции в точке называется предел отношения приращения функции к приращению аргумента при стремлении приращения аргумента к нулю:</p>
            <pre>{"f'(x) = \\lim_{\\Delta x \\to 0} \\frac{f(x + \\Delta x) - f(x)}{\\Delta x}"}</pre>
            <p><b>Геометрический смысл производной:</b> Значение производной функции f'(x_0) равно угловому коэффициенту касательной (тангенсу угла наклона), проведенной к графику функции в точке x_0.</p>
          </>
        )
      },
      {
        title: "Глава 3: Интегральное исчисление",
        subtitle: "Первообразная и неопределенный интеграл",
        content: (
          <>
            <h2>Интегралы</h2>
            <p>Функция F(x) называется первообразной для функции f(x), если на некотором промежутке выполняется равенство F'(x) = f(x). Совокупность всех первообразных называется неопределенным интегралом.</p>
            <p><b>Формула Ньютона-Лейбница:</b> Связывает определенный интеграл с первообразной:</p>
            <pre>{"\\int_{a}^{b} f(x) dx = F(b) - F(a)"}</pre>
          </>
        )
      }
    ];
  }
  
  if (prod.id === "b1") {
    return [
      {
        title: "Глава 1: Архитектура Web",
        subtitle: "Введение в веб-технологии",
        content: (
          <>
            <h2>Клиент-серверная архитектура</h2>
            <p>Современный веб построен на клиент-серверной модели взаимодействия. Браузер (клиент) отправляет HTTP-запросы серверу, который обрабатывает их и возвращает ресурсы (HTML, CSS, JavaScript, JSON).</p>
            <pre>{"HTTP GET /index.html -> Server\nServer -> HTTP 200 OK (text/html)"}</pre>
            <p><b>HTML5 и семантическая верстка:</b> Семантические теги (header, nav, main, article, section, footer) помогают поисковым роботам и скринридерам правильно интерпретировать структуру веб-страницы.</p>
          </>
        )
      },
      {
        title: "Глава 2: Основы React библиотеки",
        subtitle: "Компоненты и хуки состояния",
        content: (
          <>
            <h2>Реактивность в браузере</h2>
            <p>React — это декларативная библиотека для построения пользовательских интерфейсов. Основными строительными блоками являются компоненты. Хук useState позволяет объявлять состояние в функциональных компонентах:</p>
            <pre>{`const Counter = () => {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n};`}</pre>
          </>
        )
      },
      {
        title: "Глава 3: Развертывание приложений",
        subtitle: "Vite и Netlify Serverless",
        content: (
          <>
            <h2>Сборка и деплой</h2>
            <p>Сборщик проектов Vite компилирует и минифицирует исходный код для оптимальной работы в браузере. Netlify позволяет публиковать сайты напрямую из репозиториев GitHub.</p>
            <p><b>Serverless функции:</b> позволяют выполнять Node.js код в облаке без необходимости держать активный выделенный бэкэнд-сервер. Запросы к /.netlify/functions/products перехватываются и обрабатываются бессерверными обработчиками.</p>
          </>
        )
      }
    ];
  }
  
  return [
    {
      title: "Глава 1: Введение",
      subtitle: "Общие сведения",
      content: (
        <>
          <h2>1. Введение и обзор</h2>
          <p>Вы открыли цифровой документ: <b>{prod.name}</b>.</p>
          <p>Этот материал подготовлен для пользователей электронной библиотеки Lumina. Он содержит теоретическую базу, практические исследования и рекомендации по изучению темы.</p>
          <blockquote>«Чтение хороших книг — это разговор с самыми лучшими людьми прошедших времен». — Рене Декарт</blockquote>
          <p>Для ознакомления со следующими разделами используйте боковую панель оглавления или нижние кнопки переключения страниц.</p>
        </>
      )
    },
    {
      title: "Глава 2: Основная часть",
      subtitle: "Детали и методология",
      content: (
        <>
          <h2>2. Методологические основы</h2>
          <p>В этой главе рассматриваются основные принципы и практические методы, примененные при создании документа <b>{prod.name}</b> под авторством {prod.author || "Кафедры информационных технологий"}.</p>
          <p>Проанализированы ключевые параметры, составлены сравнительные таблицы и предоставлены комплексные рекомендации для самостоятельного изучения материала.</p>
        </>
      )
    },
    {
      title: "Глава 3: Заключение",
      subtitle: "Выводы и литература",
      content: (
        <>
          <h2>3. Выводы и заключение</h2>
          <p>На основе проведенного анализа можно сделать вывод о высокой научной и практической ценности предоставленного ресурса. Материал рекомендуется для углубленного изучения студентам и специалистам.</p>
          <p><b>Список источников:</b></p>
          <p>1. Официальные регламенты и научные стандарты библиотеки Lumina (2026 г.).</p>
          <p>2. Материалы всеобщего открытого фонда цифровых библиотек.</p>
        </>
      )
    }
  ];
};

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");

  // Quiz States
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizHistorySaved, setQuizHistorySaved] = useState(false);

  // Audio Player States
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(5);
  const [audioTime, setAudioTime] = useState(1250); // Start at 20 min 50 sec

  // Online Reader States
  const [readerOpen, setReaderOpen] = useState(false);
  const [readerPage, setReaderPage] = useState(1);
  const [readerTheme, setReaderTheme] = useState("dark");
  const [readerZoom, setReaderZoom] = useState(100);

  // Reviews & Comments States
  const [reviews, setReviews] = useState([]);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`lumina_reviews_${id}`);
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      const defaults = [
        {
          author: "Иван С.",
          rating: 5,
          date: "04.06.2026",
          comment: "Отличный материал! Все разложено по полочкам, очень помогло при подготовке к экзамену."
        },
        {
          author: "Мария К.",
          rating: 4,
          date: "18.06.2026",
          comment: "Хорошая структура. Хотелось бы больше практических примеров в коде, но в целом супер."
        }
      ];
      setReviews(defaults);
    }
  }, [id]);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError("Пожалуйста, введите ваш комментарий.");
      return;
    }
    
    const authorName = reviewAuthor.trim() || (user && user.displayName) || "Аноним";
    const newRev = {
      author: authorName,
      rating: reviewRating,
      date: new Date().toLocaleDateString("ru-RU"),
      comment: reviewComment.trim()
    };
    
    const updated = [newRev, ...reviews];
    setReviews(updated);
    localStorage.setItem(`lumina_reviews_${id}`, JSON.stringify(updated));
    
    setReviewComment("");
    setReviewAuthor("");
    setReviewRating(5);
    setReviewSuccess(true);
    setReviewError("");
    
    setTimeout(() => {
      setReviewSuccess(false);
    }, 4000);
  };

  const getProductImageStyle = (productId) => {
    if (!productId) return {};
    const customCovers = ["b_eng", "b_rus", "b_math", "b_chio", "b_hist", "b_bio", "a1"];
    if (customCovers.includes(productId)) {
      return {};
    }
    
    let hash = 0;
    for (let i = 0; i < productId.length; i++) {
      hash = productId.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use golden angle for maximum color spreading
    const hue = Math.floor((Math.abs(hash) * 137.5) % 360);
    const sat = 4 + (Math.abs(hash % 3) * 0.5); // Saturation factor 4.0 to 5.0
    const brightness = 0.95 + (Math.abs(hash % 3) * 0.1); // Brightness 0.95 to 1.15
    return { 
      filter: `hue-rotate(${hue}deg) saturate(${sat}) brightness(${brightness}) contrast(1.1)`
    };
  };

  useEffect(() => {
    const fetchProduct = async () => {
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
          const found = merged.find((p) => p.id === id);
          if (found) {
            setProduct(found);
          } else {
            throw new Error("Material not found");
          }
        } else {
          throw new Error("API responded with error");
        }
      } catch (err) {
        console.warn("Failed fetching product, loading fallback catalog details...", err);
        const found = mockProducts.find((p) => p.id === id);
        setProduct(found || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Audio timer effect
  useEffect(() => {
    let interval = null;
    if (audioPlaying) {
      interval = setInterval(() => {
        setAudioTime((prev) => prev + 1);
        setAudioProgress((prev) => Math.min(prev + 0.05, 100));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [audioPlaying]);

  // Save Quiz results to localStorage when finished
  useEffect(() => {
    if (quizFinished && product && !quizHistorySaved) {
      const finalScorePct = Math.round((score / product.questions.length) * 100);
      const mockQuizResults = JSON.parse(localStorage.getItem("lumina_mock_quizzes") || "[]");
      mockQuizResults.unshift({
        testId: product.id,
        testName: product.name,
        date: new Date().toLocaleDateString("ru-RU", { year: "numeric", month: "short", day: "numeric" }),
        score: `${score}/${product.questions.length}`,
        percentage: finalScorePct,
        status: finalScorePct >= 75 ? "Пройден" : "Не сдан"
      });
      localStorage.setItem("lumina_mock_quizzes", JSON.stringify(mockQuizResults));
      setQuizHistorySaved(true);
    }
  }, [quizFinished, score, product, quizHistorySaved]);

  if (loading) {
    return (
      <div className="product-details-page loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page container no-product glass">
        <h2>Материал не найден</h2>
        <p>К сожалению, запрашиваемый материал отсутствует в нашей базе.</p>
        <Link to="/catalog" className="btn-primary">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setQuizFinished(false);
    setQuizHistorySaved(false);
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const nextQuestion = () => {
    if (selectedOption === product.questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    const nextQ = currentQuestion + 1;
    if (nextQ < product.questions.length) {
      setCurrentQuestion(nextQ);
      setSelectedOption(null);
    } else {
      setQuizFinished(true);
    }
  };

  const formatAudioTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, "0");
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${minutes}:${pad(seconds)}`;
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "books": return "Книга / Учебник";
      case "lectures": return "Курс лекций";
      case "presentations": return "Презентация";
      case "manuals": return "Методическое пособие";
      case "theses": return "Дипломная работа";
      case "dissertations": return "Диссертация";
      case "articles": return "Научная статья";
      case "journals": return "Научный журнал";
      case "archive": return "Архив выпусков";
      case "tests": return "Интерактивный тест";
      case "instructions": return "Инструкция";
      case "regulations": return "Регламент";
      case "templates": return "Шаблон документа";
      case "training": return "Обучающие материалы";
      case "fiction": return "Художественная литература";
      case "audiobooks": return "Аудиокнига";
      case "ebooks": return "Электронная книга";
      case "periodicals": return "Периодическое издание";
      case "quizzes": return "Литературная викторина";
      case "medicine": return "Тематический сборник: Медицина";
      case "law": return "Тематический сборник: Право";
      case "history": return "Тематический сборник: История";
      case "programming": return "Тематический сборник: Программирование";
      case "architecture": return "Тематический сборник: Архитектура";
      case "art": return "Тематический сборник: Искусство";
      default: return cat;
    }
  };

  const mockReviews = [
    {
      author: "Иван С.",
      rating: 5,
      date: "04.06.2026",
      comment: "Отличный материал! Все разложено по полочкам, очень помогло при подготовке к экзамену."
    },
    {
      author: "Мария К.",
      rating: 4,
      date: "18.06.2026",
      comment: "Хорошая структура. Хотелось бы больше практических примеров в коде, но в целом супер."
    }
  ];

  return (
    <div className="product-details-page container page-transition">
      <Link to="/catalog" className="back-link">
        <ArrowLeft size={16} /> Назад к списку
      </Link>

      <div className="product-grid-layout">
        {/* Visual Showcase */}
        <div className="product-gallery glass">
          <img src={product.image} alt={product.name} className="main-display-image" style={getProductImageStyle(product.id)} />
        </div>

        {/* Product Details Section */}
        <div className="product-info-panel">
          <span className="badge-category">{getCategoryLabel(product.category)}</span>
          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                  className="star-icon"
                />
              ))}
            </div>
            <span className="rating-value">{product.rating.toFixed(1)}</span>
            <span className="reviews-count">(2 отзыва)</span>
          </div>

          <div className="price-row">
            <span className="detail-price" style={{ fontSize: '1.25rem', letterSpacing: 'normal' }}>
              {product.category === "tests" || product.category === "quizzes" ? `Время: ${product.duration}` : 
               product.category === "audiobooks" ? `Длительность: ${product.duration}` :
               `Формат: ${product.format} (${product.size})`}
            </span>
            <span className="stock-status in-stock">
              {product.category === "tests" || product.category === "quizzes" ? "Доступно онлайн" : 
               product.category === "audiobooks" ? "Онлайн-прослушивание" :
               `В наличии (${product.pages || product.slides || 100} стр.)`}
            </span>
          </div>

          <p className="detail-description">{product.description}</p>

          {/* Conditional Action Buttons: Tests vs Audiobooks vs Documents */}
          <div className="actions-section" style={{ flexDirection: 'column', gap: '16px' }}>
            {product.category === "tests" || product.category === "quizzes" ? (
              <button className="btn-primary add-to-cart-big" onClick={startQuiz}>
                <HelpCircle size={20} />
                <span>{quizFinished ? "Пройти тест заново" : "Начать тестирование"}</span>
              </button>
            ) : (
              <>
                <button
                  className="btn-primary add-to-cart-big"
                  onClick={handleAddToCart}
                  disabled={isSaved}
                >
                  <ShoppingCart size={20} fill={isSaved ? "currentColor" : "none"} />
                  <span>{isSaved ? "В корзине" : "В корзину"}</span>
                </button>
                {product.category !== "audiobooks" && (
                  <button 
                    className="btn-primary add-to-cart-big"
                    onClick={() => { setReaderOpen(true); setReaderPage(1); }}
                    style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  >
                    <BookOpen size={20} />
                    <span>Читать онлайн</span>
                  </button>
                )}
              </>
            )}

            {/* Audio Player for audiobooks */}
            {product.category === "audiobooks" && (
              <div className="audiobook-player-card glass" style={{ marginTop: '10px' }}>
                <div className="player-meta">
                  <span className="player-title">Аудиоплеер Lumina</span>
                  <span className="player-author">{product.author}</span>
                </div>
                <div className="player-controls">
                  <button className="player-btn-skip" onClick={() => setAudioTime(Math.max(0, audioTime - 15))} title="Назад на 15 секунд">
                    <RotateCcw size={16} />
                  </button>
                  <button className={`player-btn-play ${audioPlaying ? 'playing' : ''}`} onClick={() => setAudioPlaying(!audioPlaying)}>
                    {audioPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                  </button>
                  <button className="player-btn-skip" onClick={() => setAudioTime(audioTime + 15)} title="Вперед на 15 секунд">
                    <RotateCw size={16} />
                  </button>
                </div>
                <div className="player-progress-area">
                  <span className="time-display">{formatAudioTime(audioTime)}</span>
                  <div className="player-progress-track">
                    <div className="player-progress-fill" style={{ width: `${audioProgress}%` }}></div>
                  </div>
                  <span className="time-display">{product.duration}</span>
                </div>
              </div>
            )}
          </div>

          {/* Trust badges adapted for Library */}
          <div className="trust-badges-grid">
            <div className="trust-badge">
              <CheckCircle size={18} />
              <span>Лицензионный контент</span>
            </div>
            <div className="trust-badge">
              <Award size={18} />
              <span>Рецензировано</span>
            </div>
            <div className="trust-badge">
              <FileDown size={18} />
              <span>Быстрая загрузка</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ INTERACTIVE RUNNER */}
      {quizStarted && (
        <div className="quiz-runner-section glass" style={{ marginTop: '40px', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
          {!quizFinished ? (
            <div className="quiz-active">
              <div className="quiz-progress-bar">
                <span className="quiz-progress-label">
                  Вопрос <strong>{currentQuestion + 1}</strong> из <strong>{product.questions.length}</strong>
                </span>
                <div className="quiz-progress-track">
                  <div 
                    className="quiz-progress-fill" 
                    style={{ width: `${((currentQuestion) / product.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="quiz-question-title">{product.questions[currentQuestion].question}</h3>

              <div className="quiz-options-list">
                {product.questions[currentQuestion].options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`quiz-option-btn glass ${selectedOption === idx ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(idx)}
                  >
                    <span className="option-indicator">{String.fromCharCode(65 + idx)}</span>
                    <span className="option-text">{option}</span>
                  </button>
                ))}
              </div>

              <button
                className="btn-primary quiz-next-btn"
                disabled={selectedOption === null}
                onClick={nextQuestion}
              >
                <span>{currentQuestion === product.questions.length - 1 ? "Завершить тест" : "Далее"}</span>
              </button>
            </div>
          ) : (
            <div className="quiz-results-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <Award size={64} style={{ color: 'var(--accent-primary)', filter: 'drop-shadow(0 0 15px var(--accent-glow))' }} />
              <h2 className="quiz-finished-title">Тестирование завершено!</h2>
              <p className="quiz-finished-desc">Вы ответили на все вопросы теста: <strong>{product.name}</strong>.</p>
              
              <div className="quiz-score-circle glass">
                <span className="score-num">{score} / {product.questions.length}</span>
                <span className="score-pct">{Math.round((score / product.questions.length) * 100)}%</span>
              </div>

              <p className="score-grade-text">
                {score / product.questions.length >= 0.75 
                  ? "🎉 Отличный результат! Вы успешно сдали этот тест." 
                  : "💡 Нужно еще немного подучить материал. Попробуйте еще раз!"}
              </p>

              {!user && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  🔑 <em>Зайдите в систему, чтобы сохранить этот результат в постоянную историю оценок.</em>
                </p>
              )}

              <div className="quiz-actions-row" style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                <button className="btn-primary" onClick={startQuiz}>
                  <RefreshCw size={16} /> Пройти заново
                </button>
                <Link to="/profile" className="btn-secondary">
                  В личный кабинет
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs description / reviews */}
      <div className="tabs-container glass">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Сведения о материале
          </button>
          <button
            className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Отзывы ({reviews.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" ? (
            <div className="specs-content">
              <ul className="specs-list">
                <li className="spec-item">
                  <span className="spec-dot"></span>
                  <span>Автор/Составитель: <strong>{product.author}</strong></span>
                </li>
                <li className="spec-item">
                  <span className="spec-dot"></span>
                  <span>Категория: <strong>{getCategoryLabel(product.category)}</strong></span>
                </li>
                {product.specs &&
                  product.specs.map((spec, i) => (
                    <li key={i} className="spec-item">
                      <span className="spec-dot"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
              </ul>
            </div>
          ) : (
            <div className="reviews-content" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* Reviews List */}
              <div className="reviews-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.length === 0 ? (
                  <p className="no-reviews-note" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Отзывов пока нет. Будьте первым, кто оставит свой отзыв!</p>
                ) : (
                  reviews.map((rev, i) => (
                    <div key={i} className="review-card glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)' }}>
                      <div className="review-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="reviewer-name" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{rev.author}</span>
                        <span className="review-date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      </div>
                      <div className="review-rating" style={{ color: '#ffb800', display: 'flex', gap: '2px', marginBottom: '12px' }}>
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            size={14}
                            fill={starIndex < rev.rating ? "currentColor" : "none"}
                            className="star-icon"
                          />
                        ))}
                      </div>
                      <p className="reviewer-text" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Review Form */}
              <div className="add-review-section glass" style={{ padding: '30px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-card)', marginTop: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-accent)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Оставить отзыв</h3>
                
                <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Rating Selector */}
                  <div className="form-rating-selector" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ваша оценка:</span>
                    <div className="rating-stars-input" style={{ display: 'flex', gap: '6px', color: '#ffb800' }}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          onMouseEnter={() => setReviewHoverRating(num)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#ffb800' }}
                          title={`Оценка ${num}`}
                        >
                          <Star
                            size={24}
                            fill={(reviewHoverRating || reviewRating) >= num ? "currentColor" : "none"}
                            stroke="currentColor"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Author Name */}
                  <div className="form-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="reviewAuthor" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Ваше имя:</label>
                    <input
                      type="text"
                      id="reviewAuthor"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder={user ? user.displayName : "Аноним"}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  {/* Comment Textarea */}
                  <div className="form-input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="reviewComment" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Комментарий:</label>
                    <textarea
                      id="reviewComment"
                      rows="4"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Напишите, что вы думаете об этом материале..."
                      required
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    ></textarea>
                  </div>

                  {reviewError && (
                    <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{reviewError}</p>
                  )}

                  {reviewSuccess && (
                    <p style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Отзыв успешно добавлен! Спасибо за ваше мнение.</p>
                  )}

                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      width: 'fit-content',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                    }}
                  >
                    <Send size={16} />
                    <span>Отправить отзыв</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Online Reader Overlay */}
      {readerOpen && product && (
        <div className="reader-overlay" onClick={() => setReaderOpen(false)}>
          <div className="reader-container" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="reader-header">
              <div className="reader-title-info">
                <h3>{product.name}</h3>
                <p>{product.author || "Цифровая библиотека Lumina"}</p>
              </div>
              
              {/* Toolbar */}
              <div className="reader-controls">
                {/* Theme Selector */}
                <div className="control-group">
                  <button 
                    className={`reader-btn ${readerTheme === "light" ? "active" : ""}`} 
                    onClick={() => setReaderTheme("light")}
                    title="Светлая тема"
                  >
                    <Sun size={16} />
                  </button>
                  <button 
                    className={`reader-btn ${readerTheme === "sepia" ? "active" : ""}`} 
                    onClick={() => setReaderTheme("sepia")}
                    title="Сепия (для чтения)"
                  >
                    <Palette size={16} />
                  </button>
                  <button 
                    className={`reader-btn ${readerTheme === "dark" ? "active" : ""}`} 
                    onClick={() => setReaderTheme("dark")}
                    title="Темная тема"
                  >
                    <Moon size={16} />
                  </button>
                </div>

                {/* Zoom */}
                <div className="control-group">
                  <button className="reader-btn" onClick={() => setReaderZoom(Math.max(50, readerZoom - 10))} title="Отдалить">
                    <ZoomOut size={16} />
                  </button>
                  <span className="zoom-value">{readerZoom}%</span>
                  <button className="reader-btn" onClick={() => setReaderZoom(Math.min(150, readerZoom + 10))} title="Приблизить">
                    <ZoomIn size={16} />
                  </button>
                </div>
                
                {/* Close */}
                <button className="close-reader-btn" onClick={() => setReaderOpen(false)} title="Закрыть читалку">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {/* Workspace */}
            <div className="reader-body">
              {/* Sidebar with chapters */}
              <div className="reader-sidebar">
                <span className="sidebar-title">Оглавление</span>
                <ul className="toc-list">
                  {getBookPages(product).map((page, idx) => (
                    <li key={idx}>
                      <button 
                        className={`toc-item-btn ${readerPage === idx + 1 ? "active" : ""}`}
                        onClick={() => setReaderPage(idx + 1)}
                      >
                        {idx + 1}. {page.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Main reading pane */}
              <div className={`reader-workspace reader-theme-${readerTheme}`}>
                <div className="paper-sheet" style={{ transform: `scale(${readerZoom / 100})`, transformOrigin: 'center center' }}>
                  <div className="sheet-header">
                    <span>Lumina Digital Library</span>
                    <span>{product.name}</span>
                  </div>
                  
                  <div className="sheet-content">
                    {getBookPages(product)[readerPage - 1]?.content}
                  </div>
                  
                  <div className="sheet-footer">
                    <span>{product.author || "Lumina"}</span>
                    <span>Страница {readerPage} из {getBookPages(product).length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="reader-footer">
              <div className="page-turner">
                <button 
                  className="reader-btn" 
                  disabled={readerPage === 1}
                  onClick={() => setReaderPage(readerPage - 1)}
                  style={{ width: '80px' }}
                >
                  Назад
                </button>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Стр. {readerPage} / {getBookPages(product).length}
                </span>
                <button 
                  className="reader-btn" 
                  disabled={readerPage === getBookPages(product).length}
                  onClick={() => setReaderPage(readerPage + 1)}
                  style={{ width: '80px' }}
                >
                  Вперед
                </button>
              </div>
              
              {/* Reading Progress */}
              <div className="progress-track">
                <div 
                  className="progress-fill-line" 
                  style={{ width: `${(readerPage / getBookPages(product).length) * 100}%` }}
                ></div>
              </div>
              
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Прогресс: {Math.round((readerPage / getBookPages(product).length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
