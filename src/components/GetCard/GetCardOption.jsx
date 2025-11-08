import { useMemo, useState } from 'react'
import { Button, Modal } from '@/components/ui'

const GetCardOption = () => {
  const [activeTier, setActiveTier] = useState(null)

  const modalContent = useMemo(() => ({
    basic: {
      title: 'Sobre básico',
      description: 'Un paquete introductorio con personajes icónicos.',
      actions: [
        { label: 'Abrir sobre básico', onClick: () => setActiveTier(null) },
      ],
    },
    advanced: {
      title: 'Sobre avanzado',
      description: 'Incluye personajes, naves y escenas memorables.',
      actions: [
        { label: 'Abrir sobre avanzado', onClick: () => setActiveTier(null) },
      ],
    },
    expert: {
      title: 'Sobre experto',
      description: 'Colección especial con cartas raras y limitadas.',
      actions: [
        { label: 'Abrir sobre experto', onClick: () => setActiveTier(null) },
      ],
    },
  }), [])

  return (
    <>
      <Modal
        open={Boolean(activeTier)}
        onClose={() => setActiveTier(null)}
        title={activeTier ? modalContent[activeTier].title : undefined}
        description={activeTier ? modalContent[activeTier].description : undefined}
        footer={activeTier ? (
          <div className="flex flex-col gap-2 w-full">
            {modalContent[activeTier].actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ) : null}
      />
      <div className="flex flex-col gap-4">
        <Button type="button" onClick={() => setActiveTier('basic')}>Sobre básico</Button>
        <Button type="button" onClick={() => setActiveTier('advanced')}>Sobre avanzado</Button>
        <Button type="button" onClick={() => setActiveTier('expert')}>Sobre expertos</Button>
      </div>
    </>
  )
}

export default GetCardOption