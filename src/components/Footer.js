import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaStackOverflow,
  FaReddit,
} from "react-icons/fa";

// TODO: completar los enlaces que están vacíos; los que no tengan URL no se muestran
const REDES = [
  { nombre: "GitHub", icono: FaGithub, url: "https://github.com/AlbeiroBurbanoTobar" },
  { nombre: "LinkedIn", icono: FaLinkedin, url: "" },
  { nombre: "Correo", icono: FaEnvelope, url: "mailto:albeirojbt@gmail.com" },
  { nombre: "Stack Overflow", icono: FaStackOverflow, url: "" },
  { nombre: "Reddit", icono: FaReddit, url: "" },
];

/**
 * Pie de página con el autor y sus redes.
 */
const Footer = () => (
  <footer className="footer">
    <h2>Desarrollado por:</h2>
    <p className="footer-autor">Albeiro J. Burbano Tobar</p>
    <p className="footer-redes-titulo">Encuéntrame en:</p>
    <div className="footer-redes">
      {REDES.filter((red) => red.url).map(({ nombre, icono: Icono, url }) => (
        <a
          key={nombre}
          href={url}
          {...(url.startsWith("http") && {
            target: "_blank",
            rel: "noopener noreferrer",
          })}
          aria-label={nombre}
          title={nombre}
        >
          <Icono aria-hidden="true" />
        </a>
      ))}
    </div>
  </footer>
);

export default Footer;
