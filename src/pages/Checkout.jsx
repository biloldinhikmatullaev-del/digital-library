import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { CheckCircle, ArrowRight, ShieldCheck, Download, Mail, ShoppingCart } from "lucide-react";
import "./Checkout.css";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: user ? user.email : "",
    fullName: user ? user.displayName : "",
    institution: "",
    role: "student",
    department: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const isCartEmpty = cartItems.length === 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCartEmpty) return;

    setLoading(true);
    setError("");

    try {
      // Simulate backend generation of bundle download link
      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            format: item.format
          })),
          customer: {
            email: formData.email,
            name: formData.fullName,
            institution: formData.institution,
            role: formData.role
          },
          total: cartItems.length // Total items count
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setOrderResult(data);
        
        // Save to mock profile downloads history
        const mockDownloads = JSON.parse(localStorage.getItem("lumina_mock_downloads") || "[]");
        mockDownloads.unshift({
          bundleId: data.orderId,
          date: new Date().toLocaleDateString("ru-RU", { year: "numeric", month: "short", day: "numeric" }),
          itemsCount: cartItems.length,
          itemsList: cartItems.map(item => item.name).join(", "),
          status: "Готово к загрузке"
        });
        localStorage.setItem("lumina_mock_downloads", JSON.stringify(mockDownloads));

        clearCart();
      } else {
        throw new Error(data.error || "Ошибка при генерации ссылок.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Не удалось отправить запрос. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) {
    return (
      <div className="checkout-page container success-view">
        <div className="success-card glass">
          <CheckCircle size={64} className="success-icon" />
          <h2 className="quiz-finished-title" style={{ fontSize: '2.2rem', marginBottom: '10px' }}>Доступ получен!</h2>
          <p className="success-subtitle">Материалы подготовлены к скачиванию.</p>
          
          <div className="order-receipt glass" style={{ width: '100%' }}>
            <div className="receipt-row">
              <span>Номер пакета:</span>
              <strong className="receipt-value">{orderResult.orderId}</strong>
            </div>
            <div className="receipt-row">
              <span>Всего материалов:</span>
              <strong>{orderResult.total} шт.</strong>
            </div>
            <div className="receipt-row">
              <span>Отправлено на email:</span>
              <span>{formData.email}</span>
            </div>
          </div>
          
          <p className="success-notice">
            Мы продублировали ссылки на указанный почтовый ящик. Вы можете скачать файлы прямо сейчас.
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button onClick={() => alert("Скачивание архива ZIP началось...")} className="btn-primary success-btn">
              <Download size={18} /> Скачать ZIP-архив
            </button>
            <Link to="/catalog" className="btn-secondary success-btn" style={{ padding: '16px 28px' }}>
              В каталог
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container page-transition">
      <div className="ambient-glow" style={{ top: "0", right: "20%" }}></div>

      <div className="checkout-header">
        <h1 className="checkout-title">Получение материалов</h1>
        <p className="checkout-subtitle">Подтвердите ваши данные для мгновенного доступа к скачиванию.</p>
      </div>

      {isCartEmpty ? (
        <div className="checkout-empty glass">
          <ShoppingCart size={48} className="empty-icon" />
          <h3>Ваша корзина пуста</h3>
          <p>Добавьте книги, лекции или методички в каталоге, чтобы скачать их.</p>
          <Link to="/catalog" className="btn-primary">
            Перейти к каталогу
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* Checkout Form */}
          <form className="checkout-form glass" onSubmit={handleSubmit}>
            {error && <div className="checkout-error">{error}</div>}

            {/* Step 1: User Info */}
            <div className="form-section">
              <h3 className="form-section-title">1. Личные данные</h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="email">Email для отправки материалов</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input-field"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="form-group span-2">
                  <label htmlFor="fullName">ФИО полностью</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="input-field"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Иванов Иван Иванович"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Educational Institution Details */}
            <div className="form-section">
              <h3 className="form-section-title">2. Место учебы / работы</h3>
              <div className="form-grid">
                <div className="form-group span-2">
                  <label htmlFor="institution">Учебное заведение (ВУЗ / Школа)</label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    className="input-field"
                    required
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="МГУ им. Ломоносова"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Ваша роль</label>
                  <select
                    id="role"
                    name="role"
                    className="input-field"
                    value={formData.role}
                    onChange={handleInputChange}
                    style={{ background: 'var(--bg-dark)' }}
                  >
                    <option value="student">Студент / Аспирант</option>
                    <option value="teacher">Преподаватель</option>
                    <option value="researcher">Научный сотрудник</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="department">Группа / Кафедра</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    className="input-field"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Группа 301 / Кафедра ИТ"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Terms Summary instead of credit card */}
            <div className="form-section">
              <h3 className="form-section-title">3. Условия использования</h3>
              <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                <p>✓ Все скачиваемые материалы предназначены исключительно для образовательных и некоммерческих целей.</p>
                <p style={{ marginTop: '8px' }}>✓ Доступ предоставляется бесплатно в рамках цифровой библиотеки.</p>
                <p style={{ marginTop: '8px' }}>✓ После отправки вы мгновенно получите прямые ссылки для скачивания.</p>
              </div>
            </div>

            {/* Submit */}
            <div className="form-submit-row">
              <div className="secure-badge">
                <ShieldCheck size={16} />
                <span>Безопасное HTTPS соединение</span>
              </div>
              <button type="submit" className="btn-primary place-order-btn" disabled={loading}>
                {loading ? "Формирование пакета..." : `Получить доступ (${cartItems.length} файл.)`}
              </button>
            </div>
          </form>

          {/* Order Summary sidebar */}
          <aside className="checkout-summary-sidebar glass">
            <h3 className="sidebar-title">Выбранные файлы</h3>

            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div className="checkout-item-row" key={item.id}>
                  <div className="checkout-item-thumbnail">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="checkout-item-info">
                    <h4>{item.name}</h4>
                    <p className="checkout-item-price" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {item.category === "tests" ? "Интерактивно" : `${item.format} • ${item.size}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="cost-totals-block">
              <div className="totals-row">
                <span>Материалов:</span>
                <span>{cartItems.length} шт.</span>
              </div>
              <div className="totals-row grand-total-row">
                <span>Стоимость:</span>
                <span>Бесплатно</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
