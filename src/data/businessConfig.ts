import type { BusinessConfig } from '../types'

export const businessConfig: BusinessConfig = {
  name: 'Nombre',
  tagline: 'tagline',
  whatsappNumber: '18094338279',
  address: 'Direccion del local o area de cobertura',
  currency: 'Moneda aceptada',
  deliveryFee: 0 ,
  paymentMethods: [
    { id: 'cash', label: 'Efectivo' },
    { id: 'card', label: 'Tarjeta al recibir' },
    { id: 'transfer', label: 'Transferencia' },
  ],
}
