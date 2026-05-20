import { z } from "zod"

export const createTenantSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug só pode conter letras minúsculas, números e hífens"),
  planId: z.string().optional(),
  userEmail: z.string().email("Email inválido"),
  userName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  userPassword: z.string().min(8, "Password deve ter pelo menos 8 caracteres"),
})

export const updateTenantSchema = z.object({
  name: z.string().min(2).optional(),
  planId: z.string().optional(),
  status: z.enum(["ACTIVE", "SUSPENDED", "TRIAL"]).optional(),
})

export const updateWebsiteContentSchema = z.object({
  contents: z.record(z.string(), z.string()),
})

export const createEventSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  date: z.string().datetime(),
  price: z.number().optional(),
  capacity: z.number().optional(),
  imageUrl: z.string().url().optional(),
})

export const createSocialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url("URL inválido"),
  icon: z.string().min(1),
  order: z.number().default(0),
})

export const createMenuItemSchema = z.object({
  category:    z.string().min(1),
  name:        z.string().min(1),
  description: z.string().optional(),
  price:       z.number().min(0),
  badge:       z.string().optional(),
  imageUrl:    z.string().url().optional().or(z.literal("")),
  isVegetarian: z.boolean().default(false),
  isAvailable:  z.boolean().default(true),
  order:        z.number().default(0),
})

export const updateMenuItemSchema = createMenuItemSchema.partial()

export const updateWebsiteFeaturesSchema = z.object({
  hasEvents:       z.boolean().optional(),
  hasSocial:       z.boolean().optional(),
  hasMenu:         z.boolean().optional(),
  hasReservations: z.boolean().optional(),
})

export type CreateTenantInput = z.infer<typeof createTenantSchema>
export type UpdateTenantInput = z.infer<typeof updateTenantSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type CreateSocialLinkInput = z.infer<typeof createSocialLinkSchema>
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>
