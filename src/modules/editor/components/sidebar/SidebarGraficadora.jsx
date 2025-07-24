// SidebarGraficadora.jsx
import React, { useState } from 'react';
import {
  ChevronDown, ChevronRight, Square, Circle, Star, Minus,
  MoveUp, MoveDown, Layers, Trash2, Group, Ungroup, Download, Image as ImageIcon
} from 'lucide-react';
import { IoTriangleOutline } from "react-icons/io5";
import { TfiText } from "react-icons/tfi";
import { FlutterExporter } from '../../types/FlutterExporter';
import { AngularExporter } from '../../types/AngularExporter';

// Este componente representa la barra lateral izquierda del editor
// Aquí se encuentran las herramientas, capas, y acciones para agrupar, eliminar o reordenar figuras
const SidebarGraficadora = ({
  onToolSelect,
  shapes = [],
  selectedId,
  onSelectShape,
  onDeleteShape,
  onMoveForward,
  onMoveBackward,
  onGroupShapes,
  onUngroupShapes,
  onAddImage
}) => {
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedShapeIds, setSelectedShapeIds] = useState([]);


  const handleExport = async () => {
    try {
      const exporter = new FlutterExporter('my_flutter_project');
      await exporter.exportToFlutter(shapes);
    } catch (error) {
      console.error('Error al exportar a Flutter:', error);
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file && onAddImage) {
      onAddImage(file);
    }
  };
  // Alternar si un grupo está expandido (mostrar sus hijos o no)
  const toggleGroup = (groupId) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupId)) {
      newExpandedGroups.delete(groupId);
    } else {
      newExpandedGroups.add(groupId);
    }
    setExpandedGroups(newExpandedGroups);
  };

  // Manejo de selección de figura (simple o múltiple con Ctrl/Cmd)
  const handleShapeSelect = (id, event) => {
    if (event.ctrlKey || event.metaKey) {
      setSelectedShapeIds(prev =>
        prev.includes(id) ? prev.filter(shapeId => shapeId !== id) : [...prev, id]
      );
    } else {
      setSelectedShapeIds([]);
      onSelectShape(id);
    }
  };

  // Dentro del componente SidebarGraficadora, agrega esta función:
  const handleExportToAngular = async () => {
    try {
      const exporter = new AngularExporter('my-angular-project');
      await exporter.exportToAngular(shapes);
    } catch (error) {
      console.error('Error al exportar a Angular:', error);
    }
  };

  // Retorna el icono correspondiente al tipo de figura
  const getShapeIcon = (type) => {
    switch (type) {
      case 'rectangle': return <Square size={16} />;
      case 'circle': return <Circle size={16} />;
      case 'star': return <Star size={16} />;
      case 'line': return <Minus size={16} />;
      case 'triangle': return <IoTriangleOutline size={16} />;
      case 'text': return <TfiText size={16} />;
      case 'group': return <Layers size={16} />;
      default: return <Square size={16} />;
    }
  };

  // Renderizado recursivo de lista de figuras, incluyendo agrupaciones
  const renderShapeList = (shapeList = [], isInGroup = false) => {
    return shapeList.map((shape) => {
      const isSelected = selectedId === shape.id || selectedShapeIds.includes(shape.id);
      const isGroup = shape.type === 'group';
      const isExpanded = expandedGroups.has(shape.id);

      return (
        <div key={shape.id} className={`pl-${isInGroup ? '4' : '0'} `}>
          <div
            className={`flex items-center p-2 ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-900'} rounded cursor-pointer`}
            onClick={(e) => handleShapeSelect(shape.id, e)}
          >
            {isGroup && (
              <button
                onClick={(e) => { e.stopPropagation(); toggleGroup(shape.id); }}
                className="mr-1 focus:outline-none"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            <span className="flex items-center">
              {getShapeIcon(shape.type)}
              <span className="ml-2 text-white">{shape.type} {shape.id.slice(-4)}</span>
            </span>
            <div className="ml-auto flex">
              <button title="Traer adelante" onClick={(e) => { e.stopPropagation(); onMoveForward(shape.id); }} className="p-1 text-white hover:bg-gray-600 rounded">
                <MoveUp size={14} />
              </button>
              <button title="Enviar atrás" onClick={(e) => { e.stopPropagation(); onMoveBackward(shape.id); }} className="p-1 text-white hover:bg-gray-600 rounded">
                <MoveDown size={14} />
              </button>
              <button title="Eliminar" onClick={(e) => { e.stopPropagation(); onDeleteShape(shape.id); }} className="p-1 text-white hover:bg-gray-600 rounded">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Mostrar hijos si es grupo y está expandido */}
          {isGroup && isExpanded && Array.isArray(shape.children) && shape.children.length > 0 && (
            <div className="ml-4 border-l border-gray-600">
              {renderShapeList(shape.children, true)}
            </div>
          )}
        </div>
      );
    });
  };

  const loginModern = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#F3F6FD" },
    // Card central
    { type: "rectangle", x: 400, y: 180, width: 400, height: 440, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1, rotation: 0 },
    // Título
    { type: "text", x: 480, y: 220, text: "Iniciar Sesión", fontSize: 40, fill: "#1976D2", fontFamily: "Arial", width: 300, height: 50 },
    // Input Email
    { type: "rectangle", x: 480, y: 300, width: 320, height: 54, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 490, y: 315, text: "Correo electrónico", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 30 },
    // Input Password
    { type: "rectangle", x: 480, y: 370, width: 320, height: 54, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 490, y: 385, text: "Contraseña", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 30 },
    // Botón
    { type: "rectangle", x: 480, y: 450, width: 320, height: 54, fill: "#1976D2", stroke: "#1976D2", strokeWidth: 1 },
    { type: "text", x: 570, y: 465, text: "Entrar", fontSize: 22, fill: "#FFFFFF", fontFamily: "Arial", width: 120, height: 30 },
    // Link Olvidaste tu contraseña
    { type: "text", x: 540, y: 530, text: "¿Olvidaste tu contraseña?", fontSize: 18, fill: "#1976D2", fontFamily: "Arial", width: 300, height: 30 }
  ];

  const dashboardSimple = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#F3F6FD" },
    // Barra superior
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 90, fill: "#1976D2" },
    { type: "text", x: 40, y: 30, text: "Dashboard", fontSize: 36, fill: "#FFFFFF", fontFamily: "Arial", width: 400, height: 50 },
    // Card 1
    { type: "rectangle", x: 60, y: 120, width: 520, height: 180, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1, rotation: 0 },
    { type: "text", x: 90, y: 150, text: "Bienvenido 👋", fontSize: 28, fill: "#1976D2", fontFamily: "Arial", width: 400, height: 50 },
    { type: "text", x: 90, y: 190, text: "Este es tu panel principal.", fontSize: 22, fill: "#7B809A", fontFamily: "Arial", width: 400, height: 40 },
    // Card 2
    { type: "rectangle", x: 60, y: 320, width: 520, height: 180, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1, rotation: 0 },
    { type: "text", x: 90, y: 350, text: "Tareas", fontSize: 24, fill: "#1976D2", fontFamily: "Arial", width: 400, height: 40 },
    { type: "text", x: 90, y: 390, text: "No tienes tareas pendientes.", fontSize: 22, fill: "#7B809A", fontFamily: "Arial", width: 400, height: 40 }
  ];

  const signupModern = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#F3F6FD" },
    // Card central
    { type: "rectangle", x: 400, y: 100, width: 400, height: 600, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1 },
    // Título
    { type: "text", x: 480, y: 140, text: "Crear Cuenta", fontSize: 40, fill: "#1976D2", fontFamily: "Arial", width: 300, height: 50 },
    // Input Nombre
    { type: "rectangle", x: 480, y: 210, width: 320, height: 54, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 490, y: 225, text: "Nombre completo", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 30 },
    // Input Email
    { type: "rectangle", x: 480, y: 280, width: 320, height: 54, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 490, y: 295, text: "Correo electrónico", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 30 },
    // Input Password
    { type: "rectangle", x: 480, y: 350, width: 320, height: 54, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 490, y: 365, text: "Contraseña", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 30 },
    // Input Confirmar Password
    { type: "rectangle", x: 480, y: 420, width: 320, height: 54, fill: "#F5F7FA", stroke: "#B0B8C1", strokeWidth: 1 },
    { type: "text", x: 490, y: 435, text: "Confirmar contraseña", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 250, height: 30 },
    // Botón
    { type: "rectangle", x: 480, y: 500, width: 320, height: 54, fill: "#1976D2", stroke: "#1976D2", strokeWidth: 1 },
    { type: "text", x: 540, y: 515, text: "Registrarse", fontSize: 22, fill: "#FFFFFF", fontFamily: "Arial", width: 200, height: 30 },
    // Link ya tienes cuenta
    { type: "text", x: 520, y: 570, text: "¿Ya tienes cuenta? Inicia sesión", fontSize: 18, fill: "#1976D2", fontFamily: "Arial", width: 300, height: 30 }
  ];

  const userProfile = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#F3F6FD" },
    // Header
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 220, fill: "#1976D2" },
    // Avatar (círculo)
    { type: "circle", x: 550, y: 60, width: 120, height: 120, fill: "#FFFFFF", stroke: "#B0B8C1", strokeWidth: 2 },
    // Nombre
    { type: "text", x: 500, y: 200, text: "Nombre de Usuario", fontSize: 32, fill: "#1976D2", fontFamily: "Arial", width: 300, height: 40 },
    // Email
    { type: "text", x: 500, y: 250, text: "usuario@email.com", fontSize: 22, fill: "#7B809A", fontFamily: "Arial", width: 300, height: 30 },
    // Botón Editar
    { type: "rectangle", x: 540, y: 300, width: 180, height: 50, fill: "#1976D2", stroke: "#1976D2", strokeWidth: 1 },
    { type: "text", x: 580, y: 315, text: "Editar Perfil", fontSize: 22, fill: "#FFFFFF", fontFamily: "Arial", width: 120, height: 30 }
  ];

  const cardList = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#F3F6FD" },
    // Título
    { type: "text", x: 40, y: 40, text: "Mis Elementos", fontSize: 36, fill: "#1976D2", fontFamily: "Arial", width: 400, height: 50 },
    // Card 1
    { type: "rectangle", x: 60, y: 120, width: 520, height: 120, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1 },
    { type: "text", x: 90, y: 150, text: "Elemento 1", fontSize: 28, fill: "#1976D2", fontFamily: "Arial", width: 400, height: 40 },
    { type: "text", x: 90, y: 190, text: "Descripción corta...", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 400, height: 30 },
    // Card 2
    { type: "rectangle", x: 60, y: 260, width: 520, height: 120, fill: "#FFFFFF", stroke: "#E0E3EB", strokeWidth: 1 },
    { type: "text", x: 90, y: 290, text: "Elemento 2", fontSize: 28, fill: "#1976D2", fontFamily: "Arial", width: 400, height: 40 },
    { type: "text", x: 90, y: 330, text: "Otra descripción...", fontSize: 20, fill: "#7B809A", fontFamily: "Arial", width: 400, height: 30 }
  ];

  const splashScreen = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#1976D2" },
    // Logo (círculo)
    { type: "circle", x: 550, y: 250, width: 120, height: 120, fill: "#FFFFFF" },
    // Título
    { type: "text", x: 400, y: 420, text: "Mi App Móvil", fontSize: 48, fill: "#FFFFFF", fontFamily: "Arial", width: 400, height: 60 },
    // Subtítulo
    { type: "text", x: 480, y: 500, text: "¡Bienvenido!", fontSize: 32, fill: "#F3F6FD", fontFamily: "Arial", width: 300, height: 40 }
  ];

  const emptyState = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#F3F6FD" },
    // Icono (círculo)
    { type: "circle", x: 550, y: 250, width: 120, height: 120, fill: "#E0E3EB" },
    // Título
    { type: "text", x: 400, y: 420, text: "Sin resultados", fontSize: 40, fill: "#1976D2", fontFamily: "Arial", width: 400, height: 60 },
    // Subtítulo
    { type: "text", x: 480, y: 500, text: "No se encontraron datos.", fontSize: 28, fill: "#7B809A", fontFamily: "Arial", width: 300, height: 40 }
  ];

  const calendarTemplate = [
    // Fondo
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 800, fill: "#F3F6FD" },
    // Cabecera
    { type: "rectangle", x: 0, y: 0, width: 1200, height: 90, fill: "#1976D2" },
    { type: "text", x: 540, y: 30, text: "Mayo 2024", fontSize: 32, fill: "#FFFFFF", fontFamily: "Arial", width: 200, height: 40 },
    // Botón anterior
    { type: "rectangle", x: 60, y: 30, width: 40, height: 40, fill: "#1565C0" },
    { type: "text", x: 75, y: 38, text: "<", fontSize: 28, fill: "#FFFFFF", fontFamily: "Arial", width: 30, height: 30 },
    // Botón siguiente
    { type: "rectangle", x: 1100, y: 30, width: 40, height: 40, fill: "#1565C0" },
    { type: "text", x: 1115, y: 38, text: ">", fontSize: 28, fill: "#FFFFFF", fontFamily: "Arial", width: 30, height: 30 },
    // Días de la semana
    { type: "text", x: 100, y: 110, text: "L", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 30, height: 30 },
    { type: "text", x: 220, y: 110, text: "M", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 30, height: 30 },
    { type: "text", x: 340, y: 110, text: "M", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 30, height: 30 },
    { type: "text", x: 460, y: 110, text: "J", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 30, height: 30 },
    { type: "text", x: 580, y: 110, text: "V", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 30, height: 30 },
    { type: "text", x: 700, y: 110, text: "S", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 30, height: 30 },
    { type: "text", x: 820, y: 110, text: "D", fontSize: 22, fill: "#1976D2", fontFamily: "Arial", width: 30, height: 30 },
    // Celdas de días (5 filas x 7 columnas)
    ...Array.from({ length: 5 }).flatMap((_, row) =>
      Array.from({ length: 7 }).map((_, col) => {
        const dayNum = row * 7 + col + 1;
        return [
          { type: "rectangle", x: 100 + col * 120, y: 150 + row * 100, width: 100, height: 80, fill: "#FFFFFF", stroke: "#B0B8C1", strokeWidth: 1 },
          { type: "text", x: 140 + col * 120, y: 170 + row * 100, text: String(dayNum <= 31 ? dayNum : ''), fontSize: 22, fill: "#333333", fontFamily: "Arial", width: 40, height: 30 }
        ];
      })
    ).flat()
  ];

  const umlClassTemplate = [
    // Fondo de la clase
    { type: "rectangle", x: 400, y: 200, width: 300, height: 160, fill: "#FFFFFF", stroke: "#1976D2", strokeWidth: 2 },
    // Línea separadora entre nombre y atributos
    { type: "line", x: 400, y: 240, x2: 700, y2: 240, stroke: "#1976D2", strokeWidth: 2 },
    // Nombre de la clase
    { type: "text", x: 420, y: 210, text: "NombreClase", fontSize: 24, fill: "#1976D2", fontFamily: "Arial", width: 260, height: 30 },
    // Atributos
    { type: "text", x: 420, y: 250, text: "+ atributo1: Tipo", fontSize: 18, fill: "#333", fontFamily: "Arial", width: 260, height: 24 },
    { type: "text", x: 420, y: 280, text: "- atributo2: Tipo", fontSize: 18, fill: "#333", fontFamily: "Arial", width: 260, height: 24 },
    { type: "text", x: 420, y: 310, text: "# atributo3: Tipo", fontSize: 18, fill: "#333", fontFamily: "Arial", width: 260, height: 24 }
  ];

  const umlRelationsTemplate = [
    // Clase base
    { type: "rectangle", x: 200, y: 100, width: 200, height: 60, fill: "#FFF", stroke: "#1976D2", strokeWidth: 2 },
    { type: "text", x: 220, y: 120, text: "Animal", fontSize: 20, fill: "#1976D2", fontFamily: "Arial", width: 160, height: 30 },

    // Clase derivada (herencia)
    { type: "rectangle", x: 100, y: 250, width: 200, height: 60, fill: "#FFF", stroke: "#1976D2", strokeWidth: 2 },
    { type: "text", x: 120, y: 270, text: "Perro", fontSize: 20, fill: "#1976D2", fontFamily: "Arial", width: 160, height: 30 },
    // Línea de herencia (flecha vacía)
    { type: "line", x: 200, y: 160, x2: 200, y2: 250, stroke: "#1976D2", strokeWidth: 2, markerEnd: "arrow" },

    // Clase composición
    { type: "rectangle", x: 400, y: 250, width: 200, height: 60, fill: "#FFF", stroke: "#1976D2", strokeWidth: 2 },
    { type: "text", x: 420, y: 270, text: "Collar", fontSize: 20, fill: "#1976D2", fontFamily: "Arial", width: 160, height: 30 },
    // Línea de composición (rombo relleno)
    { type: "line", x: 300, y: 280, x2: 400, y2: 280, stroke: "#1976D2", strokeWidth: 2, markerEnd: "diamond" },

    // Clase asociación
    { type: "rectangle", x: 700, y: 250, width: 200, height: 60, fill: "#FFF", stroke: "#1976D2", strokeWidth: 2 },
    { type: "text", x: 720, y: 270, text: "Veterinario", fontSize: 20, fill: "#1976D2", fontFamily: "Arial", width: 160, height: 30 },
    // Línea de asociación (línea simple con círculo)
    { type: "line", x: 300, y: 310, x2: 700, y2: 280, stroke: "#1976D2", strokeWidth: 2, markerEnd: "circle" }
  ];

  const templates = {
    login: loginModern,
    dashboard: dashboardSimple,
    signup: signupModern,
    profile: userProfile,
    cards: cardList,
    splash: splashScreen,
    empty: emptyState,
    calendar: calendarTemplate,
    umlClass: umlClassTemplate,
    umlRelations: umlRelationsTemplate,
    // ...otros
  };

  const handleInsertTemplate = (templateName) => {
    if (templates[templateName]) {
      // Puedes usar onToolSelect o setShapes, según tu lógica
      templates[templateName].forEach(shape => onToolSelect(shape.type, shape));
    }
  };

  return (
    <div className="p-4 bg-gris-semi-oscuro h-full flex flex-col  ">
      <h2 className="text-xl font-bold text-white mb-4">Nombre del Proyecto</h2>

      {/* Herramientas de dibujo */}
      <div className="mb-6">
        <h3 className="text-white text-sm font-medium mb-2">Herramientas</h3>
        <div className="grid grid-cols-3 gap-2">
          {['rectangle', 'circle', 'star', 'triangle', 'line', 'text'].map(type => (
            <button
              key={type}
              className="p-2 bg-gray-700 text-white rounded hover:bg-gray-600 flex flex-col items-center justify-center"
              onClick={() => onToolSelect(type)}
              title={type}
            >
              {getShapeIcon(type)}
              <span className="text-xs mt-1">{type.slice(0, 4)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Plantillas */}
      <div className="mb-4">
        <h3 className="text-white text-sm font-medium mb-2">Plantillas</h3>
        <div className="flex flex-col space-y-2">
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('login')}>Login</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('dashboard')}>Dashboard</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('signup')}>Registro</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('profile')}>Perfil</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('cards')}>Lista de Elementos</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('splash')}>Pantalla de Bienvenida</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('empty')}>Estado Vacío</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('calendar')}>Calendario</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('umlClass')}>Clase UML</button>
          <button className="p-2 bg-blue-700 text-white rounded hover:bg-blue-800" onClick={() => handleInsertTemplate('umlRelations')}>Relaciones UML</button>
        </div>
      </div>

      {/* Agrupar/Desagrupar */}
      <div className="mb-4 flex space-x-2">
        <button
          className={`p-2 ${selectedShapeIds.length > 1 ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded hover:bg-blue-500 flex items-center justify-center`}
          onClick={() => {
            if (selectedShapeIds.length > 1) {
              onGroupShapes(selectedShapeIds);
              setSelectedShapeIds([]);
            }
          }}
          disabled={selectedShapeIds.length <= 1}
          title="Agrupar"
        >
          <Group size={16} /><span className="ml-1">Agrupar</span>
        </button>

        <button
          className={`p-2 ${selectedId && shapes.find(s => s.id === selectedId)?.type === 'group' ? 'bg-blue-600' : 'bg-gray-700'} text-white rounded hover:bg-blue-500 flex items-center justify-center`}
          onClick={() => {
            const shape = shapes.find(s => s.id === selectedId);
            if (shape?.type === 'group') onUngroupShapes(selectedId);
          }}
          disabled={!selectedId || shapes.find(s => s.id === selectedId)?.type !== 'group'}
          title="Desagrupar"
        >
          <Ungroup size={16} /><span className="ml-1">Desagrupar</span>
        </button>
      </div>
      <div className="flex items-center space-x-2">
        {/* Subir imagen */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="p-2 rounded text-white hover:bg-gray-100 hover:text-black cursor-pointer flex items-center justify-center" title="Añadir Imagen">
            <ImageIcon size={20} />
          </label>
        </div>
        <button className="export-button text-gray-500 border border-gray-300 hover:bg-white p-1 rounded-2xl" onClick={handleExport} title="Exportar a Flutter">
          <Download size={18} className="flex justify-center mx-auto" />
          <span>Exportar a Flutter</span>
        </button>

        <button
          className="export-button text-gray-500 border border-gray-300 hover:bg-white p-1 rounded-2xl"
          onClick={handleExportToAngular}
          title="Exportar a Angular"
        >
          <Download size={18} className="flex justify-center mx-auto" />
          <span>Exportar a Angular</span>
        </button>
      </div>

      {/* Lista de capas */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="text-white text-sm font-medium mb-2">Capas</h3>
        <div className="space-y-1">
          {shapes.length > 0 ? renderShapeList(shapes) : (
            <p className="text-gray-400 text-sm">No hay figuras en el lienzo</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarGraficadora;
