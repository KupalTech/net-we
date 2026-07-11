import { Alert } from 'react-bootstrap';
import './TermsContent.css';

const TermsContent = () => (
  <>
    <p className="text-muted mb-3">Última actualización: julio de 2026</p>

    <Alert variant="secondary" className="small">
      Este documento es una plantilla general orientativa y no constituye asesoramiento legal.
      Antes de un lanzamiento real con datos de usuarios, recomendamos que sea revisado por un profesional,
      especialmente en lo referido a la Ley 25.326 de Protección de Datos Personales (Argentina).
    </Alert>

    <section className="terms-section">
      <h5>1. Aceptación de los Términos</h5>
      <p>
        Al registrarte y utilizar Net-we ("la Plataforma"), aceptás estos Términos y Condiciones en su
        totalidad. Si no estás de acuerdo con alguna parte, no debés utilizar la Plataforma.
      </p>
    </section>

    <section className="terms-section">
      <h5>2. Descripción del Servicio</h5>
      <p>
        Net-we es una plataforma de networking que permite a emprendedores y profesionales crear un perfil,
        descubrir a otros miembros de la comunidad, enviar solicitudes de contacto y comunicarse mediante
        un chat una vez establecido el contacto.
      </p>
    </section>

    <section className="terms-section">
      <h5>3. Registro y Cuenta de Usuario</h5>
      <p>
        Para usar la Plataforma debés registrarte con un email válido de tu propiedad y confirmarlo mediante
        el enlace de verificación que te enviamos. Sos responsable de mantener la confidencialidad de tu
        contraseña y de toda la actividad que ocurra dentro de tu cuenta. La información que proporciones
        (nombre, empresa, rol, vertical de negocio, bio) debe ser veraz.
      </p>
    </section>

    <section className="terms-section">
      <h5>4. Datos que Recopilamos</h5>
      <p>Para el funcionamiento de la Plataforma almacenamos:</p>
      <ul>
        <li>Datos de perfil: nombre, apellido, email, empresa, rol, verticales de negocio y bio.</li>
        <li>Datos de actividad: solicitudes de contacto enviadas/recibidas y su estado.</li>
        <li>Mensajes de chat entre usuarios que se hayan contactado mutuamente.</li>
      </ul>
      <p>
        Tu email nunca es visible para otros usuarios en tu perfil público. Los mensajes de chat solo son
        accesibles para vos y la otra persona involucrada en esa conversación.
      </p>
    </section>

    <section className="terms-section">
      <h5>5. Uso Aceptable</h5>
      <p>Al usar la Plataforma te comprometés a no:</p>
      <ul>
        <li>Suplantar la identidad de otra persona o registrarte con un email que no te pertenece.</li>
        <li>Enviar contenido ofensivo, spam, o material ilegal a través del chat.</li>
        <li>Intentar acceder a datos o conversaciones de otros usuarios sin autorización.</li>
        <li>Usar la Plataforma con fines comerciales no relacionados con el networking legítimo.</li>
      </ul>
    </section>

    <section className="terms-section">
      <h5>6. Contacto y Comunicación entre Usuarios</h5>
      <p>
        El chat solo se habilita entre dos usuarios cuando uno envía una solicitud de reunión y el otro la
        acepta explícitamente. Cualquiera de las partes puede dejar de responder en cualquier momento.
      </p>
    </section>

    <section className="terms-section">
      <h5>7. Propiedad Intelectual</h5>
      <p>
        El contenido que publiques (bio, mensajes) es de tu autoría y seguís siendo su propietario. Nos
        otorgás una licencia limitada para almacenarlo y mostrarlo dentro de la Plataforma con el único fin
        de brindarte el servicio.
      </p>
    </section>

    <section className="terms-section">
      <h5>8. Limitación de Responsabilidad</h5>
      <p>
        La Plataforma se ofrece "tal cual". No garantizamos disponibilidad ininterrumpida ni nos hacemos
        responsables por acuerdos, reuniones o negocios que surjan entre usuarios a partir del uso de
        Net-we.
      </p>
    </section>

    <section className="terms-section">
      <h5>9. Modificaciones</h5>
      <p>
        Podemos actualizar estos Términos en el futuro. Los cambios relevantes se comunicarán dentro de la
        Plataforma antes de entrar en vigencia.
      </p>
    </section>

    <section className="terms-section">
      <h5>10. Baja de Cuenta</h5>
      <p>
        Podés solicitar la eliminación de tu cuenta y tus datos en cualquier momento contactando al equipo
        de soporte.
      </p>
    </section>

    <section className="terms-section">
      <h5>11. Contacto</h5>
      <p>
        Ante consultas sobre estos Términos, podés contactarnos a través de los medios indicados en la
        Plataforma.
      </p>
    </section>
  </>
);

export default TermsContent;
