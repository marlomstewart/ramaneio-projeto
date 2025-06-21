// 📦 Importações
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ConfirmPopup from '../components/ConfirmPopup';

// 🔔 Toast embutido (Notificações)
function Toast({ isOpen, texto }) {
  return (
    isOpen && (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded shadow-lg z-50">
        {texto}
      </div>
    )
  );
}

// 🚀 Componente principal
export default function ListagemRomaneiosPage() {
  // 🗂️ Dados de exemplo
  const [romaneios, setRomaneios] = useState([
    { id: 1, numero: '002847', data: '2024-06-20', status: 'Em Aberto' },
    { id: 2, numero: '002848', data: '2024-06-21', status: 'Finalizado' },
    { id: 3, numero: '002849', data: '2024-06-22', status: 'Avaria' },
    { id: 4, numero: '002850', data: '2024-06-23', status: 'Em Aberto' },
    { id: 5, numero: '002851', data: '2024-06-24', status: 'Finalizado' },
    { id: 6, numero: '002852', data: '2024-06-25', status: 'Avaria' },
  ]);

  // 🔍 Filtros
  const [filtroBusca, setFiltroBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');

  // 🔥 Popup e Toast
  const [popupAberto, setPopupAberto] = useState(false);
  const [acaoConfirmada, setAcaoConfirmada] = useState(() => () => {});
  const [tituloPopup, setTituloPopup] = useState('');
  const [mensagemPopup, setMensagemPopup] = useState('');
  const [textoToast, setTextoToast] = useState('');
  const [toastAberto, setToastAberto] = useState(false);

  // 📄 Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(
    localStorage.getItem('itensPorPaginaListagem') || 5
  );

  // Exportação
  const [menuExportarAberto, setMenuExportarAberto] = useState(false);

  useEffect(() => {
    localStorage.setItem('itensPorPaginaListagem', itensPorPagina);
  }, [itensPorPagina]);

  // 🧠 Funções auxiliares
  const mostrarToast = (texto) => {
    setTextoToast(texto);
    setToastAberto(true);
    setTimeout(() => {
      setToastAberto(false);
    }, 3000);
  };

  const abrirPopup = (acao, titulo, mensagem, textoToastConfirmar) => {
    setAcaoConfirmada(() => () => {
      acao();
      mostrarToast(textoToastConfirmar);
    });
    setTituloPopup(titulo);
    setMensagemPopup(mensagem);
    setPopupAberto(true);
  };

  // ➕ Criar novo romaneio
  const criarNovoRomaneio = () => {
    const novoNumero = String(2847 + romaneios.length).padStart(6, '0');
    const novaData = new Date().toISOString().split('T')[0];
    const novo = {
      id: romaneios.length + 1,
      numero: novoNumero,
      data: novaData,
      status: 'Em Aberto',
    };
    setRomaneios([novo, ...romaneios]);
  };

  // 🗑️ Excluir romaneio
  const excluirRomaneio = (id) => {
    setRomaneios(romaneios.filter((r) => r.id !== id));
  };

    // 🔍 Aplicar filtros
  const romaneiosFiltrados = romaneios.filter((r) => {
    const passaBusca =
      r.numero.includes(filtroBusca) || r.data.includes(filtroBusca);
    const passaStatus = filtroStatus === 'Todos' || r.status === filtroStatus;
    return passaBusca && passaStatus;
  });

  // 🔢 Ordenação
  const [colunaOrdenada, setColunaOrdenada] = useState('');
  const [ordem, setOrdem] = useState('asc');

  const ordenar = (coluna) => {
    const novaOrdem = coluna === colunaOrdenada && ordem === 'asc' ? 'desc' : 'asc';
    setColunaOrdenada(coluna);
    setOrdem(novaOrdem);
};

  const romaneiosOrdenados = [...romaneiosFiltrados].sort((a, b) => {
  if (!colunaOrdenada) return 0;
  const valorA = a[colunaOrdenada];
  const valorB = b[colunaOrdenada];

  if (ordem === 'asc') {
    return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
  } else {
    return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
  }
});


  // 📄 Paginação lógica
  const totalPaginas = Math.ceil(romaneiosOrdenados.length / itensPorPagina);
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const romaneiosPaginados = romaneiosOrdenados.slice(
    indexPrimeiro,
    indexUltimo
  );

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
    mostrarToast(`Página alterada para ${novaPagina}`);
  };

  // 📥 Exportar Excel ou PDF
  const exportarDados = (tipo, escopo) => {
    const dadosExportar =
      escopo === 'pagina' ? romaneiosPaginados : romaneiosOrdenados;

    const dados = dadosExportar.map((item) => ({
      Número: item.numero,
      Data: item.data,
      Status: item.status,
    }));

    if (tipo === 'excel') {
      const ws = XLSX.utils.json_to_sheet(dados);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Romaneios');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `Listagem_Romaneios.xlsx`);
      mostrarToast('Exportação Excel concluída');
    }

    if (tipo === 'pdf') {
      const doc = new jsPDF();
      doc.text('Listagem de Romaneios', 14, 15);
      const dadosPDF = dadosExportar.map((i) => [
        i.numero,
        i.data,
        i.status,
      ]);
      autoTable(doc, {
        head: [['Número', 'Data', 'Status']],
        body: dadosPDF,
        startY: 20,
      });
      doc.save('Listagem_Romaneios.pdf');
      mostrarToast('Exportação PDF concluída');
    }
  };

  return (
    <div className="p-6">


      {/* 🔵 Botão de Exportação */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📑 Listagem de Romaneios</h1>

        <div className="relative">
          <button
            onClick={() => setMenuExportarAberto(!menuExportarAberto)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            📤 Exportar
          </button>

          {menuExportarAberto && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow z-50">
              <button
                onClick={() => {
                  exportarDados('excel', 'pagina');
                  setMenuExportarAberto(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                📄 Página Atual (Excel)
              </button>
              <button
                onClick={() => {
                  exportarDados('pdf', 'pagina');
                  setMenuExportarAberto(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                📑 Página Atual (PDF)
              </button>
              <button
                onClick={() => {
                  exportarDados('excel', 'completo');
                  setMenuExportarAberto(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                📄 Listagem Completa (Excel)
              </button>
              <button
                onClick={() => {
                  exportarDados('pdf', 'completo');
                  setMenuExportarAberto(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                📑 Listagem Completa (PDF)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔍 Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
          placeholder="🔍 Buscar por número ou data..."
          className="border px-4 py-2 rounded w-full md:w-1/4"
        />
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="Todos">Status: Todos</option>
          <option value="Em Aberto">Em Aberto</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Avaria">Avaria</option>
        </select>
      </div>

      {/* 🖥️ Tabela (Desktop) */}
      <div className="hidden md:block">
        <table className="w-full table-auto bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => ordenar('numero')}
              >
                Número {colunaOrdenada === 'numero' ? (ordem === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => ordenar('data')}
              >
                Data {colunaOrdenada === 'data' ? (ordem === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th
                className="py-2 px-4 border cursor-pointer"
                onClick={() => ordenar('status')}
              >
                Status {colunaOrdenada === 'status' ? (ordem === 'asc' ? '🔼' : '🔽') : ''}
              </th>
              <th className="py-2 px-4 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {romaneiosPaginados.map((r) => (
              <tr key={r.id}>
                <td className="py-2 px-4 border">#{r.numero}</td>
                <td className="py-2 px-4 border">{r.data}</td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      r.status === 'Finalizado'
                        ? 'bg-green-500'
                        : r.status === 'Avaria'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() =>
                        abrirPopup(
                          () => alert(`Abrir romaneio ${r.numero}`),
                          'Visualizar Romaneio',
                          `Deseja visualizar o romaneio ${r.numero}?`,
                          `Romaneio ${r.numero} visualizado`
                        )
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                    >
                      👁️ Visualizar
                    </button>

                    <button
                      onClick={() =>
                        abrirPopup(
                          () => excluirRomaneio(r.id),
                          'Excluir Romaneio',
                          `Tem certeza que deseja excluir o romaneio ${r.numero}?`,
                          `Romaneio ${r.numero} excluído`
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📱 Cards (Mobile) */}
      <div className="md:hidden flex flex-col gap-4">
        {romaneiosPaginados.map((r) => (
          <div
            key={r.id}
            className="border rounded-lg shadow p-4 bg-white flex flex-col gap-2"
          >
            <div>
              <strong>Número:</strong> #{r.numero}
            </div>
            <div>
              <strong>Data:</strong> {r.data}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span
                className={`px-2 py-1 rounded text-white ${
                  r.status === 'Finalizado'
                    ? 'bg-green-500'
                    : r.status === 'Avaria'
                    ? 'bg-red-500'
                    : 'bg-yellow-500'
                }`}
              >
                {r.status}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  abrirPopup(
                    () => alert(`Abrir romaneio ${r.numero}`),
                    'Visualizar Romaneio',
                    `Deseja visualizar o romaneio ${r.numero}?`,
                    `Romaneio ${r.numero} visualizado`
                  )
                }
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
              >
                👁️ Visualizar
              </button>

              <button
                onClick={() =>
                  abrirPopup(
                    () => excluirRomaneio(r.id),
                    'Excluir Romaneio',
                    `Tem certeza que deseja excluir o romaneio ${r.numero}?`,
                    `Romaneio ${r.numero} excluído`
                  )
                }
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔄 Controles de Paginação e Quantidade */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mt-4">
        {/* Dropdown quantidade */}
        <div className="flex items-center gap-2">
          <label>Exibir:</label>
          <select
            value={itensPorPagina}
            onChange={(e) => {
              setItensPorPagina(Number(e.target.value));
              setPaginaAtual(1);
            }}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 15, 30, 50, 100].map((qtd) => (
              <option key={qtd} value={qtd}>
                {qtd}
              </option>
            ))}
          </select>
          <span>registros</span>
        </div>

        {/* Paginação */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => mudarPagina(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className={`px-3 py-1 rounded ${
              paginaAtual === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            ⬅️ Anterior
          </button>

          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>

          <button
            onClick={() => mudarPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
            className={`px-3 py-1 rounded ${
              paginaAtual === totalPaginas
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Próxima ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
