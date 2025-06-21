// 🔗 Importações necessárias
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 🚀 Início do Componente
export default function RomaneioPage() {
  const numeroRomaneio = "002847";

  // 📦 Dados simulados
  const [romaneio, setRomaneio] = useState([
    { id: 1, chapa: "001", material: "Branco Siena", medida: "320x190", local: "Galpão 1 - Fila A", status: "Pendente" },
    { id: 2, chapa: "002", material: "Preto Stellar", medida: "315x180", local: "Galpão 2 - Fila B", status: "Conferido" },
    { id: 3, chapa: "003", material: "Cinza Andorinha", medida: "330x200", local: "Galpão 1 - Fila C", status: "Avaria" },
    { id: 4, chapa: "004", material: "Marrom Café", medida: "310x180", local: "Galpão 3 - Fila D", status: "Pendente" },
    { id: 5, chapa: "005", material: "Verde Ubatuba", medida: "300x170", local: "Galpão 2 - Fila E", status: "Conferido" },
    { id: 6, chapa: "006", material: "Preto Stellar", medida: "315x180", local: "Galpão 2 - Fila B", status: "Pendente" },
  ]);

  // 🔍 Estados para filtros
  const [filtroBusca, setFiltroBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [filtroMaterial, setFiltroMaterial] = useState("Todos");
  const [filtroLocal, setFiltroLocal] = useState("Todos");

  // 🔢 Estado para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(() => Number(localStorage.getItem("itensPorPagina")) || 5);

  // 🔔 Estados para popup e toast
  const [popup, setPopup] = useState({ aberto: false, id: null, acao: "", novoStatus: "" });
  const [toast, setToast] = useState({ mensagem: "", visivel: false });

  // Estado para menu dropdown de Exportações
  const [menuExportarAberto, setMenuExportarAberto] = useState(false);

  // 🔥 Funções para toast
  const mostrarToast = (mensagem) => {
    setToast({ mensagem, visivel: true });
    setTimeout(() => setToast({ mensagem: "", visivel: false }), 3000);
  };

  // 🔄 Atualizar status
  const atualizarStatus = (id, novoStatus) => {
    const atualizado = romaneio.map((item) => (item.id === id ? { ...item, status: novoStatus } : item));
    setRomaneio(atualizado);
  };

  // 🔓 Abrir popup
  const abrirPopup = (id, acao, novoStatus) => {
    setPopup({ aberto: true, id, acao, novoStatus });
  };

  // ✅ Confirmar popup
  const confirmarAcao = () => {
    atualizarStatus(popup.id, popup.novoStatus);
    mostrarToast(
      popup.novoStatus === "Pendente"
        ? "Status resetado para Pendente"
        : `Status alterado para ${popup.novoStatus}`
    );
    fecharPopup(false);
  };

  // ❌ Fechar popup
  const fecharPopup = (mostrarToastCancelamento = true) => {
    setPopup({ aberto: false, id: null, acao: "", novoStatus: "" });
    if (mostrarToastCancelamento) mostrarToast("Ação cancelada");
  };

  // 🔍 Gerar listas únicas para filtros
  const materiaisUnicos = [...new Set(romaneio.map((item) => item.material))];
  const locaisUnicos = [...new Set(romaneio.map((item) => item.local))];

  // 🔍 Aplicação dos filtros
  const romaneioFiltrado = romaneio.filter((item) => {
    const busca = filtroBusca.toLowerCase();
    const passaBusca =
      item.chapa.toLowerCase().includes(busca) ||
      item.material.toLowerCase().includes(busca) ||
      item.medida.toLowerCase().includes(busca) ||
      item.local.toLowerCase().includes(busca) ||
      item.status.toLowerCase().includes(busca);

    const passaStatus = filtroStatus === "Todos" || item.status === filtroStatus;
    const passaMaterial = filtroMaterial === "Todos" || item.material === filtroMaterial;
    const passaLocal = filtroLocal === "Todos" || item.local === filtroLocal;

    return passaBusca && passaStatus && passaMaterial && passaLocal;
  });

  // 🔢 Lógica de paginação
  const indiceUltimoItem = paginaAtual * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const itensDaPagina = romaneioFiltrado.slice(indicePrimeiroItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(romaneioFiltrado.length / itensPorPagina);

  // 📥 Exportar para Excel
  const exportarParaExcel = () => {
    const dados = romaneioFiltrado.map((item) => ({
      Romaneio: numeroRomaneio,
      "Nº Chapa": item.chapa,
      Material: item.material,
      Medida: item.medida,
      Localização: item.local,
      Status: item.status,
    }));
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Romaneio");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Romaneio_${numeroRomaneio}.xlsx`);
    mostrarToast("Exportação Excel concluída");
  };

  // 📥 Exportar para PDF
  const exportarParaPDF = () => {
    const doc = new jsPDF();
    doc.text(`Romaneio de Conferência #${numeroRomaneio}`, 14, 15);
    const dados = romaneioFiltrado.map((item) => [
      numeroRomaneio,
      item.chapa,
      item.material,
      item.medida,
      item.local,
      item.status,
    ]);
    autoTable(doc, {
      head: [["Romaneio", "Nº Chapa", "Material", "Medida", "Localização", "Status"]],
      body: dados,
      startY: 20,
    });
    doc.save(`Romaneio_${numeroRomaneio}.pdf`);
    mostrarToast("Exportação PDF concluída");
  };

  // 🧠 Return da interface
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📑 Romaneio #{numeroRomaneio}</h1>

      {/* 🔵 Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total de Chapas", color: "blue", valor: romaneio.length },
          { label: "Conferidas", color: "green", valor: romaneio.filter(i => i.status === "Conferido").length },
          { label: "Avaria", color: "red", valor: romaneio.filter(i => i.status === "Avaria").length },
          { label: "Pendentes", color: "yellow", valor: romaneio.filter(i => i.status === "Pendente").length },
        ].map((card, idx) => (
          <div key={idx} className={`bg-${card.color}-500 text-white p-4 rounded-lg shadow`}>
            <h2 className="text-lg">{card.label}</h2>
            <p className="text-2xl font-bold">{card.valor}</p>
          </div>
        ))}
      </div>

      {/* 🔽 Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
          placeholder="🔍 Buscar chapa, material, medida, local ou status..."
          className="border px-4 py-2 rounded w-full md:w-1/4"
        />
        <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value)} className="border px-4 py-2 rounded">
          <option value="Todos">Status: Todos</option>
          <option value="Pendente">Pendente</option>
          <option value="Conferido">Conferido</option>
          <option value="Avaria">Avaria</option>
        </select>
        <select value={filtroMaterial} onChange={(e) => setFiltroMaterial(e.target.value)} className="border px-4 py-2 rounded">
          <option value="Todos">Material: Todos</option>
          {materiaisUnicos.map((material) => (
            <option key={material} value={material}>{material}</option>
          ))}
        </select>
        <select value={filtroLocal} onChange={(e) => setFiltroLocal(e.target.value)} className="border px-4 py-2 rounded">
          <option value="Todos">Local: Todos</option>
          {locaisUnicos.map((local) => (
            <option key={local} value={local}>{local}</option>
          ))}
        </select>
      </div>

      {/* 🔗 Exportações */}
      <div className="relative mb-4">
  <button
    onClick={() => setMenuExportarAberto(!menuExportarAberto)}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
  >
    📤 Exportar
  </button>

  {menuExportarAberto && (
    <div className="absolute mt-2 bg-white border rounded shadow z-50">
      <button
        onClick={() => {
          exportarParaExcel();
          setMenuExportarAberto(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        📄 Exportar Excel
      </button>
      <button
        onClick={() => {
          exportarParaPDF();
          setMenuExportarAberto(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        📑 Exportar PDF
      </button>
    </div>
  )}
</div>


      {/* 📱 Cards Mobile */}
      <div className="md:hidden space-y-4">
        {itensDaPagina.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between mb-2">
              <h2 className="text-xl font-bold">Chapa {item.chapa}</h2>
              <span className={`px-2 py-1 rounded text-white ${
                  item.status === "Conferido"
                    ? "bg-green-500"
                    : item.status === "Avaria"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}>
                {item.status}
              </span>
            </div>
            <p><strong>Material:</strong> {item.material}</p>
            <p><strong>Medida:</strong> {item.medida}</p>
            <p><strong>Localização:</strong> {item.local}</p>

            <div className="flex gap-2 mt-4">
              {item.status === "Pendente" ? (
                <>
                  <button onClick={() => abrirPopup(item.id, "Conferir", "Conferido")} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
                    ✅ Conferir
                  </button>
                  <button onClick={() => abrirPopup(item.id, "Avaria", "Avaria")} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                    ❌ Avaria
                  </button>
                </>
              ) : (
                <button onClick={() => abrirPopup(item.id, "Resetar", "Pendente")} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
                  🔄 Resetar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 💻 Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-auto bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nº Chapa</th>
              <th className="py-2 px-4 border">Material</th>
              <th className="py-2 px-4 border">Medida</th>
              <th className="py-2 px-4 border">Localização</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {itensDaPagina.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border">{item.chapa}</td>
                <td className="py-2 px-4 border">{item.material}</td>
                <td className="py-2 px-4 border">{item.medida}</td>
                <td className="py-2 px-4 border">{item.local}</td>
                <td className="py-2 px-4 border">
                  <span className={`px-2 py-1 rounded text-white ${
                      item.status === "Conferido"
                        ? "bg-green-500"
                        : item.status === "Avaria"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex gap-2 flex-wrap">
                    {item.status === "Pendente" ? (
                      <>
                        <button onClick={() => abrirPopup(item.id, "Conferir", "Conferido")} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
                          ✅ Conferir
                        </button>
                        <button onClick={() => abrirPopup(item.id, "Avaria", "Avaria")} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                          ❌ Avaria
                        </button>
                      </>
                    ) : (
                      <button onClick={() => abrirPopup(item.id, "Resetar", "Pendente")} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
                        🔄 Resetar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔘 Paginação */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-4">
        <div className="flex items-center">
          <label className="mr-2 font-medium">Exibir:</label>
          <select
            value={itensPorPagina}
            onChange={(e) => {
              const valor = Number(e.target.value);
              setItensPorPagina(valor);
              localStorage.setItem("itensPorPagina", valor);
              setPaginaAtual(1);
            }}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 15, 30, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="ml-2">registros por página</span>
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center gap-2">
            {paginaAtual > 1 && (
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                ⬅️ Anterior
              </button>
            )}

            {[...Array(totalPaginas)].map((_, index) => (
              <button
                key={index}
                onClick={() => setPaginaAtual(index + 1)}
                className={`px-3 py-1 rounded ${
                  paginaAtual === index + 1
                    ? "bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {paginaAtual < totalPaginas && (
              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))}
                className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Próxima ➡️
              </button>
            )}
          </div>
        )}
      </div>

      {/* 🔔 Popup */}
      {popup.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4">Confirmação</h2>
            <p className="mb-6">
              Tem certeza que deseja <span className="font-bold">{popup.acao}</span> esta chapa?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => fecharPopup(true)}
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAcao}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔔 Toast */}
      {toast.visivel && (
        <div className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {toast.mensagem}
        </div>
      )}
    </div>
  );
}
