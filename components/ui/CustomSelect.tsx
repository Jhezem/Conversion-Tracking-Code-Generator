import { useEffect, useRef, useState } from "react"

type Option = { label: string; value: string } | string

interface CustomSelectProps {
  options: Option[]
  value: string
  name?: string
  placeholder?: string
  onChange: (value: string) => void
}

const CustomSelect = ({
  options,
  value,
  name,
  placeholder,
  onChange
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  )

  const selectedLabel =
    normalizedOptions.find((opt) => opt.value === value)?.label ||
    placeholder ||
    "Select..."

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      {name && <input type="hidden" name={name} value={value} />}
      <button
        type="button"
        className="w-full text-left px-3 py-2 bg-[#1f1f1f] border border-[#333] rounded text-[#f7eedc] hover:border-[#555] focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}>
        {selectedLabel}
        <span className="float-right text-primary">▼</span>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-full max-h-52 overflow-y-auto bg-[#262626] border border-[#333] rounded shadow-md z-10 text-[#f7eedc]">
          {normalizedOptions.map(({ label, value: optionValue }) => (
            <div
              key={optionValue}
              onClick={() => {
                onChange(optionValue)
                setIsOpen(false)
              }}
              className={`px-3 py-2 hover:bg-primary cursor-pointer ${
                value === optionValue ? "bg-primary" : ""
              }`}>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
