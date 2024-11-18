import React, { useState, useEffect } from 'react';

const Evento = ({ titulo, fecha, hora, eliminarEvento, icono, color }) => (
  <div className={`bg-${color}-100 border-2 border-${color}-400 rounded-lg p-4 mb-4`}>
    <h2 className="text-lg font-bold flex items-center">{icono} {titulo}</h2>
    <p>Fecha: {fecha}</p>
    <p>Hora: {hora}</p>
    <button
      onClick={eliminarEvento}
      className={`bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg`}
    >
      Eliminar Evento
    </button>
  </div>
);

const OrganizadorDeTiempo = () => {
  const [eventos, setEventos] = useState(() => {
    const eventosGuardados = localStorage.getItem('eventos');
    return eventosGuardados ? JSON.parse(eventosGuardados) : [];
  });

  const [nuevoEvento, setNuevoEvento] = useState({
    titulo: '',
    fecha: '',
    hora: '',
    icono: '',
    color: '',
  });

  const [notificacion, setNotificacion] = useState(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('eventos', JSON.stringify(eventos));
  }, [eventos]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const fechaActual = new Date();
      eventos.forEach((evento) => {
        const fechaEvento = new Date(`${evento.fecha}T${evento.hora}:00`);
        if (fechaEvento.getTime() - fechaActual.getTime() <= 60000 && fechaEvento.getTime() - fechaActual.getTime() >= 0) {
          setNotificacion(evento);
        }
      });
    }, 60000);
    return () => clearInterval(intervalId);
  }, [eventos]);

  const handleAgregarEvento = () => {
    setEventos([...eventos, nuevoEvento]);
    setNuevoEvento({ titulo: '', fecha: '', hora: '', icono: '', color: '' });
  };

  const handleEliminarEvento = (index) => {
    setEventos(eventos.filter((evento, i) => i !== index));
  };

  const eventosOrdenados = eventos.sort((a, b) => {
    if (a.fecha === b.fecha) {
      return a.hora.localeCompare(b.hora);
    } else {
      return a.fecha.localeCompare(b.fecha);
    }
  });

  const eventosDelDia = eventos.filter(evento => evento.fecha === `${fechaSeleccionada.getFullYear()}-${(fechaSeleccionada.getMonth() + 1).toString().padStart(2, '0')}-${fechaSeleccionada.getDate().toString().padStart(2, '0')}`);

  return (
    <div className="h-screen bg-gradient-to-b from-blue-500 to-blue-800 flex justify-center items-center">
      <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Organizador de Tiempo</h1>
        <div className="flex flex-wrap justify-between mb-4">
          <div className="w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0">
            <div className="mt-4">
              <h3 className="text-lg font-bold">Eventos del Día</h3>
              <div className="flex flex-col">
                {eventosDelDia.map((evento, index) => (
                  <Evento
                    key={index}
                    titulo={evento.titulo}
                    fecha={evento.fecha}
                    hora={evento.hora}
                    icono={evento.icono}
                    color={evento.color}
                    eliminarEvento={() => handleEliminarEvento(index)}
                  />
                ))}
              </div>
              <div className="flex flex-col">
                {eventosOrdenados.map((evento, index) => (
                  <Evento
                    key={index}
                    titulo={evento.titulo}
                    fecha={evento.fecha}
                    hora={evento.hora}
                    icono={evento.icono}
                    color={evento.color}
                    eliminarEvento={() => handleEliminarEvento(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold">Agregar Evento</h2>
          <div className="flex flex-wrap justify-between">
            <input
              type="text"
              value={nuevoEvento.titulo}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
              placeholder="Título del evento"
              className="w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0 p-2 border-2 border-gray-400 rounded-lg"
            />
            <input
              type="date"
              value={nuevoEvento.fecha}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
              placeholder="Fecha del evento"
              className="w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0 p-2 border-2 border-gray-400 rounded-lg"
            />
            <input
              type="time"
              value={nuevoEvento.hora}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
              placeholder="Hora del evento"
              className="w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0 p-2 border-2 border-gray-400 rounded-lg"
            />
            <select
              value={nuevoEvento.icono}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, icono: e.target.value })}
              className="w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0 p-2 border-2 border-gray-400 rounded-lg"
            >
              <option value="">Seleccione un icono</option>
              <option value="📚">📚</option>
              <option value="📝">📝</option>
              <option value="🎓">🎓</option>
            </select>
            <select
              value={nuevoEvento.color}
              onChange={(e) => setNuevoEvento({ ...nuevoEvento, color: e.target.value })}
              className="w-full md:w-1/2 xl:w-1/3 mb-4 md:mb-0 p-2 border-2 border-gray-400 rounded-lg"
            >
              <option value="">Seleccione un color</option>
              <option value="blue">🟦</option>
              <option value="green">🟩</option>
              <option value="yellow">🟨</option>
              <option value="purple">🟪</option>
            </select>
          </div>
          <button
            onClick={handleAgregarEvento}
            className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Agregar Evento
          </button>
        </div>
        {notificacion && (
          <div className={`bg-${notificacion.color}-100 border-2 border-${notificacion.color}-400 rounded-lg p-4 mb-4`}>
            <h2 className="text-lg font-bold flex items-center">{notificacion.icono} {notificacion.titulo}</h2>
            <p>Fecha: {notificacion.fecha}</p>
            <p>Hora: {notificacion.hora}</p>
            <button
              onClick={() => setNotificacion(null)}
              className={`bg-red-400 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg`}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizadorDeTiempo;