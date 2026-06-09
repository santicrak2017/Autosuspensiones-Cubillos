import React, { useState } from 'react';
import HomeLayout from './components/templates/HomeLayout';
import GridOpciones from './components/organisms/GridOpciones';
import SearchBarPlaca from './components/molecules/SearchBarPlaca';
import CardHistorial from './components/organisms/CardHistorial';
import ListaHerramientas from './components/organisms/ListaHerramientas';

export default function App() {
  // 1. ESTADOS DE NAVEGACIÓN Y PLACAS
  const [activeTab, setActiveTab] = useState('inicio');
  const [filtroPlaca, setFiltroPlaca] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  // 2. ESTADO DE HERRAMIENTAS
  const [herramientas, setHerramientas] = useState([
    { id: 1, nombre: 'Pistola de impacto neumática', estado: 'Disponible', mecanico: '' },
    { id: 2, nombre: 'Prensa para bujes de tijera', estado: 'Prestado', mecanico: 'Carlos' },
    { id: 3, nombre: 'Extractor de terminales de dirección', estado: 'Disponible', mecanico: '' },
    { id: 4, nombre: 'Torquímetro de 1/2 pulgada', estado: 'Disponible', mecanico: '' },
  ]);

  // 3. DATOS DE PRUEBA SIMULADOS PARA TAXIS
  const baseDatosTaxis = [
    { 
      placa: 'TXA-123', conductor: 'Jorge Cárdenas', modelo: 'Hyundai Atos 2012',
      reparaciones: [
        { fecha: '14/05/2026', mecanico: 'Carlos', detalle: 'Cambio de amortiguadores delanteros', repuestos: '2 Amortiguadores Gabriel' }
      ]
    }
  ];
  const listaPlacas = baseDatosTaxis.map(t => t.placa);

  // 4. LÓGICA DE INTERACCIÓN
  const manejarSeleccionPlaca = (placa) => {
    setFiltroPlaca(placa);
    const datos = baseDatosTaxis.find(t => t.placa === placa);
    setVehiculoSeleccionado(datos || null);
  };

  const manejarAccionHerramienta = (id) => {
    setHerramientas(herramientas.map(h => {
      if (h.id === id) {
        if (h.estado === 'Disponible') {
          const nombreMecanico = prompt("Ingrese el nombre del mecánico que solicita la herramienta:");
          if (!nombreMecanico) return h; 
          return { ...h, estado: 'Prestado', mecanico: nombreMecanico };
        } else {
          return { ...h, estado: 'Disponible', mecanico: '' };
        }
      }
      return h;
    }));
  };

  // 5. RENDERIZADO CONDICIONAL DE PANTALLAS
  const renderContenido = () => {
    switch (activeTab) {
      case 'inicio':
        return <GridOpciones onSeleccionar={(id) => setActiveTab(id)} />;
      case 'historico':
        return (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px', color: '#1d1d1f', textAlign: 'left' }}>Histórico de Placas</h2>
            <SearchBarPlaca 
              filtro={filtroPlaca} 
              setFiltro={(valor) => {
                setFiltroPlaca(valor);
                if(!valor) setVehiculoSeleccionado(null);
                const exacto = baseDatosTaxis.find(t => t.placa === valor);
                if(exacto) setVehiculoSeleccionado(exacto);
              }}
              placasExistentes={listaPlacas}
              onSeleccionarPlaca={manejarSeleccionPlaca}
            />
            <CardHistorial vehiculo={vehiculoSeleccionado} />
          </div>
        );
      case 'herramientas':
        return (
          <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '6px', color: '#1d1d1f', textAlign: 'left' }}>Control de Herramientas</h2>
            <p style={{ fontSize: '14px', color: '#86868b', margin: '0 0 20px 0', textAlign: 'left' }}>
              Registre la salida y devolución de equipos del taller para evitar pérdidas.
            </p>
            <ListaHerramientas 
              herramientas={herramientas} 
              onAccionHerramienta={manejarAccionHerramienta} 
            />
          </div>
        );
      case 'administrador':
        return <div><h3>Módulo Administrador</h3><p>Controles de acceso del taller.</p></div>;
      case 'repuestos':
        return <div><h3>Stock de Repuestos</h3><p>Gestión de inventario crítico.</p></div>;
      case 'contabilidad':
        return <div><h3>Contabilidad</h3><p>Panel financiero y cuentas rápidas.</p></div>;
      default:
        return <GridOpciones onSeleccionar={(id) => setActiveTab(id)} />;
    }
  };

  return (
    <HomeLayout 
      mostrarBotonVolver={activeTab !== 'inicio'} 
      onVolver={() => {
        setActiveTab('inicio');
        setFiltroPlaca('');
        setVehiculoSeleccionado(null);
      }}
    >
      {renderContenido()}
    </HomeLayout>
  );
}
