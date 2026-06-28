import { useMemo, useState } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { FloatingCartButton } from './components/FloatingCartButton'
import { Header } from './components/Header'
import { useCart } from './context/useCart'
import { businessConfig } from './data/businessConfig'
import { categories, products } from './data/menuData'
import { CheckoutPage, type CheckoutErrors } from './pages/CheckoutPage'
import { ConfirmationPage } from './pages/ConfirmationPage'
import { MenuPage } from './pages/MenuPage'
import { ReviewPage } from './pages/ReviewPage'
import type {
  CustomerInfo,
  CustomerLocation,
  MenuStatus,
  OrderPayload,
  OrderType,
  PaymentMethod,
  ViewName,
} from './types'
import { createOrderPayload } from './utils/order'

const initialCustomerInfo: CustomerInfo = {
  name: '',
  phone: '',
  address: '',
  reference: '',
  paymentMethod: 'cash',
}

function getInitialTableNumber() {
  const queryParams = new URLSearchParams(window.location.search)
  return queryParams.get('table')?.trim() ?? ''
}

function App() {
  const initialTableNumber = useMemo(getInitialTableNumber, [])
  const {
    items,
    cartCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
  } = useCart()

  const [view, setView] = useState<ViewName>('menu')
  const [menuStatus] = useState<MenuStatus>('ready')
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id ?? '')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [orderType, setOrderType] = useState<OrderType>(
    initialTableNumber ? 'table' : 'pickup',
  )
  const [tableNumber, setTableNumber] = useState(initialTableNumber)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(initialCustomerInfo)
  const [location, setLocation] = useState<CustomerLocation | null>(null)
  const [locationMessage, setLocationMessage] = useState('')
  const [isLocating, setIsLocating] = useState(false)
  const [formErrors, setFormErrors] = useState<CheckoutErrors>({})
  const [lastOrder, setLastOrder] = useState<OrderPayload | null>(null)

  const currentOrder = useMemo(
    () =>
      createOrderPayload(
        {
          items,
          orderType,
          tableNumber: tableNumber.trim(),
          customerInfo,
          location,
          subtotal,
        },
        businessConfig.deliveryFee,
      ),
    [customerInfo, items, location, orderType, subtotal, tableNumber],
  )

  function goToMenu() {
    setView('menu')
    setIsCartOpen(false)
    window.scrollTo({ top: 0 })
  }

  function goToCheckout() {
    if (items.length === 0) {
      setIsCartOpen(true)
      return
    }

    setView('checkout')
    setIsCartOpen(false)
    window.scrollTo({ top: 0 })
  }

  function handleOrderTypeChange(nextOrderType: OrderType) {
    setOrderType(nextOrderType)
    setFormErrors({})
  }

  function handleCustomerChange(field: keyof CustomerInfo, value: string) {
    if (field === 'paymentMethod') {
      setCustomerInfo((current) => ({
        ...current,
        paymentMethod: value as PaymentMethod,
      }))
      return
    }

    setCustomerInfo((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleLocate() {
    if (!navigator.geolocation) {
      setLocationMessage('Tu navegador no permite compartir ubicacion. Escribe la direccion manualmente.')
      return
    }

    setIsLocating(true)
    setLocationMessage('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6))
        const lng = Number(position.coords.longitude.toFixed(6))

        setLocation({
          lat,
          lng,
          mapsUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        })
        setLocationMessage('Ubicacion capturada. La direccion manual sigue siendo editable.')
        setIsLocating(false)
      },
      () => {
        setLocation(null)
        setLocationMessage('No pudimos obtener la ubicacion. Puedes escribir la direccion manualmente.')
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  function validateCheckout() {
    const nextErrors: CheckoutErrors = {}

    if (orderType === 'table' && !tableNumber.trim()) {
      nextErrors.tableNumber = 'Indica el numero de mesa.'
    }

    if (orderType === 'delivery') {
      if (!customerInfo.name.trim()) {
        nextErrors.name = 'Indica tu nombre.'
      }

      if (!customerInfo.phone.trim()) {
        nextErrors.phone = 'Indica un telefono para confirmar.'
      }

      if (!customerInfo.address.trim()) {
        nextErrors.address = 'Indica la direccion de entrega.'
      }
    }

    if (orderType === 'pickup' && !customerInfo.name.trim()) {
      nextErrors.name = 'Indica el nombre de quien recoge.'
    }

    setFormErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function goToReview() {
    if (items.length === 0) {
      setIsCartOpen(true)
      return
    }

    if (!validateCheckout()) {
      return
    }

    setView('review')
    window.scrollTo({ top: 0 })
  }

  function handleOrderSent() {
    setLastOrder(currentOrder)
    clearCart()
    setIsCartOpen(false)
    setView('success')
    window.scrollTo({ top: 0 })
  }

  function startNewOrder() {
    setLastOrder(null)
    setCustomerInfo(initialCustomerInfo)
    setLocation(null)
    setLocationMessage('')
    setFormErrors({})
    setView('menu')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="app-shell">
      <Header
        businessName={businessConfig.name}
        tagline={businessConfig.tagline}
        tableNumber={tableNumber}
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onHome={goToMenu}
      />

      {view === 'menu' ? (
        <MenuPage
          categories={categories}
          products={products}
          menuStatus={menuStatus}
          selectedCategory={selectedCategory}
          tableNumber={tableNumber}
          onSelectCategory={setSelectedCategory}
          onAddToCart={addItem}
          getQuantity={getItemQuantity}
        />
      ) : null}

      {view === 'checkout' ? (
        <CheckoutPage
          business={businessConfig}
          items={items}
          orderType={orderType}
          tableNumber={tableNumber}
          customerInfo={customerInfo}
          location={location}
          locationMessage={locationMessage}
          isLocating={isLocating}
          subtotal={subtotal}
          deliveryFee={currentOrder.deliveryFee}
          total={currentOrder.total}
          errors={formErrors}
          onBack={goToMenu}
          onOrderTypeChange={handleOrderTypeChange}
          onTableChange={setTableNumber}
          onCustomerChange={handleCustomerChange}
          onLocate={handleLocate}
          onReview={goToReview}
        />
      ) : null}

      {view === 'review' ? (
        <ReviewPage
          business={businessConfig}
          order={currentOrder}
          onBack={() => setView('checkout')}
          onEditCart={() => setIsCartOpen(true)}
          onSent={handleOrderSent}
        />
      ) : null}

      {view === 'success' ? (
        <ConfirmationPage
          business={businessConfig}
          lastOrder={lastOrder}
          onNewOrder={startNewOrder}
        />
      ) : null}

      <CartDrawer
        items={items}
        subtotal={subtotal}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={goToCheckout}
        onUpdateQty={updateQuantity}
        onRemove={removeItem}
      />

      {view === 'menu' && (
        <FloatingCartButton
          cartCount={cartCount}
          subtotal={subtotal}
          onClick={() => setIsCartOpen(true)}
        />
      )}
    </div>
  )
}

export default App
