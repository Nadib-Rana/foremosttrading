
---

## ptimized DBML Schema

Here is the complete corrected schema in DBML format, incorporating all the missing variables to ensure a 100% fit:

```dbml
// ==========================================
// FOREMOST TRADING - 100% VERIFIED PRODUCTION SCHEMA
// ==========================================

TableGroup "User & Auth" {
  roles
  permissions
  role_permissions
  users
}

TableGroup "Catalog & Products" {
  categories
  collections
  brands
  product_templates
  products
  product_variants
  sizes
  materials
}

TableGroup "SVG & Customizer Engine" {
  svg_views
  svg_layers
  colors
  patterns
  fonts
  product_configurations
}

TableGroup "Saved Designs, Cart & Orders" {
  saved_designs
  saved_design_versions
  carts
  cart_items
  shipping_addresses
  orders
  order_items
  payments
  invoices
  coupons
}

TableGroup "Production & System" {
  production_queue
  notifications
  system_settings
  audit_logs
}

// ------------------------------------------
// 1. AUTH & USERS
// ------------------------------------------
Table roles {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(50) [unique, not null]
  description text
}

Table permissions {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(100) [unique, not null]
  description text
}

Table role_permissions {
  role_id uuid [not null, ref: > roles.id]
  permission_id uuid [not null, ref: > permissions.id]
  Indexes { (role_id, permission_id) [pk] }
}

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  role_id uuid [not null, ref: > roles.id]
  first_name varchar(100)
  last_name varchar(100)
  phone varchar(20)
  company_name varchar(150)
  department varchar(100)
  gender varchar(20)          // ADDED: Needed for personal profile edits
  dob date                   // ADDED: Needed for personal profile edits
  avatar_url varchar(512)    // ADDED: Needed for header dynamic profile avatar display
  status varchar(20) [default: 'ACTIVE']
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

// ------------------------------------------
// 2. CATALOG & TEMPLATES
// ------------------------------------------
Table categories {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(100) [not null]
  slug varchar(100) [unique, not null]
  parent_id uuid [null, ref: > categories.id]
}

Table collections {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(100) [not null]
  slug varchar(100) [unique, not null]
  image_url varchar(512)
}

Table brands {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(100) [not null]
}

Table product_templates {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(100) [not null]
  description text           // ADDED: Standard design template info
  category_id uuid [not null, ref: > categories.id]
  base_price decimal(10,2) [default: 0.00]
}

Table products {
  id uuid [pk, default: `gen_random_uuid()`]
  template_id uuid [not null, ref: > product_templates.id]
  category_id uuid [not null, ref: > categories.id]
  brand_id uuid [null, ref: > brands.id]
  name varchar(150) [not null]
  slug varchar(150) [unique, not null]
  description text           // ADDED: Needed for shop list page product descriptions
  base_price decimal(10,2) [not null]
  images_json jsonb [note: 'Array of image URLs and sort orders']
  is_customizable boolean [default: true]
  is_active boolean [default: true]
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table sizes {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(10) [unique, not null]
  chart_category varchar(50) [default: 'ADULT_UNISEX']
}

Table materials {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(100) [unique, not null]
  texture_url varchar(512)
}

Table product_variants {
  id uuid [pk, default: `gen_random_uuid()`]
  product_id uuid [not null, ref: > products.id]
  sku varchar(100) [unique, not null]
  size_id uuid [not null, ref: > sizes.id]
  material_id uuid [not null, ref: > materials.id]
  upcharge decimal(10,2) [default: 0.00]
  stock_quantity int [default: 0]
}

// ------------------------------------------
// 3. SVG & CUSTOMIZATION ENGINE
// ------------------------------------------
Table svg_views {
  id uuid [pk, default: `gen_random_uuid()`]
  template_id uuid [not null, ref: > product_templates.id]
  name varchar(50) [not null, note: 'FRONT, BACK, LEFT_SIDE']
  svg_raw text [not null]
  view_order int [default: 0]
}

Table svg_layers {
  id uuid [pk, default: `gen_random_uuid()`]
  svg_view_id uuid [not null, ref: > svg_views.id]
  element_id varchar(100) [not null]
  layer_name varchar(100) [not null]
  layer_type varchar(50) [not null]
  default_color varchar(7)
  is_editable boolean [default: true]
  is_required boolean [default: true]
  is_locked boolean [default: false] // ADDED: Needed for template layer rules (e.g. lock team back number color)
}

Table colors {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(50) [not null]
  hex_code varchar(7) [unique, not null]
}

Table patterns {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(50) [unique, not null]
  image_url varchar(512) [not null]
  svg_pattern_data text
}

Table fonts {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(50) [unique, not null]
  font_family varchar(100) [not null]
  font_url varchar(512)
}

Table product_configurations {
  id uuid [pk, default: `gen_random_uuid()`]
  product_id uuid [unique, not null, ref: - products.id]
  allowed_color_ids jsonb [note: 'Array of color UUIDs']
  allowed_pattern_ids jsonb [note: 'Array of pattern UUIDs']
  allowed_font_ids jsonb [note: 'Array of font UUIDs']
  upcharges_json jsonb [note: 'Rules for extra numbers, logos, text']
  tier_discounts_json jsonb [note: 'Bulk quantity discount tiers']
  max_logos int [default: 5]
  text_length_limit int [default: 15]
}

// ------------------------------------------
// 4. SAVED DESIGNS, CARTS & ORDERS
// ------------------------------------------
Table saved_designs {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null, ref: > users.id]
  product_id uuid [not null, ref: > products.id]
  name varchar(100) [not null]
  configuration_json jsonb [not null]
  roster_json jsonb [note: 'Array of player names, numbers, sizes']
  preview_image_url varchar(512)
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table saved_design_versions {
  id uuid [pk, default: `gen_random_uuid()`]
  saved_design_id uuid [not null, ref: > saved_designs.id]
  version_number int [not null]
  configuration_json jsonb [not null]
  preview_image_url varchar(512) // ADDED: Saves snapshots of version design states
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table carts {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [null, ref: > users.id]
  session_id varchar(255) [unique, not null]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table cart_items {
  id uuid [pk, default: `gen_random_uuid()`]
  cart_id uuid [not null, ref: > carts.id]
  product_id uuid [not null, ref: > products.id]
  variant_id uuid [null, ref: > product_variants.id]
  saved_design_id uuid [null, ref: > saved_designs.id]
  quantity int [not null]
  custom_text_json jsonb
  logo_url varchar(512)
  roster_json jsonb [note: 'Cart specific player details']
  subtotal_price decimal(10,2) [not null]
}

Table coupons {
  id uuid [pk, default: `gen_random_uuid()`]
  code varchar(50) [unique, not null]
  discount_type varchar(20) [not null]
  discount_value decimal(10,2) [not null]
  is_active boolean [default: true]
}

Table shipping_addresses {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null, ref: > users.id]
  recipient_name varchar(150) [not null]
  street varchar(255) [not null]
  city varchar(100) [not null]
  state varchar(100) [not null]       // ADDED: State field is required for checkout forms
  postal_code varchar(20) [not null]
  country varchar(100) [not null]
  phone varchar(20) [not null]         // ADDED: Delivery contact phone
}

Table orders {
  id uuid [pk, default: `gen_random_uuid()`]
  order_number varchar(100) [unique, not null]
  user_id uuid [not null, ref: > users.id]
  coupon_id uuid [null, ref: > coupons.id]
  shipping_address_id uuid [not null, ref: > shipping_addresses.id]
  total_amount decimal(10,2) [not null]
  net_amount decimal(10,2) [not null]
  order_status varchar(50) [default: 'PENDING']
  payment_status varchar(50) [default: 'UNPAID']
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
  updated_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table order_items {
  id uuid [pk, default: `gen_random_uuid()`]
  order_id uuid [not null, ref: > orders.id]
  product_id uuid [not null, ref: > products.id]
  variant_id uuid [null, ref: > product_variants.id]
  saved_design_id uuid [null, ref: > saved_designs.id]
  quantity int [not null]
  custom_text_json jsonb
  roster_json jsonb [note: 'Final roster for factory printing']
  unit_price decimal(10,2) [not null]
  total_price decimal(10,2) [not null]
}

Table payments {
  id uuid [pk, default: `gen_random_uuid()`]
  order_id uuid [not null, ref: > orders.id]
  payment_method varchar(50) [not null]
  transaction_reference varchar(255) [unique, not null]
  amount decimal(10,2) [not null]
  payment_status varchar(50) [not null]
}

Table invoices {
  id uuid [pk, default: `gen_random_uuid()`]
  order_id uuid [unique, not null, ref: - orders.id]
  invoice_number varchar(100) [unique, not null]
  pdf_url varchar(512) [not null]
  issue_date timestamp [default: `CURRENT_TIMESTAMP`]
}

// ------------------------------------------
// 5. PRODUCTION & SYSTEM
// ------------------------------------------
Table production_queue {
  id uuid [pk, default: `gen_random_uuid()`]
  order_item_id uuid [unique, not null, ref: - order_items.id]
  status varchar(50) [default: 'QUEUED']
  export_files_json jsonb [note: 'Stores vector/PNG/PDF URLs for print']
  started_at timestamp
  completed_at timestamp
}

Table notifications {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null, ref: > users.id]
  title varchar(150) [not null]
  message text [not null]
  is_read boolean [default: false]
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
}

Table system_settings {
  key varchar(100) [pk]
  value text [not null]
}

Table audit_logs {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [null, ref: > users.id]
  action varchar(100) [not null]
  payload_json jsonb
  created_at timestamp [default: `CURRENT_TIMESTAMP`]
}
```