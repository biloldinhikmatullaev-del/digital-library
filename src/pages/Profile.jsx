import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Package, Calendar, CheckCircle, Award, Download, FileText, Trophy, Lock } from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const { user, logout, isMock, updateUser } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setNewName(user.displayName || "");
    }
  }, [user]);

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUser({ displayName: newName.trim() });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    // Load download history from localStorage
    const savedDownloads = localStorage.getItem("lumina_mock_downloads");
    if (savedDownloads) {
      try {
        setDownloads(JSON.parse(savedDownloads));
      } catch (e) {
        console.error("Error loading downloads history", e);
      }
    }

    // Load quiz results from localStorage
    const savedQuizzes = localStorage.getItem("lumina_mock_quizzes");
    if (savedQuizzes) {
      try {
        setQuizResults(JSON.parse(savedQuizzes));
      } catch (e) {
        console.error("Error loading quiz results", e);
      }
    }

    // Load reservations
    const savedRes = localStorage.getItem("lumina_user_reservations");
    if (savedRes) {
      try {
        setReservations(JSON.parse(savedRes));
      } catch (e) {
        console.error("Error loading reservations", e);
      }
    }
  }, []);

  const handleCancelReservation = (productId) => {
    const updated = reservations.filter(res => res.id !== productId);
    setReservations(updated);
    localStorage.setItem("lumina_user_reservations", JSON.stringify(updated));

    // Restore stock in localStorage products list
    const localData = localStorage.getItem("lumina_custom_products");
    if (localData) {
      const parsed = JSON.parse(localData);
      const updatedProducts = parsed.map(p => {
        if (p.id === productId) {
          return { ...p, stock: (p.stock || 100) + 1 };
        }
        return p;
      });
      localStorage.setItem("lumina_custom_products", JSON.stringify(updatedProducts));
    }
    alert("Бронирование успешно отменено!");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  if (!user) {
    return (
      <div className="profile-page container guest-view glass">
        <User size={48} className="guest-icon" />
        <h2>Доступ ограничен</h2>
        <p>Пожалуйста, войдите в систему для просмотра вашего профиля и истории загрузок.</p>
        <Link to="/auth" className="btn-primary">
          Войти в аккаунт
        </Link>
      </div>
    );
  }

  return (
    <div className="profile-page container page-transition">
      <div className="ambient-glow" style={{ bottom: "-10%", left: "10%" }}></div>

      <div className="profile-grid">
        {/* User Card */}
        <aside className="profile-sidebar glass">
          <div className="avatar-large" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            {user.displayName ? user.displayName[0].toUpperCase() : "U"}
          </div>
          
          {isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '10px' }}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  fontFamily: 'inherit'
                }}
                maxLength={20}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={handleSaveName}
                  className="btn-primary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }}
                >
                  Сохранить
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setNewName(user.displayName || ""); }}
                  className="btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="profile-name">{user.displayName || "Пользователь"}</h2>
              <button 
                onClick={() => setIsEditing(true)} 
                className="btn-secondary" 
                style={{ padding: '4px 10px', fontSize: '0.75rem', marginTop: '-5px', marginBottom: '10px' }}
              >
                Редактировать имя
              </button>
            </>
          )}

          <p className="profile-email" style={{ marginTop: '5px' }}>{user.email}</p>
          
          <div className="profile-badge-row">
            <span className="badge-category">
              {isMock ? "Демо-режим" : "Firebase аккаунт"}
            </span>
          </div>

          <button className="btn-secondary logout-profile-btn" onClick={handleLogout}>
            <LogOut size={16} /> Выйти из аккаунта
          </button>
        </aside>

        {/* Dashboard Main Area */}
        <main className="profile-main" style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: 0, background: 'transparent', border: 'none' }}>
          
          {/* Reader Statistics Cards */}
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div className="stat-card glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg-card)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', textShadow: '0 0 20px var(--accent-glow)' }}>{downloads.length}</span>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Скачано пакетов</h4>
            </div>
            <div className="stat-card glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg-card)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffb800' }}>{quizResults.length}</span>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Пройдено тестов</h4>
            </div>
            <div className="stat-card glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)', textAlign: 'center', background: 'var(--bg-card)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                {quizResults.length > 0 
                  ? Math.round(quizResults.reduce((acc, q) => acc + q.percentage, 0) / quizResults.length) + "%"
                  : "—"
                }
              </span>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Средний результат</h4>
            </div>
          </div>

          {/* Achievements & Badges Section */}
          <div className="profile-section-card glass" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="section-title-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
              <Trophy size={20} style={{ color: 'var(--accent-primary)', filter: 'drop-shadow(0 0 10px var(--accent-glow))' }} /> Достижения и значки
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {[
                {
                  id: "first_step",
                  name: "Первый шаг",
                  description: "Успешная регистрация личного кабинета читателя",
                  icon: "🔑",
                  isUnlocked: true
                },
                {
                  id: "bookworm",
                  name: "Книжный червь",
                  description: "Скачан или прочитан первый материал из базы",
                  icon: "📚",
                  isUnlocked: downloads.length >= 1
                },
                {
                  id: "scifi_lover",
                  name: "Любитель фантастики",
                  description: "Скачивание или чтение художественной/классической прозы",
                  icon: "👽",
                  isUnlocked: downloads.length > 0 && downloads.some(dl => {
                    const list = (dl.itemsList || "").toLowerCase();
                    return list.includes("мастер") || list.includes("война") || list.includes("роман") || list.includes("есенин") || list.includes("пушкин");
                  })
                },
                {
                  id: "enlightened",
                  name: "Просвещенный",
                  description: "Успешно изучено 10 книг или учебных материалов",
                  icon: "🏆",
                  isUnlocked: downloads.length >= 10
                },
                {
                  id: "quiz_master",
                  name: "Гроза викторин",
                  description: "Пройдено не менее 3 тестов или литературных викторин",
                  icon: "⚡",
                  isUnlocked: quizResults.length >= 3
                },
                {
                  id: "straight_a",
                  name: "Отличник учебы",
                  description: "Средний балл по результатам тестирований от 85% и выше",
                  icon: "🎓",
                  isUnlocked: quizResults.length > 0 && Math.round(quizResults.reduce((acc, q) => acc + q.percentage, 0) / quizResults.length) >= 85
                }
              ].map((ach) => (
                <div
                  key={ach.id}
                  className="glass"
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    background: ach.isUnlocked ? 'var(--bg-card)' : 'rgba(255,255,255,0.01)',
                    border: ach.isUnlocked ? '1px solid var(--border-color)' : '1px solid rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    opacity: ach.isUnlocked ? 1 : 0.45,
                    transition: 'all 0.3s ease',
                    boxShadow: ach.isUnlocked ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {ach.isUnlocked && (
                    <div style={{
                      position: 'absolute',
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'var(--accent-glow)',
                      filter: 'blur(30px)',
                      top: '-10px',
                      left: '-10px',
                      pointerEvents: 'none',
                      opacity: 0.8
                    }}></div>
                  )}

                  <div style={{
                    fontSize: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: ach.isUnlocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                    width: '60px',
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    flexShrink: 0,
                    border: '1px solid rgba(255,255,255,0.05)',
                    zIndex: 2
                  }}>
                    {ach.icon}
                  </div>

                  <div style={{ flex: 1, zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: ach.isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)'
                      }}>
                        {ach.name}
                      </h4>
                      {!ach.isUnlocked && (
                        <Lock size={12} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                      lineHeight: '1.4'
                    }}>
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Reservations */}
          <div className="profile-section-card glass" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="section-title-profile" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📅 Мои активные бронирования</span>
            </h3>

            {reservations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', margin: '20px 0' }}>У вас нет активных бронирований книг.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                {reservations.map((res) => (
                  <div key={res.id} className="glass" style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={res.image} alt={res.name} style={{ width: '48px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{res.name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Автор: {res.author}</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '10px', color: 'var(--text-muted)' }}>
                            {res.method}
                          </span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(255,184,0,0.1)', padding: '2px 8px', borderRadius: '10px', color: '#ffb800', fontWeight: 600 }}>
                            До {res.until}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/product/${res.id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                        Открыть
                      </Link>
                      <button
                        onClick={() => handleCancelReservation(res.id)}
                        className="btn-secondary"
                        style={{
                          padding: '8px 16px',
                          fontSize: '0.85rem',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444'
                        }}
                      >
                        Отменить бронь
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Downloads history */}
          <div className="profile-section-card glass" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="section-title-profile">
              <Download size={20} /> Загруженные пакеты материалов
            </h3>

            {downloads.length === 0 ? (
              <div className="empty-orders">
                <p>Вы пока не скачивали учебные материалы.</p>
                <Link to="/catalog" className="btn-primary">
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {downloads.map((dl, i) => (
                  <div key={i} className="order-history-card glass">
                    <div className="order-history-header">
                      <div className="order-id-block">
                        <span className="order-id-label">ПАКЕТ ДОСТУПА</span>
                        <strong className="order-id-value">{dl.bundleId}</strong>
                      </div>
                      <span className="order-status-badge">
                        <CheckCircle size={12} /> {dl.status}
                      </span>
                    </div>

                    <div className="order-meta-info" style={{ marginBottom: '12px' }}>
                      <span className="order-meta-item">
                        <Calendar size={14} /> {dl.date}
                      </span>
                      <span className="order-meta-item total-item">
                        Файлов: <strong>{dl.itemsCount} шт.</strong>
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', justifyContent: 'between', alignItems: 'center', gap: '20px' }}>
                      <div style={{ flex: 1 }}>
                        <strong>Материалы:</strong> {dl.itemsList}
                      </div>
                      <button 
                        onClick={() => alert("Повторное скачивание пакета началось...")}
                        className="btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '4px', flexShrink: 0 }}
                      >
                        <Download size={12} /> Скачать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test results history */}
          <div className="profile-section-card glass" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            <h3 className="section-title-profile">
              <Award size={20} /> Результаты тестирования
            </h3>

            {quizResults.length === 0 ? (
              <div className="empty-orders">
                <p>Вы еще не проходили интерактивные тесты.</p>
                <Link to="/catalog?category=tests" className="btn-primary">
                  Открыть список тестов
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {quizResults.map((q, i) => (
                  <div key={i} className="order-history-card glass" style={{ borderLeft: q.percentage >= 75 ? '4px solid #10b981' : '4px solid #ef4444' }}>
                    <div className="order-history-header" style={{ border: 'none', padding: 0, margin: 0 }}>
                      <div className="order-id-block">
                        <span className="order-id-label">Тестирование ({q.date})</span>
                        <strong className="order-id-value" style={{ color: 'var(--text-primary)' }}>{q.testName}</strong>
                      </div>
                      <span 
                        className="order-status-badge"
                        style={{
                          background: q.percentage >= 75 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: q.percentage >= 75 ? '#10b981' : '#ef4444',
                          borderColor: q.percentage >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        {q.status}
                      </span>
                    </div>

                    <div className="order-meta-info" style={{ marginTop: '14px', marginBottom: 0, borderTop: '1px solid var(--border-color)', paddingTop: '12px', alignItems: 'center' }}>
                      <span>Правильных ответов: <strong>{q.score}</strong></span>
                      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: q.percentage >= 75 ? '#10b981' : '#ef4444' }}>
                        {q.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
