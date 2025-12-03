{
  "name": "Template",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": [
        "professional",
        "creative",
        "minimal",
        "academic",
        "executive"
      ]
    },
    "preview_image": {
      "type": "string"
    },
    "is_premium": {
      "type": "boolean",
      "default": false
    },
    "ats_optimized": {
      "type": "boolean",
      "default": true
    },
    "default_colors": {
      "type": "object",
      "properties": {
        "primary": {
          "type": "string"
        },
        "secondary": {
          "type": "string"
        },
        "accent": {
          "type": "string"
        }
      }
    },
    "supported_sections": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "layout_type": {
      "type": "string",
      "enum": [
        "single-column",
        "two-column",
        "sidebar"
      ]
    },
    "popularity_score": {
      "type": "number"
    }
  },
  "required": [
    "name",
    "category"
  ]
}