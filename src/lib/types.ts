import { FintechCompany, Product, FintechStatus, ProductStatus, User, UserRole } from '../generated/prisma'

export type { FintechCompany, Product, FintechStatus, ProductStatus, User, UserRole }

export interface FintechCompanyWithProducts extends FintechCompany {
  products: Product[]
}

export interface CreateFintechCompanyData {
  name: string
  address: string
  contactPersonPhoneNumber: string
  contactAddress: string
  status: FintechStatus
  createdById?: number
}

export interface CreateUserData {
  email: string
  name: string
  password: string
  role: UserRole
  createdBy?: number
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: number
  isActive?: boolean
}

export interface UpdateFintechCompanyData extends Partial<CreateFintechCompanyData> {
  id: number
}

export interface CreateProductData {
  productName: string
  productDescription: string
  strength: string
  weakness: string
  status: ProductStatus
  fintechCompanyId: number
  createdById?: number
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number
}

export const FINTECH_STATUS_LABELS: Record<FintechStatus, string> = {
  NEW: 'New',
  ENGAGED: 'Engaged',
  RETIRED: 'Retired'
}

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  NEW: 'New',
  INPROGRESS: 'In Progress',
  DONE: 'Done'
}

export const FINTECH_STATUS_COLORS: Record<FintechStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  ENGAGED: 'bg-green-100 text-green-800',
  RETIRED: 'bg-gray-100 text-gray-800'
}

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  INPROGRESS: 'bg-yellow-100 text-yellow-800',
  DONE: 'bg-green-100 text-green-800'
}
