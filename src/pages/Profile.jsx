import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut, Package, Calendar, CheckCircle, Award, Download, FileText } from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const { user, logout, isMock, updateUser } = useAuth();
  const [downloads, setDownloads] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
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
  }, []);

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
