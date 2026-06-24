import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Temporary one-shot product import route — remove after execution
// GET /api/import-products?key=<service_role_jwt>

const PROJECT_REF  = 'qyvhkpyshkvogdcsbzst'
const REST_API_URL = `https://${PROJECT_REF}.supabase.co/rest/v1`
export const dynamic = 'force-dynamic'

const PRODUCTS = [
  {
    "slug": "iphone-17",
    "brand": "apple",
    "name": "iPhone 17",
    "description": "Pourquoi choisir l’iPhone 17  💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir l’iPhone 17  📸 Appareil photo avancé pour des photos et vidéos nettes au quotidien ⚡ Puce ultra fluide idéale pour les réseaux sociaux, le multitâche et le gaming ✨ Design premium avec écran immersif et finitions élégantes 🔋 Excellente autonomie avec recharge rapide et efficace Un smartphone moderne et performant pensé pour offrir une expér",
    "specs": {
      "Ecran": "6,1 po OLED Super Retina XDR",
      "Puce": "Apple A18",
      "Camera": "48 Mpx + 12 Mpx",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "IP17-BLK-256",
        "price": 1079.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "256 Go",
        "sku": "IP17-VIO-256",
        "price": 1079.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "256 Go",
        "sku": "IP17-WHT-256",
        "price": 1079.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "256 Go",
        "sku": "IP17-BLU-256",
        "price": 1079.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert",
        "color_hex": "#22c55e",
        "storage": "256 Go",
        "sku": "IP17-GRN-256",
        "price": 1079.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-a37",
    "brand": "samsung",
    "name": "Samsung Galaxy A37",
    "description": "Samsung Galaxy A37 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir le Samsung Galaxy A37 ? 📸 Appareil photo polyvalent pour capturer chaque moment ⚡ Performance fluide pour le quotidien, streaming & réseaux sociaux✨ Écran immersif avec design moderne et élégant🔋 Batterie longue durée avec charge rapide   Un smartphone fiable et équilibré conçu pour offrir confort et simplicité au quotidien. ━━━━━━━━━━━━━━ ✔️ Smartphon",
    "specs": {
      "Ecran": "6,5 po FHD+ AMOLED 90 Hz",
      "Puce": "Exynos 1280",
      "Camera": "50 Mpx",
      "Camera frontale": "13 Mpx",
      "5G": "Oui",
      "Resistance": "IP54"
    },
    "is_new": false,
    "is_bestseller": false,
    "badge": null,
    "variants": [
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "128 Go",
        "sku": "SGA37-BLK-128",
        "price": 439.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "128 Go",
        "sku": "SGA37-WHT-128",
        "price": 439.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "128 Go",
        "sku": "SGA37-VIO-128",
        "price": 439.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert",
        "color_hex": "#22c55e",
        "storage": "128 Go",
        "sku": "SGA37-GRN-128",
        "price": 439.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "SGA37-BLK-256",
        "price": 479.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "256 Go",
        "sku": "SGA37-WHT-256",
        "price": 479.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "256 Go",
        "sku": "SGA37-VIO-256",
        "price": 479.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert",
        "color_hex": "#22c55e",
        "storage": "256 Go",
        "sku": "SGA37-GRN-256",
        "price": 479.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-a57",
    "brand": "samsung",
    "name": "Samsung Galaxy A57",
    "description": "Samsung Galaxy A57 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir le Samsung Galaxy A57 ? 📸 Photos nettes et lumineuses au quotidien ⚡ Performance fluide pour le multitâche, jeux & réseaux sociaux ✨ Grand écran Super AMOLED 120 Hz ultra immersif 🔋 Excellente autonomie avec charge rapide 45 W 🛡️ Design premium résistant à l’eau et à la poussière (IP68) Un smartphone moderne conçu pour offrir confort, fluidité et fiab",
    "specs": {
      "Ecran": "6,7 po FHD+ AMOLED 120 Hz",
      "Puce": "Exynos 1380",
      "Camera": "64 Mpx",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP67"
    },
    "is_new": false,
    "is_bestseller": false,
    "badge": null,
    "variants": [
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "128 Go",
        "sku": "SGA57-BLU-128",
        "price": 499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "128 Go",
        "sku": "SGA57-GRY-128",
        "price": 499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu clair",
        "color_hex": "#93c5fd",
        "storage": "128 Go",
        "sku": "SGA57-BCL-128",
        "price": 499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Lavande",
        "color_hex": "#c3aed6",
        "storage": "128 Go",
        "sku": "SGA57-LAV-128",
        "price": 499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "256 Go",
        "sku": "SGA57-BLU-256",
        "price": 549.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "256 Go",
        "sku": "SGA57-GRY-256",
        "price": 549.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu clair",
        "color_hex": "#93c5fd",
        "storage": "256 Go",
        "sku": "SGA57-BCL-256",
        "price": 549.0,
        "compare_at_price": null
      },
      {
        "color_name": "Lavande",
        "color_hex": "#c3aed6",
        "storage": "256 Go",
        "sku": "SGA57-LAV-256",
        "price": 549.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "xiaomi-15",
    "brand": "xiaomi",
    "name": "Xiaomi 15",
    "description": "Xiaomi 15 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Xiaomi 15 ? 📸 Expérience photo premium avec technologie Leica ⚡ Puissance ultra fluide au quotidien ✨ Design moderne, compact et haut de gamme 🔋 Excellente autonomie pensée pour durer Un smartphone premium conçu pour allier élégance et performance.   ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois  🔒 Paiement sécurisé 💬 Conseil avant ach",
    "specs": {
      "Ecran": "6,36 po AMOLED 120 Hz",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "50 Mpx Leica + 50 Mpx ultra + 50 Mpx tele",
      "Camera frontale": "32 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": false,
    "badge": "Populaire",
    "variants": [
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "XM15-BLK-512",
        "price": 799.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert",
        "color_hex": "#22c55e",
        "storage": "512 Go",
        "sku": "XM15-GRN-512",
        "price": 799.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "512 Go",
        "sku": "XM15-WHT-512",
        "price": 799.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent",
        "color_hex": "#c0c0c0",
        "storage": "512 Go",
        "sku": "XM15-SLV-512",
        "price": 799.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "xiaomi-15-t",
    "brand": "xiaomi",
    "name": "Xiaomi 15 T",
    "description": "Xiaomi 15T 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Xiaomi 15T ? 📸 Très belle qualité photo ⚡ Utilisation fluide au quotidien 🔋 Autonomie fiable et durable 🚀 Excellent rapport performance / prix Un smartphone moderne conçu pour tous les usages. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 24 à 48 h 🚚 Livraison : 7 à",
    "specs": {
      "Ecran": "6,67 po AMOLED 144 Hz",
      "Puce": "Dimensity 8400 Ultra",
      "Camera": "50 Mpx Leica + 50 Mpx tele",
      "Camera frontale": "32 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": false,
    "badge": null,
    "variants": [
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "256 Go",
        "sku": "XM15T-GRY-256",
        "price": 529.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "XM15T-BLK-256",
        "price": 529.0,
        "compare_at_price": null
      },
      {
        "color_name": "Rose Gold",
        "color_hex": "#c9a2a7",
        "storage": "256 Go",
        "sku": "XM15T-RGD-256",
        "price": 529.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "512 Go",
        "sku": "XM15T-GRY-512",
        "price": 579.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "XM15T-BLK-512",
        "price": 579.0,
        "compare_at_price": null
      },
      {
        "color_name": "Rose Gold",
        "color_hex": "#c9a2a7",
        "storage": "512 Go",
        "sku": "XM15T-RGD-512",
        "price": 579.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "xiaomi-15-t-pro",
    "brand": "xiaomi",
    "name": "Xiaomi 15 T pro",
    "description": "Xiaomi 15T Pro 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Xiaomi 15T Pro ? 📸 Photo & vidéo haute qualité ⚡ Performances rapides et fluides 🔋 Grande autonomie au quotidien 🚀 Smartphone puissant et moderne Un smartphone premium pensé pour durer. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 24 à 48 h 🚚 Livraison : 7 à 10",
    "specs": {
      "Ecran": "6,67 po AMOLED 144 Hz",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "50 Mpx Leica + 50 Mpx ultra + 50 Mpx tele",
      "Camera frontale": "32 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": false,
    "badge": null,
    "variants": [
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "XM15TP-BLK-512",
        "price": 820.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "512 Go",
        "sku": "XM15TP-GRY-512",
        "price": 820.0,
        "compare_at_price": null
      },
      {
        "color_name": "Moka",
        "color_hex": "#795548",
        "storage": "512 Go",
        "sku": "XM15TP-MOK-512",
        "price": 820.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-s26-plus",
    "brand": "samsung",
    "name": "Samsung Galaxy S26+",
    "description": "Samsung Galaxy S26+ 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S26+ ? 📱 Grand écran confortable et immersif ⚡ Expérience Samsung fluide et agréable 🔋 Autonomie pensée pour suivre vos journées ✨ Design premium fin et élégant Le parfait équilibre entre confort, puissance et élégance. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp",
    "specs": {
      "Ecran": "6,7 po QHD+ Dynamic AMOLED 120 Hz",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "50 Mpx + 12 Mpx + 10 Mpx",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "256 Go",
        "sku": "SGS26P-VIO-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "256 Go",
        "sku": "SGS26P-WHT-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "SGS26P-BLK-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "512 Go",
        "sku": "SGS26P-VIO-512",
        "price": 1199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "512 Go",
        "sku": "SGS26P-WHT-512",
        "price": 1199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "SGS26P-BLK-512",
        "price": 1199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "256 Go",
        "sku": "SGS26P-BLU-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "512 Go",
        "sku": "SGS26P-BLU-512",
        "price": 1199.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-s26",
    "brand": "samsung",
    "name": "Samsung Galaxy S26",
    "description": "Samsung Galaxy S26 💡 Prix final affiché📦 Livraison Martinique, Guadeloupe & Guyane incluse❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S26 ? ⚡ Smartphone rapide et agréable au quotidien📸 Très belles photos de jour comme de nuit📱 Format pratique et confortable en main🔋 Autonomie fiable pour tous les usages Un Galaxy moderne, fluide et équilibré. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé💬 Conseil avant achat via WhatsApp ⏳ Expédition",
    "specs": {
      "Ecran": "6,2 po FHD+ Dynamic AMOLED 120 Hz",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "50 Mpx + 12 Mpx + 10 Mpx",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "256 Go",
        "sku": "SGS26-WHT-256",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "SGS26-BLK-256",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "256 Go",
        "sku": "SGS26-BLU-256",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "256 Go",
        "sku": "SGS26-VIO-256",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "512 Go",
        "sku": "SGS26-WHT-512",
        "price": 999.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "SGS26-BLK-512",
        "price": 999.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "512 Go",
        "sku": "SGS26-BLU-512",
        "price": 999.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "512 Go",
        "sku": "SGS26-VIO-512",
        "price": 999.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-s26-ultra",
    "brand": "samsung",
    "name": "SamsungGalaxy S26 Ultra",
    "description": "Samsung Galaxy S26 Ultra 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S26 Ultra ? 📸 Expérience photo et vidéo haut de gamme 🚀 Puissance conçue pour les usages les plus exigeants 🖊️ S Pen intégré pour plus de productivité 📱 Grand écran premium ultra immersif Le meilleur de Samsung dans un seul smartphone. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois  🔒 Paiement sécurisé 💬 Conseil av",
    "specs": {
      "Ecran": "6,9 po QHD+ Dynamic AMOLED 120 Hz",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "200 Mpx + 50 Mpx + 10 Mpx",
      "S Pen": "Integre",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "SGS26U-BLK-256",
        "price": 1299.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "SGS26U-BLK-512",
        "price": 1499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "256 Go",
        "sku": "SGS26U-VIO-256",
        "price": 1299.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "256 Go",
        "sku": "SGS26U-BLU-256",
        "price": 1299.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "512 Go",
        "sku": "SGS26U-VIO-512",
        "price": 1499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "512 Go",
        "sku": "SGS26U-BLU-512",
        "price": 1499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "256 Go",
        "sku": "SGS26U-WHT-256",
        "price": 1299.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "512 Go",
        "sku": "SGS26U-WHT-512",
        "price": 1499.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "1 To",
        "sku": "SGS26U-BLK-1T",
        "price": 1649.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "1 To",
        "sku": "SGS26U-VIO-1T",
        "price": 1649.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "1 To",
        "sku": "SGS26U-BLU-1T",
        "price": 1649.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "1 To",
        "sku": "SGS26U-WHT-1T",
        "price": 1649.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "xiaomi-redmi-note-14-pro",
    "brand": "xiaomi",
    "name": "Xiaomi Redmi Note 14 Pro 5G",
    "description": "Référence : XRN14P5G-8/256_BLU Etat : NEUF Ecran de 6.67'' Double Sim Android 14 Processeur Mediatek Dimensity 7300 Ultra  Mémoire Interne de 256 Go Mémoire RAM de 8 Go Appareil Photo Principal : 200 + 8 + 2 Mpx Appareil Photo Secondaire : 20 Mpx Wifi / Bluetooth / GPS / NFC Capteur d'empreintes digitales Batterie de 5 110 mAh Charge rapide 45W",
    "specs": {
      "Ecran": "6,67 po AMOLED 120 Hz",
      "Puce": "Dimensity 7300 Ultra",
      "Camera": "200 Mpx",
      "Camera frontale": "20 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": false,
    "badge": null,
    "variants": [
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "",
        "sku": "XMRN14P-BLK-",
        "price": 389.0,
        "compare_at_price": null
      },
      {
        "color_name": "Violet",
        "color_hex": "#9333ea",
        "storage": "",
        "sku": "XMRN14P-VIO-",
        "price": 389.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert",
        "color_hex": "#22c55e",
        "storage": "",
        "sku": "XMRN14P-GRN-",
        "price": 389.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "iphone-air",
    "brand": "apple",
    "name": "iPhone Air",
    "description": "iPhone Air 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone Air ? ✨ Design fin, léger et élégant ⚡ Expérience Apple rapide et fluide 📸 Très belle qualité photo au quotidien 🔋 Autonomie pensée pour tous les usages Un iPhone moderne conçu pour allier simplicité et performance. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 1 an 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 2",
    "specs": {
      "Ecran": "6,5 po OLED Super Retina XDR",
      "Puce": "Apple A18",
      "Camera": "48 Mpx",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Or",
        "color_hex": "#d4af37",
        "storage": "256 Go",
        "sku": "IPAIR-GLD-256",
        "price": 1099.0,
        "compare_at_price": 1300.0
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "256 Go",
        "sku": "IPAIR-BLU-256",
        "price": 1099.0,
        "compare_at_price": 1300.0
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "IPAIR-BLK-256",
        "price": 1099.0,
        "compare_at_price": 1300.0
      },
      {
        "color_name": "Or",
        "color_hex": "#d4af37",
        "storage": "512 Go",
        "sku": "IPAIR-GLD-512",
        "price": 1299.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "512 Go",
        "sku": "IPAIR-BLU-512",
        "price": 1299.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "IPAIR-BLK-512",
        "price": 1299.0,
        "compare_at_price": null
      },
      {
        "color_name": "Or",
        "color_hex": "#d4af37",
        "storage": "1 To",
        "sku": "IPAIR-GLD-1T",
        "price": 1399.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "1 To",
        "sku": "IPAIR-BLU-1T",
        "price": 1399.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "1 To",
        "sku": "IPAIR-BLK-1T",
        "price": 1399.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "iphone-16-pro-max",
    "brand": "apple",
    "name": "iPhone 16 Pro Max",
    "description": "iPhone 16 Pro Max 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone 16 Pro Max ? 📸 Photo & vidéo premium 🚀 Puissance ultra fluide 🔋 Excellente autonomie 🛡️ Fiabilité Apple reconnue Un iPhone pensé pour durer. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 1 an 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expédition : 24 à 48 h 🚚 Livraison : 7 à 10 jours",
    "specs": {
      "Ecran": "6,9 po OLED ProMotion 120 Hz",
      "Puce": "Apple A18 Pro",
      "Camera": "48 Mpx Fusion + 12 Mpx + 12 Mpx 5x",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": true,
    "badge": "Populaire",
    "variants": [
      {
        "color_name": "Titane sable",
        "color_hex": "#d4c5a9",
        "storage": "256 Go",
        "sku": "IP16PM-TSB-256",
        "price": 1399.0,
        "compare_at_price": null
      },
      {
        "color_name": "Titane noir",
        "color_hex": "#888888",
        "storage": "256 Go",
        "sku": "IP16PM-UNK-256",
        "price": 1399.0,
        "compare_at_price": null
      },
      {
        "color_name": "Titane blanc",
        "color_hex": "#f0f0f0",
        "storage": "256 Go",
        "sku": "IP16PM-TWH-256",
        "price": 1399.0,
        "compare_at_price": null
      },
      {
        "color_name": "Titane naturel",
        "color_hex": "#c8b8a2",
        "storage": "256 Go",
        "sku": "IP16PM-TNT-256",
        "price": 1399.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "iphone-17-pro-max",
    "brand": "apple",
    "name": "iPhone 17 Pro Max",
    "description": "iPhone 17 Pro Max 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone 17 Pro Max ? 📸 L’une des meilleures expériences photo sur smartphone 🚀 Puissance Apple conçue pour les usages les plus exigeants 🔋 Autonomie premium pensée pour durer toute la journée ✨ Finitions haut de gamme et écran ultra immersif Le meilleur d’Apple réuni dans un seul iPhone. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie 12 mois 🔒 Paiemen",
    "specs": {
      "Ecran": "6,9 po OLED ProMotion 120 Hz",
      "Puce": "Apple A19 Pro",
      "Camera": "48 Mpx Fusion + 48 Mpx ultra + 12 Mpx 5x",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Orange cosmique",
        "color_hex": "#ff6b35",
        "storage": "256 Go",
        "sku": "IP17PM-OCO-256",
        "price": 1599.0,
        "compare_at_price": null
      },
      {
        "color_name": "Orange cosmique",
        "color_hex": "#ff6b35",
        "storage": "512 Go",
        "sku": "IP17PM-OCO-512",
        "price": 1899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Orange cosmique",
        "color_hex": "#ff6b35",
        "storage": "1 To",
        "sku": "IP17PM-OCO-1T",
        "price": 2199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu intense",
        "color_hex": "#1d4ed8",
        "storage": "256 Go",
        "sku": "IP17PM-BIN-256",
        "price": 1599.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu intense",
        "color_hex": "#1d4ed8",
        "storage": "512 Go",
        "sku": "IP17PM-BIN-512",
        "price": 1899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu intense",
        "color_hex": "#1d4ed8",
        "storage": "1 To",
        "sku": "IP17PM-BIN-1T",
        "price": 2199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent",
        "color_hex": "#c0c0c0",
        "storage": "256 Go",
        "sku": "IP17PM-SLV-256",
        "price": 1599.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent",
        "color_hex": "#c0c0c0",
        "storage": "512 Go",
        "sku": "IP17PM-SLV-512",
        "price": 1899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent",
        "color_hex": "#c0c0c0",
        "storage": "1 To",
        "sku": "IP17PM-SLV-1T",
        "price": 2199.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "iphone-17-pro",
    "brand": "apple",
    "name": "iPhone 17 Pro",
    "description": "iPhone 17 Pro 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir l’iPhone 17 Pro ? 📸 Photo et vidéo pensées pour un niveau professionnel ⚡ Puissance Apple ultra fluide et réactive ✨ Design premium avec finitions haut de gamme 🔋 Excellente autonomie pour un usage intensif Un iPhone conçu pour ceux qui veulent performance et élégance au quotidien. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie 12 mois 🔒 Paiement sécurisé ",
    "specs": {
      "Ecran": "6,3 po OLED ProMotion 120 Hz",
      "Puce": "Apple A19 Pro",
      "Camera": "48 Mpx Fusion + 48 Mpx ultra + 12 Mpx 5x",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Orange cosmique",
        "color_hex": "#ff6b35",
        "storage": "256 Go",
        "sku": "IP17P-OCO-256",
        "price": 1469.0,
        "compare_at_price": null
      },
      {
        "color_name": "Orange cosmique",
        "color_hex": "#ff6b35",
        "storage": "512 Go",
        "sku": "IP17P-OCO-512",
        "price": 1699.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent",
        "color_hex": "#c0c0c0",
        "storage": "256 Go",
        "sku": "IP17P-SLV-256",
        "price": 1469.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent",
        "color_hex": "#c0c0c0",
        "storage": "512 Go",
        "sku": "IP17P-SLV-512",
        "price": 1699.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu intense",
        "color_hex": "#1d4ed8",
        "storage": "256 Go",
        "sku": "IP17P-BIN-256",
        "price": 1469.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu intense",
        "color_hex": "#1d4ed8",
        "storage": "512 Go",
        "sku": "IP17P-BIN-512",
        "price": 1699.0,
        "compare_at_price": null
      },
      {
        "color_name": "Orange cosmique",
        "color_hex": "#ff6b35",
        "storage": "1 To",
        "sku": "IP17P-OCO-1T",
        "price": 1929.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent",
        "color_hex": "#c0c0c0",
        "storage": "1 To",
        "sku": "IP17P-SLV-1T",
        "price": 1929.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu intense",
        "color_hex": "#1d4ed8",
        "storage": "1 To",
        "sku": "IP17P-BIN-1T",
        "price": 1929.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-z-fold-7",
    "brand": "samsung",
    "name": "Samsung Galaxy Z Fold 7",
    "description": "Samsung Galaxy Z Fold7 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy Z Fold7 ? 📱 Expérience pliable premium ultra immersive 🚀 Puissance conçue pour le multitâche et la productivité ✨ Design Samsung haut de gamme et innovant ⚡ Grand écran pensé pour travailler, créer et se divertir Le smartphone Samsung le plus avancé et impressionnant de la gamme Galaxy. ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie cons",
    "specs": {
      "Ecran": "7,9 po AMOLED pliable + 6,5 po couverture",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "200 Mpx + 10 Mpx + 10 Mpx",
      "Camera frontale": "10 Mpx",
      "5G": "Oui",
      "Resistance": "IPX8"
    },
    "is_new": true,
    "is_bestseller": false,
    "badge": "Nouveau",
    "variants": [
      {
        "color_name": "Bleu nuit",
        "color_hex": "#1e3799",
        "storage": "256 Go",
        "sku": "SGZF7-BNU-256",
        "price": 1599.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu nuit",
        "color_hex": "#1e3799",
        "storage": "512 Go",
        "sku": "SGZF7-BNU-512",
        "price": 1699.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir absolu",
        "color_hex": "#0a0a0a",
        "storage": "256 Go",
        "sku": "SGZF7-NBL-256",
        "price": 1599.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir absolu",
        "color_hex": "#0a0a0a",
        "storage": "512 Go",
        "sku": "SGZF7-NBL-512",
        "price": 1699.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "256 Go",
        "sku": "SGZF7-GRY-256",
        "price": 1599.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "512 Go",
        "sku": "SGZF7-GRY-512",
        "price": 1699.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-s25",
    "brand": "samsung",
    "name": "Samsung S25",
    "description": "Samsung Galaxy S25 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S25 ? ⚡ Expérience Samsung rapide et fluide 📸 Très belles photos au quotidien 📱 Format compact et agréable en main 🔋 Autonomie fiable pour tous les usages Un Galaxy premium pensé pour être efficace au quotidien.   ━━━━━━━━━━ ✔️ Smartphone neuf & scellé 🛠️ Garantie constructeur 24 mois 🔒 Paiement sécurisé 💬 Conseil avant achat via WhatsApp ⏳ Expé",
    "specs": {
      "Ecran": "6,2 po FHD+ Dynamic AMOLED 120 Hz",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "50 Mpx + 12 Mpx + 10 Mpx",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": true,
    "badge": "Populaire",
    "variants": [
      {
        "color_name": "Bleu nuit",
        "color_hex": "#1e3799",
        "storage": "128 Go",
        "sku": "SGS25-BNU-128",
        "price": 779.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "128 Go",
        "sku": "SGS25-GRY-128",
        "price": 779.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir absolu",
        "color_hex": "#0a0a0a",
        "storage": "128 Go",
        "sku": "SGS25-NBL-128",
        "price": 779.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu clair",
        "color_hex": "#93c5fd",
        "storage": "128 Go",
        "sku": "SGS25-BCL-128",
        "price": 779.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert d’eau",
        "color_hex": "#888888",
        "storage": "128 Go",
        "sku": "SGS25-UNK-128",
        "price": 779.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu nuit",
        "color_hex": "#1e3799",
        "storage": "256 Go",
        "sku": "SGS25-BNU-256",
        "price": 849.0,
        "compare_at_price": 920.0
      },
      {
        "color_name": "Bleu nuit",
        "color_hex": "#1e3799",
        "storage": "512 Go",
        "sku": "SGS25-BNU-512",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "256 Go",
        "sku": "SGS25-GRY-256",
        "price": 849.0,
        "compare_at_price": 920.0
      },
      {
        "color_name": "Gris",
        "color_hex": "#8e8e93",
        "storage": "512 Go",
        "sku": "SGS25-GRY-512",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir absolu",
        "color_hex": "#0a0a0a",
        "storage": "256 Go",
        "sku": "SGS25-NBL-256",
        "price": 849.0,
        "compare_at_price": 920.0
      },
      {
        "color_name": "Noir absolu",
        "color_hex": "#0a0a0a",
        "storage": "512 Go",
        "sku": "SGS25-NBL-512",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu clair",
        "color_hex": "#93c5fd",
        "storage": "256 Go",
        "sku": "SGS25-BCL-256",
        "price": 849.0,
        "compare_at_price": 920.0
      },
      {
        "color_name": "Bleu clair",
        "color_hex": "#93c5fd",
        "storage": "512 Go",
        "sku": "SGS25-BCL-512",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert d’eau",
        "color_hex": "#888888",
        "storage": "256 Go",
        "sku": "SGS25-UNK-256",
        "price": 849.0,
        "compare_at_price": 920.0
      },
      {
        "color_name": "Vert d’eau",
        "color_hex": "#888888",
        "storage": "512 Go",
        "sku": "SGS25-UNK-512",
        "price": 899.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "samsung-galaxy-s25-ultra",
    "brand": "samsung",
    "name": "Samsung S25 Ultra",
    "description": "Samsung Galaxy S25 Ultra 💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━ Pourquoi choisir le Galaxy S25 Ultra ? 📸 Expérience photo et vidéo parmi les meilleures du marché 🚀 Puissance Samsung ultra haut de gamme 🖊️ S Pen intégré pour travailler, créer et gagner en productivité 📱 Écran premium ultra immersif conçu pour une utilisation intensive Le Galaxy Ultra pensé pour ceux qui veulent le meilleur sans compromis. ━━━━━━━━━━ ✔️ Smartphone",
    "specs": {
      "Ecran": "6,9 po QHD+ Dynamic AMOLED 120 Hz",
      "Puce": "Snapdragon 8 Elite",
      "Camera": "200 Mpx + 50 Mpx + 10 Mpx",
      "S Pen": "Integre",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": true,
    "badge": "Bestseller",
    "variants": [
      {
        "color_name": "Gris titane",
        "color_hex": "#6b7280",
        "storage": "256 Go",
        "sku": "SGS25U-GTI-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir titane",
        "color_hex": "#1c1c1e",
        "storage": "256 Go",
        "sku": "SGS25U-NTI-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent titane",
        "color_hex": "#c0c0c0",
        "storage": "256 Go",
        "sku": "SGS25U-ATI-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu titane",
        "color_hex": "#3b5bdb",
        "storage": "256 Go",
        "sku": "SGS25U-BTI-256",
        "price": 1099.0,
        "compare_at_price": null
      },
      {
        "color_name": "Gris titane",
        "color_hex": "#6b7280",
        "storage": "512 Go",
        "sku": "SGS25U-GTI-512",
        "price": 1199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir titane",
        "color_hex": "#1c1c1e",
        "storage": "512 Go",
        "sku": "SGS25U-NTI-512",
        "price": 1199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Argent titane",
        "color_hex": "#c0c0c0",
        "storage": "512 Go",
        "sku": "SGS25U-ATI-512",
        "price": 1199.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu titane",
        "color_hex": "#3b5bdb",
        "storage": "512 Go",
        "sku": "SGS25U-BTI-512",
        "price": 1199.0,
        "compare_at_price": null
      }
    ]
  },
  {
    "slug": "iphone-16",
    "brand": "apple",
    "name": "iPhone 16",
    "description": "Pourquoi choisir l’iPhone 16  💡 Prix final affiché 📦 Livraison Martinique, Guadeloupe & Guyane incluse ❌ Aucune taxe surprise ━━━━━━━━━━━━━━ Pourquoi choisir l’iPhone 16  📸 Appareil photo performant pour capturer vos moments avec précision et naturel ⚡ Puce rapide et fluide idéale pour les applications, réseaux sociaux et multitâche ✨ Design élégant avec écran immersif et finitions premium 🔋 Très bonne autonomie avec recharge rapide et utilisation confortable au quotidien Un smartphone moderne e",
    "specs": {
      "Ecran": "6,1 po OLED Super Retina XDR",
      "Puce": "Apple A18",
      "Camera": "48 Mpx + 12 Mpx",
      "Camera frontale": "12 Mpx",
      "5G": "Oui",
      "Resistance": "IP68"
    },
    "is_new": false,
    "is_bestseller": false,
    "badge": null,
    "variants": [
      {
        "color_name": "Rose",
        "color_hex": "#f9a8d4",
        "storage": "128 Go",
        "sku": "IP16-PNK-128",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Noir",
        "color_hex": "#1c1c1e",
        "storage": "128 Go",
        "sku": "IP16-BLK-128",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Bleu",
        "color_hex": "#4a90d9",
        "storage": "128 Go",
        "sku": "IP16-BLU-128",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Vert",
        "color_hex": "#22c55e",
        "storage": "128 Go",
        "sku": "IP16-GRN-128",
        "price": 899.0,
        "compare_at_price": null
      },
      {
        "color_name": "Blanc",
        "color_hex": "#f5f5f5",
        "storage": "128 Go",
        "sku": "IP16-WHT-128",
        "price": 899.0,
        "compare_at_price": null
      }
    ]
  }
]

type Row = Record<string, unknown>

async function pgGet(path: string, svcKey: string): Promise<Row[]> {
  const r = await fetch(`${REST_API_URL}${path}`, {
    headers: { apikey: svcKey, Authorization: `Bearer ${svcKey}`, Accept: 'application/json' }
  })
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}: ${await r.text()}`)
  return r.json()
}

async function pgPost(path: string, body: Row[], svcKey: string): Promise<void> {
  if (body.length === 0) return
  const r = await fetch(`${REST_API_URL}${path}`, {
    method: 'POST',
    headers: {
      apikey: svcKey, Authorization: `Bearer ${svcKey}`,
      'Content-Type': 'application/json', Accept: 'application/json',
      Prefer: 'return=minimal,resolution=ignore-duplicates',
    },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    const text = await r.text()
    if (!text.includes('duplicate') && !text.includes('already exists')) {
      throw new Error(`POST ${path} -> ${r.status}: ${text.slice(0, 400)}`)
    }
  }
}

export async function GET(req: NextRequest) {
  const svcKey = req.nextUrl.searchParams.get('key') ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!svcKey) return NextResponse.json({ ok: false, reason: 'missing_key' }, { status: 400 })

  try {
    // 1. Fetch brand IDs
    const brands = await pgGet('/brands?select=id,slug', svcKey)
    const brandMap: Record<string, string> = Object.fromEntries(brands.map(b => [b.slug as string, b.id as string]))

    // 2. Upsert products
    const productsToInsert = PRODUCTS.map(p => ({
      brand_id: brandMap[p.brand],
      name: p.name,
      slug: p.slug,
      description: p.description,
      specs: p.specs,
      is_active: true,
      is_new: p.is_new,
      is_bestseller: p.is_bestseller,
      badge: p.badge ?? null,
    })).filter(p => p.brand_id)

    await pgPost('/products', productsToInsert as Row[], svcKey)

    // 3. Fetch product IDs
    const slugList = PRODUCTS.map(p => p.slug).join(',')
    const dbProducts = await pgGet(`/products?slug=in.(${slugList})&select=id,slug`, svcKey)
    const productMap: Record<string, string> = Object.fromEntries(dbProducts.map(p => [p.slug as string, p.id as string]))

    // 4. Upsert variants in batches
    const variantsToInsert = PRODUCTS.flatMap(p =>
      p.variants.map((v, i) => ({
        product_id: productMap[p.slug],
        color_name: v.color_name,
        color_hex: v.color_hex,
        storage: v.storage,
        sku: v.sku,
        stock: 10,
        sort_order: i + 1,
      }))
    ).filter(v => v.product_id)

    for (let i = 0; i < variantsToInsert.length; i += 50) {
      await pgPost('/product_variants', variantsToInsert.slice(i, i + 50) as Row[], svcKey)
    }

    // 5. Fetch zones
    const zones = await pgGet('/zones?select=id,name', svcKey)

    // 6. Fetch variant IDs by SKU in batches
    const allSkus = PRODUCTS.flatMap(p => p.variants.map(v => v.sku))
    const dbVariants: Row[] = []
    for (let i = 0; i < allSkus.length; i += 50) {
      const chunk = allSkus.slice(i, i + 50).join(',')
      const rows = await pgGet(`/product_variants?sku=in.(${chunk})&select=id,sku`, svcKey)
      dbVariants.push(...rows)
    }
    const variantMap: Record<string, string> = Object.fromEntries(dbVariants.map(v => [v.sku as string, v.id as string]))

    // 7. Upsert prices (each variant x each zone)
    const pricesToInsert = PRODUCTS.flatMap(p =>
      p.variants.flatMap(v => {
        const variantId = variantMap[v.sku]
        if (!variantId) return []
        return zones.map(z => ({
          variant_id: variantId,
          zone_id: z.id as string,
          price: v.price,
          compare_at_price: v.compare_at_price ?? null,
        }))
      })
    )

    for (let i = 0; i < pricesToInsert.length; i += 100) {
      await pgPost('/product_zone_prices', pricesToInsert.slice(i, i + 100) as Row[], svcKey)
    }

    return NextResponse.json({
      ok: true,
      imported: { products: productsToInsert.length, variants: variantsToInsert.length, prices: pricesToInsert.length }
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
