"use client"
 
import { useState, useRef } from "react"
import { Send, Image as ImageIcon, Loader2 } from "lucide-react"
 
interface Props {
  onSend: (message: string) => void
  onSendImage: (file: File) => void
}
 
export default function ChatInput({ onSend, onSendImage }: Props) {
  const [text, setText] = useState("")
  const [converting, setConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
 
  function handleSend() {
    if (!text.trim()) return
    onSend(text)
    setText("")
  }
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0]
    if (!file) return
 
    setConverting(true)
    try {
      // Soporte para archivos HEIC/HEIF
      if (
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif") ||
        file.type === "image/heic" ||
        file.type === "image/heif"
      ) {
        const heic2anyModule = await import("heic2any")
        const heic2any = heic2anyModule.default || heic2anyModule
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.7,
        })
 
        const finalBlob = Array.isArray(convertedBlob)
          ? convertedBlob[0]
          : convertedBlob
        file = new File(
          [finalBlob],
          file.name.replace(/\.(heic|heif)$/i, ".jpg"),
          { type: "image/jpeg" }
        )
      }
 
      onSendImage(file)
    } catch (error) {
      console.error("Error al procesar imagen:", error)
    } finally {
      setConverting(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }
 
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend()
  }
 
  return (
    <div className="
    p-4 bg-white/70 backdrop-blur-sm
    flex flex-col gap-2
    border-t border-[#708090]/10
    ">
      <div className="flex gap-3">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,.heic,.heif"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={converting}
          className="
          w-11 h-11
          rounded-xl
          flex items-center justify-center
          bg-[#f6f4ef] text-[#708090]
          border border-[#708090]/10
          hover:bg-[#708090]/5
          transition-all
          disabled:opacity-50
          "
        >
          {converting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ImageIcon size={18} />
          )}
        </button>
 
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje..."
          className="
          flex-1
          bg-[#f6f4ef]
          border border-[#708090]/20
          rounded-full
          px-4 py-2.5
          text-sm text-[#708090]
          placeholder:text-[#708090]/60
          outline-none
          focus:border-[#b76e79]/50
          focus:shadow-[0_0_0_3px_rgba(183,110,121,0.08)]
          transition-all duration-200
          "
        />
        <button
          onClick={handleSend}
          className="
          w-11 h-11
          rounded-full
          flex items-center justify-center
          bg-[#708090] text-[#f6f4ef]
          shadow-[0_4px_12px_rgba(140,151,104,0.2)]
          hover:shadow-[0_6px_16px_rgba(140,151,104,0.3)]
          hover:bg-[#b76e79]
          hover:scale-105
          active:scale-95
          transition-all duration-200
          "
        >
          <Send size={16} color="#f6f4ef" />
        </button>
      </div>
    </div>
  )
}