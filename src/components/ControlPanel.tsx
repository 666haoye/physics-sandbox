import { useStore } from '../useStore'
import './ControlPanel.css'

const PRESETS = [
  { label: '地球', value: -9.81 },
  { label: '月球', value: -1.62 },
  { label: '火星', value: -3.71 },
]

export default function ControlPanel() {
  const gravity = useStore((state) => state.gravity)
  const setGravity = useStore((state) => state.setGravity)
  const triggerReset = useStore((state) => state.triggerReset)

  return (
    <div className="control-panel">
      <div className="control-panel__title">实验控制台</div>

      <label className="control-panel__label" htmlFor="gravity-slider">
        重力加速度
      </label>
      <div className="control-panel__slider-row">
        <input
          id="gravity-slider"
          type="range"
          min={-20}
          max={0}
          step={0.1}
          value={gravity}
          onChange={(event) => setGravity(parseFloat(event.target.value))}
        />
        <span className="control-panel__value">{(-gravity).toFixed(2)} m/s²</span>
      </div>

      <div className="control-panel__presets">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={
              Math.abs(gravity - preset.value) < 1e-6 ? 'is-active' : undefined
            }
            onClick={() => setGravity(preset.value)}
          >
            {preset.label}
            <span>{preset.value}</span>
          </button>
        ))}
      </div>

      <button type="button" className="control-panel__reset" onClick={triggerReset}>
        重置实验
      </button>
    </div>
  )
}
