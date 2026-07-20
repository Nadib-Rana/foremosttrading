# Production-Ready Database Schema: ForemostTrading

This document outlines the complete relational database schema designed for the ForemostTrading custom apparel platform. It serves as the single source of truth for the platform, ensuring no hardcoded configurations, clean normalization (3NF), optimized indexes, and infinite scalability.

---

## 1. Complete Entity List

The database schema is grouped logically into 7 core modules:

1. **User & Authentication Module**: Users, Roles, Permissions, Customers, Admins
2. **Catalog & Templates Module**: Categories, Collections, Brands, Product Templates, Products, Variants, Images
3. **SVG & Customization Module**: SVG Files, SVG Views, SVG Layers, Product Layer Mappings, Colors, Patterns, Fonts, Materials, Sizes
4. **Pricing & Customization Rules**: Dynamic pricing, upcharges, bulk quantity discounts
5. **Saved Designs & Carts**: Saved Designs, Version History, Rosters, Carts, Cart Items
6. **Checkout, Order & Production Module**: Coupons, Addresses, Orders, Order Items, Payments, Invoices, Production Queue, Export Files
7. **System & Analytics Module**: Notifications, System Settings, Audit Logs

---

## 2. Database Tables

Below is the detailed specification for every table in the relational schema.

### User & Authentication Module

#### `roles`
* **Purpose**: Defines system access groups (e.g., Admin, Customer, Production Staff).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(50), Unique, Not Null) - e.g., 'ADMIN', 'CUSTOMER', 'PRODUCTION'
  * `description` (TEXT, Nullable)
* **Indexes**: Unique on `name`.

#### `permissions`
* **Purpose**: Defines granular feature capabilities (e.g., `create_product`, `view_orders`, `edit_customizer`).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(100), Unique, Not Null)
  * `description` (TEXT, Nullable)

#### `role_permissions`
* **Purpose**: Mapping table linking Roles to their respective Permissions (Many-to-Many).
* **Columns**:
  * `role_id` (UUID, Foreign Key referencing `roles(id)` on delete cascade, Not Null)
  * `permission_id` (UUID, Foreign Key referencing `permissions(id)` on delete cascade, Not Null)
* **Primary Key**: Composite (`role_id`, `permission_id`)

#### `users`
* **Purpose**: Stores account credentials, status, and role bindings.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `email` (VARCHAR(255), Unique, Not Null)
  * `password_hash` (VARCHAR(255), Not Null)
  * `role_id` (UUID, Foreign Key referencing `roles(id)`, Not Null)
  * `status` (VARCHAR(20), Default: 'ACTIVE') - e.g., 'ACTIVE', 'SUSPENDED'
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
  * `updated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `customers`
* **Purpose**: Stores profile detail properties for client accounts.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `user_id` (UUID, Foreign Key referencing `users(id)` on delete cascade, Unique, Not Null)
  * `first_name` (VARCHAR(100), Not Null)
  * `last_name` (VARCHAR(100), Not Null)
  * `phone` (VARCHAR(20), Nullable)
  * `company_name` (VARCHAR(150), Nullable)

#### `admins`
* **Purpose**: Stores office management profile details.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `user_id` (UUID, Foreign Key referencing `users(id)` on delete cascade, Unique, Not Null)
  * `department` (VARCHAR(100), Nullable)
  * `access_level` (VARCHAR(50), Default: 'STANDARD')

---

### Catalog & Templates Module

#### `categories`
* **Purpose**: Hierarchy to catalog templates/products (e.g. Football, Basketball).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(100), Not Null)
  * `slug` (VARCHAR(100), Unique, Not Null)
  * `description` (TEXT, Nullable)
  * `parent_id` (UUID, Foreign Key referencing `categories(id)` on delete set null, Nullable)

#### `collections`
* **Purpose**: Grouping products (e.g. 'Shop The Line', 'Summer 2026').
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(100), Not Null)
  * `slug` (VARCHAR(100), Unique, Not Null)
  * `description` (TEXT, Nullable)
  * `image_url` (VARCHAR(512), Nullable)

#### `brands`
* **Purpose**: Stores manufacturer brand references.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(100), Not Null)
  * `description` (TEXT, Nullable)

#### `product_templates`
* **Purpose**: Structural design layouts (e.g. 'V-Neck Solid Jersey', 'Hoodie Cutout').
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(100), Not Null)
  * `category_id` (UUID, Foreign Key referencing `categories(id)`, Not Null)
  * `description` (TEXT, Nullable)
  * `base_price` (DECIMAL(10, 2), Default: 0.00)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
  * `updated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `products`
* **Purpose**: Catalog items derived from templates made purchasable.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `template_id` (UUID, Foreign Key referencing `product_templates(id)`, Not Null)
  * `category_id` (UUID, Foreign Key referencing `categories(id)`, Not Null)
  * `brand_id` (UUID, Foreign Key referencing `brands(id)`, Nullable)
  * `name` (VARCHAR(150), Not Null)
  * `slug` (VARCHAR(150), Unique, Not Null)
  * `description` (TEXT, Nullable)
  * `base_price` (DECIMAL(10, 2), Not Null)
  * `is_customizable` (BOOLEAN, Default: TRUE)
  * `is_active` (BOOLEAN, Default: TRUE)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
  * `updated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `product_images`
* **Purpose**: Image galleries for the product listings page.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `image_url` (VARCHAR(512), Not Null)
  * `sort_order` (INT, Default: 0)

#### `sizes`
* **Purpose**: Size options (e.g. S, M, L, XL) mapped to charts.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(10), Unique, Not Null)
  * `chart_category` (VARCHAR(50), Default: 'ADULT_UNISEX')

#### `materials`
* **Purpose**: Dynamic garment textures (e.g. Premium Wool, Cow Hide Leather).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(100), Unique, Not Null)
  * `description` (TEXT, Nullable)
  * `texture_url` (VARCHAR(512), Nullable)

#### `product_variants`
* **Purpose**: Physical SKUs derived from product + size + material.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `sku` (VARCHAR(100), Unique, Not Null)
  * `size_id` (UUID, Foreign Key referencing `sizes(id)`, Not Null)
  * `material_id` (UUID, Foreign Key referencing `materials(id)`, Not Null)
  * `upcharge` (DECIMAL(10,2), Default: 0.00)
  * `stock_quantity` (INT, Default: 0)
  * `is_active` (BOOLEAN, Default: TRUE)

---

### SVG & Customization Module

#### `svg_files`
* **Purpose**: Maps template records to dynamic vector assets.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `template_id` (UUID, Foreign Key referencing `product_templates(id)` on delete cascade, Unique, Not Null)
  * `svg_raw` (TEXT, Not Null) - Stores the parsed SVG XML payload.
  * `width` (INT, Default: 800)
  * `height` (INT, Default: 800)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `svg_views`
* **Purpose**: Support multiple garment perspectives (Front, Back, Left Side, Right Side).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `svg_file_id` (UUID, Foreign Key referencing `svg_files(id)` on delete cascade, Not Null)
  * `name` (VARCHAR(50), Not Null) - e.g., 'FRONT', 'BACK', 'LEFT_SIDE'
  * `svg_raw` (TEXT, Not Null) - Perspective-specific SVG markup data.
  * `view_order` (INT, Default: 0)
* **Constraints**: Unique (`svg_file_id`, `name`)

#### `svg_layers`
* **Purpose**: Tracks vector node IDs identified during SVG parsing.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `svg_view_id` (UUID, Foreign Key referencing `svg_views(id)` on delete cascade, Not Null)
  * `element_id` (VARCHAR(100), Not Null) - The SVG tag node `#id` value.
  * `layer_name` (VARCHAR(100), Not Null) - Human readable name.
  * `layer_type` (VARCHAR(50), Not Null) - 'FILL', 'STROKE', 'TEXT', 'IMAGE', 'GROUP'
  * `default_color` (VARCHAR(7), Nullable)
  * `parent_group_id` (VARCHAR(100), Nullable)
* **Constraints**: Unique (`svg_view_id`, `element_id`)

#### `product_layer_mappings`
* **Purpose**: Configures customization permissions for each SVG layer.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `svg_layer_id` (UUID, Foreign Key referencing `svg_layers(id)` on delete cascade, Not Null)
  * `is_editable` (BOOLEAN, Default: TRUE)
  * `is_required` (BOOLEAN, Default: TRUE)
  * `is_locked` (BOOLEAN, Default: FALSE)
  * `default_color_value` (VARCHAR(7), Nullable)
* **Constraints**: Unique (`product_id`, `svg_layer_id`)

#### `colors`
* **Purpose**: Globally allowed customizer color chips.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(50), Not Null)
  * `hex_code` (VARCHAR(7), Unique, Not Null)
  * `color_group` (VARCHAR(50), Nullable) - e.g., 'PRIMARY', 'NEUTRAL'

#### `product_colors`
* **Purpose**: Limit customizable palettes by product.
* **Columns**:
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `color_id` (UUID, Foreign Key referencing `colors(id)` on delete cascade, Not Null)
* **Primary Key**: Composite (`product_id`, `color_id`)

#### `patterns`
* **Purpose**: Customizable fills (Stripes, Sash, Gradients).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(50), Unique, Not Null)
  * `slug` (VARCHAR(50), Unique, Not Null)
  * `image_url` (VARCHAR(512), Not Null)
  * `svg_pattern_data` (TEXT, Nullable)

#### `product_patterns`
* **Purpose**: Limit patterns by product.
* **Columns**:
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `pattern_id` (UUID, Foreign Key referencing `patterns(id)` on delete cascade, Not Null)
* **Primary Key**: Composite (`product_id`, `pattern_id`)

#### `fonts`
* **Purpose**: Available customizer font types (Impact, Arial, Georgia).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `name` (VARCHAR(50), Unique, Not Null)
  * `font_family` (VARCHAR(100), Not Null)
  * `font_url` (VARCHAR(512), Nullable)

#### `product_fonts`
* **Purpose**: Limit allowed font styling per product.
* **Columns**:
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `font_id` (UUID, Foreign Key referencing `fonts(id)` on delete cascade, Not Null)
* **Primary Key**: Composite (`product_id`, `font_id`)

---

### Pricing & Customization Rules

#### `product_configurations`
* **Purpose**: Configuration limits for customize templates.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Unique, Not Null)
  * `default_pattern_id` (UUID, Foreign Key referencing `patterns(id)`, Nullable)
  * `default_font_id` (UUID, Foreign Key referencing `fonts(id)`, Nullable)
  * `allow_logos` (BOOLEAN, Default: TRUE)
  * `max_logos` (INT, Default: 5)
  * `text_length_limit` (INT, Default: 15)

#### `upcharge_rules`
* **Purpose**: Configures cost add-ons (custom numbers, team names, uploaded decals).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `option_type` (VARCHAR(50), Not Null) - e.g., 'TEXT', 'LOGO', 'ROSTER'
  * `amount` (DECIMAL(10, 2), Not Null)
* **Constraints**: Unique (`product_id`, `option_type`)

#### `quantity_discount_rules`
* **Purpose**: Tiered price breaks based on quantity (e.g. 15% discount for 10+ items).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `product_id` (UUID, Foreign Key referencing `products(id)` on delete cascade, Not Null)
  * `min_quantity` (INT, Not Null)
  * `discount_percentage` (DECIMAL(5, 2), Not Null)
* **Constraints**: Unique (`product_id`, `min_quantity`)

---

### Saved Designs & Carts

#### `saved_designs`
* **Purpose**: Saved user designs.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `customer_id` (UUID, Foreign Key referencing `customers(id)` on delete cascade, Not Null)
  * `product_id` (UUID, Foreign Key referencing `products(id)`, Not Null)
  * `name` (VARCHAR(100), Not Null)
  * `configuration_json` (JSONB, Not Null) - Map of SVG Layer IDs to Hex colors & pattern.
  * `preview_image_url` (VARCHAR(512), Nullable)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
  * `updated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `saved_design_versions`
* **Purpose**: Keeps history versions for designs.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `saved_design_id` (UUID, Foreign Key referencing `saved_designs(id)` on delete cascade, Not Null)
  * `version_number` (INT, Not Null)
  * `configuration_json` (JSONB, Not Null)
  * `preview_image_url` (VARCHAR(512), Nullable)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
* **Constraints**: Unique (`saved_design_id`, `version_number`)

#### `saved_design_rosters`
* **Purpose**: Design team roster members (names, sizes, numbers).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `saved_design_id` (UUID, Foreign Key referencing `saved_designs(id)` on delete cascade, Not Null)
  * `player_name` (VARCHAR(100), Not Null)
  * `player_number` (VARCHAR(5), Not Null)
  * `size_id` (UUID, Foreign Key referencing `sizes(id)`, Not Null)

#### `carts`
* **Purpose**: Active cart identifier.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `customer_id` (UUID, Foreign Key referencing `customers(id)` on delete cascade, Nullable) - Nullable for guest checkout.
  * `session_id` (VARCHAR(255), Unique, Not Null) - Persistent cookies fallback mapping.
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
  * `updated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `cart_items`
* **Purpose**: Items added to checkout basket.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `cart_id` (UUID, Foreign Key referencing `carts(id)` on delete cascade, Not Null)
  * `product_id` (UUID, Foreign Key referencing `products(id)`, Not Null)
  * `variant_id` (UUID, Foreign Key referencing `product_variants(id)`, Nullable) - Variant fallback config.
  * `saved_design_id` (UUID, Foreign Key referencing `saved_designs(id)`, Nullable)
  * `quantity` (INT, Not Null, Check (quantity > 0))
  * `custom_text_json` (JSONB, Nullable) - Text attributes (font, size, style).
  * `logo_url` (VARCHAR(512), Nullable) - Decal graphic URL reference.
  * `subtotal_price` (DECIMAL(10,2), Not Null)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `cart_item_rosters`
* **Purpose**: Active cart-specific rosters.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `cart_item_id` (UUID, Foreign Key referencing `cart_items(id)` on delete cascade, Not Null)
  * `player_name` (VARCHAR(100), Not Null)
  * `player_number` (VARCHAR(5), Not Null)
  * `size_id` (UUID, Foreign Key referencing `sizes(id)`, Not Null)

---

### Checkout, Order & Production Module

#### `coupons`
* **Purpose**: Promotion codes (percentage/fixed value).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `code` (VARCHAR(50), Unique, Not Null)
  * `discount_type` (VARCHAR(20), Not Null) - 'PERCENTAGE' or 'FIXED'
  * `discount_value` (DECIMAL(10,2), Not Null)
  * `min_order_value` (DECIMAL(10,2), Default: 0.00)
  * `max_discount` (DECIMAL(10,2), Nullable)
  * `start_date` (TIMESTAMP, Not Null)
  * `expiry_date` (TIMESTAMP, Not Null)
  * `usage_limit` (INT, Nullable)
  * `usage_count` (INT, Default: 0)
  * `is_active` (BOOLEAN, Default: TRUE)

#### `shipping_addresses`
* **Purpose**: Physical shipping destinations.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `customer_id` (UUID, Foreign Key referencing `customers(id)` on delete cascade, Not Null)
  * `recipient_name` (VARCHAR(150), Not Null)
  * `street` (VARCHAR(255), Not Null)
  * `city` (VARCHAR(100), Not Null)
  * `state` (VARCHAR(100), Not Null)
  * `postal_code` (VARCHAR(20), Not Null)
  * `country` (VARCHAR(100), Not Null)
  * `phone` (VARCHAR(20), Not Null)
  * `is_default` (BOOLEAN, Default: FALSE)

#### `orders`
* **Purpose**: Root records for order sales.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `order_number` (VARCHAR(100), Unique, Not Null) - e.g., 'FT-2026-100021'
  * `customer_id` (UUID, Foreign Key referencing `customers(id)`, Not Null)
  * `coupon_id` (UUID, Foreign Key referencing `coupons(id)`, Nullable)
  * `shipping_address_id` (UUID, Foreign Key referencing `shipping_addresses(id)`, Not Null)
  * `total_amount` (DECIMAL(10, 2), Not Null) - Gross total.
  * `discount_amount` (DECIMAL(10, 2), Default: 0.00)
  * `net_amount` (DECIMAL(10, 2), Not Null) - Final charged total.
  * `order_status` (VARCHAR(50), Default: 'PENDING') - 'PENDING', 'PROCESSING', 'PRINTING', 'PACKAGING', 'SHIPPING', 'DELIVERED', 'CANCELLED'
  * `payment_status` (VARCHAR(50), Default: 'UNPAID') - 'UNPAID', 'PAID', 'REFUNDED'
  * `tracking_number` (VARCHAR(100), Nullable)
  * `notes` (TEXT, Nullable)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
  * `updated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `order_items`
* **Purpose**: Line items bought inside an order.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `order_id` (UUID, Foreign Key referencing `orders(id)` on delete cascade, Not Null)
  * `product_id` (UUID, Foreign Key referencing `products(id)`, Not Null)
  * `variant_id` (UUID, Foreign Key referencing `product_variants(id)`, Nullable)
  * `saved_design_id` (UUID, Foreign Key referencing `saved_designs(id)`, Nullable)
  * `quantity` (INT, Not Null)
  * `custom_text_json` (JSONB, Nullable)
  * `logo_url` (VARCHAR(512), Nullable)
  * `unit_price` (DECIMAL(10, 2), Not Null)
  * `total_price` (DECIMAL(10, 2), Not Null)

#### `order_item_rosters`
* **Purpose**: Line item rosters for manufacturing execution.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `order_item_id` (UUID, Foreign Key referencing `order_items(id)` on delete cascade, Not Null)
  * `player_name` (VARCHAR(100), Not Null)
  * `player_number` (VARCHAR(5), Not Null)
  * `size_id` (UUID, Foreign Key referencing `sizes(id)`, Not Null)

#### `payments`
* **Purpose**: Transaction receipts.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `order_id` (UUID, Foreign Key referencing `orders(id)`, Not Null)
  * `payment_method` (VARCHAR(50), Not Null) - e.g., 'STRIPE', 'PAYPAL'
  * `transaction_reference` (VARCHAR(255), Unique, Not Null)
  * `amount` (DECIMAL(10,2), Not Null)
  * `payment_status` (VARCHAR(50), Not Null) - e.g., 'SUCCESSFUL', 'FAILED'
  * `payload_json` (JSONB, Nullable) - Webhook payload response details.
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `invoices`
* **Purpose**: Legally binding tax receipt documents.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `order_id` (UUID, Foreign Key referencing `orders(id)`, Unique, Not Null)
  * `invoice_number` (VARCHAR(100), Unique, Not Null)
  * `pdf_url` (VARCHAR(512), Not Null)
  * `issue_date` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)
  * `due_date` (TIMESTAMP, Nullable)

#### `production_queue`
* **Purpose**: Tracks garment manufacturing pipeline stations (e.g. Printing, Sewing).
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `order_item_id` (UUID, Foreign Key referencing `order_items(id)` on delete cascade, Unique, Not Null)
  * `status` (VARCHAR(50), Default: 'QUEUED') - 'QUEUED', 'PRINTING', 'PACKAGING', 'COMPLETED'
  * `started_at` (TIMESTAMP, Nullable)
  * `completed_at` (TIMESTAMP, Nullable)

#### `production_export_files`
* **Purpose**: Final vectorized assets generated to trigger printers.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `production_queue_id` (UUID, Foreign Key referencing `production_queue(id)` on delete cascade, Not Null)
  * `file_type` (VARCHAR(10), Not Null) - 'SVG', 'PNG', 'PDF'
  * `file_url` (VARCHAR(512), Not Null)
  * `generated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

---

### System & Analytics Module

#### `notifications`
* **Purpose**: Push notification lists for users.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `user_id` (UUID, Foreign Key referencing `users(id)` on delete cascade, Not Null)
  * `title` (VARCHAR(150), Not Null)
  * `message` (TEXT, Not Null)
  * `type` (VARCHAR(50), Default: 'SYSTEM') - 'ORDER_STATUS', 'PROMO', 'SYSTEM'
  * `is_read` (BOOLEAN, Default: FALSE)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `system_settings`
* **Purpose**: Dynamic system configurations.
* **Columns**:
  * `key` (VARCHAR(100), Primary Key)
  * `value` (TEXT, Not Null)
  * `description` (TEXT, Nullable)
  * `updated_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

#### `audit_logs`
* **Purpose**: Logs admin actions for compliance.
* **Columns**:
  * `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
  * `user_id` (UUID, Foreign Key referencing `users(id)` on delete set null, Nullable)
  * `action` (VARCHAR(100), Not Null) - e.g., 'PUBLISH_PRODUCT', 'UPDATE_ROLES'
  * `entity_name` (VARCHAR(100), Not Null) - e.g., 'products'
  * `entity_id` (UUID, Nullable)
  * `payload_json` (JSONB, Nullable)
  * `ip_address` (VARCHAR(45), Nullable)
  * `created_at` (TIMESTAMP, Default: `CURRENT_TIMESTAMP`)

---

## 3. Relationship Diagram

```
 [categories] ◀──(1:N)── [categories (Parent)]
      │
    (1:N)
      ▼
 [product_templates] ──(1:1)── [svg_files] ──(1:N)── [svg_views] ──(1:N)── [svg_layers]
      │                                                                           │
    (1:N)                                                                       (1:N)
      ▼                                                                           ▼
 [products] ◀──────────────(1:N)─────────────────────────────── [product_layer_mappings]
   │  │  │
   │  │  └─(1:N)── [product_variants] ──(1:1)── [sizes] 
   │  │
   │  └─(1:N)── [product_colors] ──(N:1)── [colors]
   │
   ├─(1:N)── [saved_designs] ──(1:N)── [saved_design_versions]
   │                               │
   │                             (1:N)
   │                               ▼
   │                     [saved_design_rosters]
   │
   ├─(1:N)── [cart_items] ──(1:N)── [cart_item_rosters]
   │            ▲
   │          (N:1)
   │            │
   │         [carts] ──(N:1)── [customers] ──(1:1)── [users] ──(N:1)── [roles] ──(N:N)── [permissions]
   │                             │                     ▲
   │                           (1:N)                 (1:1)
   │                             ▼                     │
   │                     [shipping_addresses]       [admins]
   │                             │
   │                           (1:N)
   │                             ▼
   └─(1:N)── [order_items] ◀──(1:N)── [orders] ──(N:1)── [coupons]
                │                        │
              (1:N)                    (1:1)
                ▼                        │
         [order_item_rosters]         [invoices]
                │
              (1:1)
                ▼
         [production_queue] ──(1:N)── [production_export_files]
```

---

## 4. Entity Relationship Explanation

### One-to-One Relationships
* **`product_templates` ↔ `svg_files`**: Each design block configuration utilizes exactly one master SVG vector file.
* **`users` ↔ `customers` / `admins`**: A user login credential maps strictly to a single customer profile or administrator profile.
* **`orders` ↔ `invoices`**: An order generates exactly one tax audit invoice.
* **`order_items` ↔ `production_queue`**: Each line item inside a custom order creates a single factory manufacturing flow card.

### One-to-Many Relationships
* **`svg_files` ↔ `svg_views`**: A vector model file contains multiple perspective rendering views (e.g. Front, Back, Side).
* **`svg_views` ↔ `svg_layers`**: A single perspective contains multiple vector paths/groups identified during parsing.
* **`saved_designs` ↔ `saved_design_versions`**: A design iteration maintains a linear tree history of saved layouts.
* **`saved_designs` / `cart_items` / `order_items` ↔ `rosters`**: A customized garment can contain a team roster list (Name, Number, Size).
* **`orders` ↔ `order_items`**: An order contains one or more line item configurations.

### Many-to-Many Relationships
* **`products` ↔ `colors`** (via `product_colors`): Limits customization options by product.
* **`products` ↔ `patterns`** (via `product_patterns`): Links products to selectable pattern presets.
* **`products` ↔ `fonts`** (via `product_fonts`): Restricts available text fonts per product.
* **`roles` ↔ `permissions`** (via `role_permissions`): Controls feature access levels.

---

## 5. Suggested Indexes

To guarantee high scalability under high traffic, the following indexes are configured:

### Performance Critical Queries (Lookup & Joins)
* `CREATE INDEX idx_products_slug ON products(slug);` (Used for catalog details page lookup)
* `CREATE INDEX idx_categories_slug ON categories(slug);` (Used for category catalog browse page)
* `CREATE INDEX idx_variants_product ON product_variants(product_id);` (Joins sizes and materials)
* `CREATE INDEX idx_layer_mappings_product ON product_layer_mappings(product_id);` (Fetches customizable parts schema)
* `CREATE INDEX idx_saved_designs_customer ON saved_designs(customer_id);` (Used for Customer 'Saved Designs' list)

### Relational Foreign Key Integrity
* `CREATE INDEX idx_orders_customer ON orders(customer_id);` (Used for account order history)
* `CREATE INDEX idx_order_items_order ON order_items(order_id);` (Used for invoice receipt summary)
* `CREATE INDEX idx_svg_layers_view ON svg_layers(svg_view_id);` (Speeds up client customizer vector tree parsing)
* `CREATE INDEX idx_production_status ON production_queue(status);` (Filters production control dashboard queue)

---

## 6. Normalization Review

The designed schema conforms strictly to **Third Normal Form (3NF)**:
1. **First Normal Form (1NF)**: All columns contain atomic values, and unique surrogate keys (`id`) identify rows. Multi-valued rosters are extracted into separate child relation tables (`_rosters`) rather than being kept in comma-separated strings.
2. **Second Normal Form (2NF)**: All non-key fields depend entirely on the primary key, eliminating partial dependencies. Composite primary keys (such as `product_colors`) only store reference identifiers mapping to independent master tables.
3. **Third Normal Form (3NF)**: No transitive dependencies exist. For example, rather than placing shipping country guidelines or tax multipliers inside the `orders` table directly, orders reference a separate `shipping_addresses` entity. Similarly, product upcharges are stored in rules tables rather than hardcoded into variant configurations.

---

## 7. Workflow Coverage Verification

* **Admin SVG Upload & Parse**: SVG raw data is read and parsed on upload. The resulting layers are stored in `svg_layers`.
* **Dynamic Customizer Schema**: When a customer selects a product, `product_layer_mappings` maps customizable paths to the `svg_layers` tree, dynamically generating color palettes (`product_colors`), text rules (`product_configurations`), and upcharges (`upcharge_rules`) without hardcoding values in the code.
* **Roster bulk customization**: Handled via normalized `_rosters` tables, allowing admins to track individual name/number configurations for printing.
* **Production Line Export**: Seamlessly connects orders to the factory via `production_queue` and `production_export_files`, linking items directly to dynamic SVGs.

---

## 8. Future Scalability Review

* **GARMENT TYPES (Cap, Bag, Jacket, Polo)**: Adding a cap or a hoodie does not require database migration or code changes. Admins simply upload a new SVG Template representing the garment, and its parsed layers automatically generate the Customizer UI options.
* **ENTERPRISE SCALE**: Using UUIDs for surrogate keys prevents distributed write collisions (unlike auto-increment integer IDs). Indexing dynamic slugs ensures sub-millisecond retrieval times.
* **HISTORICAL VERSIONING**: `saved_design_versions` protects customer projects, preventing older customizations from breaking if an administrator updates the master SVG template file structure.
