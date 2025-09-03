// src/components/Dashboard/Footer/Footer.jsx
import { useState, useEffect } from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

    const phrases = [
      "Sin lucha no hay progreso (Frederick Douglas).",
      "Inténtalo y fracasa, pero no fracases en intentarlo (Stephen Kaggwa).",
      "El trabajo duro vence al talento cuando el talento no trabaja duro (Tim Notke).",
      "Las cosas difíciles requieren un largo tiempo, las cosas imposibles un poco más (André A. Jackson).",
      "La única forma de hacer un gran trabajo es amar lo que haces (Steve Jobs).",
      "Una persona exitosa es aquella que es capaz de asentar una base con los ladrillos que otros le han tirado (David Brinkley).",
      "El éxito no es la clave de la felicidad. La felicidad es la clave del éxito. Si amas lo que haces, tendrás éxito (Albert Schweitzer).",
      "La perseverancia es la clave del éxito (Charles Chaplin).",
      "La única lucha que se pierde es la que se abandona (Che Guevara).",
      "No estoy desanimado porque cada intento equivocado descartado es un paso adelante (Thomas Edison).",
      "La perseverancia es el trabajo duro que haces después de cansarte del trabajo duro que ya hiciste (Newt Gingrich).",
      "La perseverancia es la base de todas las acciones (Lao Tzu).",
      "Las grandes obras no son llevadas a cabo por la fuerza, sino por la perseverancia (Samuel Johnson).",
      "No importa lo lento que vayas mientras no pares (Andy Warhol).",
      "La perseverancia es fallar 19 veces y triunfar la vigésima (Julie Andrews).",
      "Confía en el tiempo, que suele dar dulces salidas a muchas amargas dificultades. (Miguel de Cervantes).",
      "La perseverancia es imposible si no nos permitimos tener esperanza (Dean Koontz).",
      "Siempre parece imposible hasta que se hace (Nelson Mandela)",
      "La perseverancia no es una carrera larga, son muchas carreras cortas una tras otra (Walter Elliot).",
      "El genio se compone del 2% de talento y del 98% de perseverancia (Beethoven).",
      "El éxito es la suma de pequeños esfuerzos repetidos día tras día (Robert Collier).",
      "La motivación es lo que te pone en marcha. El hábito es lo que hace que sigas (Jim Ryun).",
      "Paso a paso. No concibo ninguna otra manera de lograr las cosas (Michael Jordan).",
    ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 1500);
    }, 4000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <footer className={styles.footer}>
      <div
        className={`${styles.motivationalPhrase} ${
          isVisible ? styles.show : ""
        }`}
      >
        {phrases[currentPhrase]}
      </div>
      <p>&copy; 2025 Persenaut. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
