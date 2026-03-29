import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { KanbanBoard } from "./KanbanBoard";

export function KanbanApp() {
  const { signOut } = useAuthActions();
  const boards = useQuery(api.boards.list);
  const createBoard = useMutation(api.boards.create);
  const deleteBoard = useMutation(api.boards.remove);

  const [selectedBoardId, setSelectedBoardId] = useState<Id<"boards"> | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [showNewBoardForm, setShowNewBoardForm] = useState(false);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const boardId = await createBoard({ name: newBoardName.trim() });
    setNewBoardName("");
    setShowNewBoardForm(false);
    setSelectedBoardId(boardId);
  };

  const handleDeleteBoard = async (boardId: Id<"boards">) => {
    if (selectedBoardId === boardId) {
      setSelectedBoardId(null);
    }
    await deleteBoard({ id: boardId });
  };

  if (selectedBoardId) {
    return (
      <KanbanBoard
        boardId={selectedBoardId}
        onBack={() => setSelectedBoardId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Header */}
      <header className="border-b-8 border-black bg-[#ffff00]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 md:p-6 gap-4">
          <h1 className="font-mono text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter">
            KANBAN<span className="text-[#ff0000]">_</span>BRUTAL
          </h1>
          <button
            onClick={() => signOut()}
            className="border-4 border-black bg-white px-4 md:px-6 py-2 md:py-3 font-mono text-sm md:text-base uppercase tracking-wider hover:bg-[#ff0000] hover:text-white transition-colors self-start sm:self-auto"
          >
            LOGOUT [X]
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <h2 className="font-mono text-xl md:text-2xl lg:text-3xl font-black uppercase border-b-4 border-black pb-2">
              YOUR_BOARDS
            </h2>
            <button
              onClick={() => setShowNewBoardForm(true)}
              className="border-4 border-black bg-[#00ff00] px-4 md:px-6 py-2 md:py-3 font-mono text-sm md:text-base uppercase tracking-wider hover:bg-[#ffff00] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 self-start sm:self-auto"
            >
              + NEW BOARD
            </button>
          </div>

          {/* New Board Form */}
          {showNewBoardForm && (
            <div className="mb-6 md:mb-8 border-8 border-black bg-white p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <form onSubmit={handleCreateBoard} className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="BOARD_NAME"
                  className="flex-1 border-4 border-black p-3 md:p-4 font-mono text-lg focus:outline-none focus:ring-4 focus:ring-[#ffff00] bg-[#f5f5f0]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-none border-4 border-black bg-[#0000ff] text-white px-4 md:px-6 py-3 md:py-4 font-mono text-base md:text-lg uppercase tracking-wider hover:bg-[#0000cc] transition-colors"
                  >
                    CREATE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewBoardForm(false);
                      setNewBoardName("");
                    }}
                    className="flex-1 sm:flex-none border-4 border-black bg-white px-4 md:px-6 py-3 md:py-4 font-mono text-base md:text-lg uppercase tracking-wider hover:bg-[#f5f5f0] transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Board Grid */}
          {boards === undefined ? (
            <div className="border-4 border-black p-8 bg-white text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="w-6 h-6 border-4 border-black border-t-transparent animate-spin" />
                <span className="font-mono text-lg uppercase">LOADING BOARDS...</span>
              </div>
            </div>
          ) : boards.length === 0 ? (
            <div className="border-8 border-black border-dashed p-8 md:p-16 text-center bg-white">
              <div className="space-y-4">
                <div className="text-4xl md:text-6xl">[ ]</div>
                <p className="font-mono text-lg md:text-xl uppercase">NO BOARDS YET</p>
                <p className="font-mono text-sm md:text-base text-gray-600 uppercase">
                  CREATE YOUR FIRST BOARD TO GET STARTED
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {boards.map((board: typeof boards[number], index: number) => (
                <div
                  key={board._id}
                  className="border-8 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
                  style={{
                    backgroundColor: ["#ffff00", "#00ff00", "#ff6b6b", "#0000ff", "#ff00ff", "#00ffff"][index % 6],
                  }}
                >
                  <div
                    className="p-4 md:p-6 cursor-pointer"
                    onClick={() => setSelectedBoardId(board._id)}
                  >
                    <h3 className="font-mono text-xl md:text-2xl font-black uppercase break-words text-black">
                      {board.name}
                    </h3>
                    <p className="font-mono text-xs md:text-sm mt-2 text-black/60 uppercase">
                      CREATED: {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="border-t-4 border-black bg-white p-3 md:p-4 flex justify-between items-center">
                    <button
                      onClick={() => setSelectedBoardId(board._id)}
                      className="font-mono text-xs md:text-sm uppercase hover:underline"
                    >
                      → OPEN
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(board._id)}
                      className="font-mono text-xs md:text-sm uppercase text-[#ff0000] hover:underline"
                    >
                      [DELETE]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white p-4 text-center">
        <p className="font-mono text-xs text-gray-500">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>
    </div>
  );
}
