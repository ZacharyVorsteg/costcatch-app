// Simple validation utilities for API input

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateRequired(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null || value === '') {
    return `${fieldName} is required`
  }
  return null
}

export function validateString(value: unknown, fieldName: string, options?: { minLength?: number; maxLength?: number }): string | null {
  if (typeof value !== 'string') {
    return `${fieldName} must be a string`
  }
  if (options?.minLength && value.length < options.minLength) {
    return `${fieldName} must be at least ${options.minLength} characters`
  }
  if (options?.maxLength && value.length > options.maxLength) {
    return `${fieldName} must be at most ${options.maxLength} characters`
  }
  return null
}

export function validateNumber(value: unknown, fieldName: string, options?: { min?: number; max?: number }): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return `${fieldName} must be a valid number`
  }
  if (options?.min !== undefined && value < options.min) {
    return `${fieldName} must be at least ${options.min}`
  }
  if (options?.max !== undefined && value > options.max) {
    return `${fieldName} must be at most ${options.max}`
  }
  return null
}

export function validateUUID(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'string') {
    return `${fieldName} must be a string`
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(value)) {
    return `${fieldName} must be a valid UUID`
  }
  return null
}

export function validateEmail(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'string') {
    return `${fieldName} must be a string`
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return `${fieldName} must be a valid email address`
  }
  return null
}

export function validateDate(value: unknown, fieldName: string): string | null {
  if (typeof value !== 'string') {
    return `${fieldName} must be a string`
  }
  const date = new Date(value)
  if (isNaN(date.getTime())) {
    return `${fieldName} must be a valid date`
  }
  return null
}

export function validateArray(value: unknown, fieldName: string, options?: { minLength?: number }): string | null {
  if (!Array.isArray(value)) {
    return `${fieldName} must be an array`
  }
  if (options?.minLength && value.length < options.minLength) {
    return `${fieldName} must have at least ${options.minLength} items`
  }
  return null
}

// Validation schemas for CostCatch API routes

export function validateItemCreate(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = []

  // Required fields
  const nameError = validateRequired(body.name, 'name') || validateString(body.name, 'name', { minLength: 1, maxLength: 200 })
  if (nameError) errors.push(nameError)

  const unitError = validateRequired(body.unit, 'unit') || validateString(body.unit, 'unit', { minLength: 1, maxLength: 50 })
  if (unitError) errors.push(unitError)

  // Optional but must be valid if provided
  if (body.category_id !== undefined && body.category_id !== null) {
    const categoryError = validateUUID(body.category_id, 'category_id')
    if (categoryError) errors.push(categoryError)
  }

  if (body.vendor_id !== undefined && body.vendor_id !== null) {
    const vendorError = validateUUID(body.vendor_id, 'vendor_id')
    if (vendorError) errors.push(vendorError)
  }

  if (body.current_price !== undefined && body.current_price !== null) {
    const priceError = validateNumber(body.current_price, 'current_price', { min: 0 })
    if (priceError) errors.push(priceError)
  }

  if (body.par_level !== undefined && body.par_level !== null) {
    const parError = validateNumber(body.par_level, 'par_level', { min: 0 })
    if (parError) errors.push(parError)
  }

  return { valid: errors.length === 0, errors }
}

export function validateItemUpdate(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = []

  // ID is required
  const idError = validateRequired(body.id, 'id') || validateUUID(body.id, 'id')
  if (idError) errors.push(idError)

  // Optional fields validation
  if (body.name !== undefined) {
    const nameError = validateString(body.name, 'name', { minLength: 1, maxLength: 200 })
    if (nameError) errors.push(nameError)
  }

  if (body.unit !== undefined) {
    const unitError = validateString(body.unit, 'unit', { minLength: 1, maxLength: 50 })
    if (unitError) errors.push(unitError)
  }

  if (body.current_price !== undefined && body.current_price !== null) {
    const priceError = validateNumber(body.current_price, 'current_price', { min: 0 })
    if (priceError) errors.push(priceError)
  }

  return { valid: errors.length === 0, errors }
}

export function validateVendorCreate(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = []

  // Name is required
  const nameError = validateRequired(body.name, 'name') || validateString(body.name, 'name', { minLength: 1, maxLength: 200 })
  if (nameError) errors.push(nameError)

  // Optional fields
  if (body.contact_name !== undefined && body.contact_name !== null && body.contact_name !== '') {
    const contactError = validateString(body.contact_name, 'contact_name', { maxLength: 100 })
    if (contactError) errors.push(contactError)
  }

  if (body.email !== undefined && body.email !== null && body.email !== '') {
    const emailError = validateEmail(body.email, 'email')
    if (emailError) errors.push(emailError)
  }

  if (body.phone !== undefined && body.phone !== null && body.phone !== '') {
    const phoneError = validateString(body.phone, 'phone', { maxLength: 30 })
    if (phoneError) errors.push(phoneError)
  }

  return { valid: errors.length === 0, errors }
}

export function validateVendorUpdate(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = []

  // ID is required
  const idError = validateRequired(body.id, 'id') || validateUUID(body.id, 'id')
  if (idError) errors.push(idError)

  // Optional fields with validation
  if (body.name !== undefined) {
    const nameError = validateString(body.name, 'name', { minLength: 1, maxLength: 200 })
    if (nameError) errors.push(nameError)
  }

  if (body.email !== undefined && body.email !== null && body.email !== '') {
    const emailError = validateEmail(body.email, 'email')
    if (emailError) errors.push(emailError)
  }

  return { valid: errors.length === 0, errors }
}

export function validateCountCreate(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = []

  // Items array is required
  const itemsError = validateRequired(body.items, 'items') || validateArray(body.items, 'items', { minLength: 1 })
  if (itemsError) {
    errors.push(itemsError)
  } else if (Array.isArray(body.items)) {
    // Validate each item
    body.items.forEach((item: unknown, index: number) => {
      if (typeof item !== 'object' || item === null) {
        errors.push(`items[${index}] must be an object`)
        return
      }
      const itemObj = item as Record<string, unknown>

      const itemIdError = validateRequired(itemObj.item_id, `items[${index}].item_id`) || validateUUID(itemObj.item_id, `items[${index}].item_id`)
      if (itemIdError) errors.push(itemIdError)

      const quantityError = validateRequired(itemObj.quantity, `items[${index}].quantity`) || validateNumber(itemObj.quantity, `items[${index}].quantity`, { min: 0 })
      if (quantityError) errors.push(quantityError)
    })
  }

  // Optional date validation
  if (body.count_date !== undefined && body.count_date !== null) {
    const dateError = validateDate(body.count_date, 'count_date')
    if (dateError) errors.push(dateError)
  }

  return { valid: errors.length === 0, errors }
}

export function validateWasteCreate(body: Record<string, unknown>): ValidationResult {
  const errors: string[] = []

  // Required fields
  const itemIdError = validateRequired(body.item_id, 'item_id') || validateUUID(body.item_id, 'item_id')
  if (itemIdError) errors.push(itemIdError)

  const quantityError = validateRequired(body.quantity, 'quantity') || validateNumber(body.quantity, 'quantity', { min: 0 })
  if (quantityError) errors.push(quantityError)

  const reasonError = validateRequired(body.reason, 'reason') || validateString(body.reason, 'reason', { minLength: 1, maxLength: 100 })
  if (reasonError) errors.push(reasonError)

  // Optional notes
  if (body.notes !== undefined && body.notes !== null && body.notes !== '') {
    const notesError = validateString(body.notes, 'notes', { maxLength: 500 })
    if (notesError) errors.push(notesError)
  }

  return { valid: errors.length === 0, errors }
}
