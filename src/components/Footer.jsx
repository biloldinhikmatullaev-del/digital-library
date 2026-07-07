import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer glass">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Lumina Lib</Link>
          <p className="footer-desc">
            Современная электронная библиотека для студентов, преподавателей и любителей чтения. Удобный доступ к учебникам, лекциям, методическим материалам, диссертациям и интерактивным викторинам.
          </p>
        </div>

        <div className="footer-links-group">
          <div className="footer-links">
            <h4 className="footer-title">Навигация</h4>
            <Link to="/">Главная</Link>
            <Link to="/catalog">Каталог книг</Link>
            <Link to="/profile">Личный кабинет</Link>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Разделы</h4>
            <Link to="/catalog?space=educational">Университетская</Link>
            <Link to="/catalog?space=corporate">База знаний</Link>
            <Link to="/catalog?space=public">Публичная</Link>
            <Link to="/catalog?space=thematic">Тематические сборники</Link>
          </div>

          <div className="footer-links">
            <h4 className="footer-title">Рассылка</h4>
            <p className="newsletter-text">Подпишитесь, чтобы получать уведомления о выходе новых учебных пособий.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Введите ваш e-mail" className="input-field" required />
              <button type="submit" className="btn-primary">OK</button>
            </form>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>&copy; {new Date().getFullYear()} Lumina Lib. Все права защищены.</p>
          <div className="bottom-links">
            <a href="#">Политика конфиденциальности</a>
            <a href="#">Пользовательское соглашение</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
