import { useState } from "react";

export default function RomaneioPage() {
  const [romaneio, setRomaneio] = useState([
    {
      id: 1,
      chapa: "001",
      material: "Branco Siena",
      medida: "320x190",
      local: "Galpão 1 - Fila A",
      status: "Pendente",
    },
    {
      id: 2,
      chapa: "002",
      material: "Preto Stellar",
      medida: "315x180",
      local: "Galpão 2 - Fila B",
      status: "Conferido",
    },
    {
      id: 3,
      chapa: "003",
      material: "Cinza Andorinha",
      medida: "330x200",
      local: "Galpão 1 - Fila C",
      status: "Avaria",
    },
  ]);

  const [filtroBusca, setFiltroBusca] = useState("");
  const [focoBusca, setFocoBusca] = useState(false);

  const atualizarStatus = (id, novoStatus) => {
    const atualizado = romaneio.map((item) => {
      if (item.id === id) {
        return { ...item, status: novoStatus };
      }
      return item;
    });
    setRomaneio(atualizado);
  };

  const romaneioFiltrado = romaneio.filter((item) => {
    const busca = filtroBusca.toLowerCase();
    return (
      item.chapa.toLowerCase().includes(busca) ||
      item.material.toLowerCase().includes(busca) ||
      item.medida.toLowerCase().includes(busca) ||
      item.local.toLowerCase().includes(busca) ||
      item.status.toLowerCase().includes(busca)
    );
  });

  // 🔥 Gerar listas únicas
  const materiais = [...new Set(romaneio.map((item) => item.material))];
  const locais = [...new Set(romaneio.map((item) => item.local))];
  const medidas = [...new Set(romaneio.map((item) => item.medida))];
  const chapas = [...new Set(romaneio.map((item) => item.chapa))];
  const status = [...new Set(romaneio.map((item) => item.status))];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📑 Romaneio #002847</h1>

      {/* 🔸 Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <h2 className="text-lg">Total de Chapas</h2>
          <p className="text-2xl font-bold">{romaneio.length}</p>
        </div>
        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
          <h2 className="text-lg">Conferidas</h2>
          <p className="text-2xl font-bold">
            {romaneio.filter((item) => item.status === "Conferido").length}
          </p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg shadow">
          <h2 className="text-lg">Avaria</h2>
          <p className="text-2xl font-bold">
            {romaneio.filter((item) => item.status === "Avaria").length}
          </p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow">
          <h2 className="text-lg">Pendentes</h2>
          <p className="text-2xl font-bold">
            {romaneio.filter((item) => item.status === "Pendente").length}
          </p>
        </div>
      </div>

      {/* 🔍 Campo de busca com lista dinâmica */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
          onFocus={() => setFocoBusca(true)}
          onBlur={() => setTimeout(() => setFocoBusca(false), 200)}
          className="w-full md:w-1/2 px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {focoBusca && (
          <div className="absolute mt-1 w-full md:w-1/2 bg-white border border-gray-300 rounded shadow-md z-10 max-h-60 overflow-auto">
            <ul className="text-sm text-gray-700 p-2 space-y-1">
              <li className="font-bold">• Nº Chapa</li>
              {chapas.map((c) => (
                <li
                  key={c}
                  className="cursor-pointer hover:bg-gray-100 rounded px-2"
                  onClick={() => setFiltroBusca(c)}
                >
                  {c}
                </li>
              ))}

              <li className="font-bold mt-2">• Material</li>
              {materiais.map((m) => (
                <li
                  key={m}
                  className="cursor-pointer hover:bg-gray-100 rounded px-2"
                  onClick={() => setFiltroBusca(m)}
                >
                  {m}
                </li>
              ))}

              <li className="font-bold mt-2">• Medida</li>
              {medidas.map((m) => (
                <li
                  key={m}
                  className="cursor-pointer hover:bg-gray-100 rounded px-2"
                  onClick={() => setFiltroBusca(m)}
                >
                  {m}
                </li>
              ))}

              <li className="font-bold mt-2">• Localização</li>
              {locais.map((l) => (
                <li
                  key={l}
                  className="cursor-pointer hover:bg-gray-100 rounded px-2"
                  onClick={() => setFiltroBusca(l)}
                >
                  {l}
                </li>
              ))}

              <li className="font-bold mt-2">• Status</li>
              {status.map((s) => (
                <li
                  key={s}
                  className="cursor-pointer hover:bg-gray-100 rounded px-2"
                  onClick={() => setFiltroBusca(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 🔸 Tabela no Desktop */}
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
            {romaneioFiltrado.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border">{item.chapa}</td>
                <td className="py-2 px-4 border">{item.material}</td>
                <td className="py-2 px-4 border">{item.medida}</td>
                <td className="py-2 px-4 border">{item.local}</td>
                <td className="py-2 px-4 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      item.status === "Conferido"
                        ? "bg-green-500"
                        : item.status === "Avaria"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-4 border">
                  <div className="flex gap-2 flex-wrap">
                    {item.status === "Pendente" ? (
                      <>
                        <button
                          onClick={() => atualizarStatus(item.id, "Conferido")}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        >
                          ✅ Conferir
                        </button>
                        <button
                          onClick={() => atualizarStatus(item.id, "Avaria")}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        >
                          ❌ Avaria
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => atualizarStatus(item.id, "Pendente")}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                      >
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

      {/* 🔸 Cards no Mobile */}
      <div className="block md:hidden space-y-4">
        {romaneioFiltrado.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg shadow p-4 bg-white flex flex-col"
          >
            <div className="flex justify-between">
              <span className="font-semibold">Nº Chapa:</span>
              {item.chapa}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Material:</span>
              {item.material}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Medida:</span>
              {item.medida}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Localização:</span>
              {item.local}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span
                className={`px-2 py-1 rounded text-white ${
                  item.status === "Conferido"
                    ? "bg-green-500"
                    : item.status === "Avaria"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="flex justify-start gap-2 flex-wrap mt-2">
              {item.status === "Pendente" ? (
                <>
                  <button
                    onClick={() => atualizarStatus(item.id, "Conferido")}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                  >
                    ✅ Conferir
                  </button>
                  <button
                    onClick={() => atualizarStatus(item.id, "Avaria")}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    ❌ Avaria
                  </button>
                </>
              ) : (
                <button
                  onClick={() => atualizarStatus(item.id, "Pendente")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                >
                  🔄 Resetar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
