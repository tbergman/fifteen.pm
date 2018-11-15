import React, {Component} from 'react';
import pure from 'recompose/pure';

const anchoFaja = 2; //ANCHO EN PIXELES DE CADA FAJA EN EL CLIP
const anchoOnda = 25; //VALOR DISTANCIA (DEMORA) EN SENOIDE

class Logo extends Component {
  static defaultProps = {
    fillColor: window.location.pathname === '/3' ? 'red' : '#ffffff',
  }

  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location = "/"
  }
  componentDidMount() {
    this.ondea();
  }

  shouldComponentUpdate() {
    return false;
  }

    ondea() {
        /* REFIERE AL TÍTULO */
        var titulo = document.querySelector("h1");
        /* CAPTURA EL CONTENIDO DEL TÍTULO */
        var texto = titulo.innerHTML;
        /* MIDE EL TAMAÑO DEL TÍTULO */
        var ancho = titulo.offsetWidth;
        var alto = titulo.offsetHeight;

        /*SIEMPRE AJUSTA EL ancho COMO MÚLTIPLO DE anchoFaja EN PIXELES*/
        ancho = ancho+(anchoFaja-ancho%anchoFaja);
        /* FIJA EL TAMAÑO DEL TÍTULO */
        titulo.style.width = ancho+"px";
        titulo.style.height = alto+"px";

        /* LA CANTIDAD DE BANDAS ES EL ANCHO DE TÍTULO SOBRE ANCHO DE CLIP */
        var totalFajas = ancho/2;

        /* VACÍA EL TÍTULO CONTENEDOR DE TEXTO */
        titulo.innerHTML = "";

        /* CREA LAS BANDAS Y LES DA FORMATO */
        for(let i=0; i<totalFajas; i++) {
            /* UN DIV PARA CADA FAJA */
            let faja = document.createElement("div");
            /* LE ASIGNA LA MISMA ALTURA DEL TÍTULO */
            faja.style.height = alto+"px";
            /* PONE EL MISMO TEXTO ORIGINAL */
            faja.innerHTML = texto;
            /* DEJA VISIBLE UN CLIP DE 2px DE ANCHO, CADA UNO 2px A LA IZQUIERDA DEL ANTERIOR PARA QUE PAREZCA UNA IMAGEN DE TÍTULO COMPLETA SIN CORTES */
            faja.style.clip = "rect(0, "+((i+1)*anchoFaja)+"px, "+alto+"px, "+(i*anchoFaja)+"px)";
            /* RETRASA LA ANIMACIÓN CSS DE CADA FAJA SIGUIENDO UNA ONDA DE TIEMPO SENOIDE */
            faja.style.animationDelay = (Math.cos(i)+i*anchoOnda)+"ms";
            /* AGREGA LA CAPA AL CONTENEDOR */
            titulo.appendChild(faja);
        }
    }

  render() {
      return <div className="wavy-logo"><h1>globally.ltd</h1></div>
  }
  //   render() {
  //   const {fillColor} = this.props;
  //   return (
  //     <div className="logo-wrapper"
  //          onClick={this.onClick}>
  //       <div id="logo-light"/>
  //       <svg width="75" height="75" viewBox="-1.2 -1.2 2.2 2.2">
  //        <g fill="none" stroke={fillColor} strokeWidth="0.01">
  //           <circle r="1"/>
  //           <g id="grid">
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-1.0s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-1.5s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-2.0s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-2.5s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-3.0s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-3.5s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-4.0s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-4.5s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //             <path d="M0 1A1 1 0 0 1 0-1">
  //               <animateTransform attributeName="transform" type="scale" begin="-5.0s" dur="6s" values="1 1; -1 1"
  //                                 repeatCount="indefinite" calcMode="spline" keySplines="0.64 0 0.36 1"/>
  //             </path>
  //           </g>
  //           <use href="#grid" transform="rotate(-65)"/>
  //         </g>
  //       </svg>
  //     </div>
  //   );
  // }
}

export default pure(Logo);
